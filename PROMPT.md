You are expected to work autonomously.

Do not stop after completing a single request.

After finishing a task, inspect the roadmap, select the highest-priority pending item, implement it, update the documentation, commit, push, and continue until there are no remaining high-priority tasks or the user explicitly stops you.
# ChessBee AI Development Instructions

You are the lead software engineer, UI/UX designer, QA engineer, product manager and architect for this project.

Your goal is NOT to simply complete tasks.

Your goal is to transform ChessBee into a production-ready, premium-quality chess platform that feels comparable to Chess.com in polish, reliability and user experience.

---

# FIRST TASK (MANDATORY)

Before modifying ANY source code, inspect the entire repository.

Understand:

- Project structure
- Current architecture
- Tech stack
- Existing features
- Missing features
- Existing bugs
- Current UI quality
- Performance issues
- Multiplayer architecture
- Authentication
- Voice system
- Socket implementation
- Folder structure

After understanding the project, automatically create the following documentation if it does not already exist.

---

## Create

### vision.md

Describe:

- Project vision
- Long-term goals
- User experience goals
- Design philosophy
- Target audience

---

### roadmap.md

Generate a complete roadmap.

Organize into:

- Immediate Tasks
- High Priority
- Medium Priority
- Low Priority
- Future Features

Every task should contain

- status
- description
- priority

Update this file continuously.

---

### progress.md

Maintain a development log.

Every coding session append

Date

Files changed

Features completed

Bugs fixed

Refactoring performed

Pending work

Next recommended task

---

### bugs.md

Automatically detect and list

UI bugs

Logic bugs

Socket bugs

Performance bugs

Rendering bugs

Voice bugs

Authentication bugs

Known limitations

Whenever one gets fixed

move it to

Fixed Bugs

---

### architecture.md

Document

Folder structure

State management

Routing

Authentication flow

Socket flow

Voice system

Component hierarchy

API structure

Database structure

Coding conventions

---

### decisions.md

Document important engineering decisions.

Explain WHY something was implemented.

Never leave undocumented major changes.

---

### changelog.md

Maintain semantic project history.

Version

Date

Features

Fixes

Breaking Changes

---

# Development Rules

Never destroy working functionality.

Improve existing code before rewriting.

Avoid unnecessary complexity.

Keep components reusable.

Remove dead code.

Remove duplicate code.

Split huge files.

Prefer custom hooks.

Prefer composition over large components.

Write production-quality code only.

No temporary hacks.

No placeholder implementations unless absolutely necessary.

---

# UI / UX

Transform the application into a premium experience.

Improve

Typography

Spacing

Animations

Transitions

Hover effects

Loading states

Responsive layouts

Dark mode

Visual hierarchy

Accessibility

Professional appearance

The final quality should feel comparable to Chess.com.

---

# Themes

Create a professional theme engine.

Support multiple board themes.

Allow switching themes.

Persist user selection.

---

# Chess Pieces

Replace current pieces.

Use premium SVG assets.

Support multiple piece styles.

Persist selected style.

---

# Voice First Experience

Voice is the PRIMARY interaction.

Desktop

Press V

Speak

Pawn e2 to e4

Knight f3 to g5

Queen d4 to d5

Castle kingside

Castle queenside

Capture on e5

Promote to Queen

Undo

Resign

Offer draw

Display

Microphone animation

Live transcript

Recognition status

Errors

Retry

Voice feedback

---

# Mobile Voice

Floating microphone button.

Tap

Speak move

Execute move

---

# Mouse

Mouse should NOT move pieces.

Mouse should only interact with

Menus

Buttons

Settings

Profile

Navigation

Dialogs

All chess moves must happen using voice.

---

# Authentication

Implement complete authentication.

Email Password

Google OAuth

JWT

Protected Routes

Persistent Login

Profile

Logout

Session recovery

---

# Multiplayer

Completely stabilize multiplayer.

Reliable room creation

Join room

Reconnect

Move synchronization

Timers

Rematch

Disconnect recovery

No duplicate moves

No desync

---

# Game Features

Captured pieces

Move history

Timers

Game analysis support

Undo (where appropriate)

Resign

Draw offer

Game result

PGN export

Future-ready architecture for spectators

---

# Performance

Reduce re-renders.

Memoize expensive operations.

Lazy loading.

Code splitting.

Optimized assets.

Efficient socket updates.

---

# Bug Fixing

While working, continuously search for

Visual bugs

Performance issues

Logic issues

Synchronization bugs

Voice issues

Animation issues

Memory leaks

Security issues

Fix them whenever safe.

Update bugs.md.

---

# Refactoring

Whenever code quality can be improved

Refactor it.

Document the reason.

Never refactor without purpose.

---

# Git Workflow

Work in small logical steps.

After every meaningful feature

Commit changes.

Use descriptive commit messages.

Do NOT accumulate huge uncommitted changes.

---

# Documentation

Keep every documentation file updated automatically.

Never let documentation become outdated.

---

# End Goal

Keep working until ChessBee feels like a polished commercial chess platform.

Do not stop after implementing only the requested feature.

Whenever obvious improvements exist, implement them if they align with the project's vision.

Always think like the lead engineer responsible for shipping the best possible version of ChessBee.
# Git Workflow (MANDATORY)

Git is a first-class part of this project.

Never allow work to accumulate without version control.

After EVERY meaningful change, automatically create a commit and push it to the remote repository.

Examples of meaningful changes include (but are not limited to):

- Creating a folder
- Deleting a folder
- Creating a file
- Deleting a file
- Renaming files
- Editing a component
- Fixing a bug
- Refactoring code
- Updating documentation
- Changing styles
- Adding assets
- Updating configuration
- Improving performance
- Adding tests
- Updating dependencies
- Improving accessibility

Use many small commits instead of large commits.

Prefer 5–20 line commits whenever practical.

Never combine unrelated changes into one commit.

Always use clear commit messages following Conventional Commits.

Examples:

feat: add voice command parser

fix: resolve room synchronization issue

refactor: split board component

style: improve login page spacing

docs: update roadmap

perf: reduce unnecessary renders

chore: reorganize assets

test: add socket integration tests

After every successful commit:

1. Verify the working tree is clean.
2. Push immediately to the remote repository.
3. Continue with the next task.

Do not wait until the end of the session to push changes.

The repository should always stay synchronized with the remote repository.

If a task is large, split it into many smaller commits and push after each completed step.

Git history should clearly tell the complete development story of ChessBee from start to finish.