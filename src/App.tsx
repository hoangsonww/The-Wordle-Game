import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WordleGame from "./pages/WordleGame";
import ConnectionsGame from "./pages/ConnectionsGame";
import SudokuGame from "./pages/SudokuGame";
import NumbersGame from "./pages/NumbersGame";

/**
 * App component is the main router component for the game hub.
 * It defines all routes for the different games available.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wordle" element={<WordleGame />} />
      <Route path="/connections" element={<ConnectionsGame />} />
      <Route path="/sudoku" element={<SudokuGame />} />
      <Route path="/numbers" element={<NumbersGame />} />
    </Routes>
  );
}
