const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { Chess } = require('chess.js')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

// ── Room & Game State ────────────────────────────────────────────────
// Each room tracks: players, chess instance, timers, turn, move history
const rooms = {}         // roomId → { players: [{id, color}], game: Chess, moveHistory: [] }
const rematchRequests = {} // roomId → [socketId]
const rateLimits = {}    // socketId → [timestamps]
const playerRooms = {}   // socketId → roomId (for quick lookup on disconnect)

// ── Rate Limiting ────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW = 1000
const RATE_LIMIT_MAX = 20

function checkRateLimit(socketId) {
  const now = Date.now()
  if (!rateLimits[socketId]) {
    rateLimits[socketId] = []
  }
  rateLimits[socketId] = rateLimits[socketId].filter((t) => now - t < RATE_LIMIT_WINDOW)
  if (rateLimits[socketId].length >= RATE_LIMIT_MAX) {
    return false
  }
  rateLimits[socketId].push(now)
  return true
}

// ── Helper: create a fresh room ──────────────────────────────────────
function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    game: new Chess(),
    moveHistory: [],
    started: false,
    whiteTime: 600,
    blackTime: 600,
    lastTickAt: null,
  }
}

// ── Helper: get serializable game state for sending to client ────────
function getGameState(roomId) {
  const room = rooms[roomId]
  if (!room) return null
  return {
    fen: room.game.fen(),
    turn: room.game.turn(),
    isCheck: room.game.isCheck(),
    isCheckmate: room.game.isCheckmate(),
    isDraw: room.game.isDraw(),
    isStalemate: room.game.isStalemate(),
    isThreefoldRepetition: room.game.isThreefoldRepetition(),
    isInsufficientMaterial: room.game.isInsufficientMaterial(),
    isGameOver: room.game.isGameOver(),
    moveHistory: room.moveHistory,
    whiteTime: room.whiteTime,
    blackTime: room.blackTime,
    started: room.started,
  }
}

// ── Helper: build full room info for clients ─────────────────────────
function getRoomInfo(roomId) {
  const room = rooms[roomId]
  if (!room) return { players: [], gameState: null }
  return {
    players: room.players,
    gameState: getGameState(roomId),
  }
}

