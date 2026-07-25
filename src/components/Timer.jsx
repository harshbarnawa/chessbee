import React from 'react'

const Timer = React.memo(({ whiteTime, blackTime, formatTime }) => {
  return (
    <div className="game-info">
      <div className="timer timer-white">
        <span className="timer-icon">⏱</span>
        <span className="timer-value">{formatTime(whiteTime)}</span>
      </div>
      <div className="timer timer-black">
        <span className="timer-icon">⏱</span>
        <span className="timer-value">{formatTime(blackTime)}</span>
      </div>
    </div>
  )
})

Timer.displayName = 'Timer'

export default Timer
