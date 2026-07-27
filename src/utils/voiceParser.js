/**
 * Voice Parser for ChessBee
 *
 * Robust speech-to-chess-command pipeline:
 *
 *   Raw transcript
 *   → Text Normalization  (textNormalizer.js)
 *   → Fuzzy Matching      (fuzzyMatcher.js)
 *   → Chess Command Parsing
 *   → Confidence Scoring
 *
 * Returns { command, confidence, displayText } or null.
 */

import { normalizeTranscript, computeConfidence } from './textNormalizer'
import {
  matchPiece,
  matchAction,
  extractSquareFuzzy,
  extractAllSquares,
  similarity,
} from './fuzzyMatcher'

// Canonical mapping: piece abbreviation to full name (for display)
const PIECE_NAMES = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
}

// Canonical mapping: action keywords to command types
const ACTION_KEYWORDS = {
  capture: ['capture', 'take', 'capturing', 'taking'],
  castle: ['castle', 'castling'],
  promote: ['promote', 'promotion'],
  undo: ['undo', 'take back', 'takeback', 'takeback'],
  resign: ['resign', 'forfeit', 'quit', 'resigning'],
  draw: ['draw', 'offer draw', 'draw offer', 'offering draw'],
}

/**
 * Determine if text contains any of the action keywords.
 */
function detectAction(normalized, keywordSet) {
  return keywordSet.some(kw => normalized.includes(kw))
}

/**
 * Detect castling command: "castle kingside" / "castle queenside" / "short castle" / "long castle".
 */
function detectCastle(normalized) {
  // Standard: "castle kingside" or "castle queenside"
  if (detectAction(normalized, ['castle'])) {
    if (normalized.includes('king') || normalized.includes('short') || normalized.includes('short castle')) {
      return { type: 'castle', side: 'kingside' }
    }
    if (normalized.includes('queen') || normalized.includes('long') || normalized.includes('long castle')) {
      return { type: 'castle', side: 'queenside' }
    }
    // Bare "castle" — default to kingside
    return { type: 'castle', side: 'kingside' }
  }

  // Implicit castle: just say "kingside" or "queenside" / "short" / "long" with castle context
  if (normalized.includes('kingside') && !normalized.includes('to') && !normalized.includes('e')) {
    return { type: 'castle', side: 'kingside' }
  }
  if (normalized.includes('queenside') && !normalized.includes('to') && !normalized.includes('e')) {
    return { type: 'castle', side: 'queenside' }
  }

  return null
}

/**
 * Detect resignation.
 */
function detectResign(normalized) {
  if (detectAction(normalized, ACTION_KEYWORDS.resign)) {
    return { type: 'resign' }
  }
  return null
}

/**
 * Detect draw offer.
 */
function detectDraw(normalized) {
  if (detectAction(normalized, ACTION_KEYWORDS.draw)) {
    return { type: 'draw' }
  }
  return null
}

/**
 * Detect undo.
 */
function detectUndo(normalized) {
  if (detectAction(normalized, ACTION_KEYWORDS.undo)) {
    return { type: 'undo' }
  }
  return null
}

/**
 * Detect capture command: "take e5" / "capture e5" / "take bishop on e5".
 */
function detectCapture(normalized, raw) {
  if (!detectAction(normalized, ACTION_KEYWORDS.capture)) return null

  const square = extractSquareFuzzy(normalized.split(/\s+/))

  // Determine piece being captured (optional)
  const pieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
  let capturedPiece = null
  for (const p of pieces) {
    if (normalized.includes(p)) {
      capturedPiece = p
      break
    }
  }

  if (square) {
    return {
      type: 'capture',
      to: square,
      capturedPiece,
      piece: capturedPiece ? capturedPiece[0] : null,
    }
  }

  return null
}

/**
 * Detect promotion command: "promote to queen" / "promotion rook" / "promote e8 queen".
 */
function detectPromote(normalized) {
  if (!detectAction(normalized, ACTION_KEYWORDS.promote)) return null

  let promotionPiece = 'q'
  const pieces = [
    { name: 'queen', abbr: 'q' },
    { name: 'rook', abbr: 'r' },
    { name: 'bishop', abbr: 'b' },
    { name: 'knight', abbr: 'n' },
  ]

  // Check for target piece
  for (const { name, abbr } of pieces) {
    if (normalized.includes(name)) {
      promotionPiece = abbr
      break
    }
  }

  const square = extractSquareFuzzy(normalized.split(/\s+/))

  return {
    type: 'promote',
    to: square,
    promotion: promotionPiece,
  }
}

