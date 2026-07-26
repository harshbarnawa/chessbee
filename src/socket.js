import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://chessbylibrary.onrender.com/'

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  autoConnect: false,
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason)
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message)
})
