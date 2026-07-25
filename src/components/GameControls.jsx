import React, { useState } from 'react'

const GameControls = React.memo(({ gameEnded, canMakeMove, onResign, onDrawOffer, onUndo, isLocal }) => {
  const [showConfirm, setShowConfirm] = useState(null)

  const handleResign = () => {
    if (showConfirm === 'resign') {
      onResign()
      setShowConfirm(null)
    } else {
      setShowConfirm('resign')
      setTimeout(() => setShowConfirm(null), 3000)
    }
  }

  const handleDraw = () => {
    if (showConfirm === 'draw') {
      onDrawOffer()
      setShowConfirm(null)
    } else {
      setShowConfirm('draw')
      setTimeout(() => setShowConfirm(null), 3000)
    }
  }

  if (gameEnded) return null

  return (
    <div className="game-controls">
      {canMakeMove && (
        <>
          <button
            className={`control-btn control-resign ${showConfirm === 'resign' ? 'control-confirm' : ''}`}
            onClick={handleResign}
            aria-label={showConfirm === 'resign' ? 'Confirm resignation' : 'Resign from game'}
          >
            {showConfirm === 'resign' ? 'Confirm Resign?' : '🏳️ Resign'}
          </button>

          {!isLocal && (
            <button
              className={`control-btn control-draw ${showConfirm === 'draw' ? 'control-confirm' : ''}`}
              onClick={handleDraw}
              aria-label={showConfirm === 'draw' ? 'Confirm draw offer' : 'Offer draw'}
            >
              {showConfirm === 'draw' ? 'Confirm Draw?' : '🤝 Offer Draw'}
            </button>
          )}

          {isLocal && (
            <button
              className="control-btn control-undo"
              onClick={onUndo}
              aria-label="Undo last move"
            >
              ↩️ Undo
            </button>
          )}
        </>
      )}
    </div>
  )
})

GameControls.displayName = 'GameControls'

export default GameControls
