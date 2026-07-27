# ChessBee Architecture

## Folder Structure

```
chessbee/
├── docs/                    # Project documentation
├── public/                  # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── server/                  # Backend server
│   ├── index.js             # Express + Socket.io server
│   └── package.json
├── src/                     # Frontend source
│   ├── App.jsx              # Root component with routing
│   ├── ChessGame.jsx        # Main game component (monolithic)
│   ├── index.css            # Global styles
│   ├── main.jsx             # React entry point
│   ├── socket.js            # Socket.io client singleton
│   └── assets/              # Static assets (mostly unused)
├── index.html               # HTML entry point
├── package.json
├── vite.config.js           # Vite configuration
└── vercel.json              # Vercel SPA rewrites
```

## Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React 19, React Router 7  |
| Chess Logic | chess.js 1.4              |
| Backend     | Node.js, Express 5        |
| Realtime    | Socket.io 4.8             |
| Build       | Vite 8                    |
| Deploy (FE) | Vercel                    |
| Deploy (BE) | Render                    |

## State Management

All state is managed via React `useState` hooks inside `ChessGame.jsx`. There is no global state management library (Redux, Zustand, Context, etc.).

Key state variables:
- `game` - Chess.js instance (entire game state)
- `playerColor` - 'white' | 'black' | null
- `players` - Array of connected players
- `selectedSquare` - Currently selected square for move
- `moveHistory` - Array of move objects
- `capturedPieces` - { white: [], black: [] }
- `whiteTime` / `blackTime` - Timer values in seconds
- `winner` - 'White' | 'Black' | null
- `gameStarted` - Boolean
- `opponentOffline` - Boolean
- `abortTimer` / `gameAborted` - Room abort countdown
- `waitingRematch` - Boolean
- `copied` - Clipboard feedback

## Routing

```
/           → ChessGame (local/solo mode)
/room/:roomId → ChessGame (multiplayer mode)
```

Two routes, both render the same component. The presence of `roomId` param triggers multiplayer mode.

## Authentication Flow

**NOT IMPLEMENTED** - No authentication exists. Players are identified only by their Socket.io connection ID.

## Socket Flow

### Client → Server Events
| Event | Payload | Description |
|-------|---------|-------------|
| `joinRoom` | `roomId` | Join a game room |
| `move` | `{ roomId, move }` | Send a move to opponent |
| `requestRematch` | `roomId` | Request rematch |

### Server → Client Events
| Event | Payload | Description |
|-------|---------|-------------|
| `playerColor` | `'white'` or `'black'` | Assigned color |
| `players` | `[{ id, color }]` | Updated player list |
| `roomFull` | - | Room has 2 players |
| `receiveMove` | `move` | Opponent's move |
| `opponentDisconnected` | - | Opponent left |
| `startRematch` | - | Both players ready |
| `rematchWaiting` | `count` | How many want rematch |

### Server State
- `rooms` - Object mapping roomId to array of { id, color }
- `rematchRequests` - Object mapping roomId to array of socket IDs

## Voice System

Voice is the PRIMARY interaction model for ChessBee. The voice pipeline processes
speech-to-text output through a multi-stage analysis chain:

### Voice Pipeline Architecture

```
Speech Input → Web Speech API (SpeechRecognition)
  → Raw Transcript + Confidence
  → textNormalizer.js
      ├─ Filler word removal ("um", "uh", "please", "I want to")
      ├─ Number-word → digit replacement ("four" → "4", "five" → "5")
      ├─ Chess homophone mapping ("green" → "queen", "rock" → "rook", "night" → "knight")
      ├─ Square spacing normalization ("e 4" → "e4", "d five" → "d5")
      └─ Normalized clean text
  → fuzzyMatcher.js
      ├─ Levenshtein distance (edit distance matching)
      ├─ Soundex phonetic matching (words that sound alike)
      ├─ Hybrid similarity scoring
      ├─ Chess piece name fuzzy matching (handles "bisop", "kniht")
      ├─ Chess action word matching ("castel", "kapter")
      └─ Square extraction (multiple formats)
  → voiceParser.js
      ├─ Command type detection (move, castle, capture, promote, resign, draw, undo)
      ├─ Confidence scoring (combines speech confidence + text confidence + match confidence)
      └─ Returns { command, confidence, displayText }
  → ChessGame.jsx
      ├─ Command execution
      └─ voiceFeedback.js (spoken confirmation via Speech Synthesis)
```

### Optional AI Fallback

When local parsing confidence is below threshold, the system can optionally
fall back to an AI-assisted parser (aiVoiceParser.js) that calls a backend
LLM endpoint with a chess-specific system prompt. This is disabled by default.

### Voice Feedback

Moves are confirmed via the Web Speech Synthesis API (voiceFeedback.js):
- "Knight to F3", "Capturing on E5", "Castling kingside"
- Game events: "Check!", "Checkmate!"

### Key Voice Files

| File | Purpose |
|------|---------|
| `src/utils/textNormalizer.js` | Filler removal, homophone mapping, number normalization |
| `src/utils/fuzzyMatcher.js` | Levenshtein distance, Soundex, piece/action matching |
| `src/utils/voiceParser.js` | Main parse pipeline, confidence scoring |
| `src/utils/aiVoiceParser.js` | Optional AI fallback with LLM system prompt |
| `src/utils/voiceFeedback.js` | Spoken move confirmations via Speech Synthesis |
| `src/hooks/useVoice.js` | Web Speech API lifecycle, continuous listening |
| `src/components/VoiceControl.jsx` | Voice UI with confidence badges and feedback |

### Supported Voice Formats

- "Queen e2 to e4" / "Knight f3 g5" / "Bishop c4 to d5"
- "Castle kingside" / "Castle queenside"
- "Take e5" / "Capture d4" / "Queen takes e5"
- "Promote to queen"
- "Undo" / "Take back"
- "Resign" / "Offer draw"
- "e4" (square selection)

### Common Misrecognitions Handled

| What user says | Speech API might hear | Handled by |
|----------------|----------------------|------------|
| "queen" | "green", "clean" | Homophone map |
| "rook" | "rock", "wreck" | Homophone map |
| "knight" | "night", "nite" | Homophone map + Soundex |
| "bishop" | "bisop", "bishup" | Homophone map + Levenshtein |
| "e four" | "e four" | Square spacing normalization |
| "to" | "two", "too" | Homophone map → "2" (filtered) |
| "for" | "four", "fore" | Homophone map → "4" |

## Component Hierarchy

```
<BrowserRouter>
  <App>
    <Routes>
      <Route path="/" element={<ChessGame />} />
      <Route path="/room/:roomId" element={<ChessGame />} />
    </Routes>
  </App>
</BrowserRouter>
```

**ChessGame.jsx** contains everything:
- Top bar (logo, create room, leave)
- Room controls (URL copy, waiting status)
- Game info (timers, status)
- Captured pieces
- Chess board (rendered via `renderBoard()`)
- Rematch button
- Sidebar (status, move history)

## Database Structure

**NONE** - All data is ephemeral. Server stores room state in memory only. Server restart loses all rooms.

## API Structure

No REST API. All communication is via Socket.io WebSocket events.

## Coding Conventions

- Functional components only (no class components)
- CSS variables for theming (`--light`, `--dark`, `--bg`, etc.)
- No TypeScript
- No prop-types
- Indentation varies (mix of styles in ChessGame.jsx)
- Unicode chess pieces (♔♕♖♗♘♙ / ♚♛♜♝♞♟)
- Dark theme by default
