import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'

const PIECE_SYMBOLS = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

export function useChessGame() {
  const [game, setGame] = useState(() => new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [moveHistory, setMoveHistory] = useState([])
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] })
  const [winner, setWinner] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameStatus, setGameStatus] = useState(null) // 'checkmate' | 'draw' | 'stalemate' | etc.
  const historyRef = useRef([])

  const resetGame = useCallback((start = false) => {
    const freshGame = new Chess()
    setGame(freshGame)
    setSelectedSquare(null)
    setMoveHistory([])
    setCapturedPieces({ white: [], black: [] })
    setWinner(null)
    setGameStarted(start)
    setGameStatus(null)
    historyRef.current = []
  }, [])

  const getValidMoves = useCallback(
    (square) => {
      return game.moves({ square, verbose: true }).map((m) => m.to)
    },
    [game]
  )

  // Rebuild captured pieces from move history
  const rebuildCapturedPieces = useCallback((history) => {
    const newCaptured = { white: [], black: [] }
    history.forEach((m) => {
      if (m.captured) {
        const victimColor = m.color === 'w' ? 'b' : 'w'
        const capturedSymbol = PIECE_SYMBOLS[victimColor][m.captured]
        newCaptured[m.color === 'w' ? 'white' : 'black'].push(capturedSymbol)
      }
    })
    setCapturedPieces(newCaptured)
  }, [])

  // Apply a validated move to local state (used for both local and received moves)
  const applyValidatedMove = useCallback(
    (moveData) => {
      setGame((currentGame) => {
        const gameCopy = new Chess(currentGame.fen())
        const playedMove = gameCopy.move({
          from: moveData.from,
          to: moveData.to,
          promotion: moveData.promotion || 'q',
        })

        if (playedMove) {
          historyRef.current.push(currentGame.fen())
          setMoveHistory(gameCopy.history({ verbose: true }))
          rebuildCapturedPieces(gameCopy.history({ verbose: true }))
          return gameCopy
        }

        // Move failed — return current game unchanged
        return currentGame
      })
    },
    [rebuildCapturedPieces]
  )

  // Local player makes a move (optimistic, sends to server for validation)
  const movePiece = useCallback(
    (from, to, emitMove) => {
      if (winner || gameStatus) return false

      // Check it's the right player's turn in multiplayer
      // (server will validate, but we check locally too for immediate feedback)
      const gameCopy = new Chess(game.fen())
      const move = gameCopy.move({ from, to, promotion: 'q' })

      if (move) {
        // Optimistically apply the move locally
        historyRef.current.push(game.fen())
        setMoveHistory(gameCopy.history({ verbose: true }))
        rebuildCapturedPieces(gameCopy.history({ verbose: true }))
        setGame(gameCopy)
        setGameStarted(true)
        setSelectedSquare(null)

        // Local game-over detection (server confirms for multiplayer)
        if (gameCopy.isGameOver()) {
          if (gameCopy.isCheckmate()) {
            setWinner(gameCopy.turn() === 'w' ? 'Black' : 'White')
            setGameStatus('checkmate')
          } else if (gameCopy.isStalemate()) {
            setGameStatus('stalemate')
          } else if (gameCopy.isDraw()) {
            setGameStatus('draw')
          }
        }

        // Send to server for validation and broadcast
        if (emitMove) {
          emitMove({ from, to, promotion: 'q' })
        }

        return true
      }

      setSelectedSquare(null)
      return false
    },
    [game, winner, gameStatus, rebuildCapturedPieces]
  )

  // Receive a move from the server (opponent's move or validated自己的 move)
  const receiveServerMove = useCallback(
    (moveData) => {
      setGame((currentGame) => {
        const gameCopy = new Chess(currentGame.fen())
        const playedMove = gameCopy.move({
          from: moveData.from,
          to: moveData.to,
          promotion: moveData.promotion || 'q',
        })

        if (playedMove) {
          historyRef.current.push(currentGame.fen())
          setMoveHistory(gameCopy.history({ verbose: true }))
          rebuildCapturedPieces(gameCopy.history({ verbose: true }))
          return gameCopy
        }

        return currentGame
      })
      setGameStarted(true)
      setSelectedSquare(null)
    },
    [rebuildCapturedPieces]
  )

  // Receive full game state from server (on join, reconnect, rematch)
  const applyServerGameState = useCallback(
    (gameState) => {
      if (!gameState || !gameState.fen) return

      const newGame = new Chess(gameState.fen)
      setGame(newGame)
      setMoveHistory(gameState.moveHistory || [])
      rebuildCapturedPieces(gameState.moveHistory || [])
      setGameStarted(gameState.started || false)
      setSelectedSquare(null)
      historyRef.current = []

      // Rebuild history ref from the game
      // We don't need the full history ref for server-authoritative mode
    },
    [rebuildCapturedPieces]
  )

  // Handle game over from server
  const handleGameOver = useCallback((data) => {
    if (data.winner) {
      // Capitalize first letter
      setWinner(data.winner.charAt(0).toUpperCase() + data.winner.slice(1))
    }
    setGameStatus(data.reason)
  }, [])

  const undoMove = useCallback(() => {
    if (historyRef.current.length === 0) return false

    const previousFen = historyRef.current.pop()
    const previousGame = new Chess(previousFen)

    setGame(previousGame)
    setMoveHistory(previousGame.history({ verbose: true }))
    setSelectedSquare(null)

    // Rebuild captured pieces from history
    const newCaptured = { white: [], black: [] }
    const history = previousGame.history({ verbose: true })
    history.forEach((m) => {
      if (m.captured) {
        const victimColor = m.color === 'w' ? 'b' : 'w'
        const capturedSymbol = PIECE_SYMBOLS[victimColor][m.captured]
        newCaptured[m.color === 'w' ? 'white' : 'black'].push(capturedSymbol)
      }
    })
    setCapturedPieces(newCaptured)

    return true
  }, [])

  const onSquareClick = useCallback(
    (square, canMovePieceFn, players, roomId, waitingRematchFlag, gameAbortedFlag) => {
      if (winner || gameStatus || gameAbortedFlag || waitingRematchFlag || (roomId && players.length < 2)) {
        return
      }

      const piece = game.get(square)

      if (!selectedSquare) {
        if (piece && piece.color === game.turn() && canMovePieceFn(piece)) {
          setSelectedSquare(square)
        }
        return
      }

      const validMoves = getValidMoves(selectedSquare)

      if (validMoves.includes(square)) {
        return { from: selectedSquare, to: square }
      }

      if (piece && piece.color === game.turn() && canMovePieceFn(piece)) {
        setSelectedSquare(square)
        return null
      }

      setSelectedSquare(null)
      return null
    },
    [game, selectedSquare, winner, gameStatus, getValidMoves]
  )

  const isCheckmate = gameStatus === 'checkmate'
  const isDraw = gameStatus === 'draw' || gameStatus === 'stalemate' ||
    gameStatus === 'repetition' || gameStatus === 'insufficient material' ||
    gameStatus === 'fifty-move rule' || gameStatus === 'agreement'
  const isStalemate = gameStatus === 'stalemate'
  const gameEnded = winner !== null || isCheckmate || isDraw
  const turn = game.turn()
  const canUndo = historyRef.current.length > 0 && !gameEnded

  return {
    game,
    selectedSquare,
    setSelectedSquare,
    moveHistory,
    capturedPieces,
    winner,
    setWinner,
    gameStarted,
    setGameStarted,
    gameStatus,
    setGameStatus,
    resetGame,
    getValidMoves,
    movePiece,
    undoMove,
    receiveServerMove,
    applyServerGameState,
    handleGameOver,
    onSquareClick,
    isCheckmate,
    isDraw,
    isStalemate,
    gameEnded,
    turn,
    canUndo,
    pieceSymbols: PIECE_SYMBOLS,
  }
}
