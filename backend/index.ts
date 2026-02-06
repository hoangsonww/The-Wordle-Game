import express from "express";
import cors from "cors";
import favicon from "serve-favicon";
import path from "path";

// ─── Inline OpenAPI/Swagger spec ────────────────────────────────────────────
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "PuzzleForge API",
    version: "2.0.0",
    description:
      "API endpoints for Wordle, Connections, Sudoku, Numbers, Memory Match, and Minesweeper.",
  },
  servers: [{ url: "https://wordle-game-backend.vercel.app/api/" }],
  paths: {
    "/random-word": {
      get: {
        summary: "Get a random 5-letter word",
        responses: {
          "200": {
            description: "A random word",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    word: { type: "string", example: "apple" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/word-valid/{word}": {
      get: {
        summary: "Check if a word is valid",
        parameters: [
          {
            name: "word",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Validity of the word",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/connections/puzzle": {
      get: {
        summary: "Get a Connections puzzle",
        responses: {
          "200": {
            description: "A Connections puzzle with groups",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    groups: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          category: { type: "string" },
                          words: { type: "array", items: { type: "string" } },
                          difficulty: { type: "string" },
                          color: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/sudoku/puzzle": {
      get: {
        summary: "Get a Sudoku puzzle",
        responses: {
          "200": {
            description: "A Sudoku puzzle and its solution",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    puzzle: { type: "array" },
                    solution: { type: "array" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/numbers/puzzle": {
      get: {
        summary: "Get a Numbers puzzle",
        responses: {
          "200": {
            description: "A Numbers puzzle with target",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    numbers: { type: "array", items: { type: "number" } },
                    target: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/memory/puzzle": {
      get: {
        summary: "Get a Memory Match puzzle",
        parameters: [
          {
            name: "difficulty",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["easy", "medium", "hard"] },
          },
        ],
        responses: {
          "200": {
            description: "A set of pairs for Memory Match",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pairs: { type: "array", items: { type: "string" } },
                    difficulty: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/minesweeper/board": {
      get: {
        summary: "Get a Minesweeper board",
        parameters: [
          {
            name: "difficulty",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["easy", "medium", "hard"] },
          },
        ],
        responses: {
          "200": {
            description: "A Minesweeper board with mine positions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    width: { type: "number" },
                    height: { type: "number" },
                    minesCount: { type: "number" },
                    mines: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          row: { type: "number" },
                          col: { type: "number" },
                        },
                      },
                    },
                    difficulty: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// ─── Backup list of 108 common 5-letter words ───────────────────────────────
const backupWords = [
  "about",
  "other",
  "which",
  "their",
  "there",
  "first",
  "would",
  "these",
  "click",
  "price",
  "state",
  "smith",
  "green",
  "house",
  "apple",
  "table",
  "chair",
  "world",
  "thing",
  "place",
  "never",
  "again",
  "every",
  "great",
  "small",
  "large",
  "money",
  "power",
  "heart",
  "light",
  "water",
  "dance",
  "laugh",
  "dream",
  "music",
  "movie",
  "party",
  "beach",
  "night",
  "happy",
  "visit",
  "thought",
  "friend",
  "peace",
  "earth",
  "ocean",
  "river",
  "sweet",
  "spice",
  "group",
  "begin",
  "bring",
  "carry",
  "check",
  "craft",
  "focus",
  "ghost",
  "honey",
  "ideal",
  "judge",
  "kneel",
  "magic",
  "nurse",
  "order",
  "phone",
  "queen",
  "round",
  "share",
  "trust",
  "union",
  "value",
  "watch",
  "yield",
  "zone",
  "birth",
  "claim",
  "drive",
  "fetch",
  "grant",
  "image",
  "joint",
  "knight",
  "layer",
  "metal",
  "offer",
  "pound",
  "quick",
  "rough",
  "super",
  "theme",
  "urban",
  "video",
  "whale",
  "xenon",
  "yacht",
  "zebra",
  "eager",
  "brave",
  "cheap",
  "doubt",
  "eagle",
  "fancy",
  "giant",
  "hotel",
  "issue",
  "jelly",
  "merry",
];

// In-memory cache
let validWords: Set<string> | null = null;

// ─── Fetch & cache the official list once (fallback on error) ───────────────
async function loadWordList() {
  if (validWords) return;
  const RAW =
    "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";
  try {
    const res = await fetch(RAW);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    validWords = new Set(
      text
        .split("\n")
        .map((w) => w.trim())
        .filter((w) => /^[a-z]{5}$/.test(w)),
    );
    console.log(`✅ Loaded ${validWords.size} words from GitHub.`);
  } catch (err) {
    console.error("⚠️  Could not fetch word list – using backup:", err);
    validWords = new Set(backupWords);
  }
}

const app = express();

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// serve the favicon placed at backend/favicon.ico
app.use(favicon(path.join(__dirname, "favicon.ico")));

// ensure word list is loaded
app.use(async (_req, _res, next) => {
  await loadWordList();
  next();
});

// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.get("/api/random-word", (_req, res) => {
  const arr = Array.from(validWords!);
  const word = arr[Math.floor(Math.random() * arr.length)];
  res.json({ word });
});

app.get("/api/word-valid/:word", (req, res) => {
  const guess = String(req.params.word).toLowerCase();
  res.json({ valid: validWords!.has(guess) });
});

// ─── CONNECTIONS GAME ───────────────────────────────────────────────────────
const connectionsPuzzles = [
  {
    groups: [
      {
        category: "Types of Fruit",
        words: ["APPLE", "BANANA", "ORANGE", "GRAPE"],
        difficulty: "easy",
        color: "lime",
      },
      {
        category: "Programming Languages",
        words: ["PYTHON", "JAVA", "RUBY", "SWIFT"],
        difficulty: "medium",
        color: "yellow",
      },
      {
        category: "US States",
        words: ["TEXAS", "FLORIDA", "NEVADA", "MAINE"],
        difficulty: "hard",
        color: "orange",
      },
      {
        category: "Words that follow 'FIRE'",
        words: ["PLACE", "WORKS", "FLY", "BALL"],
        difficulty: "tricky",
        color: "purple",
      },
    ],
  },
  {
    groups: [
      {
        category: "Coffee Drinks",
        words: ["LATTE", "MOCHA", "ESPRESSO", "CAPPUCCINO"],
        difficulty: "easy",
        color: "lime",
      },
      {
        category: "Precious Gems",
        words: ["DIAMOND", "RUBY", "EMERALD", "SAPPHIRE"],
        difficulty: "medium",
        color: "yellow",
      },
      {
        category: "Web Browsers",
        words: ["CHROME", "SAFARI", "FIREFOX", "EDGE"],
        difficulty: "hard",
        color: "orange",
      },
      {
        category: "___BOARD",
        words: ["CARD", "KEY", "CLIP", "SCORE"],
        difficulty: "tricky",
        color: "purple",
      },
    ],
  },
  {
    groups: [
      {
        category: "Days of the Week",
        words: ["MONDAY", "TUESDAY", "FRIDAY", "SUNDAY"],
        difficulty: "easy",
        color: "lime",
      },
      {
        category: "Chess Pieces",
        words: ["KING", "QUEEN", "ROOK", "BISHOP"],
        difficulty: "medium",
        color: "yellow",
      },
      {
        category: "Social Media",
        words: ["TWITTER", "FACEBOOK", "INSTAGRAM", "TIKTOK"],
        difficulty: "hard",
        color: "orange",
      },
      {
        category: "Things that Ring",
        words: ["BELL", "PHONE", "ALARM", "DOORBELL"],
        difficulty: "tricky",
        color: "purple",
      },
    ],
  },
];

app.get("/api/connections/puzzle", (_req, res) => {
  const puzzle =
    connectionsPuzzles[Math.floor(Math.random() * connectionsPuzzles.length)];
  res.json(puzzle);
});

// ─── SUDOKU GAME ────────────────────────────────────────────────────────────
function generateSudoku() {
  // Pre-generated valid sudoku puzzles (puzzle, solution pairs)
  const puzzles = [
    {
      puzzle: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
    },
    {
      puzzle: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
      ],
      solution: [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9],
      ],
    },
  ];

  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

app.get("/api/sudoku/puzzle", (_req, res) => {
  const puzzle = generateSudoku();
  res.json(puzzle);
});

// ─── NUMBERS GAME ───────────────────────────────────────────────────────────
function generateNumbersPuzzle() {
  const puzzles = [
    { numbers: [3, 5, 7, 10, 25, 50], target: 347 },
    { numbers: [2, 4, 6, 8, 10, 12], target: 48 },
    { numbers: [1, 3, 5, 10, 25, 100], target: 156 },
    { numbers: [5, 6, 7, 8, 9, 10], target: 432 },
    { numbers: [2, 3, 4, 5, 25, 50], target: 237 },
    { numbers: [1, 2, 3, 4, 5, 10], target: 42 },
  ];

  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

app.get("/api/numbers/puzzle", (_req, res) => {
  const puzzle = generateNumbersPuzzle();
  res.json(puzzle);
});

// ─── MEMORY MATCH GAME ──────────────────────────────────────────────────────
const memorySymbols = [
  "COMET",
  "CROWN",
  "ORBIT",
  "PLUME",
  "GLYPH",
  "EMBER",
  "QUILL",
  "NOVA",
  "FABLE",
  "RIDGE",
  "PULSE",
  "VAULT",
  "MIRAGE",
  "PRISM",
  "AXIS",
  "VIVID",
  "FLARE",
  "RUNE",
];

function getDifficulty(queryValue: unknown) {
  const value = String(queryValue || "").toLowerCase();
  if (value === "easy" || value === "medium" || value === "hard") {
    return value as "easy" | "medium" | "hard";
  }
  return "medium";
}

function generateMemoryPuzzle(difficulty: "easy" | "medium" | "hard") {
  const counts = { easy: 6, medium: 8, hard: 10 };
  const pairsCount = counts[difficulty] ?? counts.medium;
  const shuffled = [...memorySymbols].sort(() => Math.random() - 0.5);
  return {
    pairs: shuffled.slice(0, pairsCount),
    difficulty,
  };
}

app.get("/api/memory/puzzle", (req, res) => {
  const difficulty = getDifficulty(req.query.difficulty);
  const puzzle = generateMemoryPuzzle(difficulty);
  res.json(puzzle);
});

// ─── MINESWEEPER GAME ───────────────────────────────────────────────────────
function generateMinesweeperBoard(difficulty: "easy" | "medium" | "hard") {
  const configs = {
    easy: { width: 9, height: 9, mines: 10 },
    medium: { width: 12, height: 12, mines: 20 },
    hard: { width: 16, height: 16, mines: 40 },
  };
  const config = configs[difficulty] ?? configs.medium;
  const positions = new Set<string>();

  while (positions.size < config.mines) {
    const row = Math.floor(Math.random() * config.height);
    const col = Math.floor(Math.random() * config.width);
    positions.add(`${row},${col}`);
  }

  const mines = Array.from(positions).map((pos) => {
    const [row, col] = pos.split(",").map(Number);
    return { row, col };
  });

  return {
    width: config.width,
    height: config.height,
    minesCount: config.mines,
    mines,
    difficulty,
  };
}

app.get("/api/minesweeper/board", (req, res) => {
  const difficulty = getDifficulty(req.query.difficulty);
  const board = generateMinesweeperBoard(difficulty);
  res.json(board);
});

app.get("/swagger.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.get("/api-docs", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PuzzleForge API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css" />
  <link rel="icon" href="/favicon.ico" />
  <style>body{margin:0}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`);
});

// redirect root → docs
app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

// ─── EXPORT FOR VERCEL ────────────────────────────────────────────────────────
// express `app` is itself a `(req, res) => void` handler,
// so Vercel’s Node builder will invoke it on every request.
export default app;
