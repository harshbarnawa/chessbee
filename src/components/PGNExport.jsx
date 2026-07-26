import React, { useState } from 'react'

const PGNExport = React.memo(({ game, gameEnded, playerColor }) => {
  const [copied, setCopied] = useState(false)

  const getResult = () => {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? '0-1' : '1-0'
    }
    if (game.isStalemate()) return '1/2-1/2'
    if (game.isThreefoldRepetition()) return '1/2-1/2'
    if (game.isInsufficientMaterial()) return '1/2-1/2'
    if (game.isDraw()) return '1/2-1/2'
    return '*'
  }

  const generatePGN = () => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

    const whiteName = playerColor === 'black' ? 'Black' : 'White'
    const blackName = playerColor === 'black' ? 'White' : 'Black'

    const headers = [
      `[Event "Casual Game"]`,
      `[Site "ChessBee"]`,
      `[Date "${dateStr}"]`,
      `[Round "1"]`,
      `[White "${whiteName}"]`,
      `[Black "${blackName}"]`,
      `[Result "${getResult()}"]`,
    ]

    // Add ECO/opening if available
    const headersStr = headers.join('\n')

    const moves = game.history({ verbose: true })
    let moveText = ''

    moves.forEach((move, index) => {
      if (index % 2 === 0) {
        moveText += `${Math.floor(index / 2) + 1}. `
      }
      moveText += move.san + ' '
    })

    moveText += getResult()

    return `${headersStr}\n\n${moveText}`.trim()
  }

  const handleCopy = () => {
    const pgn = generatePGN()
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = pgn
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownload = () => {
    const pgn = generatePGN()
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chessbee-${new Date().toISOString().split('T')[0]}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pgn-export">
      <button className="pgn-btn" onClick={handleCopy} title="Copy PGN" aria-label="Copy PGN to clipboard">
        {copied ? '✓ Copied' : '📋 Copy PGN'}
      </button>
      <button className="pgn-btn" onClick={handleDownload} title="Download PGN" aria-label="Download PGN file">
        💾 Download
      </button>
    </div>
  )
})

PGNExport.displayName = 'PGNExport'

export default PGNExport
