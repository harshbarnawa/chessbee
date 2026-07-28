import React, { useState, useRef, useEffect } from 'react'
import { useTheme, BOARD_THEMES, PIECE_STYLES } from '../context/ThemeContext'
import { createPieceSvg } from '../utils/chessPieces'

const THEME_ICONS = {
  green: '🌿', wood: '🪵', glass: '💎', brown: '🟫', icysea: '🧊',
  newspaper: '📰', walnut: '🌰', sky: '☀️', lolz: '🎉', stone: '🪨',
  bases: '⚾', '8bit': '🕹️', marble: '🏛️', purple: '🔮',
  translucent: '✨', metal: '⚙️', tournament: '🏆', dash: '⚡',
  burledwood: '🌲', darkblue: '🌙',
}

const PIECE_ICONS = {
  neo: '💠', classic: '♚', wood: '🪵', glass: '💎', metal: '⚙️',
  marble: '🏛️', gothic: '🕯️', '8bit': '🕹️', tournament: '🏆',
  book: '📖', icysea: '🧊', newspaper: '📰', sky: '☀️', walnut: '🌰',
  purple: '🔮', dash: '⚡', bases: '⚾', lolz: '🎉', burledwood: '🌲',
  translucent: '✨',
}

const ThemeSelector = React.memo(() => {
  const { boardTheme, setBoardTheme, pieceStyle, setPieceStyle } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('board')
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Board & Piece Themes"
        aria-label="Change board and piece theme"
        aria-expanded={isOpen}
      >
        🎨
      </button>

      {isOpen && (
        <div className="theme-dropdown theme-dropdown-xl">
          {/* Tab bar */}
          <div className="theme-tabs">
            <button
              className={`theme-tab ${activeTab === 'board' ? 'theme-tab-active' : ''}`}
              onClick={() => setActiveTab('board')}
            >
              <span className="tab-icon">🎨</span> Board
            </button>
            <button
              className={`theme-tab ${activeTab === 'piece' ? 'theme-tab-active' : ''}`}
              onClick={() => setActiveTab('piece')}
            >
              <span className="tab-icon">♟</span> Pieces
            </button>
          </div>

          {/* Board Themes Grid */}
          {activeTab === 'board' && (
            <div className="theme-grid-section">
              <div className="theme-grid">
                {Object.entries(BOARD_THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    className={`theme-card ${boardTheme === key ? 'theme-card-active' : ''}`}
                    onClick={() => { setBoardTheme(key) }}
                    title={theme.name}
                  >
                    <span className="theme-card-icon">{THEME_ICONS[key] || '🎨'}</span>
                    <span className="theme-card-swatches">
                      <span className="theme-card-swatch" style={{ background: theme.light }} />
                      <span className="theme-card-swatch" style={{ background: theme.dark }} />
                    </span>
                    <span className="theme-card-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Piece Styles Grid */}
          {activeTab === 'piece' && (
            <div className="theme-grid-section">
              <div className="theme-grid">
                {Object.entries(PIECE_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    className={`theme-card theme-card-piece ${pieceStyle === key ? 'theme-card-active' : ''}`}
                    onClick={() => { setPieceStyle(key) }}
                    title={style.name}
                  >
                    <span className="piece-card-previews">
                      <span
                        className="piece-card-svg"
                        dangerouslySetInnerHTML={{ __html: createPieceSvg('k', 'w', key) }}
                      />
                      <span
                        className="piece-card-svg piece-card-dark"
                        dangerouslySetInnerHTML={{ __html: createPieceSvg('k', 'b', key) }}
                      />
                    </span>
                    <span className="theme-card-name">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

ThemeSelector.displayName = 'ThemeSelector'

export default ThemeSelector
