/**
 * Chess Pieces for ChessBee
 * 20 piece styles with clean, standard Staunton silhouettes.
 * Unique gradient IDs prevent DOM collisions on deploy.
 */

let _svgId = 0
const uid = (p) => `${p}${++_svgId}`

// ── Piece Shapes (shared across all styles) ──────────────────────────
// Each function returns SVG inner markup for a piece type.
// Takes palette: { fill, stroke, accent, highlight, eye, sw }

const SHAPES = {
  pawn: (p) => `
    <circle cx="22.5" cy="10" r="4.5" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M16 33c.5-3 1.5-6 3-8.5 1-1.7 2-2.5 3.5-2.5s2.5.8 3.5 2.5c1.5 2.5 2.5 5.5 3 8.5z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M15 36c0-1.5 1-2.5 2.5-2.5h10c1.5 0 2.5 1 2.5 2.5v3H15v-3z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>`,

  knight: (p) => `
    <path d="M14 36c0-2 1-3 3-3h15c2 0 3 1 3 3v2H14v-2z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M30 33c-1-3-3-6-5-8l-3-2c-1.5-1-3-2-4-3.5l-1.5-2.5c-.8-1.2-.5-2.5.5-3.5l3-2 5 1c1 .5 2 1.5 2.5 3l2 5c.3 1 0 2.5-.5 4l-2 4.5c-.8 2-1.5 3-2 4z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M22 10c3-1 4-3 3-6 0 0 2 3 0 6-1 1.5-2.5 2-3.5 2h.5z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1"/>
    <circle cx="25" cy="19" r="1.2" fill="${p.eye}"/>`,

  bishop: (p) => `
    <circle cx="22.5" cy="6" r="3" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M22.5 9.5c2.5 0 5 3 5.5 6 .8 4 0 8-1.5 11-.8 1.5-1.5 2.5-2.5 3.5h-3c-1-1-1.7-2-2.5-3.5-1.5-3-2.3-7-1.5-11 .5-3 3-6 5.5-6z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M18.5 18c1.5 0 2.5-1 4-2 1.5 1 2.5 2 4 2" fill="none" stroke="${p.stroke}" stroke-width="0.8"/>
    <path d="M17 30c1 1 3 2 5.5 2s4.5-1 5.5-2" fill="none" stroke="${p.stroke}" stroke-width="0.8"/>
    <path d="M15 33c0-2 1.5-3 3-3h9c1.5 0 3 1 3 3v3H15v-3z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <circle cx="22.5" cy="14" r="1" fill="${p.stroke}"/>`,

  rook: (p) => `
    <path d="M12 18V8h4v4h3V8h4v4h3V8h4v10H12z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M10 18h25v4H10z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M12 22v11h21V22" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M10 33c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>`,

  queen: (p) => `
    <circle cx="9" cy="8" r="3" fill="${p.accent}" stroke="${p.stroke}" stroke-width="0.8"/>
    <circle cx="22.5" cy="5" r="3" fill="${p.accent}" stroke="${p.stroke}" stroke-width="0.8"/>
    <circle cx="36" cy="8" r="3" fill="${p.accent}" stroke="${p.stroke}" stroke-width="0.8"/>
    <circle cx="15" cy="5.5" r="2" fill="${p.accent}" stroke="${p.stroke}" stroke-width="0.6"/>
    <circle cx="30" cy="5.5" r="2" fill="${p.accent}" stroke="${p.stroke}" stroke-width="0.6"/>
    <path d="M7 20c1 2 3 3 5 3 2 0 3-1 5-2 2 2 4 3 6 3s4-1 6-3c2 1 3 2 5 2 2 0 4-1 5-3l1 7c0 2-1 3-2 3H8c-1 0-2-1-2-3l1-7z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M7 20c0 4 2 7 4 8h23c2-1 4-4 4-8" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M12 28c1 1 3 2 4 2h13c1 0 3-1 4-2v5H12v-5z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M10 33c0-2 1.5-3 3-3h19c1.5 0 3 1 3 3v3H10v-3z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>`,

  king: (p) => `
    <path d="M22.5 3v6" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M19.5 6h6" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10 36c0-2 1-3 3-3h19c2 0 3 1 3 3v3H10v-3z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M12 33V20h21v13" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M10 20h25v4H10z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M14 20c0-3 1.5-6 3.5-8 1.2-1.2 2.5-2 5-2s3.8.8 5 2c2 2 3.5 5 3.5 8" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.sw}"/>
    <path d="M17 14h11" fill="none" stroke="${p.stroke}" stroke-width="0.8"/>
    <path d="M18 17.5h9" fill="none" stroke="${p.stroke}" stroke-width="0.8"/>`,
}

