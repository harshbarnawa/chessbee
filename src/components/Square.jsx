import React from 'react'

const Square = React.memo(({ square, piece, isDark, isSelected, isValidMove, isKingInCheck, pieceSymbols, onClick }) => {
  return (
    <div
      onClick={() => onClick(square)}
      className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid' : ''} ${isKingInCheck ? 'check' : ''}`}
    >
      {piece && (
        <span className={`piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`}>
          {pieceSymbols[piece.color][piece.type]}
        </span>
      )}
    </div>
  )
})

Square.displayName = 'Square'

export default Square
