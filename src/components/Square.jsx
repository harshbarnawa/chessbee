import React from 'react'
import { usePieceTheme, UNICODE_PIECES } from '../context/PieceThemeContext'

const Square = React.memo(({ square, piece, isDark, isSelected, isValidMove, isKingInCheck, onClick, showRankLabel, showFileLabel }) => {
  const { pieceSymbols, ready } = usePieceTheme()

  // Get SVG (or blank if still loading), fallback to unicode
  const svg = piece ? (pieceSymbols[piece.color]?.[piece.type] || '') : ''
  const unicode = piece ? (UNICODE_PIECES[piece.color]?.[piece.type] || '') : ''

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
          dangerouslySetInnerHTML={{ __html: svg || unicode }}
        />
      )}
    </div>
  )
})

Square.displayName = 'Square'

export default Square
