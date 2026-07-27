import React, { useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChessGame } from './hooks/useChessGame'
import { useTimer } from './hooks/useTimer'
import { useSocket } from './hooks/useSocket'
import { useVoice } from './hooks/useVoice'
import { useTheme } from './context/ThemeContext'
import { socket } from './socket'
import { speakCommandFeedback, speakGameEvent } from './utils/voiceFeedback'

import TopBar from './components/TopBar'
import RoomControls from './components/RoomControls'
import Timer from './components/Timer'
import CapturedPieces from './components/CapturedPieces'
import ChessBoard from './components/ChessBoard'
import RematchButton from './components/RematchButton'
import Sidebar from './components/Sidebar'
import VoiceControl from './components/VoiceControl'
import GameControls from './components/GameControls'
import PGNExport from './components/PGNExport'
import GameResult from './components/GameResult'
import MobileSidebar from './components/MobileSidebar'
import MobileVoiceButton from './components/MobileVoiceButton'

import './index.css'

const ChessGame = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const {
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
    isCheckmate,
    isDraw,
    isStalemate,
    gameEnded,
    turn,
    canUndo,
    pieceSymbols: defaultPieceSymbols,
  } = useChessGame()

  const { currentPieces } = useTheme()
  const pieceSymbols = currentPieces.pieces

  const {
    playerColor,
    players,
    waitingRematch,
    setWaitingRematch,
    copied,
    gameOverData,
    setGameOverData,
    drawOffered,
    drawOfferFrom,
    setDrawOffered,
    emitMove,
    requestRematch,
    resign: emitResign,
    offerDraw,
    acceptDraw,
    declineDraw,
    leaveRoom,
    copyRoomUrl,
    canMovePiece,
  } = useSocket(roomId)

  const {
    whiteTime,
    blackTime,
    abortTimer,
    gameAborted,
    opponentOffline,
    resetTimers,
    formatTime,
    syncFromServer,
    setWhiteTime,
    setBlackTime,
  } = useTimer(gameStarted, gameEnded, turn, roomId, players, setWinner)

  const canMakeMove = !gameEnded && !gameAborted && !waitingRematch && !(roomId && players.length < 2)

  // ── Socket Event Listeners ─────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return

    // Opponent's move — apply to local game state
    const handleMoveMade = (data) => {
      if (data.move) {
        receiveServerMove(data.move)
      }
      if (data.gameState) {
        syncFromServer(data.gameState)
      }
    }

    // Our own move acknowledged by server — sync state only (we already applied optimistically)
    const handleMoveAccepted = (data) => {
      if (data.gameState) {
        syncFromServer(data.gameState)
      }
    }

    const handleGameOverEvent = (data) => {
      handleGameOver(data)
      setGameOverData(data)
    }

    const handleOpponentDisconnected = () => {
      // Player list will update via 'players' event with length < 2
      // canMakeMove will become false, preventing further moves
    }

    // Full game state from server (on join, reconnect, rematch)
    const handleGameState = (gameState) => {
      if (gameState && gameState.fen) {
        applyServerGameState(gameState)
        syncFromServer(gameState)
      }
    }

    // Rematch started with fresh game state
    const handleStartRematchEvent = (gameState) => {
      resetGame(false)
      resetTimers()
      if (gameState && gameState.fen) {
        applyServerGameState(gameState)
        syncFromServer(gameState)
      }
    }

    socket.on('moveMade', handleMoveMade)
    socket.on('moveAccepted', handleMoveAccepted)
    socket.on('gameOver', handleGameOverEvent)
    socket.on('opponentDisconnected', handleOpponentDisconnected)
    socket.on('gameState', handleGameState)
    socket.on('startRematch', handleStartRematchEvent)

    return () => {
      socket.off('moveMade', handleMoveMade)
      socket.off('moveAccepted', handleMoveAccepted)
      socket.off('gameOver', handleGameOverEvent)
      socket.off('opponentDisconnected', handleOpponentDisconnected)
      socket.off('gameState', handleGameState)
      socket.off('startRematch', handleStartRematchEvent)
    }
  }, [roomId, receiveServerMove, handleGameOver, syncFromServer, applyServerGameState, gameStarted, gameEnded, setGameOverData, resetGame, resetTimers])

  // ── Voice-only mode: no mouse/touch square click handler ──────────

  /**
   * Execute a voice move and speak feedback only on success.
   */
  const executeVoiceMove = useCallback((from, to, emitMove, piece) => {
    const success = movePiece(from, to, emitMove)
    if (success) {
      speakCommandFeedback({ type: 'move', piece, from, to })
    }
    return success
  }, [movePiece, emitMove])

  // ── Voice Commands ─────────────────────────────────────────────────
  const handleVoiceCommand = useCallback(
    (command) => {
      if (!canMakeMove) return

      switch (command.type) {
        case 'move': {
          const { from, to, piece } = command

          if (from && to) {
            // Direct move: "e2 e4", "e2 to e4"
            executeVoiceMove(from, to, emitMove, piece)
          } else if (!from && to) {
            // Voice-only move: "pawn to e4", "knight f3", "e4", etc.
            // Get ALL legal moves and filter by target square
            const allLegalMoves = game.moves({ verbose: true })
            const movesToTarget = allLegalMoves.filter(m => m.to === to)

            if (movesToTarget.length === 0) break // No valid move to this square

            let candidateMoves = movesToTarget
            if (piece) {
              // Filter by piece type: "pawn to e4", "knight f3"
              candidateMoves = movesToTarget.filter(m => m.piece === piece)
            }

            if (candidateMoves.length > 0) {
              // Pick the first valid move — voice-only, auto-select
              executeVoiceMove(candidateMoves[0].from, to, emitMove, piece)
            }
          } else if (from && !to) {
            setSelectedSquare(from)
          }
          break
        }

        case 'select': {
          // Voice-only mode: treat any square mention as a move target
          const { square, piece } = command
          if (square) {
            const allLegalMoves = game.moves({ verbose: true })
            const movesToTarget = allLegalMoves.filter(m => m.to === square)
            if (movesToTarget.length > 0) {
              executeVoiceMove(movesToTarget[0].from, square, emitMove, piece)
            }
          }
          break
        }

        case 'castle': {
          const castleSource = turn === 'w' ? 'e1' : 'e8'
          const castleTarget = command.side === 'kingside'
            ? (turn === 'w' ? 'g1' : 'g8')
            : (turn === 'w' ? 'c1' : 'c8')
          executeVoiceMove(castleSource, castleTarget, emitMove, 'k')
          break
        }

        case 'capture': {
          if (selectedSquare && command.to) {
            executeVoiceMove(selectedSquare, command.to, emitMove, command.piece)
          }
          break
        }

        case 'promote': {
          if (selectedSquare && command.to) {
            executeVoiceMove(selectedSquare, command.to, emitMove, command.piece)
          }
          break
        }

        case 'resign': {
          speakCommandFeedback(command)
          handleResign()
          break
        }

        case 'draw': {
          speakCommandFeedback(command)
          handleDrawOffer()
          break
        }

        case 'acceptDraw': {
          speakCommandFeedback({ type: 'acceptDraw' })
          handleAcceptDraw()
          break
        }

        case 'declineDraw': {
          speakCommandFeedback({ type: 'declineDraw' })
          handleDeclineDraw()
          break
        }

        case 'undo': {
          if (!roomId && canUndo) {
            undoMove()
            speakCommandFeedback(command)
          }
          break
        }

        default:
          break
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canMakeMove, game, turn, selectedSquare, getValidMoves, executeVoiceMove, emitMove, setSelectedSquare, roomId, canUndo, undoMove, handleResign, handleDrawOffer, handleAcceptDraw, handleDeclineDraw]
  )

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error: voiceError,
    parsedDisplay,
    toggleListening,
    clearError,
  } = useVoice(handleVoiceCommand)

  // ── Status Display ─────────────────────────────────────────────────
  const getStatus = () => {
    if (gameAborted) return 'Game Aborted'
    if (opponentOffline) return 'Opponent Offline'
    if (roomId && players.length < 2 && !gameStarted) return 'Waiting for opponent...'
    if (isCheckmate) {
      const checkmateWinner = winner || (turn === 'w' ? 'Black' : 'White')
      return `Checkmate! ${checkmateWinner} Wins!`
    }
    if (gameStatus === 'resignation') return `${winner} Wins!`
    if (gameStatus === 'agreement') return 'Draw by Agreement!'
    if (isDraw) {
      if (gameStatus === 'stalemate') return 'Stalemate — Draw!'
      if (gameStatus === 'repetition') return 'Draw by Repetition!'
      if (gameStatus === 'insufficient material') return 'Draw — Insufficient Material!'
      if (gameStatus === 'fifty-move rule') return 'Draw — Fifty-Move Rule!'
      return 'Draw!'
    }
    if (winner) return `${winner} wins on time!`
    if (roomId && players.length < 2) return 'Waiting for opponent...'
    if (game.isCheck()) return turn === 'w' ? 'White King in Check!' : 'Black King in Check!'
    return turn === 'w' ? "White's Turn" : "Black's Turn"
  }

  // ── Rematch Handler ───────────────────────────────────────────────
  const handleRematch = useCallback(() => {
    resetGame(false)
    resetTimers()
    setGameStarted(false)
    requestRematch()
  }, [resetGame, resetTimers, setGameStarted, requestRematch])

  // ── Resign Handler ────────────────────────────────────────────────
  const handleResign = useCallback(() => {
    if (roomId) {
      // Multiplayer: notify opponent via socket
      emitResign()
    } else {
      // Local: set winner directly
      setWinner(turn === 'w' ? 'Black' : 'White')
    }
  }, [roomId, emitResign, turn, setWinner])

  // ── Draw Offer Handler ────────────────────────────────────────────
  const handleDrawOffer = useCallback(() => {
    if (roomId) {
      offerDraw()
    }
  }, [roomId, offerDraw])

  const handleAcceptDraw = useCallback(() => {
    acceptDraw()
  }, [acceptDraw])

  const handleDeclineDraw = useCallback(() => {
    declineDraw()
  }, [declineDraw])

  // ── Leave Room ────────────────────────────────────────────────────
  const handleLeave = useCallback(() => {
    leaveRoom()
    navigate('/')
  }, [leaveRoom, navigate])

  return (
    <div className="chess-app" role="main" aria-label="ChessBee Chess Game">
      <div className="chess-container">
        <div className="board-wrapper">
          <TopBar roomId={roomId} onLeave={handleLeave} />

          <RoomControls
            roomId={roomId}
            copied={copied}
            abortTimer={abortTimer}
            gameAborted={gameAborted}
            players={players}
            onCopyUrl={copyRoomUrl}
          />

          <Timer whiteTime={whiteTime} blackTime={blackTime} formatTime={formatTime} />

          <CapturedPieces capturedPieces={capturedPieces} />

          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            getValidMoves={getValidMoves}
            playerColor={playerColor}
            pieceSymbols={pieceSymbols}
          />

          <VoiceControl
            isListening={isListening}
            isSupported={isSupported}
            error={voiceError}
            parsedDisplay={parsedDisplay}
            onToggleListening={toggleListening}
            onClearError={clearError}
          />

          <GameControls
            gameEnded={gameEnded}
            canMakeMove={canMakeMove}
            drawOffered={drawOffered}
            drawOfferFrom={drawOfferFrom}
            playerColor={playerColor}
          />

          <GameResult
            winner={winner}
            isCheckmate={isCheckmate}
            isDraw={isDraw}
            isStalemate={isStalemate}
            gameAborted={gameAborted}
            opponentOffline={opponentOffline}
            gameStatus={gameStatus}
            onRematch={handleRematch}
            waitingRematch={waitingRematch}
          />

          {gameEnded && (
            <RematchButton waitingRematch={waitingRematch} onClick={handleRematch} />
          )}
        </div>

        <Sidebar
          status={getStatus()}
          moveHistory={moveHistory}
          pgnExport={<PGNExport game={game} gameEnded={gameEnded} playerColor={playerColor} />}
        />

        <MobileSidebar status={getStatus()} moveHistory={moveHistory} />

        <MobileVoiceButton
          isListening={isListening}
          parsedDisplay={parsedDisplay}
          onToggleListening={toggleListening}
        />
      </div>
    </div>
  )
}

export default ChessGame
