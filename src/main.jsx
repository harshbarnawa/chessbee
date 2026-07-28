import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { PieceThemeProvider } from './context/PieceThemeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <PieceThemeProvider>
        <App />
      </PieceThemeProvider>
    </ThemeProvider>
  </BrowserRouter>
)
