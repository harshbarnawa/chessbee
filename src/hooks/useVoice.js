import { useState, useCallback, useRef, useEffect } from 'react'
import { parseVoiceInput, getMoveDescription, getConfidenceLabel } from '../utils/voiceParser'

/**
 * useVoice — Voice recognition hook for ChessBee
 *
 * Manages the Web Speech API lifecycle, feeds transcripts through the
 * voice-parsing pipeline, and surfaces parsed commands + metadata.
 *
 * @param {Function} onCommand        Called with the parsed command object on success
 * @param {Object}   [opts]
 * @param {boolean}  [opts.continuous=true]  Keep listening after each utterance
 * @param {number}   [opts.confidenceThreshold=0.35]  Minimum confidence to accept a command
 */
export function useVoice(onCommand, opts = {}) {
  const {
    continuous = true,
    confidenceThreshold = 0.35,
  } = opts

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState(null)
  const [lastConfidence, setLastConfidence] = useState(null)
  const [parsedDisplay, setParsedDisplay] = useState(null)
  const recognitionRef = useRef(null)
  const restartTimeoutRef = useRef(null)
  const pendingRestartRef = useRef(false)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const stopListening = useCallback(() => {
    pendingRestartRef.current = false
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore errors from already-stopped recognizers
      }
      recognitionRef.current = null
    }
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser')
      return
    }

    // Stop any existing session
    if (recognitionRef.current) {
      stopListening()
    }

    pendingRestartRef.current = true

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3

    let finalTranscript = ''
    let lastProcessedIndex = -1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setLastCommand(null)
      setLastConfidence(null)
      setParsedDisplay(null)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      // Build interim text from non-final results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]

        // Get the best (highest-confidence) alternative
        const bestAlternative = result[0]
        const transcriptText = bestAlternative.transcript

        if (result.isFinal) {
          final += transcriptText
        } else {
          interim += transcriptText
        }
      }

      // Show interim results for real-time feedback
      if (interim) {
        setInterimTranscript(interim)
      }

      // Process final results
      if (final) {
        finalTranscript = (finalTranscript ? finalTranscript + ' ' : '') + final
        setTranscript(finalTranscript)
        setInterimTranscript('')

        // Get estimated confidence from the speech API
        // Use the confidence of the last final result
        let speechConfidence = 0.8
        let lastFinalResult = null
        for (let i = event.results.length - 1; i >= 0; i--) {
          if (event.results[i].isFinal) {
            lastFinalResult = event.results[i]
            speechConfidence = event.results[i][0].confidence || 0.8
            break
          }
        }

        // Try ALL alternatives from the speech API to find the best parse.
        // The first alternative is usually highest confidence from the ASR,
        // but a lower-ranked alternative might match chess vocabulary better
        // (e.g. "pawn" vs "porn", "knight" vs "night").
        let bestParsed = null
        let bestConfidence = 0
        let bestRaw = finalTranscript

        if (lastFinalResult) {
          for (let alt = 0; alt < lastFinalResult.length; alt++) {
            const altText = lastFinalResult[alt].transcript
            // Reconstruct the full transcript with this alternative
            const altFull = finalTranscript.replace(final, altText)
            const parsed = parseVoiceInput(altFull, lastFinalResult[alt].confidence || speechConfidence)
            const conf = parsed?.confidence ?? 0
            if (conf > bestConfidence) {
              bestConfidence = conf
              bestParsed = parsed
              bestRaw = altFull
            }
          }
        }

        // Fall back to default parsing if no alternative worked
        if (!bestParsed) {
          bestParsed = parseVoiceInput(finalTranscript, speechConfidence)
          bestConfidence = bestParsed?.confidence ?? 0
          bestRaw = finalTranscript
        }

        const parsed = bestParsed
        const confidence = bestConfidence

        if (parsed && confidence >= confidenceThreshold) {
          setLastCommand(parsed.command)
          setLastConfidence(confidence)
          setParsedDisplay({
            text: parsed.displayText,
            confidence: getConfidenceLabel(confidence),
            normalized: parsed.normalized,
            raw: parsed.raw,
          })
          onCommand?.(parsed.command)
          // Clear for next command
          finalTranscript = ''
          lastProcessedIndex = event.results.length - 1
        } else if (parsed) {
          // Below confidence threshold — show as "low confidence" but don't execute
          setLastConfidence(confidence)
          setParsedDisplay({
            text: parsed.displayText || 'Unclear command',
            confidence: getConfidenceLabel(confidence),
            normalized: parsed.normalized,
            raw: parsed.raw,
            rejected: true,
          })
        } else {
          // Could not parse — show an error briefly
          setError(`Could not understand: "${final}"`)
          setParsedDisplay({
            text: '?',
            confidence: { label: 'Unparseable', className: 'confidence-low' },
            raw: final,
            rejected: true,
          })
        }
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.')
      } else if (event.error === 'audio-capture') {
        setError('No microphone found.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied.')
        setIsListening(false)
        pendingRestartRef.current = false
      } else if (event.error === 'aborted') {
        // Expected when we manually stop — ignore
      } else {
        setError(`Error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      if (pendingRestartRef.current && continuous) {
        restartTimeoutRef.current = setTimeout(() => {
          if (pendingRestartRef.current) {
            try {
              recognition.start()
              recognitionRef.current = recognition
            } catch (e) {
              // Already started or dead
            }
          }
        }, 100)
      } else {
        setIsListening(false)
        recognitionRef.current = null
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [onCommand, stopListening, continuous, confidenceThreshold])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setLastCommand(null)
    setLastConfidence(null)
    setParsedDisplay(null)
  }, [])

  useEffect(() => {
    return () => {
      pendingRestartRef.current = false
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    lastCommand,
    lastConfidence,
    parsedDisplay,
    startListening,
    stopListening,
    toggleListening,
    clearError,
    clearTranscript,
  }
}
