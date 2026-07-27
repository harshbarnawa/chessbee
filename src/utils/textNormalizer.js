/**
 * Text Normalizer for ChessBee Voice Recognition
 *
 * Transforms raw speech-to-text output into a clean, normalized form
 * ready for fuzzy matching and chess-command parsing.
 *
 * Pipeline:
 *   Raw transcript → lowercase → filler-word removal →
 *   homophone correction → number-word replacement →
 *   square spacing normalization → cleanup
 */

// Filler words and disfluencies to remove entirely
const FILLER_WORDS = new Set([
  'um', 'uh', 'er', 'ah', 'like', 'well', 'so', 'actually',
  'basically', 'literally', 'honestly', 'i mean', 'you know',
  'please', 'thanks', 'thank you', 'sorry', 'dude', 'bro',
  'i wanna', 'i would like to', 'can i',
  'could you', 'would you', 'let me', 'i need to', 'i will',
  'just', 'maybe', 'probably', 'kinda', 'sort of',
])

// Number words → digit replacements
const NUMBER_WORDS = new Map([
  ['zero', '0'], ['one', '1'], ['two', '2'], ['three', '3'],
  ['four', '4'], ['five', '5'], ['six', '6'], ['seven', '7'],
  ['eight', '8'], ['nine', '9'], ['ten', '10'],
  ['eleven', '11'], ['twelve', '12'],
])

/**
 * Homophone / common-misrecognition mapping for chess terms.
 *
 * Maps misheard words → canonical chess terms.
 *
 * CRITICAL: "to" is NOT a homophone. It's the preposition in
 * "pawn to e4" and must stay as "to".
 */
