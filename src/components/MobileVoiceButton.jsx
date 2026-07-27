import React from 'react'

/**
 * MobileVoiceButton — floating microphone button for mobile devices.
 *
 * Renders a fixed-position microphone button that sits at the bottom
 * of the screen on mobile viewports, providing easy one-handed access
 * to voice input during chess games.
 */
const MobileVoiceButton = React.memo(({
  isListening,
  parsedDisplay,
  onToggleListening,
}) => {
  return (
    <div className="mobile-voice-fab" role="region" aria-label="Voice input">
      <button
        className={`mobile-voice-btn ${isListening ? 'mobile-voice-btn-active' : ''}`}
        onClick={onToggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        aria-pressed={isListening}
      >
        <span className="mobile-voice-icon">
          {isListening ? '🔴' : '🎤'}
        </span>
        {isListening && <span className="mobile-voice-pulse" />}
      </button>

      {/* Show parsed command briefly after recognition */}
      {parsedDisplay && !isListening && (
        <div className={`mobile-voice-tooltip ${parsedDisplay.rejected ? 'mobile-voice-rejected' : ''}`}>
          <span className={`mobile-voice-confidence ${parsedDisplay.confidence.className}`}>
            {parsedDisplay.confidence.label}
          </span>
          <span className="mobile-voice-command-text">{parsedDisplay.text}</span>
        </div>
      )}
    </div>
  )
})

MobileVoiceButton.displayName = 'MobileVoiceButton'

export default MobileVoiceButton
