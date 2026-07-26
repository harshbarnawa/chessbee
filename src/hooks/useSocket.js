import { useState, useEffect, useCallback, useRef } from 'react'
import { socket } from '../socket'

export function useSocket(roomId) {
  const [playerColor, setPlayerColor] = useState(null)
  const [players, setPlayers] = useState([])
  const [waitingRematch, setWaitingRematch] = useState(false)
  const [copied, setCopied] = useState(false)
  const [gameOverData, setGameOverData] = useState(null)
  const [drawOffered, setDrawOffered] = useState(false)
  const [drawOfferFrom, setDrawOfferFrom] = useState(null)
  const rematchTimeoutRef = useRef(null)

  // Connect socket on mount, disconnect on unmount
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      // Don't disconnect socket on unmount — it's a singleton
      // Only disconnect when the app is truly closed
    }
  }, [])

  useEffect(() => {
    if (!roomId) return

    // Join the room
    socket.emit('joinRoom', roomId)

    const handlePlayerColor = (color) => {
      setPlayerColor(color)
    }

    const handlePlayers = (data) => {
      setPlayers(data)
      if (data.length === 2) {
        setWaitingRematch(false)
      }
    }

    const handleRoomFull = () => {
      setGameOverData(null)
    }

    const handleOpponentDisconnected = () => {
      setWaitingRematch(false)
    }

    const handleStartRematch = (gameState) => {
      setWaitingRematch(false)
      setGameOverData(null)
      setDrawOffered(false)
      setDrawOfferFrom(null)
      if (rematchTimeoutRef.current) {
        clearTimeout(rematchTimeoutRef.current)
      }
    }

    const handleRematchWaiting = (count) => {
      // Still waiting
    }

    const handleDrawOffered = ({ from }) => {
      setDrawOffered(true)
      setDrawOfferFrom(from)
    }

    const handleDrawDeclined = ({ from }) => {
      setDrawOffered(false)
      setDrawOfferFrom(null)
    }

    // Rejoin room on reconnect
    const handleConnect = () => {
      if (roomId) {
        socket.emit('joinRoom', roomId)
      }
    }

    socket.on('playerColor', handlePlayerColor)
    socket.on('players', handlePlayers)
    socket.on('roomFull', handleRoomFull)
    socket.on('opponentDisconnected', handleOpponentDisconnected)
    socket.on('startRematch', handleStartRematch)
    socket.on('rematchWaiting', handleRematchWaiting)
    socket.on('drawOffered', handleDrawOffered)
    socket.on('drawDeclined', handleDrawDeclined)
    socket.on('connect', handleConnect)

    return () => {
      socket.off('playerColor', handlePlayerColor)
      socket.off('players', handlePlayers)
      socket.off('roomFull', handleRoomFull)
      socket.off('opponentDisconnected', handleOpponentDisconnected)
      socket.off('startRematch', handleStartRematch)
      socket.off('rematchWaiting', handleRematchWaiting)
      socket.off('drawOffered', handleDrawOffered)
      socket.off('drawDeclined', handleDrawDeclined)
      socket.off('connect', handleConnect)
    }
  }, [roomId])

  const emitMove = useCallback(
    (move) => {
      if (roomId) {
        socket.emit('move', { roomId, move })
      }
    },
    [roomId]
  )

  const requestRematch = useCallback(() => {
    setWaitingRematch(true)
    socket.emit('requestRematch', roomId)
  }, [roomId])

  const resign = useCallback(() => {
    if (roomId) {
      socket.emit('resign', roomId)
    }
  }, [roomId])

  const offerDraw = useCallback(() => {
    if (roomId) {
      socket.emit('offerDraw', roomId)
    }
  }, [roomId])

  const acceptDraw = useCallback(() => {
    if (roomId) {
      socket.emit('acceptDraw', roomId)
      setDrawOffered(false)
      setDrawOfferFrom(null)
    }
  }, [roomId])

  const declineDraw = useCallback(() => {
    if (roomId) {
      socket.emit('declineDraw', roomId)
      setDrawOffered(false)
      setDrawOfferFrom(null)
    }
  }, [roomId])

  const leaveRoom = useCallback(() => {
    if (roomId) {
      socket.emit('leaveRoom', roomId)
    }
    setPlayerColor(null)
    setPlayers([])
    setWaitingRematch(false)
    setGameOverData(null)
    setDrawOffered(false)
    setDrawOfferFrom(null)
  }, [roomId])

  const copyRoomUrl = useCallback(() => {
    const url = window.location.origin + '/room/' + roomId
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for non-HTTPS
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [roomId])

  const canMovePiece = useCallback(
    (piece) => {
      if (!roomId) return true
      if (!piece) return false
      return (
        (playerColor === 'white' && piece.color === 'w') ||
        (playerColor === 'black' && piece.color === 'b')
      )
    },
    [roomId, playerColor]
  )

  return {
    playerColor,
    players,
    waitingRematch,
    setWaitingRematch,
    copied,
    gameOverData,
    setGameOverData,
    drawOffered,
    drawOfferFrom,
    setDrawOffered,
    emitMove,
    requestRematch,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    leaveRoom,
    copyRoomUrl,
    canMovePiece,
  }
}
