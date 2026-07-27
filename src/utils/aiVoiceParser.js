/**
 * AI-Assisted Voice Parser for ChessBee
 *
 * Optional module that can make API calls to a backend LLM endpoint
 * for improved voice command parsing when the local parser's
 * confidence is below threshold.
 *
 * This module is designed as a drop-in enhancement — it can be:
 * - DISABLED (default): Everything runs client-side via voiceParser.js
 * - ENABLED: Falls back to AI parsing when local confidence is low
 *
 * The server endpoint is not yet implemented; this file provides the
 * client-side integration point and retry logic.
 *
 * Integration:
 *   import { parseWithAIFallback } from './aiVoiceParser'
 *   const result = await parseWithAIFallback(rawTranscript, localParseResult)
 */

import { parseVoiceInput } from './voiceParser'

/**
 * System prompt for the AI chess command parser.
 * Instructs the LLM to convert natural language chess speech into
 * a structured command.
 */
export const AI_PARSER_SYSTEM_PROMPT = `You are a chess command parser for ChessBee, a voice-controlled chess app.
Convert natural speech into structured chess commands.

Return a JSON object with these fields:
- "type": "move", "capture", "castle", "promote", "resign", "draw", "undo", or "select"
- "piece": one of "p" (pawn), "n" (knight), "b" (bishop), "r" (rook), "q" (queen), "k" (king), or null
- "from": source square like "e2" or null
- "to": target square like "e4" or null
- "side": for castling, "kingside" or "queenside"
- "promotion": for promotions, "q" (default), "r", "b", or "n"

Examples:
- "knight f3 to g5" → {"type":"move","piece":"n","from":"f3","to":"g5"}
- "pawn e4" → {"type":"select","piece":"p","square":"e4"}
- "e2 to e4" → {"type":"move","from":"e2","to":"e4"}
- "castle kingside" → {"type":"castle","side":"kingside"}
- "take on e5" → {"type":"capture","to":"e5"}
- "promote to queen" → {"type":"promote","promotion":"q"}
- "resign" → {"type":"resign"}
- "offer draw" → {"type":"draw"}
- "undo" → {"type":"undo"}

Handle common speech recognition errors:
- "green" → queen, "rock" → rook, "night" → knight, "bisop" → bishop
- "to" / "too" / "two" → ignore (they separate source and target)
- "for" / "four" → could be "4" in square notation
- Filler words like "um", "like", "please" → ignore
- "e four" → square "e4", "d five" → "d5"

Return ONLY the JSON object, no explanation. If the command is not a valid chess command, return {"type":"unknown"}.`

/**
 * Try to parse a transcript using a backend AI endpoint.
 *
 * @param {string} transcript - Raw speech-to-text output
 * @param {string} endpoint - URL of the AI parsing endpoint
 * @param {Object} [options]
 * @param {number} [options.timeout=5000] - Request timeout in ms
 * @returns {Promise<Object|null>} Parsed command or null on failure
 */
export async function parseWithAI(transcript, endpoint, { timeout = 5000 } = {}) {
  if (!transcript || !endpoint) return null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) return null

    const data = await response.json()
    return data.command || null
  } catch (err) {
    clearTimeout(timeoutId)
    return null
  }
}

/**
 * Parse a transcript with optional AI fallback.
 *
 * Strategy:
 * 1. First, run the local parser (voiceParser.js)
 * 2. If confidence is below threshold AND an AI endpoint is configured,
 *    try the AI parser
 * 3. Return whichever result has higher confidence
 *
 * @param {string} transcript - Raw speech-to-text transcript
 * @param {Object} [options]
 * @param {string} [options.aiEndpoint] - AI parsing endpoint URL
 * @param {number} [options.localConfidenceThreshold=0.6] - Min local confidence to skip AI
 * @param {number} [options.speechConfidence] - Confidence from speech API
 * @returns {Promise<Object>} Parsed result
 */
export async function parseWithAIFallback(transcript, options = {}) {
  const {
    aiEndpoint = null,
    localConfidenceThreshold = 0.6,
    speechConfidence = 0.8,
  } = options

  // Step 1: Run local parser
  const localResult = parseVoiceInput(transcript, speechConfidence)

  // Step 2: If local confidence is good enough, or no AI endpoint, return local result
  if (!aiEndpoint) {
    return localResult || { command: null, confidence: 0, displayText: '' }
  }

  if (localResult && localResult.confidence >= localConfidenceThreshold) {
    return localResult
  }

  // Step 3: Fall back to AI parser
  const aiCommand = await parseWithAI(transcript, aiEndpoint)
  if (aiCommand && aiCommand.type !== 'unknown') {
    return {
      command: aiCommand,
      confidence: 0.9, // AI parsing gets high confidence
      displayText: '',
      raw: transcript,
      fromAI: true,
    }
  }

  // Step 4: Return local result (even if low confidence)
  return localResult || { command: null, confidence: 0, displayText: '' }
}