/**
 * Detect standard move: "e2 e4" / "knight f3" / "e2 to e4" / "knight f3 to g5".
 *
 * This is the most complex parsing step — we look for:
 * 1. Two squares (from → to)
 * 2. A piece name + two squares (e.g., "knight f3 g5")
 * 3. A piece name + one square (piece selection)
 * 4. Two squares with "to" / "take" in between
 */
function detectMove(normalized, raw) {
  // Extract all squares from the normalized text
  const squares = extractAllSquares(normalized.split(/\s+/))

  // Try to match a piece name
  const tokens = normalized.split(/\s+/)
  let pieceResult = null
  for (const token of tokens) {
    pieceResult = matchPiece(token)
    if (pieceResult) break
  }

  const piece = pieceResult ? pieceResult.piece : null

  // Case 1: Two squares — "e2 e4", "e2 to e4", "e2 to e5"
  if (squares.length >= 2) {
    return {
      type: 'move',
      piece,
      from: squares[0],
      to: squares[1],
      confidence: pieceResult ? pieceResult.score : 1,
    }
  }

  // Case 2: One square + piece name — "knight f3" (just selecting the piece)
  if (squares.length === 1 && piece) {
    return {
      type: 'select',
      square: squares[0],
      piece,
      confidence: pieceResult.score,
    }
  }

  // Case 3: Just one square — "e4" (square selection)
  if (squares.length === 1) {
    return {
      type: 'select',
      square: squares[0],
      confidence: 1,
    }
  }

  return null
}

/**
 * Main parse function — the entry point for voice command processing.
 *
 * @param {string} raw   The raw speech-to-text transcript
 * @param {number} [speechConfidence]  Optional confidence from the speech API (0-1)
 * @returns {{ command: object, confidence: number, displayText: string } | null}
 */
export function parseVoiceInput(raw, speechConfidence = 0.8) {
  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    return null
  }

  const trimmed = raw.trim()

  // Step 1: Normalize the transcript
  const normalized = normalizeTranscript(trimmed)
  if (!normalized || normalized.length === 0) {
    return null
  }

  // Step 2: Try each command type in priority order
  const tryParse = [
    detectCastle,
    detectResign,
    detectDraw,
    detectUndo,
    detectCapture,
    detectPromote,
    detectMove,
  ]

  for (const parser of tryParse) {
    const result = parser(normalized, trimmed)
    if (result) {
      // Step 3: Compute confidence
      const textConfidence = computeConfidence(normalized, trimmed)
      const cmdConfidence = result.confidence || 1
      const overallConfidence = Math.min(
        (speechConfidence * 0.4) + (textConfidence * 0.3) + (cmdConfidence * 0.3),
        1
      )

      // Build display text
      const displayText = getMoveDescription(result)

      return {
        command: { ...result },
        confidence: Math.round(overallConfidence * 100) / 100,
        displayText,
        raw: trimmed,
        normalized,
      }
    }
  }

  return null
}

/**
 * Human-readable description of a command.
 */
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
      return command.capturedPiece
        ? `Capture ${command.capturedPiece} on ${command.to}`
        : `Capture on ${command.to}`
    case 'promote':
      return command.to
        ? `Promote to ${PIECE_NAMES[command.promotion] || command.promotion} on ${command.to}`
        : `Promote to ${PIECE_NAMES[command.promotion] || command.promotion}`
    case 'move': {
      const pieceName = command.piece ? PIECE_NAMES[command.piece] || command.piece : 'Piece'
      return command.from && command.to
        ? `${pieceName} ${command.from} to ${command.to}`
        : command.from
          ? `Select ${pieceName} on ${command.from}`
          : ''
    }
    case 'select': {
      const pieceName = command.piece ? PIECE_NAMES[command.piece] || command.piece : null
      return pieceName
        ? `Select ${pieceName} on ${command.square}`
        : `Select ${command.square}`
    }
    default:
      return ''
  }
}

/**
 * Get a confidence label for display purposes.
 */
export function getConfidenceLabel(confidence) {
  if (confidence >= 0.85) return { label: 'High', className: 'confidence-high' }
  if (confidence >= 0.6) return { label: 'Medium', className: 'confidence-medium' }
  return { label: 'Low', className: 'confidence-low' }
}
