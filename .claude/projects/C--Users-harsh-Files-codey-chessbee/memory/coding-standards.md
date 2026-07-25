---
name: coding-standards
description: Follow PROMPT.md git workflow - small conventional commits, push after every commit, never accumulate large changes
metadata:
  type: feedback
---

PROMPT.md mandates a strict git workflow:

- Small logical commits (5-20 lines when practical)
- Conventional commit messages: feat:, fix:, refactor:, style:, docs:, perf:, chore:, test:
- Push after EVERY successful commit
- Never combine unrelated changes
- Never let work accumulate without version control

**Why:** The user wants git history to tell the complete development story of ChessBee from start to finish.

**How to apply:** After every meaningful change, commit and push immediately. Keep each commit focused on one logical unit. Don't batch multiple unrelated changes.
