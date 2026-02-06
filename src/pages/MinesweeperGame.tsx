import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStatsStore } from "../store/statsStore";
import { Bomb, Flag, RefreshCw, MousePointer2 } from "lucide-react";

interface MinesweeperResponse {
  width: number;
  height: number;
  mines: { row: number; col: number }[];
  minesCount?: number;
  difficulty: "easy" | "medium" | "hard";
}

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
}

const numberColors: Record<number, string> = {
  1: "text-blue-300",
  2: "text-green-300",
  3: "text-red-300",
  4: "text-purple-300",
  5: "text-orange-300",
  6: "text-cyan-300",
  7: "text-pink-300",
  8: "text-white",
};

function buildBoard(data: MinesweeperResponse) {
  const mineSet = new Set(data.mines.map((m) => `${m.row},${m.col}`));
  const board: Cell[][] = Array.from({ length: data.height }, (_, row) =>
    Array.from({ length: data.width }, (_, col) => ({
      row,
      col,
      isMine: mineSet.has(`${row},${col}`),
      adjacent: 0,
      revealed: false,
      flagged: false,
    })),
  );

  const directions = [-1, 0, 1];
  for (let r = 0; r < data.height; r++) {
    for (let c = 0; c < data.width; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      directions.forEach((dr) => {
        directions.forEach((dc) => {
          if (dr === 0 && dc === 0) return;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < data.height && nc >= 0 && nc < data.width) {
            if (board[nr][nc].isMine) count++;
          }
        });
      });
      board[r][c].adjacent = count;
    }
  }

  return board;
}

