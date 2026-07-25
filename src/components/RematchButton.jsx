import React from 'react'

const RematchButton = React.memo(({ waitingRematch, onClick }) => {
  return (
    <div className="rematch-wrap">
      <button
        className="rematch-btn"
        disabled={waitingRematch}
        onClick={onClick}
      >
        {waitingRematch ? 'Waiting for opponent...' : 'Rematch'}
      </button>
    </div>
  )
})

RematchButton.displayName = 'RematchButton'

export default RematchButton
