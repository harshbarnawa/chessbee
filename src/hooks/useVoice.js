import { useState, useCallback, useRef, useEffect } from 'react'
import { parseVoiceInput, getMoveDescription } from '../utils/voiceParser'

export function useVoice(onCommand) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
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

    if (recognitionRef.current) {
      stopListening()
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
      setInterimTranscript('')
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (interim) {
        setInterimTranscript(interim)
      }

      if (final) {
        setTranscript(final)
        setInterimTranscript('')

        const command = parseVoiceInput(final)
        if (command) {
          setLastCommand(command)
          onCommand?.(command)
        } else {
          setError(`Could not understand: "${final}"`)
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
      } else {
        setError(`Error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [onCommand, stopListening])

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
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
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
    startListening,
    stopListening,
    toggleListening,
    clearError,
    clearTranscript,
  }
}
