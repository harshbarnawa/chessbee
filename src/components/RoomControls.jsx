import React from 'react'

const RoomControls = React.memo(({ roomId, copied, abortTimer, gameAborted, players, onCopyUrl }) => {
  if (!roomId) return null

  return (
    <>
      <div className="room-box">
        <input
          value={window.location.href}
          readOnly
          aria-label="Room invite link"
        />
        <button className="copy-btn" onClick={onCopyUrl} aria-label="Copy room link to clipboard">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {players.length < 2 && !gameAborted && (
        <div className="waiting-box">
          <span>Waiting for opponent...</span>
          <span>{abortTimer}s</span>
        </div>
      )}
    </>
  )
})

RoomControls.displayName = 'RoomControls'

export default RoomControls
