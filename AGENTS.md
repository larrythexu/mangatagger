# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
MangaTagger is a Next.js (App Router) web game where the user guesses a manga’s genres from its cover image.

## Common commands (pnpm)
Install deps:
- `pnpm install`

Run locally:
- `pnpm dev` (Next dev server)

Production build/run:
- `pnpm build`
- `pnpm start`

Lint:
- `pnpm lint` (runs `eslint`)

Typecheck (no script defined, but TypeScript is configured):
- `pnpm exec tsc --noEmit`

Tests:
- No test runner/config is currently present in `package.json`.

## Key architecture (big picture)
### Routing / page composition (Next App Router)
- `app/layout.tsx`: root layout, global fonts, includes `app/globals.css`.
- `app/page.tsx`: home page; renders `components/GameMenu`.

### UI components (client)
The interactive game UI is implemented as client components (they use `"use client"`), so game state and logic currently run in the browser.
- `components/GameMenu.tsx`: main game container; loads persisted state, displays daily manga cover via `next/image`, and calls the core game logic.
- `components/StatusDisplay.tsx`: shows remaining lives/guesses and already-guessed genres.
- `components/GuessForm.tsx`: stubbed/unfinished.

### Game domain logic (lib)
- `lib/gameService.ts`: core game loop/state transitions.
  - `loadGame()` loads persisted state or calls `initGame()`.
  - `submitAnswer(...)` validates guesses, updates `GameState`, and persists.
  - `getAnswer()` computes the daily answer set from the daily manga’s genres and caches it in-memory.
- `lib/storage.ts`: localStorage persistence (`mangatagger-state`).
  - Note: `GameState` includes `Set`s (`guessedGenres`, `remainingGenres`). JSON serialization via `JSON.stringify` will not preserve `Set` values without custom conversion.

### Daily manga selection + data
- `lib/mangaService.ts`: chooses the daily manga deterministically from `data/top500manga.json` using the UTC day-of-year index.
- `data/top500manga.json`: shuffled list of manga entries (expected shape: `{ "data": Manga[] }`).
- `data/genres.json`: allowed genre strings (lowercase) used for validation.
- `types/index.ts`: shared TypeScript types (`Manga`, `GameState`, `answerResult`). Also defines the data shape expected from `data/top500manga.json`.

### External image loading
- `next.config.ts` allows cover images from MyAnimeList’s CDN via `images.remotePatterns`.

## Updating the manga dataset
There is a fetch script that hits the MyAnimeList API:
- `scripts/fetch_manga.py`

It expects an environment variable:
- `MAL_API_KEY` (used as `X-MAL-CLIENT-ID`)

Run (from repo root):
- `MAL_API_KEY=... python3 scripts/fetch_manga.py`

Notes:
- The script depends on the Python `requests` package.
- `lib/mangaService.ts` currently expects `data/top500manga.json` to be an object with a top-level `data` field; ensure the fetch script output matches this shape when modifying it.
