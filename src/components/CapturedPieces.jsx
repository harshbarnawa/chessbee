import React from 'react'

const CapturedPieces = React.memo(({ capturedPieces }) => {
  return (
    <div className="captures-mini">
      <div className="mini-capture-row">
        {capturedPieces.white.map((piece, index) => (
          <span key={index} className="capture-piece">
            {piece}
          </span>
        ))}
      </div>
      <div className="mini-capture-row">
        {capturedPieces.black.map((piece, index) => (
          <span key={index} className="capture-piece">
            {piece}
          </span>
        ))}
      </div>
    </div>
  )
})

CapturedPieces.displayName = 'CapturedPieces'

export default CapturedPieces
