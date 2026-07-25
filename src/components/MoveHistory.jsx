import React from 'react'

const MoveHistory = React.memo(({ moveHistory }) => {
  return (
    <div className="moves-box">
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
  )
})

MoveHistory.displayName = 'MoveHistory'

export default MoveHistory
