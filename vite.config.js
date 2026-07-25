import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('chess.js')) return 'chess'
          if (id.includes('socket.io-client')) return 'socket'
        },
      },
    },
  },
})
