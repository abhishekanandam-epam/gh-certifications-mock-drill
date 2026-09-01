# Copilot Instructions

## Project Snapshot
- This is a GitHub certifications mock-drill app with a React + TypeScript Vite client in `client/` and an Express + TypeScript API in `server/`.
- The app is now generic across certifications. Avoid reintroducing `gh-300` assumptions outside the current seed data under `server/data/certifications/gh-300/`.
- Progress and history are browser-local only; there is no database. Storage is scoped per certification in `client/src/lib/storage.ts`.

## Commands
- Install both workspaces from the root: `npm run install:all`.
- Run locally from the root: `npm run dev` starts the API on port 4000 and the Vite client on port 5173.
- Build the client from the root: `npm run build`.
- Client-only checks: `cd client; npm run build` and `cd client; npm run lint`.
- Server-only build: `cd server; npm run build`.

## Architecture And Data Flow
- `server/src/index.ts` owns API routing, mode-specific question selection, and Express startup.
- `server/src/data.ts` loads static JSON from `server/data/` and caches domains/questions per certification.
- `server/src/config.ts` defines mode defaults and limits. Keep `/api/modes` and this config aligned if mode behavior changes.
- `client/src/lib/api.ts` is the client API boundary. The Vite dev server proxies `/api` to `http://localhost:4000` via `client/vite.config.ts`.
- `client/src/lib/certification.tsx` owns selected-certification state and syncs it to localStorage.
- `client/src/lib/grading.ts` supports single-answer and multi-answer questions; do not assume only one correct answer.

## Certification Data Contract
- Register each certification in `server/data/certifications.json` with `id`, `name`, `shortName`, and `description`.
- Add per-certification files under `server/data/certifications/<cert-id>/domains.json` and `questions.json`.
- Domain records use `id`, `name`, and `description`.
- Question records use `id`, `domain`, `question`, `options`, `correctAnswers`, `explanation`, and `difficulty` (`easy`, `medium`, or `hard`). `correctAnswers` stores zero-based option indices and may contain multiple entries.
- When adding or renaming domain IDs, update both `domains.json` and every matching question `domain` value.

## UI And State Conventions
- Main screens live in `client/src/pages/`; reusable display pieces live in `client/src/components/`.
- Keep saved attempts and practice sessions certification-scoped using the existing `ghcert.<certId>.*` localStorage pattern.
- The pass threshold is defined in `client/src/lib/grading.ts`; use that constant instead of duplicating the value.
- Preserve the current quiet app style in `client/src/App.css` and `client/src/index.css` unless a design task explicitly asks for a visual refresh.

## Documentation To Link
- Use [README.md](../README.md) for the local quickstart, project layout, and steps to add a certification.
- Use [MODE_CONFIGURATION.md](../MODE_CONFIGURATION.md) for practice/exam mode behavior and current GH-300 distribution details.
- Use [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) and [QUESTIONS_UPDATE_SUMMARY.md](../QUESTIONS_UPDATE_SUMMARY.md) for historical context on the seeded question bank.
- Some older docs may still mention the previous `gh-300-mock-drill` path or GH-300-specific wording. Treat the generic `gh-certifications-mock-drill` structure as canonical.

## Working Guidelines
- Keep server/client contracts aligned: update `server/src/types.ts`, `client/src/types.ts`, and `client/src/lib/api.ts` together when API shapes change.
- Validate data-shape changes with `cd server; npm run build` and validate UI/API contract changes with `cd client; npm run build`.
- Do not edit generated build output or dependency folders.
- Keep question-bank edits as structured JSON changes, not ad hoc string rewrites.