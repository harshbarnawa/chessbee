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
- "Pawn e2 to e4" / "Knight f3 to g5" / "Queen d4 to d5"
- "Castle kingside" / "Castle queenside" / "Short castle"
- "Capture on e5" / "Take e5" / "Queen takes e5"
- "Promote to Queen"
- "Undo" / "Take back"
- "Resign" / "Offer draw"
- "e4" (single square selection)

**Voice pipeline architecture (2024-12-01):**
1. Web Speech API → raw transcript + confidence
2. Text normalization (filler removal, homophone mapping, number words)
3. Fuzzy matching (Levenshtein + Soundex phonetic)
4. Chess command parsing with confidence scoring
5. Command execution + spoken confirmation (Speech Synthesis)

**Common misrecognitions handled:**
- queen/green/clean, rook/rock, knight/night, bishop/bisop
- to/two/too, for/four, e four/e4, d five/d5
- Filler words: um, uh, like, please, I want to

**Voice feedback:**
- Spoken confirmation of every move ("Knight to F3", "Capturing on E5")
- Microphone animation when active
- Live transcript display
- Confidence badges (High/Medium/Low)
- Error handling with retry
- Mobile floating microphone button (visible on ≤768px viewport)

**Why:** This is the primary differentiator from Chess.com and Lichess. Voice-first makes chess more accessible and natural.

**How to apply:** When implementing features, always consider voice interaction first. Mouse/click should be a fallback, not the primary path. The mouse should NOT move pieces — only voice should.

See also: [[project-overview]], [[coding-standards]]

See also: [[project-overview]], [[coding-standards]]
