import React, { useState, useEffect, useRef } from 'react'

const MobileSidebar = React.memo(({ status, moveHistory }) => {
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new moves
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [moveHistory.length, isOpen])

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
            <div className="mobile-moves-box" ref={scrollRef}>
              {moveHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (() => {
                const pairs = []
                for (let i = 0; i < moveHistory.length; i += 2) {
                  const moveNum = Math.floor(i / 2) + 1
                  const whiteMove = moveHistory[i]
                  const blackMove = moveHistory[i + 1] || null
                  pairs.push({ moveNum, white: whiteMove, black: blackMove })
                }
                const lastIdx = moveHistory.length - 1
                return pairs.map((pair) => {
                  const whiteGlobalIdx = (pair.moveNum - 1) * 2
                  const blackGlobalIdx = (pair.moveNum - 1) * 2 + 1
                  return (
                    <div key={pair.moveNum} className="move-row">
                      <span className="move-number">{pair.moveNum}.</span>
                      <span className={`move-white ${whiteGlobalIdx === lastIdx ? 'move-current' : ''}`}>
                        {pair.white?.san || ''}
                      </span>
                      {pair.black && (
                        <span className={`move-black ${blackGlobalIdx === lastIdx ? 'move-current' : ''}`}>
                          {pair.black.san}
                        </span>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  )
})

MobileSidebar.displayName = 'MobileSidebar'

export default MobileSidebar
