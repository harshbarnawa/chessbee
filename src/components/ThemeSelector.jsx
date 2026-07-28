import React, { useState, useRef, useEffect } from 'react'
import { useTheme, BOARD_THEMES, PIECE_STYLES } from '../context/ThemeContext'
import { createPieceSvg } from '../utils/chessPieces'

// Generate a small king SVG preview for each piece style
function getKingPreview(styleKey) {
  return createPieceSvg('k', 'w', styleKey)
}

const ThemeSelector = React.memo(() => {
  const { boardTheme, setBoardTheme, pieceStyle, setPieceStyle } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('board')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
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
        title="Board & Piece Theme"
        aria-label="Change board and piece theme"
        aria-expanded={isOpen}
      >
        🎨
      </button>

      {isOpen && (
        <div className="theme-dropdown theme-dropdown-wide">
          {/* Tab bar */}
          <div className="theme-tabs">
            <button
              className={`theme-tab ${activeTab === 'board' ? 'theme-tab-active' : ''}`}
              onClick={() => setActiveTab('board')}
            >
              Board
            </button>
            <button
              className={`theme-tab ${activeTab === 'piece' ? 'theme-tab-active' : ''}`}
              onClick={() => setActiveTab('piece')}
            >
              Pieces
            </button>
          </div>

          {/* Board Themes */}
          {activeTab === 'board' && (
            <div className="theme-section">
              <div className="theme-dropdown-title">Board Theme</div>
              {Object.entries(BOARD_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-option ${boardTheme === key ? 'theme-active' : ''}`}
                  onClick={() => {
                    setBoardTheme(key)
                  }}
                >
                  <span className="theme-preview">
                    <span className="theme-swatch" style={{ background: theme.light }} />
                    <span className="theme-swatch" style={{ background: theme.dark }} />
                  </span>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Piece Themes */}
          {activeTab === 'piece' && (
            <div className="theme-section">
              <div className="theme-dropdown-title">Piece Style</div>
              {Object.entries(PIECE_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  className={`theme-option piece-theme-option ${pieceStyle === key ? 'theme-active' : ''}`}
                  onClick={() => {
                    setPieceStyle(key)
                  }}
                >
                  <span className="piece-theme-preview">
                    <span
                      className="piece-preview-svg"
                      dangerouslySetInnerHTML={{ __html: getKingPreview(key) }}
                    />
                    <span
                      className="piece-preview-svg piece-preview-dark"
                      dangerouslySetInnerHTML={{ __html: createPieceSvg('k', 'b', key) }}
                    />
                  </span>
                  <span className="theme-name">{style.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

ThemeSelector.displayName = 'ThemeSelector'

export default ThemeSelector
