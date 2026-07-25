# ChessBee Changelog

All notable changes to ChessBee are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] - 2024-12-01

### Initial Release

#### Features
- Real-time multiplayer chess via Socket.io
- Private room system with shareable invite links
- Automatic white/black color assignment
- Auto-flipped board for black player
- 10-minute chess timers
- Check and checkmate detection
- Move history sidebar
- Captured pieces display
- Rematch system
- Opponent disconnect detection
- Room abort timer (60s waiting for opponent)
- Responsive design (mobile/desktop)
- Dark theme UI
- Legal move validation using chess.js
- Unicode chess pieces

#### Technical
- React 19 frontend with React Router 7
- chess.js 1.4 for game logic
- Socket.io 4.8 for real-time communication
- Vite 8 for build tooling
- Deployed on Vercel (frontend) + Render (backend)

---

## [Unreleased]

### In Progress
- Documentation suite
- Codebase cleanup and refactoring
- Voice interaction system
- Theme engine
- Premium SVG chess pieces
- Authentication system
- Performance optimizations
