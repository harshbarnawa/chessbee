# ChessBee Engineering Decisions

## 2024 - Initial Build

### D-001: Chess.js for game logic
**Decision:** Use chess.js library for all chess rules, validation, and state management.
**Why:** Reimplements the full chess rule engine correctly. Avoids months of work building legal move generation, check detection, checkmate, stalemate, en passant, castling, promotion, etc.
**Trade-off:** Adds a dependency, but it's the standard JS chess library with 4k+ GitHub stars.

### D-002: Socket.io for real-time multiplayer
**Decision:** Use Socket.io instead of raw WebSockets or a service like Firebase.
**Why:** Socket.io provides automatic reconnection, room abstraction, broadcasting, and fallback transports out of the box. The room system maps directly to chess game rooms.
**Trade-off:** Heavier than raw WebSocket, but saves significant development time.

### D-003: Unicode chess pieces
**Decision:** Use Unicode characters for chess pieces instead of SVG/images.
**Why:** Zero asset loading, works everywhere, no external dependencies. Quick to implement for MVP.
**Trade-off:** Less visually polished than premium SVG pieces. Limited styling control. Plan to replace with premium SVG assets.

### D-004: Vercel + Render deployment
**Decision:** Deploy frontend to Vercel, backend to Render.
**Why:** Vercel provides instant deploys, CDN, and SPA routing support. Render provides free-tier Node.js hosting with Socket.io support.
**Trade-off:** Two separate deployments to manage. CORS configuration needed between them.

### D-005: No authentication initially
**Decision:** Ship without authentication for rapid iteration.
**Why:** The core value is playing chess with friends via room links. Authentication adds friction to the initial experience.
**Trade-off:** No user identity, no persistent stats, no ranked play. These are future features.

### D-006: In-memory server state
**Decision:** Store room state in server memory, not a database.
**Why:** Simplicity for MVP. Chess games are ephemeral - once the game ends, the state is no longer needed.
**Trade-off:** Server restart loses all active games. No game history or persistence. This is acceptable for the current stage.

### D-007: Voice-first interaction model
**Decision:** Make voice the PRIMARY interaction method, with mouse only for UI navigation.
**Why:** Unique differentiator from Chess.com and Lichess. Voice-first is the core vision of ChessBee.
**Trade-off:** Accessibility concern - voice may not work for all users. Need fallback keyboard input.

---

## Pending Decisions

### PD-001: State management approach
**Options:** React Context, Zustand, Redux Toolkit, Jotai
**Context:** Current useState approach won't scale as features grow. Need to decide before adding authentication, themes, and game analysis.
**Recommendation:** Zustand - lightweight, minimal boilerplate, good for this project size.

### PD-002: Backend database
**Options:** PostgreSQL, MongoDB, Firebase, Supabase
**Context:** Needed for user accounts, game history, ratings, and persistence.
**Recommendation:** PostgreSQL with Prisma ORM for structured data (users, games, moves).

### PD-003: Voice recognition engine
**Options:** Web Speech API (browser native), Whisper API (OpenAI), Deepgram, custom model
**Context:** Must support chess-specific vocabulary reliably.
**Decision:** Web Speech API for MVP (free, no server needed), with multi-stage client-side post-processing pipeline (normalization → fuzzy matching → confidence scoring). Optional AI-assisted parsing (aiVoiceParser.js) for future cloud fallback when local confidence is low.

### PD-004: Voice parsing approach
**Decision:** Rule-based client-side pipeline with fuzzy matching, NOT a cloud API.
**Why:** Zero latency, works offline, no API costs. The multi-stage pipeline (normalize → fuzzy match → parse → score) handles common speech misrecognitions (queen/green, rook/rock, knight/night) without any server round-trips. AI-assisted parsing is optional for low-confidence fallback.
**Trade-off:** Less flexible than an LLM-based approach, but the bounded chess domain (6 piece types, 64 squares, ~10 commands) maps well to deterministic parsing with fuzzy tolerance.
