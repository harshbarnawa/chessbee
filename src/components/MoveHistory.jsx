import React, { useEffect, useRef } from 'react'

const MoveHistory = React.memo(({ moveHistory }) => {
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new moves
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [moveHistory.length])

  if (moveHistory.length === 0) {
    return (
      <div className="moves-box" ref={scrollRef}>
        <p className="no-moves">No moves yet</p>
      </div>
    )
  }

  // Pair moves into rows: 1. e4 e5  2. Nf3 Nc6
  const pairs = []
  for (let i = 0; i < moveHistory.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1
    const whiteMove = moveHistory[i]
    const blackMove = moveHistory[i + 1] || null
    pairs.push({ moveNum, white: whiteMove, black: blackMove })
  }

  // Highlight the last move
  const lastMoveIndex = moveHistory.length - 1

  return (
    <div className="moves-box" ref={scrollRef}>
      {pairs.map((pair, idx) => {
        const whiteGlobalIdx = idx * 2
        const blackGlobalIdx = idx * 2 + 1

        return (
          <div key={pair.moveNum} className="move-row">
            <span className="move-number">{pair.moveNum}.</span>
            <span
              className={`move-white ${whiteGlobalIdx === lastMoveIndex ? 'move-current' : ''}`}
            >
              {pair.white?.san || ''}
            </span>
            {pair.black && (
              <span
                className={`move-black ${blackGlobalIdx === lastMoveIndex ? 'move-current' : ''}`}
              >
                {pair.black.san}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
})

MoveHistory.displayName = 'MoveHistory'

export default MoveHistory