// ── Style Definitions ────────────────────────────────────────────────
// 20 piece styles, each with white/black palettes + effect type

const STYLES = {
  neo: {
    name: 'Neo',
    effect: 'solid',
    w: { fill: '#FFFFFF', stroke: '#333333', accent: '#D4A017', highlight: '#F8F8F8', eye: '#000', sw: 1.5 },
    b: { fill: '#2A2A2A', stroke: '#111111', accent: '#D4A017', highlight: '#444444', eye: '#FFF', sw: 1.2 },
  },
  classic: {
    name: 'Classic',
    effect: 'gradient',
    w: { fill: '#FFFFF0', stroke: '#555555', accent: '#D4A017', highlight: '#FFFFFF', eye: '#000', sw: 1.5 },
    b: { fill: '#1A1A1A', stroke: '#000000', accent: '#D4A017', highlight: '#333333', eye: '#FFF', sw: 1.2 },
  },
  wood: {
    name: 'Wood',
    effect: 'gradient',
    w: { fill: '#E8C97B', stroke: '#8B6914', accent: '#B8860B', highlight: '#F5DDA0', eye: '#3A2000', sw: 1.5 },
    b: { fill: '#5C3A1E', stroke: '#2A1A0A', accent: '#DAA520', highlight: '#7A5230', eye: '#F0D890', sw: 1.2 },
  },
  glass: {
    name: 'Glass',
    effect: 'glass',
    w: { fill: 'rgba(200,220,255,0.75)', stroke: '#6080B0', accent: '#80A0D0', highlight: 'rgba(240,248,255,0.9)', eye: '#2A3A60', sw: 1.3 },
    b: { fill: 'rgba(40,50,80,0.8)', stroke: '#1A2040', accent: '#506090', highlight: 'rgba(80,100,140,0.9)', eye: '#B0C0E0', sw: 1.1 },
  },
  metal: {
    name: 'Metal',
    effect: 'metal',
    w: { fill: '#D8D8D8', stroke: '#666666', accent: '#999999', highlight: '#F0F0F0', eye: '#333', sw: 1.5 },
    b: { fill: '#3A3A3A', stroke: '#1A1A1A', accent: '#777777', highlight: '#555555', eye: '#CCC', sw: 1.2 },
  },
  marble: {
    name: 'Marble',
    effect: 'gradient',
    w: { fill: '#F0F0F0', stroke: '#9B9B9B', accent: '#BBBBBB', highlight: '#FFFFFF', eye: '#555', sw: 1.4 },
    b: { fill: '#808080', stroke: '#444444', accent: '#666666', highlight: '#AAAAAA', eye: '#DDD', sw: 1.2 },
  },
  gothic: {
    name: 'Gothic',
    effect: 'solid',
    w: { fill: '#E8E0D0', stroke: '#4A3728', accent: '#8B6914', highlight: '#F5EDE0', eye: '#2A1A0A', sw: 1.6 },
    b: { fill: '#2A1A0A', stroke: '#0A0500', accent: '#D4A017', highlight: '#4A3020', eye: '#D4A017', sw: 1.3 },
  },
  '8bit': {
    name: '8-Bit',
    effect: 'solid',
    w: { fill: '#FFFFFF', stroke: '#000000', accent: '#FF0000', highlight: '#FFFF00', eye: '#000', sw: 2.2 },
    b: { fill: '#333333', stroke: '#000000', accent: '#00FF00', highlight: '#666666', eye: '#FFF', sw: 2.2 },
  },
  tournament: {
    name: 'Tournament',
    effect: 'gradient',
    w: { fill: '#FFFFF0', stroke: '#4A4A4A', accent: '#C8A200', highlight: '#FFFFF8', eye: '#000', sw: 1.5 },
    b: { fill: '#1A1A1A', stroke: '#000000', accent: '#C8A200', highlight: '#333333', eye: '#FFF', sw: 1.2 },
  },
  book: {
    name: 'Book',
    effect: 'solid',
    w: { fill: '#F5E6D0', stroke: '#5C3A1E', accent: '#8B6914', highlight: '#FFF0E0', eye: '#2A1A0A', sw: 1.4 },
    b: { fill: '#3A2A1A', stroke: '#1A0A00', accent: '#DAA520', highlight: '#5A4A3A', eye: '#F0D890', sw: 1.2 },
  },
  icysea: {
    name: 'Icy Sea',
    effect: 'glass',
    w: { fill: 'rgba(232,244,255,0.8)', stroke: '#5B97A8', accent: '#80B0C0', highlight: 'rgba(240,248,255,0.95)', eye: '#2A4A5A', sw: 1.3 },
    b: { fill: 'rgba(58,106,122,0.85)', stroke: '#1A3A4A', accent: '#5B97A8', highlight: 'rgba(90,138,154,0.9)', eye: '#C0E0F0', sw: 1.1 },
  },
  newspaper: {
    name: 'Newspaper',
    effect: 'solid',
    w: { fill: '#FFFFFF', stroke: '#222222', accent: '#444444', highlight: '#F5F5F5', eye: '#000', sw: 1.8 },
    b: { fill: '#333333', stroke: '#111111', accent: '#555555', highlight: '#555555', eye: '#FFF', sw: 1.8 },
  },
  sky: {
    name: 'Sky',
    effect: 'gradient',
    w: { fill: '#E8F0FF', stroke: '#5A8CCF', accent: '#7AAAEF', highlight: '#F0F5FF', eye: '#2A4A8A', sw: 1.4 },
    b: { fill: '#3A6AAF', stroke: '#1A3A7A', accent: '#5A8CCF', highlight: '#5A8AAF', eye: '#C0D8F0', sw: 1.2 },
  },
  walnut: {
    name: 'Walnut',
    effect: 'gradient',
    w: { fill: '#E3C8A3', stroke: '#6A4634', accent: '#8B6914', highlight: '#F0D8B8', eye: '#3A2010', sw: 1.5 },
    b: { fill: '#4A2A1A', stroke: '#2A1000', accent: '#DAA520', highlight: '#6A4A3A', eye: '#F0D890', sw: 1.2 },
  },
  purple: {
    name: 'Purple',
    effect: 'gradient',
    w: { fill: '#F0E8FF', stroke: '#7B4FA3', accent: '#9B6FC3', highlight: '#F8F0FF', eye: '#4A2A6A', sw: 1.4 },
    b: { fill: '#4A2A6A', stroke: '#2A1040', accent: '#7B4FA3', highlight: '#6A4A8A', eye: '#D0C0E0', sw: 1.2 },
  },
  dash: {
    name: 'Dash',
    effect: 'outline',
    w: { fill: 'rgba(255,255,255,0.1)', stroke: '#333333', accent: '#666666', highlight: '#999999', eye: '#000', sw: 2 },
    b: { fill: 'rgba(50,50,50,0.1)', stroke: '#111111', accent: '#444444', highlight: '#777777', eye: '#FFF', sw: 2 },
  },
  bases: {
    name: 'Bases',
    effect: 'solid',
    w: { fill: '#F6F1E3', stroke: '#5A4C3A', accent: '#8B6914', highlight: '#FFF8E8', eye: '#2A1A0A', sw: 1.5 },
    b: { fill: '#5A4C3A', stroke: '#2A1A0A', accent: '#DAA520', highlight: '#7A6A5A', eye: '#F0D890', sw: 1.2 },
  },
  lolz: {
    name: 'Lolz',
    effect: 'solid',
    w: { fill: '#FFF68F', stroke: '#FF69B4', accent: '#FF1493', highlight: '#FFFFB0', eye: '#FF69B4', sw: 1.5 },
    b: { fill: '#FF69B4', stroke: '#CC0066', accent: '#FF1493', highlight: '#FF8AC4', eye: '#FFF68F', sw: 1.2 },
  },
  burledwood: {
    name: 'Burled Wood',
    effect: 'gradient',
    w: { fill: '#E9CFA4', stroke: '#7A4F34', accent: '#B8860B', highlight: '#F5DFC0', eye: '#3A2010', sw: 1.5 },
    b: { fill: '#5A3A20', stroke: '#2A1500', accent: '#DAA520', highlight: '#7A5A40', eye: '#F0D890', sw: 1.2 },
  },
  translucent: {
    name: 'Translucent',
    effect: 'glass',
    w: { fill: 'rgba(255,255,255,0.45)', stroke: 'rgba(100,100,100,0.5)', accent: 'rgba(150,150,150,0.6)', highlight: 'rgba(255,255,255,0.7)', eye: 'rgba(0,0,0,0.4)', sw: 1.2 },
    b: { fill: 'rgba(50,50,50,0.55)', stroke: 'rgba(0,0,0,0.6)', accent: 'rgba(100,100,100,0.6)', highlight: 'rgba(80,80,80,0.6)', eye: 'rgba(255,255,255,0.4)', sw: 1.1 },
  },
}

