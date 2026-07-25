const PIECE_NAMES = {
  pawn: 'p',
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
  king: 'k',
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8']

function normalizeText(text) {
  return text.toLowerCase().trim()
}

function extractSquare(text) {
  const match = text.match(/([a-h][1-8])/)
  return match ? match[1] : null
}

function extractPieceType(text) {
  const normalized = normalizeText(text)

  if (normalized.includes('pawn') || normalized.includes('pwan')) return 'p'
  if (normalized.includes('knight') || normalized.includes('night') || normalized.includes('nite')) return 'n'
  if (normalized.includes('bishop') || normalized.includes('bish')) return 'b'
  if (normalized.includes('rook') || normalized.includes('rock')) return 'r'
  if (normalized.includes('queen') || normalized.includes('quean')) return 'q'
  if (normalized.includes('king') || normalized.includes('kin')) return 'k'

  return null
}

function parseMoveCommand(text) {
  const normalized = normalizeText(text)

  // Castle commands
  if (normalized.includes('castle') && (normalized.includes('king') || normalized.includes('kingside') || normalized.includes('short'))) {
    return { type: 'castle', side: 'kingside' }
  }
  if (normalized.includes('castle') && (normalized.includes('queen') || normalized.includes('queenside') || normalized.includes('long'))) {
    return { type: 'castle', side: 'queenside' }
  }

  // Resign
  if (normalized.includes('resign') || normalized.includes('forfeit') || normalized.includes('quit')) {
    return { type: 'resign' }
  }

  // Draw
  if (normalized.includes('draw') || normalized.includes('offer draw') || normalized.includes('draw offer')) {
    return { type: 'draw' }
  }

  // Undo
  if (normalized.includes('undo') || normalized.includes('take back') || normalized.includes('takeback')) {
    return { type: 'undo' }
  }

  // Capture on square
  if (normalized.includes('capture') || normalized.includes('take') || normalized.includes('cap')) {
    const square = extractSquare(normalized)
    if (square) {
      return { type: 'capture', to: square }
    }
  }

  // Promote
  if (normalized.includes('promote')) {
    const square = extractSquare(normalized)
    let promotionPiece = 'q'
    if (normalized.includes('rook')) promotionPiece = 'r'
    else if (normalized.includes('bishop')) promotionPiece = 'b'
    else if (normalized.includes('knight')) promotionPiece = 'n'

    return { type: 'promote', to: square, promotion: promotionPiece }
  }

  // Standard move: "pawn e2 to e4" or "knight f3 to g5" or just "e2 to e4"
  const squares = normalized.match(/[a-h][1-8]/g)
  if (squares && squares.length >= 2) {
    return {
      type: 'move',
      piece: extractPieceType(normalized),
      from: squares[0],
      to: squares[1],
    }
  }

  // Single square selection (just say a square like "e4")
  if (squares && squares.length === 1) {
    return { type: 'select', square: squares[0] }
  }

  return null
}

export function parseVoiceInput(text) {
  if (!text || text.trim().length === 0) {
    return null
  }

  const result = parseMoveCommand(text)

  return result
}

export function getMoveDescription(command) {
  if (!command) return ''

  switch (command.type) {
    case 'castle':
      return `Castle ${command.side}`
    case 'resign':
      return 'Resign'
    case 'draw':
      return 'Offer Draw'
    case 'undo':
      return 'Undo Move'
    case 'capture':
      return `Capture on ${command.to}`
    case 'promote':
      return `Promote to ${command.promotion} on ${command.to || '...'}`
    case 'move':
      return command.piece
        ? `${command.piece} ${command.from} to ${command.to}`
        : `${command.from} to ${command.to}`
    case 'select':
      return `Select ${command.square}`
    default:
      return ''
  }
}
