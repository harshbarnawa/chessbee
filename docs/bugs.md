# ChessBee Bug Tracker

## Open Bugs

### Critical

| ID | Category | Description | Reproduction |
|----|----------|-------------|--------------|
| BUG-001 | Socket | `receiveMove` useEffect has empty dependency array `[]` - listener captures stale `pieceSymbols` reference | Move pieces, the symbols may not update correctly in edge cases |
| BUG-002 | Socket | No server-side move validation - any client can send any move payload, enabling cheating or crashes | Send malformed move from socket client |
| BUG-003 | Logic | Timer continues ticking after checkmate in race conditions due to `game` object reference changing in useEffect deps | Play game to checkmate, observe timer may tick briefly after |

### High

| ID | Category | Description | Reproduction |
|----|----------|-------------|--------------|
| BUG-004 | Logic | Rematch: `resetGame(false)` resets timers but doesn't properly restart game flow - `gameStarted` set to false, `startRematch` event has 100ms hack | Complete game, click rematch |
| BUG-005 | UI | Missing assets: `bee-logo.png` and `leave.svg` referenced in JSX but not in public/ directory | Check console for 404 errors |
| BUG-006 | Socket | If a player refreshes page, they lose their color assignment and room state | Join room, refresh page |
| BUG-007 | Logic | `onSquareClick` allows selecting opponent's pieces if it's the correct turn color but wrong player (multiplayer race condition) | Rapid clicking during opponent's turn |

### Medium

| ID | Category | Description | Reproduction |
|----|----------|-------------|--------------|
| BUG-008 | CSS | `App.css` is Vite template leftovers - dead code that adds confusion | Read file |
| BUG-009 | UI | Board doesn't flip for local (non-room) games - always shows white perspective | Play local game as black concept |
| BUG-010 | Logic | `abortTimer` useEffect re-creates interval on every `players` state change | Join room, observe timer behavior |
| BUG-011 | Socket | `joinRoom` emits on every roomId change but doesn't leave previous room | Navigate between rooms |
| BUG-012 | UI | Sidebar hidden on mobile with no alternative for move history | View on mobile device |

### Low

| ID | Category | Description | Reproduction |
|----|----------|-------------|--------------|
| BUG-013 | UI | Game title says "Chess Bee" but project name varies (Chess Arena, ChessBee) | Check title, README, docs |
| BUG-014 | CSS | Sidebar height `min(70vw, 760px)` doesn't match board height on all screen sizes | Resize window |
| BUG-015 | Logic | `window.location.href` used directly for room URL instead of React Router navigation | Click "Create Room" |

---

## Fixed Bugs

*No bugs fixed yet in this tracking system. Moved here as bugs get resolved.*
