import React from 'react'
import GameStatus from './GameStatus'
import MoveHistory from './MoveHistory'

const Sidebar = React.memo(({ status, moveHistory }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">Game Status</div>
      <GameStatus status={status} />
      <MoveHistory moveHistory={moveHistory} />
    </div>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
