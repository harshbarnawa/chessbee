---
name: project-overview
description: ChessBee is a voice-first multiplayer chess platform built with React 19, chess.js, Socket.io, deployed on Vercel (frontend) and Render (backend)
metadata:
  type: project
---

ChessBee is a real-time multiplayer chess platform with voice-first interaction as its core differentiator.

**Tech Stack:**
- Frontend: React 19, React Router 7, chess.js 1.4, Socket.io client
- Backend: Node.js, Express 5, Socket.io server
- Build: Vite 8
- Deploy: Vercel (frontend), Render (backend at chessbylibrary.onrender.com)

**Key Files:**
- `src/ChessGame.jsx` — Monolithic 1072-line component containing ALL game logic and UI
- `server/index.js` — Socket.io server handling rooms, moves, rematch
- `src/socket.js` — Socket.io client singleton (hardcoded to production URL)
- `src/index.css` — All styles in one file

**Current State (2024-12-01):**
- Basic multiplayer chess works
- No authentication, no voice, no themes, no SVG pieces
- Code needs major refactoring
- Documentation was missing (now created)

**Deployment:**
- Frontend: Vercel with SPA rewrites
- Backend: Render (free tier) at chessbylibrary.onrender.com
- Socket URL hardcoded in socket.js

See also: [[coding-standards]], [[voice-first-vision]]
