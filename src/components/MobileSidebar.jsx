import React, { useState } from 'react'

const MobileSidebar = React.memo(({ status, moveHistory }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close game info' : 'Open game info'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsOpen(false)}>
          <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <span className="mobile-sidebar-title">Game Info</span>
              <button className="mobile-sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close game info">✕</button>
            </div>
            <div className="mobile-status-box">{status}</div>
            <div className="mobile-moves-box">
              {moveHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (
                moveHistory.map((move, index) => (
                  <div key={index} className="move">
                    {Math.floor(index / 2) + 1}. {move.san}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
})

MobileSidebar.displayName = 'MobileSidebar'

export default MobileSidebar
