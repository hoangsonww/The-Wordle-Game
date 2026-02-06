# PuzzleForge Backend API

A small Express-based serverless backend for serving PuzzleForge game data, including Wordle-style random words, Connections groups, Sudoku puzzles, and Numbers targets.  
This backend:

- Fetches the full Wordle word list from GitHub on cold start
- Falls back to a built-in list of 108 common 5-letter words if the GitHub fetch fails
- Exposes primary endpoints:
  - `GET /api/random-word` → `{ word: "<5-letter word>" }`
  - `GET /api/word-valid/:word` → `{ valid: true|false }`
  - `GET /api/connections/puzzle` → `{ groups: [...] }`
  - `GET /api/sudoku/puzzle` → `{ puzzle: [...], solution: [...] }`
  - `GET /api/numbers/puzzle` → `{ numbers: [...], target: number }`
  - `GET /api/memory/puzzle` → `{ pairs: [...], difficulty: "easy|medium|hard" }`
  - `GET /api/minesweeper/board` → `{ width, height, minesCount, mines: [...] }`
- Serves Swagger/OpenAPI docs at `/api-docs` (with JSON at `/swagger.json`)
- Redirects `/` → `/api-docs`
- Serves a `favicon.ico` from `backend/favicon.ico`
- Is deployable to Vercel via the included `serverless-http` handler

---

## ⚙️ Prerequisites

- **Node.js** v16+
- **npm** (or yarn)
- (Optional) **Vercel CLI** for local emulation & deployment

---

## 🚀 Installation

1. **Clone** or **cd** into the `backend/` folder:

   ```bash
   cd path/to/your/project/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

---

## 🔧 Development

1. **Build** the TypeScript:

   ```bash
   npm run build
   ```

   This compiles `index.ts` → `dist/index.js`.

2. **Start** the local server:

   ```bash
   npm start
   ```

   By default it listens on `http://localhost:3001/api/`

3. **Test** the endpoints with `curl` (no shell comments or braces!):

   ```bash
   curl http://localhost:3001/api/random-word
   # → { "word": "apple" }

   curl http://localhost:3001/api/word-valid/hello
   # → { "valid": true }
   ```

4. **Browse** the API documentation:

   - JSON spec: `http://localhost:3001/api/swagger.json`
   - Swagger UI: `http://localhost:3001/api/api-docs`
   - Visiting `http://localhost:3001/api/` will redirect → `/api-docs`

---

## ⚙️ Configuration

No environment variables are required. The code will:

- Attempt to fetch `https://raw.githubusercontent.com/tabatkins/wordle-list/main/words` once
- Cache the resulting 5-letter words in memory
- Log success or fallback to console

---

## 📦 Deployment to Vercel

1. **Install** Vercel CLI (if you haven’t already):

   ```bash
   npm install -g vercel
   ```

2. From your **project root** (one level above `backend/`), run:

   ```bash
   vercel
   ```

   Vercel will detect `vercel.json` and deploy your Express function as a Serverless Function.

3. Once deployed, your two endpoints live at:

   ```
   https://<YOUR-VERCEL-APP>/api/random-word
   https://<YOUR-VERCEL-APP>/api/word-valid/<word>
   ```

   and your docs at:

   ```
   https://<YOUR-VERCEL-APP>/api/api-docs
   ```

---

## 🔍 Endpoints Summary

| Path                        | Method | Description                      |
| --------------------------- | :----: | -------------------------------- |
| `/api/random-word`          |  GET   | Returns a random 5-letter word   |
| `/api/word-valid/:word`     |  GET   | Checks if `:word` is in the list |
| `/api/swagger.json`         |  GET   | OpenAPI JSON spec                |
| `/api/api-docs`             |  GET   | Swagger UI documentation         |
| `/api/` _(root)_ → redirect |  GET   | Redirects to `/api-docs`         |

---

## 🛑 Troubleshooting

- **GitHub fetch fails** → you’ll see a console warning and the built-in 108-word fallback will be used.
- **Port conflicts** → set `PORT` environment variable before `npm start`.
- **TypeScript errors** → ensure you’re on Node.js v16+ and have run `npm install` in `backend/`.
