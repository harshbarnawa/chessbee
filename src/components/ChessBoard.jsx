import React, { useMemo } from 'react'
import Square from './Square'

const ChessBoard = React.memo(({ game, selectedSquare, getValidMoves, playerColor, pieceSymbols, onSquareClick }) => {
  const board = useMemo(() => {
    const squares = []
    const normalRanks = ['8', '7', '6', '5', '4', '3', '2', '1']
    const normalFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const flippedRanks = ['1', '2', '3', '4', '5', '6', '7', '8']
    const flippedFiles = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']

    const ranks = playerColor === 'black' ? flippedRanks : normalRanks
    const files = playerColor === 'black' ? flippedFiles : normalFiles

    const validMoves = selectedSquare ? getValidMoves(selectedSquare) : []

    ranks.forEach((rank, rIdx) => {
      files.forEach((file, cIdx) => {
        const square = `${file}${rank}`
        const piece = game.get(square)
        const isDark = (rIdx + cIdx) % 2 === 1
        const isSelected = square === selectedSquare
        const isValidMove = validMoves.includes(square)
        const kingInCheck = piece && piece.type === 'k' && piece.color === game.turn() && game.isCheck()

        squares.push(
          <Square
            key={square}
            square={square}
            piece={piece}
            isDark={isDark}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isKingInCheck={kingInCheck}
            pieceSymbols={pieceSymbols}
            onClick={onSquareClick}
          />
        )
      })
    })

    return squares
  }, [game, selectedSquare, getValidMoves, playerColor, pieceSymbols, onSquareClick])

  return (
    <div className="board-container">
      <div className="board" role="grid" aria-label="Chess board">
        {board}
      </div>
    </div>
  )
})

ChessBoard.displayName = 'ChessBoard'

export default ChessBoard
