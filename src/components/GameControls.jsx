import React, { useState, useEffect } from 'react'

/**
 * GameControls — Voice-only game controls.
 *
 * This is a voice-first chess game. Instead of clicking buttons,
 * use voice commands:
 *   - "resign" — Resign from the game
 *   - "draw" / "offer draw" — Offer a draw
 *   - "undo" — Undo last move (local only)
 *   - "accept draw" — Accept opponent's draw offer
 *   - "decline draw" — Decline opponent's draw offer
 *
 * This component only renders voice command hints, no clickable buttons.
 */
const GameControls = React.memo(({
  gameEnded,
  canMakeMove,
  drawOffered,
  drawOfferFrom,
  playerColor,
}) => {
  if (gameEnded) return null

  // Show draw offer status from opponent (voice-only)
  if (drawOffered && drawOfferFrom && drawOfferFrom !== playerColor) {
    return (
      <div className="game-controls draw-offer-controls">
        <span className="draw-offer-text">
          🎤 Draw offered by opponent — Say "accept draw" or "decline draw"
        </span>
      </div>
    )
  }

  return (
    <div className="game-controls voice-hints-only">
      {canMakeMove && (
        <div className="voice-game-hints">
          <span className="voice-game-hint-item">🎤 Say "resign" to resign</span>
          <span className="voice-game-hint-item">🎤 Say "draw" to offer draw</span>
        </div>
      )}
    </div>
  )
})

GameControls.displayName = 'GameControls'

export default GameControls
