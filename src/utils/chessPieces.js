/**
 * Premium SVG Chess Pieces for ChessBee
 *
 * 5 piece styles: classic, chesscom, wood, glass, metal
 * Each uses unique gradient IDs to avoid DOM collisions.
 * White pieces have strong outlines for visibility on light squares.
 */

// ── Unique ID counter (prevents gradient ID collisions) ──────────────
let _svgId = 0
const uid = (prefix) => `${prefix}_${++_svgId}`

/**
 * Creates an SVG element string for a chess piece.
 * @param {string} type - 'k', 'q', 'r', 'b', 'n', 'p'
 * @param {string} color - 'w' or 'b'
 * @param {string} style - 'classic', 'chesscom', 'wood', 'glass', 'metal'
 * @returns {string} SVG markup
 */
export function createPieceSvg(type, color, style = 'classic') {
  const generators = {
    classic: classicPieceSvg,
    chesscom: chesscomPieceSvg,
    wood: woodPieceSvg,
    glass: glassPieceSvg,
    metal: metalPieceSvg,
  }
  const gen = generators[style] || generators.classic
  const svgs = {
    k: gen.king,
    q: gen.queen,
    r: gen.rook,
    b: gen.bishop,
    n: gen.knight,
    p: gen.pawn,
  }
  return (svgs[type] || '')(color)
}

