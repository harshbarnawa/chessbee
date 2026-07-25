import React, { useEffect } from 'react'

const VoiceControl = React.memo(({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  error,
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
          {transcript && (
            <span className="voice-transcript">{transcript}</span>
          )}
        </div>
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
