# ChessBee Roadmap

## Immediate Tasks (Do First)

| # | Status | Priority | Description |
|---|--------|----------|-------------|
| 1 | 🔄 In Progress | Critical | Create all documentation files |
| 2 | ⬜ Pending | Critical | Remove dead code and unused Vite template assets (App.css, hero.png, react.svg, vite.svg) |
| 3 | ⬜ Pending | Critical | Fix missing assets (bee-logo.png, leave.svg) |
| 4 | ⬜ Pending | Critical | Fix title inconsistency - standardize to "ChessBee" |

## High Priority

| # | Status | Priority | Description |
|---|--------|----------|-------------|
| 5 | ⬜ Pending | High | Refactor ChessGame.jsx — split into smaller components and custom hooks |
| 6 | ⬜ Pending | High | Add environment variable for socket URL (currently hardcoded to production) |
| 7 | ⬜ Pending | High | Fix rematch flow — proper timer reset, game state cleanup |
| 8 | ⬜ Pending | High | Add server-side move validation (prevent cheating/crashes) |
| 9 | ⬜ Pending | High | Add reconnect logic — restore color and room state on page refresh |
| 10 | ⬜ Pending | High | Implement voice-first interaction system (Web Speech API) |
| 11 | ⬜ Pending | High | Fix timer race conditions — ensure timer stops cleanly on game end |

## Medium Priority

| # | Status | Priority | Description |
|---|--------|----------|-------------|
| 12 | ⬜ Pending | Medium | Implement theme engine with multiple board themes |
| 13 | ⬜ Pending | Medium | Add premium SVG chess pieces with style selector |
| 14 | ⬜ Pending | Medium | Add PGN export functionality |
| 15 | ⬜ Pending | Medium | Add resign and draw offer buttons |
| 16 | ⬜ Pending | Medium | Add move undo (local games only) |
| 17 | ⬜ Pending | Medium | Improve game result display (winner, reason, time) |
| 18 | ⬜ Pending | Medium | Add mobile floating microphone button for voice |
| 19 | ⬜ Pending | Medium | Add rate limiting on socket events |
| 20 | ⬜ Pending | Medium | Add room history or game replay basic support |
| 21 | ⬜ Pending | Medium | Add animations and transitions (board, pieces, UI) |
| 22 | ⬜ Pending | Medium | Improve responsive layout — sidebar as bottom sheet on mobile |

## Low Priority

| # | Status | Priority | Description |
|---|--------|----------|-------------|
| 23 | ⬜ Pending | Low | Add React.memo and useMemo for performance |
| 24 | ⬜ Pending | Low | Add lazy loading and code splitting |
| 25 | ⬜ Pending | Low | Add accessibility features (ARIA labels, keyboard navigation) |
| 26 | ⬜ Pending | Low | Add loading states and skeletons |
| 27 | ⬜ Pending | Low | Add hover effects and micro-interactions |
| 28 | ⬜ Pending | Low | Add sound effects (move, capture, check, checkmate) |
| 29 | ⬜ Pending | Low | Optimize bundle size and assets |
| 30 | ⬜ Pending | Low | Add SEO meta tags and Open Graph data |

## Future Features

| # | Status | Priority | Description |
|---|--------|----------|-------------|
| 31 | ⬜ Pending | Future | User authentication (Email + Google OAuth + JWT) |
| 32 | ⬜ Pending | Future | User profiles and statistics |
| 33 | ⬜ Pending | Future | Ranked matchmaking with ELO ratings |
| 34 | ⬜ Pending | Future | Game analysis and review |
| 35 | ⬜ Pending | Future | Spectator mode |
| 36 | ⬜ Pending | Future | Database persistence (PostgreSQL) |
| 37 | ⬜ Pending | Future | Dark/Light mode toggle |
| 38 | ⬜ Pending | Future | Custom piece sets (multiple styles) |
| 39 | ⬜ Pending | Future | Tournament system |
| 40 | ⬜ Pending | Future | AI opponent (difficulty levels) |
| 41 | ⬜ Pending | Future | Chat system during games |
| 42 | ⬜ Pending | Future | Notification system |
| 43 | ⬜ Pending | Future | Mobile app (React Native or PWA) |

---

*Last updated: 2024-12-01*
