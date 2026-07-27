import React, { useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChessGame } from './hooks/useChessGame'
import { useTimer } from './hooks/useTimer'
import { useSocket } from './hooks/useSocket'
import { useVoice } from './hooks/useVoice'
import { useTheme } from './context/ThemeContext'
import { socket } from './socket'

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
    onSquareClick,
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

  // ── Voice Commands ─────────────────────────────────────────────────
  const handleVoiceCommand = useCallback(
    (command) => {
      if (!canMakeMove) return

      switch (command.type) {
        case 'move': {
          const { from, to } = command
          if (from && to) {
            movePiece(from, to, emitMove)
          } else if (from && !to) {
            setSelectedSquare(from)
          }
          break
        }

        case 'select': {
          const { square } = command
          if (square) {
            const piece = game.get(square)
            if (piece && piece.color === turn) {
              setSelectedSquare(square)
            } else if (selectedSquare) {
              const validMoves = getValidMoves(selectedSquare)
              if (validMoves.includes(square)) {
                movePiece(selectedSquare, square, emitMove)
              }
            }
          }
          break
        }

        case 'castle': {
          if (command.side === 'kingside') {
            if (turn === 'w') {
              movePiece('e1', 'g1', emitMove)
            } else {
              movePiece('e8', 'g8', emitMove)
            }
          } else {
            if (turn === 'w') {
              movePiece('e1', 'c1', emitMove)
            } else {
              movePiece('e8', 'c8', emitMove)
            }
          }
          break
        }

        case 'capture': {
          if (selectedSquare) {
            movePiece(selectedSquare, command.to, emitMove)
          }
          break
        }

        case 'promote': {
          if (selectedSquare && command.to) {
            movePiece(selectedSquare, command.to, emitMove)
          }
          break
        }

        case 'resign': {
          handleResign()
          break
        }

        case 'draw': {
          handleDrawOffer()
          break
        }

        case 'undo': {
          if (!roomId && canUndo) {
            undoMove()
          }
          break
        }

        default:
          break
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canMakeMove, game, turn, selectedSquare, getValidMoves, movePiece, emitMove, setSelectedSquare, roomId, canUndo, undoMove]
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

  // ── Square Click Handler ──────────────────────────────────────────
  const handleSquareClick = useCallback(
    (square) => {
      const result = onSquareClick(square, canMovePiece, players, roomId, waitingRematch, gameAborted)

      if (result && result.from && result.to) {
        movePiece(result.from, result.to, emitMove)
      }
    },
    [onSquareClick, canMovePiece, players, roomId, waitingRematch, gameAborted, movePiece, emitMove]
  )

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

  // ── Undo Handler (local only) ─────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (!roomId && canUndo) {
      undoMove()
    }
  }, [roomId, canUndo, undoMove])

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
            onSquareClick={handleSquareClick}
          />

          <VoiceControl
            isListening={isListening}
            isSupported={isSupported}
            transcript={transcript}
            interimTranscript={interimTranscript}
            error={voiceError}
            parsedDisplay={parsedDisplay}
            onToggleListening={toggleListening}
            onClearError={clearError}
          />

          <GameControls
            gameEnded={gameEnded}
            canMakeMove={canMakeMove}
            onResign={handleResign}
            onDrawOffer={handleDrawOffer}
            onUndo={handleUndo}
            isLocal={!roomId}
            drawOffered={drawOffered}
            drawOfferFrom={drawOfferFrom}
            onAcceptDraw={handleAcceptDraw}
            onDeclineDraw={handleDeclineDraw}
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
      </div>
    </div>
  )
}

export default ChessGame
