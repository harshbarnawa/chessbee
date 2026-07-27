/**
 * Premium SVG Chess Pieces for ChessBee
 *
 * High-quality inline SVG chess pieces inspired by chess.com's design.
 * Each piece is rendered as an SVG viewBox with distinct shapes.
 *
 * The pieces use CSS for coloring — each component takes `fill` and `stroke`
 * props so the theme system can color them consistently.
 */

/**
 * Creates an SVG element string for a chess piece.
 *
 * @param {string} type - Piece type: 'k', 'q', 'r', 'b', 'n', 'p'
 * @param {string} color - 'w' or 'b'
 * @param {string} fill - Fill color for the piece body
 * @returns {string} SVG markup
 */
export function createPieceSvg(type, color) {
  const svgs = {
    k: kingSvg(color),
    q: queenSvg(color),
    r: rookSvg(color),
    b: bishopSvg(color),
    n: knightSvg(color),
    p: pawnSvg(color),
  }
  return svgs[type] || ''
}

/**
 * Accessibility: OCR-friendly piece labels.
 */
export function getPieceLabel(type, color) {
  const names = { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' }
  const colors = { w: 'White', b: 'Black' }
  return `${colors[color]} ${names[type]}`
}

// ── SVG Piece Defs (Premium Chess.com Style) ─────────────────────────

function pawnSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="pawnGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <circle cx="22.5" cy="9" r="5.5" fill="url(#pawnGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v4H15v-4z" fill="url(#pawnGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M15.5 33.5c-.5-3 0-7 2-11 1.2-2.5 2-4 3-4s1.8 1.5 3 4c2 4 2.5 8 2 11z" fill="url(#pawnGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
</svg>`
}

function knightSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  const eye = color === 'w' ? '#000' : '#fff'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="knightGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${c}" stroke="${stroke}" stroke-width="1"/>
  <path d="M12 36c0-2 1-3 3-3h15c2 0 3 1 3 3v3H12v-3z" fill="url(#knightGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#knightGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <circle cx="25" cy="19" r="1.2" fill="${eye}"/>
  <path d="M19 26c1.5 1 3.5 1 5 0" fill="none" stroke="${stroke}" stroke-width="0.8"/>
</svg>`
}

function bishopSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="bishopGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <circle cx="22.5" cy="6" r="3.5" fill="url(#bishopGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="url(#bishopGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${stroke}" stroke-width="0.8"/>
  <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${stroke}" stroke-width="0.8"/>
  <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="url(#bishopGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <circle cx="22.5" cy="14" r="1" fill="${stroke}"/>
</svg>`
}

function rookSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="rookGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#rookGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M12 33V18h21v15" fill="url(#rookGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M10 18h25v4H10z" fill="url(#rookGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="url(#rookGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <rect x="16" y="11" width="3" height="7" fill="${c}" stroke="${stroke}" stroke-width="0.5"/>
  <rect x="21" y="11" width="3" height="7" fill="${c}" stroke="${stroke}" stroke-width="0.5"/>
  <rect x="26" y="11" width="3" height="7" fill="${c}" stroke="${stroke}" stroke-width="0.5"/>
</svg>`
}

function queenSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  const jewel = color === 'w' ? '#d4a017' : '#d4a017'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="queenGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <circle cx="9" cy="8" r="3" fill="${jewel}" stroke="${stroke}" stroke-width="0.8"/>
  <circle cx="22.5" cy="5" r="3" fill="${jewel}" stroke="${stroke}" stroke-width="0.8"/>
  <circle cx="36" cy="8" r="3" fill="${jewel}" stroke="${stroke}" stroke-width="0.8"/>
  <circle cx="15" cy="5.5" r="2" fill="${jewel}" stroke="${stroke}" stroke-width="0.6"/>
  <circle cx="30" cy="5.5" r="2" fill="${jewel}" stroke="${stroke}" stroke-width="0.6"/>
  <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="url(#queenGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="url(#queenGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="url(#queenGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="url(#queenGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
</svg>`
}

function kingSvg(color) {
  const c = color === 'w' ? '#fff' : '#1a1a1a'
  const stroke = color === 'w' ? '#777' : '#000'
  const highlight = color === 'w' ? '#f8f8f8' : '#333'
  const cross = color === 'w' ? '#d4a017' : '#d4a017'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
  <defs>
    <radialGradient id="kingGrad${color === 'w' ? 'W' : 'B'}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${highlight}" />
      <stop offset="100%" stop-color="${c}" />
    </radialGradient>
  </defs>
  <path d="M22.5 3v6" fill="none" stroke="${cross}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M19.5 6h6" fill="none" stroke="${cross}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#kingGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M12 33V20h21v13" fill="url(#kingGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M10 20h25v4H10z" fill="url(#kingGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#kingGrad${color === 'w' ? 'W' : 'B'})" stroke="${stroke}" stroke-width="1.2"/>
  <path d="M17 14h11" fill="none" stroke="${stroke}" stroke-width="0.8"/>
  <path d="M18 17.5h9" fill="none" stroke="${stroke}" stroke-width="0.8"/>
</svg>`
}
