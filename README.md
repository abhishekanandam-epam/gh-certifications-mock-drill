# GH Certifications Mock Drill

A practice app for GitHub certification exams (starting with GH-300, with more certifications
such as GH-600 planned): timed mock exams and instant-feedback practice sessions across topic
domains, with local score history and weak-area tracking (all progress stored in your browser via
localStorage, scoped per certification).

> Question banks are original content written for this project, inspired by public GitHub
> documentation topics — they do not reuse content from any third-party question bank.

## Run locally

```powershell
npm run install:all   # installs server + client dependencies
npm run dev            # starts the API (port 4000) and the Vite client (port 5173)
```

Open http://localhost:5173

## Project structure

- `server/` — Express API serving the question bank(s). Certifications are listed in
  `server/data/certifications.json`, and each certification's questions/domains live under
  `server/data/certifications/<cert-id>/` (e.g. `certifications/gh-300/questions.json`).
- `client/` — React + TypeScript (Vite) app: Practice mode, Mock Exam mode, History, Dashboard,
  with a certification switcher in the nav bar.

## Adding a new certification

1. Add an entry to `server/data/certifications.json` with a unique `id` (e.g. `gh-600`).
2. Create `server/data/certifications/<id>/domains.json` and `questions.json` following the
   same shape as the `gh-300` files.
3. Restart the server — the new certification appears automatically in the client's switcher.

## Build for production

```powershell
npm run build
```

