import React, { createContext, useContext, useState, useEffect } from 'react'

const PieceThemeContext = createContext()

// 4 professionally designed open-source piece sets (CBurnett, Merida, Alpha, Maestro)
export const PIECE_THEMES = ['cburnett', 'merida', 'alpha', 'maestro']

export const PIECE_THEME_NAMES = {
  cburnett: { name: 'CBurnett', icon: '♛' },
  merida: { name: 'Merida', icon: '♚' },
  alpha: { name: 'Alpha', icon: '♝' },
  maestro: { name: 'Maestro', icon: '♜' },
}

const PIECE_KEYS = ['wk','wq','wr','wb','wn','wp','bk','bq','br','bb','bn','bp']

/**
 * Loads all piece SVGs for all themes into a cache on app init.
 * ~48 small SVGs, ~100KB total — fetched once, then theme switches are instant.
 */
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
            cache[theme][piece] = svg
          })
      )
    )
  )
  // Log any failures
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.warn('[PieceTheme]', r.reason?.message || 'Unknown fetch error')
    }
  })
  return cache
}

/**
 * Builds a nested symbols object from flat cache:
 * { w: { k: '<svg>', q: '<svg>', ... }, b: { k: '<svg>', ... } }
 */
function buildPieceSymbols(cache, theme) {
  const themeCache = cache?.[theme]
  const symbols = { w: {}, b: {} }
  if (!themeCache) return symbols
  PIECE_KEYS.forEach(key => {
    const color = key[0]  // 'w' or 'b'
    const type = key[1]   // 'k', 'q', 'r', 'b', 'n', 'p'
    symbols[color][type] = themeCache[key] || ''
  })
  return symbols
}

export function PieceThemeProvider({ children }) {
  const [cache, setCache] = useState(null)
  const [theme, setTheme] = useState('cburnett')
  const [loading, setLoading] = useState(true)

  // Load all pieces on mount
  useEffect(() => {
    loadAllPieces().then(c => {
      setCache(c)
      setLoading(false)
    })
  }, [])

  const pieceSymbols = cache ? buildPieceSymbols(cache, theme) : { w: {}, b: {} }

  return (
    <PieceThemeContext.Provider value={{
      pieceTheme: theme,
      setPieceTheme: setTheme,
      pieceSymbols,
      loading,
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
