import React from 'react'

const GameResult = React.memo(({ winner, isCheckmate, isDraw, gameAborted, opponentOffline, onRematch, waitingRematch }) => {
  if (!winner && !isCheckmate && !isDraw && !gameAborted && !opponentOffline) return null

  let resultText = ''
  let resultIcon = ''

  if (gameAborted) {
    resultText = 'Game Aborted'
    resultIcon = '⏹️'
  } else if (opponentOffline) {
    resultText = 'Opponent Disconnected'
    resultIcon = '📴'
  } else if (isCheckmate) {
    const winnerColor = winner === 'White' ? 'White' : 'Black'
    resultText = `Checkmate! ${winnerColor} Wins!`
    resultIcon = '👑'
  } else if (isDraw) {
    resultText = 'Draw!'
    resultIcon = '🤝'
  } else if (winner) {
    resultText = `${winner} Wins on Time!`
    resultIcon = '⏱️'
  }

  return (
    <div className="game-result-overlay">
      <div className="game-result-card">
        <span className="result-icon">{resultIcon}</span>
        <h2 className="result-text">{resultText}</h2>
        <button
          className="rematch-btn"
          disabled={waitingRematch}
          onClick={onRematch}
        >
          {waitingRematch ? 'Waiting for opponent...' : '🔄 Rematch'}
        </button>
      </div>
    </div>
  )
})

GameResult.displayName = 'GameResult'

export default GameResult
