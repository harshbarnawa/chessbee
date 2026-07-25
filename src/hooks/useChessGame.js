import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'

const PIECE_SYMBOLS = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

export function useChessGame() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [moveHistory, setMoveHistory] = useState([])
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] })
  const [winner, setWinner] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const historyRef = useRef([])

  const resetGame = useCallback((start = false) => {
    const freshGame = new Chess()
    setGame(freshGame)
    setSelectedSquare(null)
    setMoveHistory([])
    setCapturedPieces({ white: [], black: [] })
    setWinner(null)
    setGameStarted(start)
    historyRef.current = []
  }, [])

  const getValidMoves = useCallback((square) => {
    return game.moves({ square, verbose: true }).map((m) => m.to)
  }, [game])

  const applyMoveToState = useCallback((gameCopy, move) => {
    if (move.captured) {
      const victimColor = move.color === 'w' ? 'b' : 'w'
      const capturedSymbol = PIECE_SYMBOLS[victimColor][move.captured]

      setCapturedPieces((prev) => ({
        ...prev,
        [move.color === 'w' ? 'white' : 'black']: [
          ...prev[move.color === 'w' ? 'white' : 'black'],
          capturedSymbol,
        ],
      }))
    }

    setMoveHistory(gameCopy.history({ verbose: true }))
  }, [])

  const movePiece = useCallback((from, to, emitMove) => {
    if (winner) return false

    const gameCopy = new Chess(game.fen())
    const move = gameCopy.move({ from, to, promotion: 'q' })

    if (move) {
      historyRef.current.push(game.fen())
      applyMoveToState(gameCopy, move)
      setGame(gameCopy)
      setGameStarted(true)
      setSelectedSquare(null)

      if (emitMove) {
        emitMove({ from, to, promotion: 'q' })
      }

      return true
    }

    setSelectedSquare(null)
    return false
  }, [game, winner, applyMoveToState])

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

  const receiveMove = useCallback((move) => {
    setGame((currentGame) => {
      const gameCopy = new Chess(currentGame.fen())
      const playedMove = gameCopy.move(move)

      if (playedMove) {
        historyRef.current.push(currentGame.fen())
        applyMoveToState(gameCopy, playedMove)
      }

      return gameCopy
    })

    setGameStarted(true)
  }, [applyMoveToState])

  const onSquareClick = useCallback((square, canMovePiece, players, roomId, waitingRematch, gameAborted) => {
    if (winner || gameAborted || waitingRematch || (roomId && players.length < 2)) {
      return
    }

    const piece = game.get(square)

    if (!selectedSquare) {
      if (piece && piece.color === game.turn() && canMovePiece(piece)) {
        setSelectedSquare(square)
      }
      return
    }

    const validMoves = getValidMoves(selectedSquare)

    if (validMoves.includes(square)) {
      return { from: selectedSquare, to: square }
    }

    if (piece && piece.color === game.turn() && canMovePiece(piece)) {
      setSelectedSquare(square)
      return null
    }

    setSelectedSquare(null)
    return null
  }, [game, selectedSquare, winner, getValidMoves])

  const isCheckmate = game.isCheckmate()
  const isDraw = game.isDraw()
  const isCheck = game.isCheck()
  const gameEnded = winner || isCheckmate || isDraw
  const turn = game.turn()
  const canUndo = historyRef.current.length > 0

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
    resetGame,
    getValidMoves,
    movePiece,
    undoMove,
    receiveMove,
    onSquareClick,
    isCheckmate,
    isDraw,
    isCheck,
    gameEnded,
    turn,
    canUndo,
    pieceSymbols: PIECE_SYMBOLS,
  }
}
