import React from 'react'

const GameStatus = React.memo(({ status }) => {
  return (
    <div className="status-box">
      {status}
    </div>
  )
})

GameStatus.displayName = 'GameStatus'

export default GameStatus
