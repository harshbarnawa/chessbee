const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

// Game state
const rooms = {}
const rematchRequests = {}
const gameStates = {}
const rateLimits = {}

// Rate limiting
const RATE_LIMIT_WINDOW = 1000 // 1 second
const RATE_LIMIT_MAX = 10 // max events per window

function checkRateLimit(socketId) {
  const now = Date.now()
  if (!rateLimits[socketId]) {
    rateLimits[socketId] = []
  }

  // Remove old entries
  rateLimits[socketId] = rateLimits[socketId].filter((t) => now - t < RATE_LIMIT_WINDOW)

  if (rateLimits[socketId].length >= RATE_LIMIT_MAX) {
    return false
  }

  rateLimits[socketId].push(now)
  return true
}

// Chess move validation (simplified FEN-based)
function isValidMove(from, to, fen) {
  if (!from || !to) return false
  if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) return false
  if (from === to) return false
  return true
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`)

  socket.on('joinRoom', (roomId) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' })
      return
    }

    if (!roomId || typeof roomId !== 'string' || roomId.length > 100) {
      socket.emit('error', { message: 'Invalid room ID' })
      return
    }

    socket.join(roomId)
    socket.roomId = roomId

    if (!rooms[roomId]) {
      rooms[roomId] = []
    }

    if (rooms[roomId].length >= 2) {
      socket.emit('roomFull')
      return
    }

    const color = rooms[roomId].length === 0 ? 'white' : 'black'
    rooms[roomId].push({ id: socket.id, color })

    socket.emit('playerColor', color)
    io.to(roomId).emit('players', rooms[roomId])

    // Send current game state if exists
    if (gameStates[roomId]) {
      socket.emit('gameState', gameStates[roomId])
    }

    console.log(`Player ${socket.id} joined room ${roomId} as ${color}`)
  })

  socket.on('move', ({ roomId, move }) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' })
      return
    }

    if (!roomId || !move || !move.from || !move.to) {
      socket.emit('error', { message: 'Invalid move data' })
      return
    }

    if (!isValidMove(move.from, move.to)) {
      socket.emit('error', { message: 'Invalid move format' })
      return
    }

    // Verify player is in this room
    if (!rooms[roomId] || !rooms[roomId].find((p) => p.id === socket.id)) {
      socket.emit('error', { message: 'Not in this room' })
      return
    }

    // Store game state
    if (!gameStates[roomId]) {
      gameStates[roomId] = { moves: [] }
    }
    gameStates[roomId].moves.push(move)

    socket.to(roomId).emit('receiveMove', move)
  })

  socket.on('requestRematch', (roomId) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Rate limit exceeded' })
      return
    }

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
      // Reset game state for new game
      gameStates[roomId] = { moves: [] }
      io.to(roomId).emit('startRematch')
    }
  })

  socket.on('disconnect', () => {
    const roomId = socket.roomId

    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((player) => player.id !== socket.id)

      socket.to(roomId).emit('opponentDisconnected')
      io.to(roomId).emit('players', rooms[roomId])

      delete rematchRequests[roomId]

      if (rooms[roomId].length === 0) {
        delete rooms[roomId]
        delete gameStates[roomId]
      }
    }

    delete rateLimits[socket.id]
    console.log(`Player disconnected: ${socket.id}`)
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: Object.keys(rooms).length })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
