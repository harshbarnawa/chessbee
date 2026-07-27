import React from 'react'
import { createPieceSvg } from '../utils/chessPieces'

const Square = React.memo(({ square, piece, isDark, isSelected, isValidMove, isKingInCheck, pieceSymbols, onClick, showRankLabel, showFileLabel }) => {
  return (
    <div
      role="gridcell"
      aria-label={`${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
      className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid' : ''} ${isKingInCheck ? 'check' : ''}`}
    >
      {showRankLabel && (
        <span className="coord-label rank-label">{showRankLabel}</span>
      )}
      {showFileLabel && (
        <span className="coord-label file-label">{showFileLabel}</span>
      )}
      {piece && (
        <span
          className={`piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`}
          dangerouslySetInnerHTML={{
            __html: pieceSymbols[piece.color]?.[piece.type]
              || createPieceSvg(piece.type, piece.color)
          }}
        />
      )}
    </div>
  )
})

Square.displayName = 'Square'

export default Square
