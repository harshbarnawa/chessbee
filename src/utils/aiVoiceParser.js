/**
 * AI-Assisted Voice Parser for ChessBee
 *
 * Free, client-side AI for voice command parsing.
 * Uses enhanced pattern matching and fuzzy logic to understand
 * chess commands without requiring external API calls.
 *
 * Strategy:
 * 1. Enhanced local AI (works offline, instant)
 * 2. Browser built-in AI (Chrome Gemini Nano, if available)
 * 3. OpenRouter free tier (optional, for edge cases)
 *
 * The local AI is the primary parser - it's designed to handle
 * common speech patterns, accents, and chess terminology.
 */

import { parseVoiceInput } from './voiceParser'
import { normalizeTranscript } from './textNormalizer'
import { extractAllSquares, matchPiece, similarity } from './fuzzyMatcher'

/**
 * Enhanced AI parser - handles complex natural language chess commands.
 *
 * This function attempts to parse natural language commands that the
 * basic parser might miss. It uses pattern matching to understand
 * variations like:
 * - "move the pawn to e4"
 * - "put my knight on f3"
 * - "take the bishop"
 * - "I want to castle"
 * - "can you move my queen to d5"
 */
export function enhanceParse(transcript) {
  if (!transcript) return null

  const lower = transcript.toLowerCase().trim()

  // Natural language patterns → chess commands
  const NL_PATTERNS = [
    // "move [piece] to [square]"
    { pattern: /move\s+(?:my\s+|the\s+)?(\w+)\s+to\s+([a-h][1-8])/i, handler: (m) => {
      const piece = matchPiece(m[1])
      return { type: 'move', piece: piece?.piece || null, to: m[2].toLowerCase(), from: null }
    }},
    // "[piece] to [square]"
    { pattern: /(\w+)\s+to\s+([a-h][1-8])/i, handler: (m) => {
      const piece = matchPiece(m[1])
      return { type: 'move', piece: piece?.piece || null, to: m[2].toLowerCase(), from: null }
    }},
    // "take [piece] on [square]"
    { pattern: /take\s+(?:the\s+)?(\w+)?\s*(?:on\s+)?([a-h][1-8])/i, handler: (m) => {
      const piece = matchPiece(m[1])
      return { type: 'move', piece: piece?.piece || null, to: m[2].toLowerCase(), from: null }
    }},
    // "[square] [square]" (two squares)
    { pattern: /([a-h][1-8])\s+([a-h][1-8])/i, handler: (m) => {
      return { type: 'move', from: m[1].toLowerCase(), to: m[2].toLowerCase() }
    }},
    // "castle kingside" / "castle queenside"
    { pattern: /castle\s+(king|queen|short|long)/i, handler: (m) => {
      const side = m[1].toLowerCase().startsWith('k') || m[1].toLowerCase() === 'short' ? 'kingside' : 'queenside'
      return { type: 'castle', side }
    }},
    // "resign"
    { pattern: /\bresign\b/i, handler: () => ({ type: 'resign' }) },
    // "offer draw" / "draw"
    { pattern: /\b(draw|offer\s+draw)\b/i, handler: () => ({ type: 'draw' }) },
    // "accept draw"
    { pattern: /\b(accept\s+draw|draw\s+accept)\b/i, handler: () => ({ type: 'acceptDraw' }) },
    // "decline draw"
    { pattern: /\b(decline\s+draw|draw\s+decline)\b/i, handler: () => ({ type: 'declineDraw' }) },
    // "undo"
    { pattern: /\b(undo|take\s*back)\b/i, handler: () => ({ type: 'undo' }) },
    // "promote to [piece]"
    { pattern: /promot(?:e|ion)\s+to\s+(\w+)/i, handler: (m) => {
      const piece = matchPiece(m[1])
      return { type: 'promote', promotion: piece?.piece || 'q' }
    }},
  ]

  for (const { pattern, handler } of NL_PATTERNS) {
    const match = lower.match(pattern)
    if (match) {
      return handler(match)
    }
  }

  return null
}

/**
 * Try to suggest a valid move when the exact command fails.
 *
 * This is a "helpful AI" feature - when a voice command is unclear,
 * try to find the closest valid move based on partial information.
 *
 * For example, if someone says "knight" without a target square,
 * we could suggest available knight moves.
 */
