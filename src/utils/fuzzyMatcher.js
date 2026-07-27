/**
 * Fuzzy Matcher for ChessBee Voice Recognition
 *
 * Provides approximate string matching using Levenshtein distance
 * and specialized chess-term matching with confidence scoring.
 */

/**
 * Compute Levenshtein distance between two strings.
 */
export function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }

  return dp[m][n]
}

/**
 * Compute similarity score (0-1) between two strings.
 * 1 = identical, 0 = completely different.
 */
export function similarity(a, b) {
  if (!a || !b) return 0
  if (a === b) return 1
  const dist = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length)
  return maxLen === 0 ? 1 : 1 - dist / maxLen
}

/**
 * Find the best fuzzy match for a target word among a list of candidates.
 * Returns { match, score } or null if no match exceeds the threshold.
 */
export function bestFuzzyMatch(target, candidates, { threshold = 0.5, minLength = 2 } = {}) {
  if (!target || target.length < minLength) return null

  let best = null
  let bestScore = 0

  for (const candidate of candidates) {
    const score = similarity(target, candidate)
    if (score > bestScore && score >= threshold) {
      bestScore = score
      best = candidate
    }
  }

  return best ? { match: best, score: bestScore } : null
}

/**
 * Canonical chess piece names (lowercase).
 */
const PIECE_CANONICAL = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']

/**
 * Canonical piece abbreviations.
 */
const PIECE_ABBREVIATIONS = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }

/**
 * Canonical action verbs used in chess commands.
 */
const ACTION_CANONICAL = [
  'capture', 'take', 'castle', 'kingside', 'queenside',
  'promote', 'undo', 'resign', 'draw', 'move', 'to',
]

/**
 * Map of canonical piece names to their standard abbreviations.
 */
const PIECE_TO_ABBR = { pawn: 'p', knight: 'n', bishop: 'b', rook: 'r', queen: 'q', king: 'k' }

/**
 * Map of canonical actions to command types.
 */
const ACTION_TO_TYPE = {
  capture: 'capture', take: 'capture',
  castle: 'castle', kingside: 'castle', queenside: 'castle',
  promote: 'promote',
  undo: 'undo', resign: 'resign', draw: 'draw',
}

/**
 * Fuzzy-match a single token against known chess piece names.
 * Returns { piece: 'q', score: 0.85 } or null.
 */
export function matchPiece(token, { threshold = 0.4 } = {}) {
  if (!token || token.length < 2) return null

  // Direct abbreviation match
  if (PIECE_ABBREVIATIONS[token]) {
    return { piece: token, score: 1 }
  }

  // Fuzzy match against canonical names
  const result = bestFuzzyMatch(token, PIECE_CANONICAL, { threshold })
  if (result) {
    return { piece: PIECE_TO_ABBR[result.match], score: result.score }
  }

  return null
}

/**
 * Fuzzy-match a token against known chess actions.
 * Returns { action: 'capture', score: 0.85 } or null.
 */
export function matchAction(token, { threshold = 0.4 } = {}) {
  if (!token || token.length < 2) return null

  const result = bestFuzzyMatch(token, ACTION_CANONICAL, { threshold })
  if (result) {
    return { action: ACTION_TO_TYPE[result.match] || result.match, score: result.score }
  }

  return null
}

/**
 * Try to extract a chess square from a sequence of tokens.
 * Handles formats like "e4", "e 4", "e-4", "to e4", "c5", etc.
 */
export function extractSquareFuzzy(tokens) {
  if (typeof tokens === 'string') tokens = tokens.split(/\s+/)

  // Pattern 1: Direct square notation "e4", "d5", "h8"
  const directSquare = tokens.join('').match(/[a-h][1-8]/)
  if (directSquare) return directSquare[0]

  // Pattern 2: Separate file and rank like "e 4", "d five"
  for (let i = 0; i < tokens.length - 1; i++) {
    const fileMatch = tokens[i].match(/^([a-h])$/i)
    if (fileMatch) {
      const next = tokens[i + 1]
      const rankMatch = next.match(/^([1-8])$/)
      if (rankMatch) {
        return `${fileMatch[1].toLowerCase()}${rankMatch[1]}`
      }
      // Could be a number word — check through homophones
      if (/^(one|two|three|four|five|six|seven|eight)$/.test(next)) {
        const rankMap = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8' }
        return `${fileMatch[1].toLowerCase()}${rankMap[next] || next}`
      }
    }
  }

  // Pattern 3: "square e4" or "on e4"
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'square' || tokens[i] === 'on') {
      if (i + 1 < tokens.length) {
        const sq = tokens[i + 1].match(/^([a-h][1-8])$/i)
        if (sq) return sq[1].toLowerCase()
      }
    }
  }

  return null
}

/**
 * Extract all possible chess squares from a list of tokens.
 * Useful for "from e2 to e4" patterns.
 */
export function extractAllSquares(tokens) {
  if (typeof tokens === 'string') tokens = tokens.split(/\s+/)

  const squares = []
  const joined = tokens.join('')
  const directMatches = joined.match(/[a-h][1-8]/g)
  if (directMatches) {
    squares.push(...directMatches)
  }

  // Also check for separated notation: "e 4" → "e4"
  for (let i = 0; i < tokens.length - 1; i++) {
    if (/^[a-h]$/i.test(tokens[i])) {
      if (/^[1-8]$/.test(tokens[i + 1])) {
        const sq = `${tokens[i].toLowerCase()}${tokens[i + 1]}`
        if (!squares.includes(sq)) squares.push(sq)
      }
    }
  }

  return squares
}

/**
 * Overall confidence threshold — commands below this are rejected.
 */
export const MIN_COMMAND_CONFIDENCE = 0.35