export function getPieceLabel(type, color) {
  const names = { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' }
  const colors = { w: 'White', b: 'Black' }
  return `${colors[color]} ${names[type]}`
}

// Helper: extract inner SVG content (paths) from a full SVG string
function inner(svg) {
  return svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')
}

// ══════════════════════════════════════════════════════════════════════
// CLASSIC — Refined premium SVG with strong white piece contrast
// ══════════════════════════════════════════════════════════════════════

const classicPieceSvg = {
  pawn: (c) => {
    const id = uid('cp')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="9" r="5.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v4H15v-4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15.5 33.5c-.5-3 0-7 2-11 1.2-2.5 2-4 3-4s1.8 1.5 3 4c2 4 2.5 8 2 11z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  knight: (c) => {
    const id = uid('ck')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const e = c === 'w' ? '#000' : '#FFF'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${f}" stroke="${s}" stroke-width="1"/>
    <path d="M12 36c0-2 1-3 3-3h15c2 0 3 1 3 3v3H12v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="25" cy="19" r="1.2" fill="${e}"/>
    <path d="M19 26c1.5 1 3.5 1 5 0" fill="none" stroke="${s}" stroke-width="0.8"/>
  </svg>`
  },

  bishop: (c) => {
    const id = uid('cb')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="6" r="3.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="22.5" cy="14" r="1" fill="${s}"/>
  </svg>`
  },

  rook: (c) => {
    const id = uid('cr')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V18h21v15" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 18h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <rect x="16" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="21" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="26" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
  </svg>`
  },

  queen: (c) => {
    const id = uid('cq')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const j = '#D4A017'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="9" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="36" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="15" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <circle cx="30" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  king: (c) => {
    const id = uid('ckg')
    const f = c === 'w' ? '#FFFFFF' : '#1B1B1B'
    const s = c === 'w' ? '#4A4A4A' : '#000000'
    const h = c === 'w' ? '#F5F5F5' : '#2E2E2E'
    const cr = '#D4A017'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22.5 3v6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M19.5 6h6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V20h21v13" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 20h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M17 14h11" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M18 17.5h9" fill="none" stroke="${s}" stroke-width="0.8"/>
  </svg>`
  },
}

// ══════════════════════════════════════════════════════════════════════
// CHESS.COM — Inspired by chess.com's piece set
// ══════════════════════════════════════════════════════════════════════

const chesscomPieceSvg = {
  pawn: (c) => {
    const id = uid('ccp')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="10" r="5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M14 37c0-1.5 1-2.5 2.5-2.5h12c1.5 0 2.5 1 2.5 2.5v2.5H14V37z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15 34.5c-.5-3.5 0-7 2.5-11 1.5-2.5 2.5-4 3.5-4s2 1.5 3.5 4c2.5 4 3 7.5 2.5 11z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  knight: (c) => {
    const id = uid('cck')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const e = c === 'w' ? '#222' : '#DDD'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22 9c2.5-1 4-3 3.5-5.5 0 0 2.5 2.5.5 5.5-.8 1.2-2 1.5-3 1.5h-.5z" fill="${f}" stroke="${s}" stroke-width="1.2"/>
    <path d="M12 37c0-2 1-3 3-3h15c2 0 3 1 3 3v1.5H12V37z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M30 34c-1-3-3-6-5.5-8.5l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="25.5" cy="19" r="1.3" fill="${e}"/>
    <path d="M18.5 26c1.5 1.2 4 1.2 5.5 0" fill="none" stroke="${s}" stroke-width="0.7"/>
  </svg>`
  },

  bishop: (c) => {
    const id = uid('ccb')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="6.5" r="3" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M22.5 10c2.5 0 4.5 2.5 5 5.5.7 4-.3 7.5-1.5 10.5-.7 1.5-1.5 2.5-2.5 3.5h-2c-1-1-1.8-2-2.5-3.5-1.2-3-2.2-6.5-1.5-10.5.5-3 2.5-5.5 5-5.5z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M18 18.5c1.5 0 3-1 4.5-2 1.5 1 3 2 4.5 2" fill="none" stroke="${s}" stroke-width="0.7"/>
    <path d="M15.5 32c0-2 1.5-3 3-3h8c1.5 0 3 1 3 3v2H15.5v-2z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="22.5" cy="14.5" r="1" fill="${s}"/>
  </svg>`
  },

  rook: (c) => {
    const id = uid('ccr')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M10 37c0-2 1-3 3-3h19c2 0 3 1 3 3v1H10v-1z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 34V18h21v16" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 18h25v3.5H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 18V9h3.5v3.5h3V9h3v3.5h3V9h3.5v9H12z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  queen: (c) => {
    const id = uid('ccq')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const j = '#C8A200'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="8" cy="8" r="2.8" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="2.8" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="37" cy="8" r="2.8" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="14" cy="5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <circle cx="31" cy="5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <path d="M6 21c1 2 3 3 5 3 2 0 3.5-1 5.5-2 2 2 4.5 3 6.5 3s4.5-1 6.5-3c2 1 3.5 2 5.5 2 2 0 4-1 5-3l.5 6c0 2-1 3-2 3H8c-1 0-2-1-2-3l.5-6z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M6 21c0 4 2 7 4 8h25c2-1 4-4 4-8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 29c1 1 3.5 2 4.5 2h11c1 0 3.5-1 4.5-2v4H10v-4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v1H10v-1z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  king: (c) => {
    const id = uid('cckg')
    const f = c === 'w' ? '#FFFFDD' : '#333333'
    const s = c === 'w' ? '#3D3D3D' : '#111111'
    const h = c === 'w' ? '#FFFFFF' : '#4A4A4A'
    const cr = '#C8A200'
    const sw = c === 'w' ? 1.8 : 1.3
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="42%" cy="32%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22.5 3v5.5" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M20 5.5h5" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 37c0-2 1-3 3-3h19c2 0 3 1 3 3v1H10v-1z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 34V20h21v14" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 20h25v3.5H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M17 14h11" fill="none" stroke="${s}" stroke-width="0.7"/>
    <path d="M18 17h9" fill="none" stroke="${s}" stroke-width="0.7"/>
  </svg>`
  },
}

// ══════════════════════════════════════════════════════════════════════
// WOOD — Warm brown tones with grain-like highlights
// ══════════════════════════════════════════════════════════════════════

const woodPieceSvg = {
  pawn: (c) => {
    const id = uid('wp')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="9" r="5.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v4H15v-4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15.5 33.5c-.5-3 0-7 2-11 1.2-2.5 2-4 3-4s1.8 1.5 3 4c2 4 2.5 8 2 11z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  knight: (c) => {
    const id = uid('wk')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const e = c === 'w' ? '#3A2000' : '#F0D890'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${f}" stroke="${s}" stroke-width="1"/>
    <path d="M12 36c0-2 1-3 3-3h15c2 0 3 1 3 3v3H12v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="25" cy="19" r="1.2" fill="${e}"/>
    <path d="M19 26c1.5 1 3.5 1 5 0" fill="none" stroke="${s}" stroke-width="0.8"/>
  </svg>`
  },

  bishop: (c) => {
    const id = uid('wb')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="6" r="3.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="22.5" cy="14" r="1" fill="${s}"/>
  </svg>`
  },

  rook: (c) => {
    const id = uid('wr')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V18h21v15" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 18h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <rect x="16" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="21" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="26" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
  </svg>`
  },

  queen: (c) => {
    const id = uid('wq')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const j = c === 'w' ? '#B8860B' : '#DAA520'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="9" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="36" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="15" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <circle cx="30" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
  </svg>`
  },

  king: (c) => {
    const id = uid('wkg')
    const f = c === 'w' ? '#E8C97B' : '#5C3A1E'
    const s = c === 'w' ? '#8B6914' : '#2A1A0A'
    const h = c === 'w' ? '#F5DDA0' : '#7A5230'
    const cr = c === 'w' ? '#B8860B' : '#DAA520'
    const sw = c === 'w' ? 1.6 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22.5 3v6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M19.5 6h6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V20h21v13" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 20h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M17 14h11" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M18 17.5h9" fill="none" stroke="${s}" stroke-width="0.8"/>
  </svg>`
  },
}

// ══════════════════════════════════════════════════════════════════════
// GLASS — Translucent blue-tinted pieces with glossy highlights
// ══════════════════════════════════════════════════════════════════════

const glassPieceSvg = {
  pawn: (c) => {
    const id = uid('gp')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="9" r="5.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v4H15v-4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M15.5 33.5c-.5-3 0-7 2-11 1.2-2.5 2-4 3-4s1.8 1.5 3 4c2 4 2.5 8 2 11z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <ellipse cx="20" cy="7" rx="2" ry="1.5" fill="rgba(255,255,255,0.4)" transform="rotate(-15 20 7)"/>
  </svg>`
  },

  knight: (c) => {
    const id = uid('gk')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const e = c === 'w' ? '#2A3A60' : '#B0C0E0'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${f}" stroke="${s}" stroke-width="1"/>
    <path d="M12 36c0-2 1-3 3-3h15c2 0 3 1 3 3v3H12v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <circle cx="25" cy="19" r="1.2" fill="${e}"/>
    <ellipse cx="23" cy="16" rx="3" ry="2" fill="rgba(255,255,255,0.25)" transform="rotate(-20 23 16)"/>
  </svg>`
  },

  bishop: (c) => {
    const id = uid('gb')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="22.5" cy="6" r="3.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <circle cx="22.5" cy="14" r="1" fill="${s}"/>
    <ellipse cx="21" cy="12" rx="2.5" ry="2" fill="rgba(255,255,255,0.3)" transform="rotate(-10 21 12)"/>
  </svg>`
  },

  rook: (c) => {
    const id = uid('gr')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M12 33V18h21v15" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M10 18h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <rect x="16" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="21" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="26" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <ellipse cx="20" cy="14" rx="4" ry="2.5" fill="rgba(255,255,255,0.2)" transform="rotate(-5 20 14)"/>
  </svg>`
  },

  queen: (c) => {
    const id = uid('gq')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const j = c === 'w' ? '#80A0D0' : '#506090'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <circle cx="9" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="36" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="15" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <circle cx="30" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <ellipse cx="20" cy="16" rx="5" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-8 20 16)"/>
  </svg>`
  },

  king: (c) => {
    const id = uid('gkg')
    const f = c === 'w' ? 'rgba(200,220,255,0.85)' : 'rgba(40,50,80,0.9)'
    const s = c === 'w' ? '#6080B0' : '#1A2040'
    const h = c === 'w' ? 'rgba(230,240,255,0.95)' : 'rgba(60,75,110,0.9)'
    const cr = c === 'w' ? '#6090C0' : '#405080'
    const sw = c === 'w' ? 1.4 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${h}"/><stop offset="100%" stop-color="${f}"/>
    </radialGradient></defs>
    <path d="M22.5 3v6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M19.5 6h6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M12 33V20h21v13" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M10 20h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}" opacity="0.95"/>
    <path d="M17 14h11" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M18 17.5h9" fill="none" stroke="${s}" stroke-width="0.8"/>
    <ellipse cx="21" cy="14" rx="4" ry="2.5" fill="rgba(255,255,255,0.25)" transform="rotate(-10 21 14)"/>
  </svg>`
  },
}

