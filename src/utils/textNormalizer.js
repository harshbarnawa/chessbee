/**
 * Text Normalizer for ChessBee Voice Recognition
 *
 * Transforms raw speech-to-text output into a clean, normalized form
 * ready for fuzzy matching and chess-command parsing.
 *
 * Pipeline:
 *   Raw transcript → lowercase → filler-word removal →
 *   number-word replacement → canonicalised string
 */

// Filler words and disfluencies to remove entirely
const FILLER_WORDS = new Set([
  'um', 'uh', 'er', 'ah', 'like', 'well', 'so', 'actually',
  'basically', 'literally', 'honestly', 'i mean', 'you know',
  'please', 'thanks', 'thank you', 'sorry', 'dude', 'bro',
  'i want to', 'i wanna', 'i would like to', 'can i',
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

// Homophone / common-misrecognition mapping for chess terms
// These map misheard words TO canonical chess terms
const CHESS_HOMOPHONES = new Map([
  // Piece names
  ['queen', 'queen'], ['green', 'queen'], ['clean', 'queen'],
  ['quean', 'queen'], ['quinn', 'queen'], ['keen', 'queen'],
  ['rook', 'rook'], ['rock', 'rook'], ['wreck', 'rook'],
  ['roof', 'rook'], ['knight', 'knight'], ['night', 'knight'],
  ['nite', 'knight'], ['knife', 'knight'], ['nice', 'knight'],
  ['bishop', 'bishop'], ['bisop', 'bishop'], ['bishup', 'bishop'],
  ['bi shop', 'bishop'], ['bish', 'bishop'], ['biscuit', 'bishop'],
  ['pawn', 'pawn'], ['pwan', 'pawn'], ['prawn', 'pawn'],
  ['pon', 'pawn'], ['porn', 'pawn'],
  ['king', 'king'], ['kin', 'king'], ['keen', 'king'],
  // Action words
  ['capture', 'capture'], ['capcha', 'capture'], ['kapture', 'capture'],
  ['take', 'capture'], ['takes', 'capture'], ['took', 'capture'],
  ['captures', 'capture'], ['cap', 'capture'],
  ['castle', 'castle'], ['castl', 'castle'], ['castel', 'castle'],
  ['cassel', 'castle'], ['cattle', 'castle'],
  ['kingside', 'kingside'], ['king side', 'kingside'],
  ['queenside', 'queenside'], ['queen side', 'queenside'],
  ['promote', 'promote'], ['promotion', 'promote'], ['premote', 'promote'],
  ['undo', 'undo'], ['undue', 'undo'], ['un do', 'undo'],
  ['take back', 'undo'], ['takeback', 'undo'], ['took back', 'undo'],
  ['resign', 'resign'], ['resin', 'resign'], ['design', 'resign'],
  ['re sign', 'resign'], ['resigning', 'resign'],
  ['draw', 'draw'], ['door', 'draw'], ['drawn', 'draw'],
  ['offer draw', 'draw'], ['draw offer', 'draw'],
  // Number homophones
  ['to', '2'], ['too', '2'], ['two', '2'],
  ['for', '4'], ['four', '4'], ['fore', '4'],
  ['ate', '8'], ['eight', '8'],
  // Square homophones
  ['see', 'c'], ['bee', 'b'], ['dee', 'd'], ['gee', 'g'],
  ['ay', 'a'], ['eh', 'a'],
])

/**
 * Remove filler words and disfluencies from text.
 */
function removeFillers(text) {
  let result = text.toLowerCase().trim()
  for (const filler of FILLER_WORDS) {
    // Use word-boundary regex to avoid partial matches
    const regex = new RegExp(`\\b${filler.replace(/\s+/g, '\\s+')}\\b`, 'gi')
    result = result.replace(regex, '')
  }
  // Collapse multiple spaces
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
