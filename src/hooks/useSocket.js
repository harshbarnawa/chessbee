import { useState, useEffect, useCallback, useRef } from 'react'
import { socket } from '../socket'

export function useSocket(roomId) {
  const [playerColor, setPlayerColor] = useState(null)
  const [players, setPlayers] = useState([])
  const [waitingRematch, setWaitingRematch] = useState(false)
  const [copied, setCopied] = useState(false)
  const rematchTimeoutRef = useRef(null)

  useEffect(() => {
    if (!roomId) return

    socket.emit('joinRoom', roomId)

    socket.on('playerColor', (color) => {
      setPlayerColor(color)
    })

    socket.on('players', (data) => {
      setPlayers(data)
      if (data.length === 2) {
        setWaitingRematch(false)
      }
    })

    socket.on('roomFull', () => {
      alert('Room is full')
    })

    socket.on('opponentDisconnected', () => {
      setWaitingRematch(false)
    })

    socket.on('startRematch', () => {
      setWaitingRematch(false)
      if (rematchTimeoutRef.current) {
        clearTimeout(rematchTimeoutRef.current)
      }
    })

    return () => {
      socket.off('playerColor')
      socket.off('players')
      socket.off('roomFull')
      socket.off('opponentDisconnected')
      socket.off('startRematch')
    }
  }, [roomId])

  const emitMove = useCallback((move) => {
    if (roomId) {
      socket.emit('move', { roomId, move })
    }
  }, [roomId])

  const requestRematch = useCallback(() => {
    setWaitingRematch(true)
    socket.emit('requestRematch', roomId)
  }, [roomId])

  const copyRoomUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const canMovePiece = useCallback((piece) => {
    if (!roomId) return true
    if (!piece) return false
    return (
      (playerColor === 'white' && piece.color === 'w') ||
      (playerColor === 'black' && piece.color === 'b')
    )
  }, [roomId, playerColor])

  return {
    playerColor,
    players,
    waitingRematch,
    setWaitingRematch,
    copied,
    emitMove,
    requestRematch,
    copyRoomUrl,
    canMovePiece,
  }
}
