---
name: voice-only-chess-config
description: ChessBee is a voice-only chess game - no mouse/touch interaction allowed
metadata:
  type: project
---

ChessBee is configured as a **pure voice-only chess game**. Key architectural decisions:
- All mouse/touch interactions are disabled on the board (no `cursor:pointer`, no `onClick`, no hover effects)
- ChessBoard and Square components have no click handlers
- GameControls shows only voice hints, no clickable buttons
- Voice recognition uses Web Speech API + enhanced NL parser + AI fallback
- Chess.com-style coordinate labels on board edges (left A-H, bottom 1-8)
- Premium SVG pieces with gradients and chess.com-style designs
- Two-player P2P on-screen + multiplayer room via socket.io

**Why:** Users must use voice only to improve chess players' memory. Press V or click the mic button, speak any command like "e4", "pawn to e4", "knight f3", "castle kingside", "resign", "draw" — pieces move automatically without manual selection.

**How to apply:** Never add mouse/touch interaction for gameplay. Voice commands are parsed through: textNormalizer (homophones) → voiceParser (command detection) → aiVoiceParser (NL patterns + browser AI) → ChessGame.jsx (auto-resolve source square → movePiece).
