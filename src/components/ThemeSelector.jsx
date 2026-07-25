import React, { useState } from 'react'
import { useTheme, BOARD_THEMES } from '../context/ThemeContext'

const ThemeSelector = React.memo(() => {
  const { boardTheme, setBoardTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="theme-selector">
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Board Theme"
        aria-label="Change board theme"
        aria-expanded={isOpen}
      >
        🎨
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-title">Board Theme</div>
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <button
              key={key}
              className={`theme-option ${boardTheme === key ? 'theme-active' : ''}`}
              onClick={() => {
                setBoardTheme(key)
                setIsOpen(false)
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
    </div>
  )
})

ThemeSelector.displayName = 'ThemeSelector'

export default ThemeSelector
