---
name: voice-first-vision
description: ChessBee is voice-first - voice is PRIMARY interaction, mouse only for UI navigation, this is the core differentiator
metadata:
  type: project
---

ChessBee's core vision is voice-first chess interaction:

- **Voice is PRIMARY** — all chess moves happen via voice
- **Mouse is SECONDARY** — only for menus, buttons, settings, navigation
- **Keyboard shortcut:** Press V to activate voice input
- **Mobile:** Floating microphone button, tap to speak

**Voice commands:**
- "Pawn e2 to e4"
- "Knight f3 to g5"
- "Queen d4 to d5"
- "Castle kingside"
- "Castle queenside"
- "Capture on e5"
- "Promote to Queen"
- "Undo"
- "Resign"
- "Offer draw"

**Voice feedback:**
- Microphone animation when active
- Live transcript display
- Recognition status
- Error handling with retry
- Voice feedback for move confirmation

**Why:** This is the primary differentiator from Chess.com and Lichess. Voice-first makes chess more accessible and natural.

**How to apply:** When implementing features, always consider voice interaction first. Mouse/click should be a fallback, not the primary path. The mouse should NOT move pieces — only voice should.

See also: [[project-overview]], [[coding-standards]]
