import React, { createContext, useContext, useState, useEffect } from 'react'

const PieceThemeContext = createContext()

export const PIECE_THEMES = ['cburnett', 'merida', 'alpha', 'maestro']

export const PIECE_THEME_NAMES = {
  cburnett: { name: 'CBurnett', icon: '♛' },
  merida: { name: 'Merida', icon: '♚' },
  alpha: { name: 'Alpha', icon: '♝' },
  maestro: { name: 'Maestro', icon: '♜' },
}

/** Unicode fallback — used when SVG fails to load */
export const UNICODE_PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

const PIECE_KEYS = ['wk','wq','wr','wb','wn','wp','bk','bq','br','bb','bn','bp']

/**
 * Strip XML/DOCTYPE declarations and enforce 100% sizing + viewBox.
 * This ensures every SVG works with dangerouslySetInnerHTML regardless of source.
 */
function normalizeSvg(svg) {
  if (!svg || typeof svg !== 'string') return ''
  let s = svg
    .replace(/<\?xml[^>]*\?>/g, '')              // XML declaration
    .replace(/<!DOCTYPE[^>]*>/g, '')              // DOCTYPE
    .replace(/<!--[\s\S]*?-->/g, '')              // HTML comments
    .replace(/\bwidth\s*=\s*"[^"]*"/i, 'width="100%"')
    .replace(/\bheight\s*=\s*"[^"]*"/i, 'height="100%"')
  if (!s.includes('viewBox')) {
    s = s.replace('<svg', '<svg viewBox="0 0 45 45"')
  }
  return s
}

async function loadAllPieces() {
  const cache = {}
  const results = await Promise.allSettled(
    PIECE_THEMES.flatMap(theme =>
      PIECE_KEYS.map(piece =>
        fetch(`/pieces/${theme}/${piece}.svg`)
          .then(r => {
            if (!r.ok) throw new Error(`Failed to load ${theme}/${piece}.svg`)
            return r.text()
          })
          .then(svg => {
            if (!cache[theme]) cache[theme] = {}
            cache[theme][piece] = normalizeSvg(svg)
          })
      )
    )
  )
  results.forEach(r => {
    if (r.status === 'rejected') console.warn('[PieceTheme]', r.reason?.message)
  })
  return cache
}

function buildPieceSymbols(cache, theme) {
  const themeCache = cache?.[theme]
  const symbols = { w: {}, b: {} }
  if (!themeCache) return symbols
  PIECE_KEYS.forEach(key => {
    const color = key[0]
    const type = key[1]
    symbols[color][type] = themeCache[key] || ''
  })
  return symbols
}

export function PieceThemeProvider({ children }) {
  const [cache, setCache] = useState(null)
  const [theme, setTheme] = useState('cburnett')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadAllPieces().then(c => {
      setCache(c)
      setReady(true)
    })
  }, [])

  const pieceSymbols = cache ? buildPieceSymbols(cache, theme) : { w: {}, b: {} }

  return (
    <PieceThemeContext.Provider value={{
      pieceTheme: theme,
      setPieceTheme: setTheme,
      pieceSymbols,
      ready,
      pieceThemes: PIECE_THEMES,
    }}>
      {children}
    </PieceThemeContext.Provider>
  )
}

export function usePieceTheme() {
  const context = useContext(PieceThemeContext)
  if (!context) throw new Error('usePieceTheme must be used within PieceThemeProvider')
  return context
}
