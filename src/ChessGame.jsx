import React from 'react'
import { useParams } from 'react-router-dom'
import { useChessGame } from './hooks/useChessGame'
import { useTimer } from './hooks/useTimer'
import { useSocket } from './hooks/useSocket'

import TopBar from './components/TopBar'
import RoomControls from './components/RoomControls'
import Timer from './components/Timer'
import CapturedPieces from './components/CapturedPieces'
import ChessBoard from './components/ChessBoard'
import RematchButton from './components/RematchButton'
import Sidebar from './components/Sidebar'

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
    receiveMove,
    onSquareClick,
    isCheckmate,
    isDraw,
    gameEnded,
    turn,
    pieceSymbols,
  } = useChessGame()

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
        />
      </div>
    </div>
  )
}

export default ChessGame
