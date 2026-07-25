import React from 'react'
import ThemeSelector from './ThemeSelector'

const TopBar = React.memo(({ roomId }) => {
  const handleCreateRoom = () => {
    const id = crypto.randomUUID()
    window.location.href = `/room/${id}`
  }

  const handleLeave = () => {
    window.location.href = '/'
  }

  return (
    <div className="top-bar">
      <div className="logo-section">
        <img
          src="/bee-logo.svg"
          alt="Chess Bee"
          className="logo-img"
        />
        <h1 className="game-title">Chess Bee</h1>
      </div>

      <div className="top-buttons">
        <ThemeSelector />

        {!roomId && (
          <button className="main-btn" onClick={handleCreateRoom}>
            Create Room
          </button>
        )}

        {roomId && (
          <button className="leave-btn" onClick={handleLeave}>
            <img
              src="/leave.svg"
              alt="Leave"
              className="leave-icon"
            />
          </button>
        )}
      </div>
    </div>
  )
})

TopBar.displayName = 'TopBar'

export default TopBar