// ══════════════════════════════════════════════════════════════════════
// METAL — Chrome/silver metallic with sharp gradients
// ══════════════════════════════════════════════════════════════════════

const metalPieceSvg = {
  pawn: (c) => {
    const id = uid('mp')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <circle cx="22.5" cy="9" r="5.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v4H15v-4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M15.5 33.5c-.5-3 0-7 2-11 1.2-2.5 2-4 3-4s1.8 1.5 3 4c2 4 2.5 8 2 11z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <ellipse cx="20" cy="7" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.3)" transform="rotate(-15 20 7)"/>
  </svg>`
  },

  knight: (c) => {
    const id = uid('mk')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const e = c === 'w' ? '#333' : '#CCC'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${f}" stroke="${s}" stroke-width="1"/>
    <path d="M12 36c0-2 1-3 3-3h15c2 0 3 1 3 3v3H12v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="25" cy="19" r="1.2" fill="${e}"/>
    <path d="M19 26c1.5 1 3.5 1 5 0" fill="none" stroke="${s}" stroke-width="0.8"/>
    <ellipse cx="23" cy="16" rx="3" ry="2" fill="rgba(255,255,255,0.2)" transform="rotate(-20 23 16)"/>
  </svg>`
  },

  bishop: (c) => {
    const id = uid('mb')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <circle cx="22.5" cy="6" r="3.5" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <circle cx="22.5" cy="14" r="1" fill="${s}"/>
    <ellipse cx="21" cy="12" rx="2.5" ry="2" fill="rgba(255,255,255,0.25)" transform="rotate(-10 21 12)"/>
  </svg>`
  },

  rook: (c) => {
    const id = uid('mr')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V18h21v15" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 18h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <rect x="16" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="21" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <rect x="26" y="11" width="3" height="7" fill="${f}" stroke="${s}" stroke-width="0.5"/>
    <ellipse cx="20" cy="14" rx="4" ry="2.5" fill="rgba(255,255,255,0.2)" transform="rotate(-5 20 14)"/>
  </svg>`
  },

  queen: (c) => {
    const id = uid('mq')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const j = c === 'w' ? '#B0B0B0' : '#555'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <circle cx="9" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="36" cy="8" r="3" fill="${j}" stroke="${s}" stroke-width="0.8"/>
    <circle cx="15" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <circle cx="30" cy="5.5" r="2" fill="${j}" stroke="${s}" stroke-width="0.6"/>
    <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <ellipse cx="20" cy="16" rx="5" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-8 20 16)"/>
  </svg>`
  },

  king: (c) => {
    const id = uid('mkg')
    const f = c === 'w' ? '#D8D8D8' : '#3A3A3A'
    const s = c === 'w' ? '#666666' : '#1A1A1A'
    const h = c === 'w' ? '#F0F0F0' : '#555555'
    const cr = c === 'w' ? '#999' : '#777'
    const sw = c === 'w' ? 1.5 : 1.2
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${h}"/><stop offset="50%" stop-color="${f}"/><stop offset="100%" stop-color="${s}"/>
    </linearGradient></defs>
    <path d="M22.5 3v6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M19.5 6h6" fill="none" stroke="${cr}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M12 33V20h21v13" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M10 20h25v4H10z" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="url(#${id})" stroke="${s}" stroke-width="${sw}"/>
    <path d="M17 14h11" fill="none" stroke="${s}" stroke-width="0.8"/>
    <path d="M18 17.5h9" fill="none" stroke="${s}" stroke-width="0.8"/>
    <ellipse cx="21" cy="14" rx="4" ry="2.5" fill="rgba(255,255,255,0.25)" transform="rotate(-10 21 14)"/>
  </svg>`
  },
}
