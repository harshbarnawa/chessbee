/**
 * Voice Feedback for ChessBee
 *
 * Provides spoken confirmation of moves using the Web Speech Synthesis API.
 * Creates a natural, voice-first experience where the user hears
 * confirmation of every command they execute.
 *
 * Features:
 * - Speak move confirmations ("Knight to F3", "Castle kingside")
 * - Announce game events ("White in check", "Checkmate!")
 * - Configurable speech rate, pitch, and voice
 * - Mute/unmute toggle
 */

// Piece names for spoken output
const PIECE_NAMES_SPOKEN = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
}

// Spoken feedback templates
const FEEDBACK_TEMPLATES = {
  move: (piece, from, to) => {
    const pieceName = piece ? PIECE_NAMES_SPOKEN[piece] || 'piece' : ''
    if (!pieceName) return `To ${to.toUpperCase()}`
    return pieceName === 'pawn'
      ? `Pawn to ${to.toUpperCase()}`
      : `${pieceName} to ${to.toUpperCase()}`
  },
  capture: (piece, to) => {
    const pieceName = piece ? PIECE_NAMES_SPOKEN[piece] || 'piece' : 'piece'
    return `Capturing on ${to.toUpperCase()}`
  },
  castle: (side) => side === 'kingside' ? 'Castling kingside' : 'Castling queenside',
  promote: (piece) => `Promoting to ${PIECE_NAMES_SPOKEN[piece] || 'queen'}`,
  resign: () => 'Resigning',
  draw: () => 'Offering draw',
  acceptDraw: () => 'Draw accepted',
  declineDraw: () => 'Draw declined',
  undo: () => 'Undoing move',
  select: (piece, square) => {
    const pieceName = piece ? PIECE_NAMES_SPOKEN[piece] || 'piece' : 'piece'
    return `Selected ${pieceName} on ${square.toUpperCase()}`
  },
  check: () => 'Check!',
  checkmate: (winner) => `Checkmate! ${winner} wins!`,
  stalemate: () => 'Stalemate!',
  'no move': (reason) => reason || 'Move not valid',
}

/**
 * Speak a text using the browser's speech synthesis.
 *
 * @param {string} text - Text to speak
 * @param {Object} [options]
 * @param {number} [options.rate=1.1] - Speech rate (0.1 to 10)
 * @param {number} [options.pitch=1.0] - Speech pitch (0 to 2)
 * @param {string} [options.voiceName] - Preferred voice name
 */
export function speak(text, options = {}) {
  const { rate = 1.1, pitch = 1.0, voiceName = null } = options

  if (!('speechSynthesis' in window) || !text) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 0.8

  // Try to find a preferred voice
  if (voiceName) {
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes(voiceName))
    if (preferred) utterance.voice = preferred
  }

  window.speechSynthesis.speak(utterance)
}

/**
 * Generate and speak feedback for a parsed chess command.
 *
 * @param {Object} command - The parsed command object from voiceParser.js
 * @param {Object} [context]
 * @param {string} [context.winner] - 'White' or 'Black' if game over
 * @param {boolean} [context.muted=false] - Skip speaking if muted
 */
export function speakCommandFeedback(command, context = {}) {
  if (!command || context.muted) return

  const { type } = command
  let text = ''

  switch (type) {
    case 'move':
      text = FEEDBACK_TEMPLATES.move(command.piece, command.from, command.to)
      break
    case 'capture':
      text = FEEDBACK_TEMPLATES.capture(command.piece, command.to)
      break
    case 'castle':
      text = FEEDBACK_TEMPLATES.castle(command.side)
      break
    case 'promote':
      text = FEEDBACK_TEMPLATES.promote(command.promotion)
      break
    case 'resign':
      text = FEEDBACK_TEMPLATES.resign()
      break
    case 'draw':
      text = FEEDBACK_TEMPLATES.draw()
      break
    case 'acceptDraw':
      text = FEEDBACK_TEMPLATES.acceptDraw()
      break
    case 'declineDraw':
      text = FEEDBACK_TEMPLATES.declineDraw()
      break
    case 'undo':
      text = FEEDBACK_TEMPLATES.undo()
      break
    case 'select':
      text = FEEDBACK_TEMPLATES.select(command.piece, command.square)
      break
    default:
      return
  }

  if (text) speak(text)
}

/**
 * Speak a game event (check, checkmate, etc.)
 *
 * @param {string} eventType - 'check', 'checkmate', 'stalemate'
 * @param {Object} [context]
 * @param {string} [context.winner] - Winner color for checkmate
 * @param {boolean} [context.muted=false]
 */
export function speakGameEvent(eventType, context = {}) {
  if (context.muted) return

  const template = FEEDBACK_TEMPLATES[eventType]
  if (template) {
    const text = typeof template === 'function' ? template(context.winner) : template
    speak(text)
  }
}

/**
 * Check if speech synthesis is available.
 */
export function isSpeechSupported() {
  return 'speechSynthesis' in window
}
