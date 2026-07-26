import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(gameStarted, gameEnded, turn, roomId, players, setWinner) {
  const [whiteTime, setWhiteTime] = useState(600)
  const [blackTime, setBlackTime] = useState(600)
  const [abortTimer, setAbortTimer] = useState(60)
  const [gameAborted, setGameAborted] = useState(false)
  const [opponentOffline, setOpponentOffline] = useState(false)
  const intervalRef = useRef(null)
  const turnRef = useRef(turn)

  // Keep turnRef in sync
  useEffect(() => {
    turnRef.current = turn
  }, [turn])

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

  // Sync timer values from server state
  const syncFromServer = useCallback((gameState) => {
    if (gameState && typeof gameState.whiteTime === 'number') {
      setWhiteTime(gameState.whiteTime)
    }
    if (gameState && typeof gameState.blackTime === 'number') {
      setBlackTime(gameState.blackTime)
    }
  }, [])

  // Abort timer (waiting for opponent in multiplayer)
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
  }, [roomId, players.length >= 2, gameAborted])

  // Game timer — runs continuously, ticks the current player's clock
  // Does NOT restart on turn change — uses turnRef to avoid stale closures
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (gameEnded || !gameStarted || (roomId && players.length < 2)) {
      return
    }

    intervalRef.current = setInterval(() => {
      const currentTurn = turnRef.current

      if (currentTurn === 'w') {
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
    // Only restart the interval when game lifecycle changes, not on every turn change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, gameEnded, roomId, players.length >= 2, setWinner])

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
    syncFromServer,
    setWhiteTime,
    setBlackTime,
  }
}
