import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useStatsStore } from "../store/statsStore";

type Board = number[][];

/**
 * SudokuGame component - Fill the 9x9 grid with digits 1-9
 */
export default function SudokuGame() {
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [userBoard, setUserBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const startRef = useRef<number>(Date.now());
  const { recordSudokuGame, recordSudokuStart } = useStatsStore();

  useEffect(() => {
    // Fetch puzzle from API
    fetch("https://wordle-game-backend.vercel.app/api/sudoku/puzzle")
      .then((res) => res.json())
      .then((data) => {
        setPuzzle(data.puzzle);
        setSolution(data.solution);
        setUserBoard(data.puzzle.map((row: number[]) => [...row]));
        recordSudokuStart();
        startRef.current = Date.now();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching puzzle:", err);
        setError("Failed to load the game. Please refresh the page.");
        setLoading(false);
      });
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle && puzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || !userBoard || !puzzle || !solution) return;

    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return; // Can't change given numbers

    const newBoard = userBoard.map((r) => [...r]);
    newBoard[row][col] = num;
    setUserBoard(newBoard);

    // Check if correct
    if (num !== 0 && num !== solution[row][col]) {
      setMistakes(mistakes + 1);
    }

    // Check if puzzle is complete
    checkCompletion(newBoard);
  };

  const checkCompletion = (board: Board) => {
    if (!solution) return;

    // Check if board matches solution
    const isComplete = board.every((row, i) =>
      row.every((cell, j) => cell === solution[i][j]),
    );

    if (isComplete) {
      setGameWon(true);
      const elapsed = Math.max(
        1,
        Math.floor((Date.now() - startRef.current) / 1000),
      );
      recordSudokuGame(true, mistakes, elapsed);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!selectedCell) return;

    if (e.key >= "1" && e.key <= "9") {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
      handleNumberInput(0);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedCell, userBoard]);

  if (loading) {
    return (
      <Layout title="Sudoku">
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Sudoku">
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
      <Layout title="Sudoku">
        <div className="flex flex-col justify-center items-center py-12 px-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-4xl font-extrabold mb-4">🎉 Puzzle Solved!</h2>
            <p className="text-xl mb-2">Congratulations!</p>
            <p className="text-lg mb-6 text-white">Mistakes: {mistakes}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              New Puzzle
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Sudoku">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-lg text-white mb-2">
            Fill the 9×9 grid with digits 1-9
          </p>
          <p className="text-sm text-white">
            Each row, column, and 3×3 box must contain all digits
          </p>
          <div className="mt-3">
            <span className="bg-white/20 px-4 py-2 rounded-lg">
              Mistakes: {mistakes}
            </span>
          </div>
        </div>

        {/* Sudoku Board */}
        <div className="flex justify-center mb-6">
          <div className="inline-block bg-white/20 backdrop-blur-md p-2 rounded-lg">
            <div className="grid grid-cols-9 gap-0 border-4 border-white/50 rounded-lg overflow-hidden">
              {userBoard?.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                  const isGiven = puzzle && puzzle[rowIdx][colIdx] !== 0;
                  const isSelected =
                    selectedCell?.row === rowIdx &&
                    selectedCell?.col === colIdx;
                  const isInSameRow = selectedCell?.row === rowIdx;
                  const isInSameCol = selectedCell?.col === colIdx;
                  const isInSameBox =
                    selectedCell &&
                    Math.floor(rowIdx / 3) ===
                      Math.floor(selectedCell.row / 3) &&
                    Math.floor(colIdx / 3) === Math.floor(selectedCell.col / 3);

                  // Border classes for 3x3 boxes
                  const borderClasses = `
                    ${colIdx % 3 === 0 && colIdx !== 0 ? "border-l-2" : "border-l"}
                    ${rowIdx % 3 === 0 && rowIdx !== 0 ? "border-t-2" : "border-t"}
                    border-white/30
                  `;

                  return (
                    <button
                      key={`${rowIdx}-${colIdx}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                        flex items-center justify-center
                        text-sm sm:text-base md:text-lg font-bold
                        ${borderClasses}
                        ${
                          isSelected
                            ? "bg-blue-500/50"
                            : isInSameRow || isInSameCol || isInSameBox
                              ? "bg-white/10"
                              : "bg-white/5"
                        }
                        ${isGiven ? "text-white" : "text-blue-300"}
                        hover:bg-white/20
                        transition-colors
                      `}
                    >
                      {cell !== 0 ? cell : ""}
                    </button>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Number Input Buttons */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-lg transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberInput(0)}
            className="w-12 h-12 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg font-bold text-lg transition-all"
          >
            ×
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-white">
          <p>Click a cell and press a number (1-9) or use the buttons above</p>
          <p>Press Delete/Backspace to clear a cell</p>
        </div>
      </div>
    </Layout>
  );
}
