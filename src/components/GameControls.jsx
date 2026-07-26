import React, { useState, useEffect } from 'react'

const GameControls = React.memo(({
  gameEnded,
  canMakeMove,
  onResign,
  onDrawOffer,
  onUndo,
  isLocal,
  drawOffered,
  drawOfferFrom,
  onAcceptDraw,
  onDeclineDraw,
  playerColor,
}) => {
  const [showConfirm, setShowConfirm] = useState(null)

  // Auto-clear confirmation after 3 seconds
  useEffect(() => {
    if (showConfirm) {
      const timeout = setTimeout(() => setShowConfirm(null), 3000)
      return () => clearTimeout(timeout)
    }
  }, [showConfirm])

  const handleResign = () => {
    if (showConfirm === 'resign') {
      onResign()
      setShowConfirm(null)
    } else {
      setShowConfirm('resign')
    }
  }

  const handleDraw = () => {
    if (showConfirm === 'draw') {
      onDrawOffer()
      setShowConfirm(null)
    } else {
      setShowConfirm('draw')
    }
  }

  if (gameEnded) return null

  // Show draw offer from opponent
  if (drawOffered && drawOfferFrom && drawOfferFrom !== playerColor) {
    return (
      <div className="game-controls draw-offer-controls">
        <span className="draw-offer-text">Draw offered by opponent</span>
        <button
          className="control-btn control-draw"
          onClick={onAcceptDraw}
          aria-label="Accept draw offer"
        >
          ✓ Accept
        </button>
        <button
          className="control-btn control-resign"
          onClick={onDeclineDraw}
          aria-label="Decline draw offer"
        >
          ✕ Decline
        </button>
      </div>
    )
  }

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
              disabled={drawOffered && drawOfferFrom === playerColor}
              aria-label={showConfirm === 'draw' ? 'Confirm draw offer' : 'Offer draw'}
            >
              {drawOffered && drawOfferFrom === playerColor
                ? 'Draw Offered...'
                : showConfirm === 'draw'
                ? 'Confirm Draw?'
                : '🤝 Offer Draw'}
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
