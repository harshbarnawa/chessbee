import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const ChessGame = lazy(() => import('./ChessGame'))

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontSize: '18px',
      fontWeight: '600',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>♟</div>
        <div>Loading ChessBee...</div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<ChessGame />} />
        <Route path="/room/:roomId" element={<ChessGame />} />
      </Routes>
    </Suspense>
  )
}

export default App