const CHESS_HOMOPHONES = new Map([
  // ── Piece names ──────────────────────────────────────────────
  // Pawn — speech APIs commonly hear "want", "won", "porn", "pon", etc.
  ['pawn', 'pawn'], ['pwan', 'pawn'], ['prawn', 'pawn'],
  ['pon', 'pawn'], ['porn', 'pawn'], ['pun', 'pawn'],
  ['pown', 'pawn'], ['pom', 'pawn'], ['poin', 'pawn'],
  ['want', 'pawn'], ['wont', 'pawn'], ['won', 'pawn'],
  ['wan', 'pawn'], ['warn', 'pawn'], ['warned', 'pawn'],
  ['pound', 'pawn'], ['pond', 'pawn'], ['bond', 'pawn'],
  ['wanted', 'pawn'], ['wanda', 'pawn'], ['wand', 'pawn'],
  ['panda', 'pawn'], ['panic', 'pawn'], ['paint', 'pawn'],
  ['went', 'pawn'], ['vent', 'pawn'], ['rent', 'pawn'],
  ['lent', 'pawn'], ['tent', 'pawn'], ['bent', 'pawn'],

  // Knight — "night", "nite", "knife", "right", "light", "white"
  ['knight', 'knight'], ['night', 'knight'], ['nite', 'knight'],
  ['knife', 'knight'], ['right', 'knight'], ['light', 'knight'],
  ['wright', 'knight'], ['write', 'knight'], ['rite', 'knight'],
  ['white', 'knight'], ['bright', 'knight'], ['fright', 'knight'],
  ['delight', 'knight'], ['quite', 'knight'], ['quote', 'knight'],
  ['site', 'knight'], ['sight', 'knight'], ['tight', 'knight'],
  ['flight', 'knight'], ['might', 'knight'],
  ['naitan', 'knight'], ['niten', 'knight'], ['high', 'knight'],

  // Bishop — "bish", "bishup", "bisop"
  ['bishop', 'bishop'], ['bisop', 'bishop'], ['bishup', 'bishop'],
  ['bi shop', 'bishop'], ['bish', 'bishop'], ['biscuit', 'bishop'],
  ['bushel', 'bishop'], ['fishing', 'bishop'],
  ['wish', 'bishop'], ['dish', 'bishop'], ['fish', 'bishop'],
  ['rich', 'bishop'], ['which', 'bishop'], ['switch', 'bishop'],
  ['bichop', 'bishop'], ['be shop', 'bishop'],

  // Rook — "rock", "wreck", "roof"
  ['rook', 'rook'], ['rock', 'rook'], ['wreck', 'rook'],
  ['roof', 'rook'], ['brook', 'rook'], ['crook', 'rook'],
  ['look', 'rook'], ['cook', 'rook'], ['book', 'rook'],
  ['hook', 'rook'], ['took', 'rook'], ['nook', 'rook'],
  ['shook', 'rook'], ['knook', 'rook'],
  ['rauk', 'rook'], ['rawk', 'rook'], ['wrong', 'rook'],
  ['route', 'rook'], ['rude', 'rook'], ['room', 'rook'],

  // Queen — "green", "clean", "quinn"
  ['queen', 'queen'], ['green', 'queen'], ['clean', 'queen'],
  ['quean', 'queen'], ['quinn', 'queen'], ['keen', 'queen'],
  ['queens', 'queen'],
  ['queen', 'queen'], ['cream', 'queen'], ['dream', 'queen'],
  ['scream', 'queen'], ['stream', 'queen'], ['bean', 'queen'],
  ['mean', 'queen'], ['lean', 'queen'], ['jean', 'queen'],
  ['seen', 'queen'], ['scene', 'queen'],
  ['mean', 'queen'], ['team', 'queen'], ['beam', 'queen'],

  // King — "kin", "kin"
  ['king', 'king'], ['kin', 'king'], ['ring', 'king'],
  ['sing', 'king'], ['wing', 'king'], ['bring', 'king'],
  ['thing', 'king'], ['swing', 'king'], ['sting', 'king'],
  ['cling', 'king'], ['fling', 'king'], ['sling', 'king'],
  ['blink', 'king'], ['sink', 'king'], ['link', 'king'],
  ['ping', 'king'], ['ding', 'king'], ['zing', 'king'],

  // ── Action words ─────────────────────────────────────────────
  ['capture', 'capture'], ['capcha', 'capture'], ['kapture', 'capture'],
  ['take', 'capture'], ['takes', 'capture'], ['took', 'capture'],
  ['captures', 'capture'], ['cap', 'capture'], ['tap', 'capture'],

  ['castle', 'castle'], ['castl', 'castle'], ['castel', 'castle'],
  ['cassel', 'castle'], ['cattle', 'castle'], ['puzzle', 'castle'],

  ['kingside', 'kingside'], ['king side', 'kingside'],
  ['queenside', 'queenside'], ['queen side', 'queenside'],

  ['promote', 'promote'], ['promotion', 'promote'], ['premote', 'promote'],
  ['promoted', 'promote'],

  ['undo', 'undo'], ['undue', 'undo'], ['un do', 'undo'],
  ['take back', 'undo'], ['takeback', 'undo'], ['took back', 'undo'],

  ['resign', 'resign'], ['resin', 'resign'], ['design', 'resign'],
  ['re sign', 'resign'], ['resigning', 'resign'],

  ['draw', 'draw'], ['door', 'draw'], ['drawn', 'draw'],
  ['offer draw', 'draw'], ['draw offer', 'draw'],

  // ── Number homophones ────────────────────────────────────────
  ['zero', '0'], ['oh', '0'],
  ['one', '1'], ['won', '1'],
  ['two', '2'], ['too', '2'],
  ['three', '3'], ['tree', '3'], ['free', '3'],
  ['for', '4'], ['four', '4'], ['fore', '4'],
  ['five', '5'], ['fire', '5'], ['dive', '5'],
  ['six', '6'], ['sicks', '6'], ['sick', '6'],
  ['seven', '7'], ['savings', '7'], ['second', '7'],
  ['eight', '8'], ['ate', '8'],
  ['nine', '9'], ['mine', '9'], ['dine', '9'],

  // ── Square letter homophones ─────────────────────────────────
  ['ay', 'a'], ['eh', 'a'], ['aye', 'a'],
  ['bee', 'b'], ['be', 'b'], ['bea', 'b'], ['beep', 'b'],
  ['see', 'c'], ['sea', 'c'], ['si', 'c'],
  ['dee', 'd'], ['die', 'd'], ['dye', 'd'],
  ['ee', 'e'], ['east', 'e'], ['each', 'e'],
  ['eff', 'f'], ['if', 'f'],
  ['gee', 'g'], ['je', 'g'], ['joe', 'g'],
  ['aitch', 'h'], ['haitch', 'h'], ['hey', 'h'],
  ['ex', 'x'], ['sex', 'x'], ['axe', 'x'],
  ['why', 'y'], ['y', 'y'],
  ['zed', 'z'], ['zee', 'z'],
])