export function suggestMoves(game, transcript, turn) {
  if (!game || !transcript) return []

  const allMoves = game.moves({ verbose: true })
  const myMoves = allMoves.filter(m => m.color === turn)

  const lower = transcript.toLowerCase().trim()

  // Try to find any piece name mentioned
  const pieceWords = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
  let mentionedPiece = null
  for (const word of pieceWords) {
    if (lower.includes(word)) {
      const matched = matchPiece(word)
      if (matched) mentionedPiece = matched.piece
      break
    }
  }

  // If a piece was mentioned, return all moves for that piece
  if (mentionedPiece) {
    return myMoves.filter(m => m.piece === mentionedPiece)
  }

  // If a square was mentioned, return moves TO that square
  const squares = extractAllSquares(lower.split(/\s+/))
  if (squares.length > 0) {
    return myMoves.filter(m => squares.includes(m.to))
  }

  return []
}

/**
 * Check if browser built-in AI is available.
 * (Chrome's Gemini Nano or similar)
 */
export async function checkBrowserAI() {
  if (typeof window !== 'undefined' && window.ai && window.ai.languageModel) {
    try {
      const available = await window.ai.languageModel.status()
      return available === 'available'
    } catch {
      return false
    }
  }
  return false
}

/**
 * Parse using browser built-in AI (if available).
 * This is a free, on-device AI that runs in Chrome.
 */
export async function parseWithBrowserAI(transcript) {
  try {
    if (!window.ai || !window.ai.languageModel) return null

    const session = await window.ai.languageModel.create({
      systemPrompt: `You are a chess command parser. Convert speech to JSON chess commands.
Return ONLY valid JSON: {"type":"move","piece":"p","to":"e4"} or {"type":"castle","side":"kingside"}
Types: move, castle, resign, draw, undo, promote, acceptDraw, declineDraw
Pieces: p (pawn), n (knight), b (bishop), r (rook), q (queen), k (king)`
    })

    const result = await session.prompt(`Parse this chess command: "${transcript}"`)
    await session.destroy()

    try {
      const parsed = JSON.parse(result)
      if (parsed && parsed.type) return parsed
    } catch {
      // AI didn't return valid JSON
    }
  } catch {
    // Browser AI not available or failed
  }
  return null
}

/**
 * Main AI parse function with multiple fallback strategies.
 *
 * @param {string} transcript - Raw speech-to-text output
 * @param {Object} [options]
 * @param {Object} [options.game] - Current chess.js game instance
 * @param {string} [options.turn] - Current turn ('w' or 'b')
 * @param {number} [options.speechConfidence] - Confidence from speech API
 * @returns {Promise<Object|null>} Parsed command or null
 */
export async function parseWithAIFallback(transcript, options = {}) {
  const { game, turn, speechConfidence = 0.8 } = options

  // Strategy 1: Enhanced local parser (instant, offline)
  const localResult = parseVoiceInput(transcript, speechConfidence)
  if (localResult && localResult.confidence >= 0.4) {
    return localResult
  }

  // Strategy 2: Enhanced NL parser
  const nlResult = enhanceParse(transcript)
  if (nlResult) {
    const textConf = 0.75
    const conf = Math.min((speechConfidence * 0.4) + (textConf * 0.3) + (0.7 * 0.3), 1)
    return {
      command: nlResult,
      confidence: Math.round(conf * 100) / 100,
      displayText: nlResult.type,
      raw: transcript,
      normalized: normalizeTranscript(transcript),
      fromAI: true,
    }
  }

  // Strategy 3: Browser built-in AI (if available, free)
  try {
    const browserResult = await parseWithBrowserAI(transcript)
    if (browserResult && browserResult.type !== 'unknown') {
      return {
        command: browserResult,
        confidence: 0.85,
        displayText: '',
        raw: transcript,
        normalized: normalizeTranscript(transcript),
        fromAI: true,
      }
    }
  } catch {
    // Browser AI not available
  }

  // Strategy 4: Return local result even if low confidence
  return localResult || { command: null, confidence: 0, displayText: '', raw: transcript }
}