// ── Type Mapping (single-letter → shape key) ─────────────────────────
const TYPE_MAP = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }

// ── SVG Generator ────────────────────────────────────────────────────

function createPieceSvg(type, color, style = 'classic') {
  // Validate + resolve type
  const shapeKey = TYPE_MAP[type]
  if (!shapeKey || !SHAPES[shapeKey]) {
    console.warn(`[chessPieces] Invalid piece type: "${type}", falling back to pawn`)
    return createPieceSvg('p', color, style)
  }

  // Validate style
  const s = STYLES[style]
  if (!s) {
    console.warn(`[chessPieces] Invalid piece style: "${style}", falling back to classic`)
    return createPieceSvg(type, color, 'classic')
  }

  const p = s[color] || s.w
  const effect = s.effect || 'solid'
  const id = uid('p')

  let defs = ''
  let fill = p.fill
  let extraAttrs = ''

  switch (effect) {
    case 'gradient': {
      const gid = `g${id}`
      defs = `<linearGradient id="${gid}" x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="${p.highlight}"/>
        <stop offset="100%" stop-color="${p.fill}"/>
      </linearGradient>`
      fill = `url(#${gid})`
      break
    }
    case 'glass': {
      const gid = `g${id}`
      defs = `<linearGradient id="${gid}" x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="${p.highlight}"/>
        <stop offset="100%" stop-color="${p.fill}"/>
      </linearGradient>`
      fill = `url(#${gid})`
      extraAttrs = ' opacity="0.92"'
      break
    }
    case 'metal': {
      const gid = `g${id}`
      defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.highlight}"/>
        <stop offset="50%" stop-color="${p.fill}"/>
        <stop offset="100%" stop-color="${p.stroke}"/>
      </linearGradient>`
      fill = `url(#${gid})`
      break
    }
    // solid and outline: no defs needed
  }

  const inner = SHAPES[shapeKey]({ ...p, fill })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="100%" height="100%">
    <defs>${defs}</defs>
    <g${extraAttrs}>${inner}</g>
  </svg>`
}

// ── Accessibility ────────────────────────────────────────────────────

function getPieceLabel(type, color) {
  const names = { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' }
  const colors = { w: 'White', b: 'Black' }
  return `${colors[color]} ${names[type]}`
}

export { createPieceSvg, getPieceLabel, STYLES }
