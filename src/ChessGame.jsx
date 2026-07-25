import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useChessGame } from './hooks/useChessGame'
import { useTimer } from './hooks/useTimer'
import { useSocket } from './hooks/useSocket'
import { useVoice } from './hooks/useVoice'
import { useTheme } from './context/ThemeContext'

import TopBar from './components/TopBar'
import RoomControls from './components/RoomControls'
import Timer from './components/Timer'
import CapturedPieces from './components/CapturedPieces'
import ChessBoard from './components/ChessBoard'
import RematchButton from './components/RematchButton'
import Sidebar from './components/Sidebar'
import VoiceControl from './components/VoiceControl'
import ThemeSelector from './components/ThemeSelector'
import GameControls from './components/GameControls'
import PGNExport from './components/PGNExport'
import GameResult from './components/GameResult'

import './index.css'

const ChessGame = () => {
  const { roomId } = useParams()

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
    resetGame,
    getValidMoves,
    movePiece,
    undoMove,
    receiveMove,
    onSquareClick,
    isCheckmate,
    isDraw,
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
    emitMove,
    requestRematch,
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
  } = useTimer(gameStarted, gameEnded, turn, roomId, players, setWinner)

  const canMakeMove = !gameEnded && !gameAborted && !waitingRematch && !(roomId && players.length < 2)

  const handleVoiceCommand = useCallback((command) => {
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
  }, [canMakeMove, game, turn, selectedSquare, getValidMoves, movePiece, emitMove, setSelectedSquare, roomId, canUndo, undoMove])

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error: voiceError,
    toggleListening,
    clearError,
  } = useVoice(handleVoiceCommand)

  const getStatus = () => {
    if (gameAborted) return 'Game Aborted'
    if (opponentOffline) return 'Opponent Offline'
    if (winner) return `${winner} wins on time!`
    if (roomId && players.length < 2) return 'Waiting for opponent...'
    if (isCheckmate) return turn === 'w' ? 'Checkmate! Black Wins!' : 'Checkmate! White Wins!'
    if (isDraw) return 'Draw!'
    if (game.isCheck()) return turn === 'w' ? 'White King in Check!' : 'Black King in Check!'
    return turn === 'w' ? "White's Turn" : "Black's Turn"
  }

  const handleSquareClick = (square) => {
    const result = onSquareClick(
      square,
      canMovePiece,
      players,
      roomId,
      waitingRematch,
      gameAborted
    )

    if (result && result.from && result.to) {
      movePiece(result.from, result.to, emitMove)
    }
  }

  const handleRematch = () => {
    resetGame(false)
    resetTimers()
    setGameStarted(false)
    requestRematch()
  }

  const handleResign = () => {
    setWinner(turn === 'w' ? 'Black' : 'White')
  }

  const handleDrawOffer = () => {
    // TODO: Implement draw offer via socket
  }

  const handleUndo = () => {
    if (!roomId && canUndo) {
      undoMove()
    }
  }

  return (
    <div className="chess-app">
      <div className="chess-container">
        <div className="board-wrapper">
          <TopBar roomId={roomId} />

          <RoomControls
            roomId={roomId}
            copied={copied}
            abortTimer={abortTimer}
            gameAborted={gameAborted}
            players={players}
            onCopyUrl={copyRoomUrl}
          />

          <Timer
            whiteTime={whiteTime}
            blackTime={blackTime}
            formatTime={formatTime}
          />

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
          />

          <GameResult
            winner={winner}
            isCheckmate={isCheckmate}
            isDraw={isDraw}
            gameAborted={gameAborted}
            opponentOffline={opponentOffline}
            onRematch={handleRematch}
            waitingRematch={waitingRematch}
          />

          {gameEnded && (
            <RematchButton
              waitingRematch={waitingRematch}
              onClick={handleRematch}
            />
          )}
        </div>

        <Sidebar
          status={getStatus()}
          moveHistory={moveHistory}
          pgnExport={<PGNExport game={game} gameEnded={gameEnded} />}
        />
      </div>
    </div>
  )
}

export default ChessGame
