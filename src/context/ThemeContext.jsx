import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const BOARD_THEMES = {
  classic: {
    name: 'Classic',
    light: '#f0d9b5',
    dark: '#b58863',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  golden: {
    name: 'Golden Bee',
    light: '#f0d9b5',
    dark: '#ebb331',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  midnight: {
    name: 'Midnight',
    light: '#dee3e6',
    dark: '#8ca2ad',
    selected: 'rgba(100,200,100,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  forest: {
    name: 'Forest',
    light: '#eeeed2',
    dark: '#769656',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  marble: {
    name: 'Marble',
    light: '#f0f0f0',
    dark: '#6d8a6d',
    selected: 'rgba(100,150,255,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  rosewood: {
    name: 'Rosewood',
    light: '#f5d5c8',
    dark: '#b0522f',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
}

export const PIECE_STYLES = {
  unicode: {
    name: 'Classic Unicode',
    pieces: {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
    },
  },
  merida: {
    name: 'Merida',
    pieces: {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
    },
  },
}

export function ThemeProvider({ children }) {
  const [boardTheme, setBoardTheme] = useState(() => {
    const saved = localStorage.getItem('chessbee-board-theme')
    return saved && BOARD_THEMES[saved] ? saved : 'golden'
  })

  const [pieceStyle, setPieceStyle] = useState(() => {
    const saved = localStorage.getItem('chessbee-piece-style')
    return saved && PIECE_STYLES[saved] ? saved : 'unicode'
  })

  useEffect(() => {
    localStorage.setItem('chessbee-board-theme', boardTheme)
  }, [boardTheme])

  useEffect(() => {
    localStorage.setItem('chessbee-piece-style', pieceStyle)
  }, [pieceStyle])

  const currentTheme = BOARD_THEMES[boardTheme] || BOARD_THEMES.golden
  const currentPieces = PIECE_STYLES[pieceStyle] || PIECE_STYLES.unicode

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--light', currentTheme.light)
    root.style.setProperty('--dark', currentTheme.dark)
    root.style.setProperty('--selected', currentTheme.selected)
    root.style.setProperty('--valid', currentTheme.valid)
    root.style.setProperty('--check', currentTheme.check)
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{
      boardTheme,
      setBoardTheme,
      pieceStyle,
      setPieceStyle,
      currentTheme,
      currentPieces,
      boardThemes: BOARD_THEMES,
      pieceStyles: PIECE_STYLES,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
