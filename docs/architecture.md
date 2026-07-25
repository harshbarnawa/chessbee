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

**NOT IMPLEMENTED** - Voice interaction is the PRIMARY interaction model per the project vision but does not exist yet.

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