/**
 * Remove filler words and disfluencies from text.
 * Handles multi-word fillers first to avoid partial matches.
 */
function removeFillers(text) {
  let result = text.toLowerCase().trim()

  // Sort fillers by length (longest first) so multi-word fillers
  // like "i want to" get removed before single words
  const sorted = [...FILLER_WORDS].sort((a, b) => b.length - a.length)

  for (const filler of sorted) {
    const regex = new RegExp(`\\b${filler.replace(/\s+/g, '\\s+')}\\b`, 'gi')
    result = result.replace(regex, '')
  }

  return result.replace(/\s+/g, ' ').trim()
}

/**
 * Normalize spacing around letters used in chess notation.
 * "a 4" → "a4", "e  5" → "e5"
 */
function normalizeSquareSpacing(text) {
  return text
    .replace(/\b([a-h])\s+(\d)\b/gi, '$1$2')
    .replace(/\b([a-h])\s+([a-h])\b/gi, '$1 $2')
    .trim()
}

/**
 * Replace number words with their digit equivalents.
 */
function replaceNumberWords(text) {
  const words = text.split(/\s+/)
  return words.map(w => NUMBER_WORDS.get(w) || w).join(' ')
}

/**
 * Apply chess homophone mapping to improve recognition.
 * Maps misheard words to their canonical chess equivalents.
 */
function applyHomophoneMap(text) {
  const words = text.split(/\s+/)
  return words.map(w => CHESS_HOMOPHONES.get(w) || w).join(' ')
}

/**
 * Main normalization pipeline.
 *
 * Order matters:
 *   1. Lowercase + trim
 *   2. Remove fillers (before homophones, so "i want to" → "")
 *   3. Replace number words
 *   4. Apply homophones (maps "night" → "knight", "want" → "pawn", etc.)
 *   5. Normalize square spacing ("e 4" → "e4")
 *   6. Cleanup
 */
export function normalizeTranscript(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw
    .toLowerCase()
    .trim()

  // Remove filler words first
  text = removeFillers(text)

  // Replace number words with digits
  text = replaceNumberWords(text)

  // Apply chess homophone mapping
  text = applyHomophoneMap(text)

  // Normalize square spacing: "e 4" → "e4"
  text = normalizeSquareSpacing(text)

  // Final cleanup
  text = text
    .replace(/[^\w\s\d]/g, ' ')   // remove punctuation
    .replace(/\s+/g, ' ')          // collapse whitespace
    .trim()

  return text
}

/**
 * Compute a confidence score for the normalized result.
 * Returns a number between 0 and 1.
 */
export function computeConfidence(normalized, raw) {
  if (!normalized || !raw) return 0

  const rawLower = raw.toLowerCase().trim()
  const normWords = normalized.split(/\s+/)
  const rawWords = rawLower.split(/\s+/)

  // Heuristic: ratio of meaningful words retained after normalization
  const fillerCount = rawWords.filter(w => FILLER_WORDS.has(w)).length
  const meaningfulWords = rawWords.length - fillerCount

  if (meaningfulWords === 0) return 0

  const keptWords = normWords.filter(w => w.length >= 1).length

  // If normalization collapsed to nothing, low confidence
  if (keptWords === 0) return 0.1

  // Base confidence on what fraction of meaningful words we kept
  const retentionRatio = Math.min(keptWords / meaningfulWords, 1)

  // Bonus for exact piece matches appearing in normalized text
  const hasPiece = /(queen|rook|knight|bishop|pawn|king)/.test(normalized)
  const hasSquare = /[a-h][1-8]/.test(normalized)
  const pieceBonus = hasPiece ? 0.15 : 0
  const squareBonus = hasSquare ? 0.15 : 0

  return Math.min(retentionRatio * 0.7 + pieceBonus + squareBonus, 1)
}
