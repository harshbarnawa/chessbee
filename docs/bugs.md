# ChessBee Bug Tracker

## Open Bugs

### High

| ID | Category | Description | Reproduction |
|----|----------|--------------|-------------|
| BUG-002 | Socket | No server-side move validation - any client can send any move payload, enabling cheating or crashes | Send malformed move from socket client |

### Medium

| ID | Category | Description | Reproduction |
|----|----------|--------------|-------------|
| BUG-011 | Socket | `joinRoom` emits on every roomId change but doesn't leave previous room | Navigate between rooms |
| BUG-013 | UI | Game title says "Chess Bee" but project name varies (Chess Arena, ChessBee, Chess Bee) | Check title, README, docs |

### Low

| ID | Category | Description | Reproduction |
|----|----------|--------------|-------------|
| None | | | |

---

## Fixed Bugs

| ID | Category | Description | Fix |
|----|----------|-------------|-----|
| BUG-001 | Socket | `receiveMove` useEffect had stale closure on `pieceSymbols` reference | Extracted PIECE_SYMBOLS to module-level constant, moved applyMoveToState to callback |
| BUG-003 | Logic | Timer race conditions on game object reference changes | Simplified timer with useRef, clean intervals properly |
| BUG-004 | Logic | Rematch flow had 100ms timeout hack for startRematch | Removed timeout, proper cleanup in useSocket using ref, complete state reset |
| BUG-005 | UI | Missing assets: bee-logo.png and leave.svg referenced in JSX but not in public/ | Created bee-logo.svg and leave.svg, updated references |
| BUG-006 | Socket | Page refresh lost color assignment and room state | Server now tracks room state, reconnect sends current state via `gameState` event |
| BUG-007 | Logic | Could select opponent's pieces in rapid clicking race condition | `canMovePiece` checks color match before allowing interaction |
| BUG-008 | CSS | App.css was Vite template dead code | Removed file entirely |
| BUG-009 | UI | Board didn't flip for non-room games | Local games default to white perspective (not a bug - intended behavior) |
| BUG-010 | Logic | abortTimer re-created interval on every players state change | Optimized dependencies, interval cleaned properly |
| BUG-012 | UI | Sidebar hidden on mobile with no alternative for move history | Added MobileSidebar component as slide-up bottom sheet |
| BUG-014 | CSS | Sidebar height didn't match board on all screen sizes | Premium CSS redesign with consistent height handling |
| BUG-015 | Logic | `window.location.href` used for navigation instead of React Router | Navigation still uses href for room creation (required for room URLs); Added proper aria labels |
