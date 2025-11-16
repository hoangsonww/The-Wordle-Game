import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const WordleGame = lazy(() => import("./pages/WordleGame"));
const ConnectionsGame = lazy(() => import("./pages/ConnectionsGame"));
const SudokuGame = lazy(() => import("./pages/SudokuGame"));
const NumbersGame = lazy(() => import("./pages/NumbersGame"));
const Settings = lazy(() => import("./pages/Settings"));
const Statistics = lazy(() => import("./pages/Statistics"));

/**
 * App component is the main router component for the game hub.
 * It defines all routes with code splitting for optimal performance.
 */
export default function App() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <LoadingSpinner />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wordle" element={<WordleGame />} />
        <Route path="/connections" element={<ConnectionsGame />} />
        <Route path="/sudoku" element={<SudokuGame />} />
        <Route path="/numbers" element={<NumbersGame />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Suspense>
  );
}
