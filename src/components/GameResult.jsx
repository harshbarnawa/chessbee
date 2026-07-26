import React from 'react'

const GameResult = React.memo(({ winner, isCheckmate, isDraw, isStalemate, gameAborted, opponentOffline, gameStatus, onRematch, waitingRematch }) => {
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
    // winner is set by the server via handleGameOver, capitalize it
    const winnerName = winner || 'Unknown'
    resultText = `Checkmate! ${winnerName} Wins!`
    resultIcon = '👑'
  } else if (isStalemate) {
    resultText = 'Stalemate — Draw!'
    resultIcon = '🤝'
  } else if (isDraw) {
    // Differentiate draw reasons
    let drawReason = ''
    if (gameStatus === 'repetition') drawReason = ' (Threefold Repetition)'
    else if (gameStatus === 'insufficient material') drawReason = ' (Insufficient Material)'
    else if (gameStatus === 'fifty-move rule') drawReason = ' (Fifty-Move Rule)'
    else if (gameStatus === 'agreement') drawReason = ' (By Agreement)'
    resultText = `Draw!${drawReason}`
    resultIcon = '🤝'
  } else if (winner) {
    // Differentiate between resignation and timeout
    if (gameStatus === 'resignation') {
      resultText = `${winner} Wins!`
      resultIcon = '🏆'
    } else {
      resultText = `${winner} Wins on Time!`
      resultIcon = '⏱️'
    }
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
          aria-label={waitingRematch ? 'Waiting for opponent' : 'Start rematch'}
        >
          {waitingRematch ? 'Waiting for opponent...' : '🔄 Rematch'}
        </button>
      </div>
    </div>
  )
})

GameResult.displayName = 'GameResult'

export default GameResult
