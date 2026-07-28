import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const BOARD_THEMES = {
  green: {
    name: 'Green',
    light: '#EEEED2',
    dark: '#769656',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  wood: {
    name: 'Wood',
    light: '#F0D9B5',
    dark: '#B58863',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  glass: {
    name: 'Glass',
    light: '#EAF7F7',
    dark: '#78A6A8',
    selected: 'rgba(100,200,200,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  brown: {
    name: 'Brown',
    light: '#E8D2B0',
    dark: '#8B5A3C',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  icysea: {
    name: 'Icy Sea',
    light: '#EAFBFF',
    dark: '#5B97A8',
    selected: 'rgba(100,180,220,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  newspaper: {
    name: 'Newspaper',
    light: '#F3F3F3',
    dark: '#8C8C8C',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  walnut: {
    name: 'Walnut',
    light: '#E3C8A3',
    dark: '#6A4634',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  sky: {
    name: 'Sky',
    light: '#EAF5FF',
    dark: '#5A8CCF',
    selected: 'rgba(100,160,240,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  lolz: {
    name: 'Lolz',
    light: '#FFF68F',
    dark: '#FF69B4',
    selected: 'rgba(255,180,200,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  stone: {
    name: 'Stone',
    light: '#E0E0E0',
    dark: '#757575',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  bases: {
    name: 'Bases',
    light: '#F6F1E3',
    dark: '#5A4C3A',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  '8bit': {
    name: '8-Bit',
    light: '#F5E6A8',
    dark: '#6E8B3D',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  marble: {
    name: 'Marble',
    light: '#F8F8F8',
    dark: '#9B9B9B',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  purple: {
    name: 'Purple',
    light: '#F1E5FF',
    dark: '#7B4FA3',
    selected: 'rgba(160,120,220,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  translucent: {
    name: 'Translucent',
    light: 'rgba(255,255,255,0.5)',
    dark: 'rgba(102,102,102,0.5)',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  metal: {
    name: 'Metal',
    light: '#E4E4E4',
    dark: '#686868',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  tournament: {
    name: 'Tournament',
    light: '#F0D9B5',
    dark: '#7A5230',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  dash: {
    name: 'Dash',
    light: '#FFFFFF',
    dark: '#2E2E2E',
    selected: 'rgba(150,150,150,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  burledwood: {
    name: 'Burled Wood',
    light: '#E9CFA4',
    dark: '#7A4F34',
    selected: 'rgba(255,214,10,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
  darkblue: {
    name: 'Dark Blue',
    light: '#DCEEFF',
    dark: '#234A74',
    selected: 'rgba(100,160,240,0.35)',
    valid: 'rgba(255,255,255,0.22)',
    check: '#e57373',
  },
}

export function ThemeProvider({ children }) {
  const [boardTheme, setBoardTheme] = useState(() => {
    const saved = localStorage.getItem('chessbee-board-theme')
    return saved && BOARD_THEMES[saved] ? saved : 'green'
  })

  useEffect(() => {
    localStorage.setItem('chessbee-board-theme', boardTheme)
  }, [boardTheme])

  const currentTheme = BOARD_THEMES[boardTheme] || BOARD_THEMES.green

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
      currentTheme,
      boardThemes: BOARD_THEMES,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
