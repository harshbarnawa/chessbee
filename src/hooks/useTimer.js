import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(gameStarted, gameEnded, turn, roomId, players, setWinner) {
  const [whiteTime, setWhiteTime] = useState(600)
  const [blackTime, setBlackTime] = useState(600)
  const [abortTimer, setAbortTimer] = useState(60)
  const [gameAborted, setGameAborted] = useState(false)
  const [opponentOffline, setOpponentOffline] = useState(false)
  const intervalRef = useRef(null)

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, [])

  const resetTimers = useCallback(() => {
    setWhiteTime(600)
    setBlackTime(600)
    setAbortTimer(60)
    setGameAborted(false)
    setOpponentOffline(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Abort timer (waiting for opponent)
  useEffect(() => {
    if (!roomId || players.length >= 2 || gameAborted) return

    const interval = setInterval(() => {
      setAbortTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setGameAborted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [roomId, players, gameAborted])

  // Game timer
  useEffect(() => {
    if (gameEnded || !gameStarted || (roomId && players.length < 2)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setWinner('Black')
            clearInterval(intervalRef.current)
            intervalRef.current = null
            return 0
          }
          return prev - 1
        })
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setWinner('White')
            clearInterval(intervalRef.current)
            intervalRef.current = null
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [gameStarted, gameEnded, turn, roomId, players, setWinner])

  return {
    whiteTime,
    blackTime,
    abortTimer,
    gameAborted,
    opponentOffline,
    setOpponentOffline,
    setGameAborted,
    formatTime,
    resetTimers,
  }
}
