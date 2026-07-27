import React, { useEffect } from 'react'

const VoiceControl = React.memo(({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  error,
  parsedDisplay,
  onToggleListening,
  onClearError,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v' || e.key === 'V') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return
        }
        e.preventDefault()
        onToggleListening()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onToggleListening])

  if (!isSupported) {
    return (
      <div className="voice-control voice-unsupported">
        <span className="voice-icon">🎤</span>
        <span>Voice not supported in this browser</span>
      </div>
    )
  }

  return (
    <div className={`voice-control ${isListening ? 'voice-active' : ''}`}>
      <button
        className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
        onClick={onToggleListening}
        title="Press V to toggle voice (or click)"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        aria-pressed={isListening}
      >
        <span className="voice-icon">
          {isListening ? '🔴' : '🎤'}
        </span>
        {isListening && (
          <span className="voice-pulse" />
        )}
      </button>

      {isListening && (
        <div className="voice-status">
          <span className="voice-label">Listening...</span>
          {interimTranscript && (
            <span className="voice-interim">{interimTranscript}</span>
          )}
        </div>
      )}

      {/* Parsed command display (shown after recognition) */}
      {parsedDisplay && !isListening && (
        <div className={`voice-command-display ${parsedDisplay.rejected ? 'voice-rejected' : ''}`}>
          <span className={`voice-confidence ${parsedDisplay.confidence.className}`}>
            {parsedDisplay.confidence.label}
          </span>
          <span className="voice-command-text">
            {parsedDisplay.text}
          </span>
          {parsedDisplay.normalized && parsedDisplay.normalized !== parsedDisplay.raw && (
            <span className="voice-normalized-hint">
              — you said: "{parsedDisplay.raw}"
            </span>
          )}
        </div>
      )}

      {/* Show full transcript while listening */}
      {transcript && isListening && (
        <div className="voice-transcript">{transcript}</div>
      )}

      {/* Show raw transcript briefly after recognition (if parsed differently) */}
      {transcript && !isListening && !parsedDisplay?.normalized && (
        <div className="voice-transcript">{transcript}</div>
      )}

      {error && (
        <div className="voice-error" onClick={onClearError}>
          <span>{error}</span>
          <span className="voice-error-close">✕</span>
        </div>
      )}

      <div className="voice-hint">
        Press <kbd>V</kbd> to speak a move
      </div>
    </div>
  )
})

VoiceControl.displayName = 'VoiceControl'

export default VoiceControl
