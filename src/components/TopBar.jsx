import React from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'

const TopBar = React.memo(({ roomId, onLeave }) => {
  const navigate = useNavigate()

  const handleCreateRoom = () => {
    const id = crypto.randomUUID()
    navigate(`/room/${id}`)
  }

  const handleLeave = () => {
    if (onLeave) {
      onLeave()
    } else {
      navigate('/')
    }
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
          <button className="main-btn" onClick={handleCreateRoom} aria-label="Create a new game room">
            Create Room
          </button>
        )}

        {roomId && (
          <button className="leave-btn" onClick={handleLeave} aria-label="Leave room">
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
