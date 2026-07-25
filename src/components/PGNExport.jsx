import React, { useState } from 'react'

const PGNExport = React.memo(({ game, gameEnded }) => {
  const [copied, setCopied] = useState(false)

  const generatePGN = () => {
    const headers = [
      `[Event "ChessBee Game"]`,
      `[Site "chessbee.app"]`,
      `[Date "${new Date().toISOString().split('T')[0]}"]`,
      `[Round "1"]`,
      `[White "Player 1"]`,
      `[Black "Player 2"]`,
      `[Result "${getResult()}"]`,
    ]

    const moves = game.history({ verbose: true })
    let pgn = headers.join('\n') + '\n\n'

    moves.forEach((move, index) => {
      if (index % 2 === 0) {
        pgn += `${Math.floor(index / 2) + 1}. `
      }
      pgn += move.san + ' '
    })

    pgn += getResult()
    return pgn.trim()
  }

  const getResult = () => {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? '0-1' : '1-0'
    }
    if (game.isDraw()) return '1/2-1/2'
    if (game.isStalemate()) return '1/2-1/2'
    if (game.isThreefoldRepetition()) return '1/2-1/2'
    if (game.isInsufficientMaterial()) return '1/2-1/2'
    return '*'
  }

  const handleCopy = () => {
    const pgn = generatePGN()
    navigator.clipboard.writeText(pgn)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const pgn = generatePGN()
    const blob = new Blob([pgn], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chessbee-${new Date().toISOString().split('T')[0]}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pgn-export">
      <button className="pgn-btn" onClick={handleCopy} title="Copy PGN">
        {copied ? '✓ Copied' : '📋 Copy PGN'}
      </button>
      <button className="pgn-btn" onClick={handleDownload} title="Download PGN">
        💾 Download
      </button>
    </div>
  )
})

PGNExport.displayName = 'PGNExport'

export default PGNExport