// ── Socket.io Connection Handler ─────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`)

  // ── Join Room ──────────────────────────────────────────────────────
  socket.on('joinRoom', (roomId) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' })
      return
    }

    if (!roomId || typeof roomId !== 'string' || roomId.length > 100) {
      socket.emit('error', { message: 'Invalid room ID' })
      return
    }

    // Leave any previous room first
    const previousRoomId = playerRooms[socket.id]
    if (previousRoomId && previousRoomId !== roomId && rooms[previousRoomId]) {
      rooms[previousRoomId].players = rooms[previousRoomId].players.filter(
        (p) => p.id !== socket.id
      )
      socket.to(previousRoomId).emit('opponentDisconnected')
      io.to(previousRoomId).emit('players', rooms[previousRoomId].players)
      socket.leave(previousRoomId)

      if (rooms[previousRoomId].players.length === 0) {
        delete rooms[previousRoomId]
        delete rematchRequests[previousRoomId]
      }
    }

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      createRoom(roomId)
    }

    // Check if room is full
    if (rooms[roomId].players.length >= 2) {
      // Check if this player is reconnecting (already in the room)
      const existingPlayer = rooms[roomId].players.find((p) => p.id === socket.id)
      if (!existingPlayer) {
        socket.emit('roomFull')
        return
      }
    }

    socket.join(roomId)
    socket.roomId = roomId
    playerRooms[socket.id] = roomId

    // Check if player is reconnecting (same socket.id)
    let existingPlayer = rooms[roomId].players.find((p) => p.id === socket.id)
    if (!existingPlayer) {
      // Assign the missing color (if white is taken, give black, and vice versa)
      const existingColors = rooms[roomId].players.map((p) => p.color)
      const color = !existingColors.includes('white') ? 'white' : 'black'
      rooms[roomId].players.push({ id: socket.id, color })
      existingPlayer = rooms[roomId].players.find((p) => p.id === socket.id)
    }

    const playerColor = rooms[roomId].players.find((p) => p.id === socket.id)?.color
    socket.emit('playerColor', playerColor)
    socket.emit('gameState', getGameState(roomId))
    io.to(roomId).emit('players', rooms[roomId].players.map((p) => ({ id: p.id, color: p.color })))

    console.log(`Player ${socket.id} joined room ${roomId} as ${playerColor}`)
  })

  // ── Make Move ──────────────────────────────────────────────────────
  socket.on('move', ({ roomId, move }) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' })
      return
    }

    if (!roomId || !move || !move.from || !move.to) {
      socket.emit('error', { message: 'Invalid move data' })
      return
    }

    const room = rooms[roomId]
    if (!room) {
      socket.emit('error', { message: 'Room not found' })
      return
    }

    // Verify player is in this room
    const player = room.players.find((p) => p.id === socket.id)
    if (!player) {
      socket.emit('error', { message: 'Not in this room' })
      return
    }

    // Enforce turn: only the player whose turn it is can move
    const expectedColor = room.game.turn() === 'w' ? 'white' : 'black'
    if (player.color !== expectedColor) {
      socket.emit('error', { message: 'Not your turn' })
      return
    }

    // Validate and apply move using chess.js
    let playedMove
    try {
      playedMove = room.game.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q',
      })
    } catch (e) {
      socket.emit('error', { message: 'Illegal move' })
      return
    }

    if (!playedMove) {
      socket.emit('error', { message: 'Illegal move' })
      return
    }

    // Store move in history
    const moveData = {
      from: playedMove.from,
      to: playedMove.to,
      san: playedMove.san,
      color: playedMove.color,
      captured: playedMove.captured || null,
      promotion: playedMove.promotion || null,
      flags: playedMove.flags,
    }
    room.moveHistory.push(moveData)
    room.started = true

    // Send acknowledgment to the sender with validated game state
    socket.emit('moveAccepted', {
      move: moveData,
      gameState: getGameState(roomId),
    })

    // Broadcast the validated move to the OPPONENT only (not back to sender)
    socket.to(roomId).emit('moveMade', {
      move: moveData,
      gameState: getGameState(roomId),
    })

    // Check for game-ending conditions
    if (room.game.isGameOver()) {
      let result = '*'
      let winner = null
      let reason = null

      if (room.game.isCheckmate()) {
        winner = room.game.turn() === 'w' ? 'black' : 'white'
        reason = 'checkmate'
        result = winner === 'white' ? '1-0' : '0-1'
      } else if (room.game.isDraw()) {
        reason = 'draw'
        result = '1/2-1/2'
        if (room.game.isStalemate()) reason = 'stalemate'
        else if (room.game.isThreefoldRepetition()) reason = 'repetition'
        else if (room.game.isInsufficientMaterial()) reason = 'insufficient material'
        else if (room.game.isDraw()) reason = 'fifty-move rule'
      }

      io.to(roomId).emit('gameOver', { winner, reason, result })
    }

    console.log(`Move in room ${roomId}: ${playedMove.san}`)
  })

  // ── Resign ─────────────────────────────────────────────────────────
  socket.on('resign', (roomId) => {
    if (!checkRateLimit(socket.id)) return

    const room = rooms[roomId]
    if (!room) return

    const player = room.players.find((p) => p.id === socket.id)
    if (!player) return

    const winner = player.color === 'white' ? 'black' : 'white'
    io.to(roomId).emit('gameOver', { winner, reason: 'resignation', result: winner === 'white' ? '1-0' : '0-1' })
    console.log(`Player ${player.color} resigned in room ${roomId}`)
  })

  // ── Offer Draw ─────────────────────────────────────────────────────
  socket.on('offerDraw', (roomId) => {
    if (!checkRateLimit(socket.id)) return

    const room = rooms[roomId]
    if (!room) return

    const player = room.players.find((p) => p.id === socket.id)
    if (!player) return

    // Notify the opponent of the draw offer
    socket.to(roomId).emit('drawOffered', { from: player.color })
  })

  socket.on('acceptDraw', (roomId) => {
    if (!checkRateLimit(socket.id)) return

    const room = rooms[roomId]
    if (!room) return

    io.to(roomId).emit('gameOver', { winner: null, reason: 'agreement', result: '1/2-1/2' })
  })

  socket.on('declineDraw', (roomId) => {
    if (!checkRateLimit(socket.id)) return

    const room = rooms[roomId]
    if (!room) return

    const player = room.players.find((p) => p.id === socket.id)
    if (!player) return

    socket.to(roomId).emit('drawDeclined', { from: player.color })
  })

  // ── Rematch ────────────────────────────────────────────────────────
  socket.on('requestRematch', (roomId) => {
    if (!checkRateLimit(socket.id)) return

    if (!roomId || typeof roomId !== 'string') {
      socket.emit('error', { message: 'Invalid room ID' })
      return
    }

    if (!rematchRequests[roomId]) {
      rematchRequests[roomId] = []
    }

    if (!rematchRequests[roomId].includes(socket.id)) {
      rematchRequests[roomId].push(socket.id)
    }

    io.to(roomId).emit('rematchWaiting', rematchRequests[roomId].length)

    if (rematchRequests[roomId].length === 2) {
      rematchRequests[roomId] = []
      // Reset game state — swap colors for fairness
      const room = rooms[roomId]
      if (room) {
        room.game = new Chess()
        room.moveHistory = []
        room.started = false
        room.whiteTime = 600
        room.blackTime = 600
        room.lastTickAt = null

        // Swap player colors
        room.players.forEach((p) => {
          p.color = p.color === 'white' ? 'black' : 'white'
        })

        // Notify each player of their new color
        room.players.forEach((p) => {
          io.to(p.id).emit('playerColor', p.color)
        })

        io.to(roomId).emit('players', room.players.map((p) => ({ id: p.id, color: p.color })))
        io.to(roomId).emit('startRematch', getGameState(roomId))
      }
    }
  })

  // ── Leave Room ─────────────────────────────────────────────────────
  socket.on('leaveRoom', (roomId) => {
    if (!roomId || !rooms[roomId]) return

    rooms[roomId].players = rooms[roomId].players.filter((p) => p.id !== socket.id)
    socket.leave(roomId)
    delete playerRooms[socket.id]

    socket.to(roomId).emit('opponentDisconnected')
    io.to(roomId).emit('players', rooms[roomId].players.map((p) => ({ id: p.id, color: p.color })))

    if (rooms[roomId].players.length === 0) {
      delete rooms[roomId]
      delete rematchRequests[roomId]
    }
  })

  // ── Disconnect ─────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const roomId = playerRooms[socket.id]

    if (roomId && rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter((p) => p.id !== socket.id)

      socket.to(roomId).emit('opponentDisconnected')
      io.to(roomId).emit('players', rooms[roomId].players.map((p) => ({ id: p.id, color: p.color })))

      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId]
        delete rematchRequests[roomId]
      }
    }

    delete playerRooms[socket.id]
    delete rateLimits[socket.id]
    console.log(`Player disconnected: ${socket.id}`)
  })
})

// ── Health Check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: Object.keys(rooms).length,
    players: Object.keys(playerRooms).length,
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