export default function MinesweeperGame() {
  const { recordMinesweeperGame, recordMinesweeperStart } = useStatsStore();

  const [board, setBoard] = useState<Cell[][]>([]);
  const [minesCount, setMinesCount] = useState(0);
  const [flags, setFlags] = useState(0);
  const [moves, setMoves] = useState(0);
  const [revealedSafe, setRevealedSafe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const startRef = useRef(0);

  const loadBoard = () => {
    setLoading(true);
    setError("");
    setGameOver(false);
    setGameWon(false);
    setFlags(0);
    setMoves(0);
    setRevealedSafe(0);

    fetch("https://wordle-game-backend.vercel.app/api/minesweeper/board")
      .then((res) => res.json())
      .then((data: MinesweeperResponse) => {
        const nextBoard = buildBoard(data);
        setBoard(nextBoard);
        setMinesCount(data.minesCount ?? data.mines.length);
        recordMinesweeperStart();
        startRef.current = Date.now();
        setElapsed(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching minesweeper board:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBoard();
  }, []);

  useEffect(() => {
    if (loading || gameOver || gameWon) return;
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [loading, gameOver, gameWon]);

  const revealAllMines = (working: Cell[][]) => {
    return working.map((row) =>
      row.map((cell) => (cell.isMine ? { ...cell, revealed: true } : cell)),
    );
  };

  const handleReveal = (row: number, col: number) => {
    if (loading || gameOver || gameWon) return;
    const current = board[row]?.[col];
    if (!current || current.revealed || current.flagged) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);

    if (current.isMine) {
      const exploded = revealAllMines(board);
      setBoard(exploded);
      setGameOver(true);
      const finalTime = Math.max(
        1,
        Math.floor((Date.now() - startRef.current) / 1000),
      );
      recordMinesweeperGame(false, nextMoves, finalTime);
      return;
    }

    const nextBoard = board.map((rowCells) =>
      rowCells.map((cell) => ({ ...cell })),
    );
    const queue: Array<[number, number]> = [[row, col]];
    let revealedNow = 0;

    while (queue.length) {
      const [r, c] = queue.pop()!;
      const cell = nextBoard[r][c];
      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;
      revealedNow++;

      if (cell.adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < nextBoard.length &&
              nc >= 0 &&
              nc < nextBoard[0].length
            ) {
              const neighbor = nextBoard[nr][nc];
              if (!neighbor.revealed && !neighbor.isMine) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    setBoard(nextBoard);
    const totalSafe = nextBoard.length * nextBoard[0].length - minesCount;
    const nextRevealed = revealedSafe + revealedNow;
    setRevealedSafe(nextRevealed);

    if (nextRevealed >= totalSafe) {
      const finalTime = Math.max(
        1,
        Math.floor((Date.now() - startRef.current) / 1000),
      );
      setGameWon(true);
      recordMinesweeperGame(true, nextMoves, finalTime);
    }
  };

  const toggleFlag = (row: number, col: number) => {
    if (loading || gameOver || gameWon) return;
    const current = board[row]?.[col];
    if (!current || current.revealed) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);

    const nextBoard = board.map((rowCells) =>
      rowCells.map((cell) => ({ ...cell })),
    );
    const cell = nextBoard[row][col];
    cell.flagged = !cell.flagged;
    setBoard(nextBoard);
    setFlags((prev) => prev + (cell.flagged ? 1 : -1));
  };

  const handleCellClick = (row: number, col: number) => {
    if (flagMode) {
      toggleFlag(row, col);
    } else {
      handleReveal(row, col);
    }
  };

  if (loading) {
    return (
      <Layout title="Minesweeper">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Minesweeper">
        <div className="flex justify-center items-center h-96">
          <div className="bg-red-500/20 p-6 rounded-lg text-white">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (gameWon) {
    return (
      <Layout title="Minesweeper">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">Minefield Cleared!</h2>
            <p className="text-xl mb-2">Moves: {moves}</p>
            <p className="text-lg mb-6 text-white">Time: {elapsed}s</p>
            <button
              onClick={loadBoard}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              New Board
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (gameOver) {
    return (
      <Layout title="Minesweeper">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">Boom!</h2>
            <p className="text-xl mb-2">You triggered a mine.</p>
            <p className="text-lg mb-6 text-white">Moves: {moves}</p>
            <button
              onClick={loadBoard}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Minesweeper">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bomb className="text-cyan-300" size={28} />
            <p className="text-lg text-white">
              Reveal every safe tile without hitting a mine.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white mt-4">
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Mines: {minesCount - flags}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Moves: {moves}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-lg">
              Time: {elapsed}s
            </span>
            <button
              onClick={() => setFlagMode((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                flagMode
                  ? "bg-cyan-500 text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {flagMode ? <Flag size={16} /> : <MousePointer2 size={16} />}
              {flagMode ? "Flag Mode" : "Reveal Mode"}
            </button>
            <button
              onClick={loadBoard}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              New Board
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="grid gap-1 bg-white/10 p-3 rounded-2xl border border-white/20"
            style={{
              gridTemplateColumns: `repeat(${board[0]?.length ?? 0}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row) =>
              row.map((cell) => {
                const isRevealed = cell.revealed;
                const baseClasses =
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-lg text-sm sm:text-base font-bold";
                const revealedClasses = cell.isMine
                  ? "bg-red-500/40 text-red-200"
                  : "bg-white/20 text-white";
                const hiddenClasses =
                  "bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30";

                return (
                  <button
                    key={`${cell.row}-${cell.col}`}
                    onClick={() => handleCellClick(cell.row, cell.col)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleFlag(cell.row, cell.col);
                    }}
                    className={`${baseClasses} ${isRevealed ? revealedClasses : hiddenClasses}`}
                  >
                    {cell.flagged && !isRevealed && (
                      <Flag size={14} className="text-cyan-200" />
                    )}
                    {isRevealed && cell.isMine && <Bomb size={16} />}
                    {isRevealed && !cell.isMine && cell.adjacent > 0 && (
                      <span
                        className={numberColors[cell.adjacent] ?? "text-white"}
                      >
                        {cell.adjacent}
                      </span>
                    )}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
