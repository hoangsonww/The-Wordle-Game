import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import GameCard from "../components/GameCard";
import {
  Sparkles,
  Grid3x3,
  Calculator,
  GitBranch,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  Brain,
  Bomb,
} from "lucide-react";
import { useStatsStore } from "../store/statsStore";
import { motion } from "framer-motion";

/**
 * Home page displays all available games in a grid layout
 */
export default function Home() {
  const { stats, achievements } = useStatsStore();

  const games = [
    {
      title: "Wordle",
      description:
        "Guess the hidden 5-letter word in 6 tries. Classic word puzzle game!",
      icon: Sparkles,
      path: "/wordle",
      color: "lime",
    },
    {
      title: "Connections",
      description: "Find groups of four items that share something in common.",
      icon: GitBranch,
      path: "/connections",
      color: "purple",
    },
    {
      title: "Sudoku",
      description:
        "Fill the 9×9 grid with digits so each column, row, and 3×3 section contains 1-9.",
      icon: Grid3x3,
      path: "/sudoku",
      color: "blue",
    },
    {
      title: "Numbers",
      description:
        "Use mathematical operations to reach the target number. Daily brain teaser!",
      icon: Calculator,
      path: "/numbers",
      color: "yellow",
    },
    {
      title: "Memory Match",
      description:
        "Flip cards, find pairs, and clear the board with the fewest moves.",
      icon: Brain,
      path: "/memory",
      color: "orange",
    },
    {
      title: "Minesweeper",
      description:
        "Reveal safe tiles, flag mines, and clear the grid without detonating.",
      icon: Bomb,
      path: "/minesweeper",
      color: "cyan",
    },
  ];

  // UI-only calculations (frontend only)
  const totalWins =
    stats.wordle.won +
    stats.connections.won +
    stats.sudoku.won +
    stats.numbers.won +
    stats.memory.won +
    stats.minesweeper.won;
  const totalPlayed =
    stats.wordle.played +
    stats.connections.played +
    stats.sudoku.played +
    stats.numbers.played +
    stats.memory.played +
    stats.minesweeper.played;
  const winRate =
    totalPlayed > 0 ? ((totalWins / totalPlayed) * 100).toFixed(1) : "0";
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <Layout showBackButton={false}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-0 pb-6 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">
            🧩 PuzzleForge
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-white leading-relaxed">
            Forge your mind with word, logic, and number puzzles. Track your
            progress and unlock achievements.
          </p>
        </motion.div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-yellow-400/30 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Trophy
              className="mx-auto mb-2 text-yellow-400 drop-shadow-lg"
              size={32}
            />
            <p className="text-2xl sm:text-3xl font-extrabold">{totalWins}</p>
            <p className="text-xs sm:text-sm mt-1 text-white">Total Wins</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-blue-400/30 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Target
              className="mx-auto mb-2 text-blue-400 drop-shadow-lg"
              size={32}
            />
            <p className="text-2xl sm:text-3xl font-extrabold">{winRate}%</p>
            <p className="text-xs sm:text-sm mt-1 text-white">Win Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-green-400/30 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <TrendingUp
              className="mx-auto mb-2 text-green-400 drop-shadow-lg"
              size={32}
            />
            <p className="text-2xl sm:text-3xl font-extrabold">
              {stats.wordle.currentStreak}
            </p>
            <p className="text-xs sm:text-sm mt-1 text-white">Current Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-purple-400/30 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Trophy
              className="mx-auto mb-2 text-purple-400 drop-shadow-lg"
              size={32}
            />
            <p className="text-2xl sm:text-3xl font-extrabold">
              {unlockedAchievements}/{achievements.length}
            </p>
            <p className="text-xs sm:text-sm mt-1 text-white">Achievements</p>
          </motion.div>
        </div>

        {/* View Statistics Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            to="/statistics"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
          >
            <BarChart3 size={24} />
            View Detailed Statistics
          </Link>
        </motion.div>

        {/* Games Grid */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Choose Your Puzzle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {games.map((game, idx) => (
              <motion.div
                key={game.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Individual Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Your Game Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 rounded-2xl bg-lime-500/10 border border-lime-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-lime-400">
                {stats.wordle.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Wordle Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.wordle.played} played
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-purple-500/10 border border-purple-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">
                {stats.connections.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Connections Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.connections.played} played
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">
                {stats.sudoku.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Sudoku Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.sudoku.played} played
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-yellow-500/10 border border-yellow-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-yellow-400">
                {stats.numbers.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Numbers Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.numbers.played} played
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-orange-500/10 border border-orange-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-400">
                {stats.memory.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Memory Match Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.memory.played} played
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
                {stats.minesweeper.won}
              </p>
              <p className="text-sm sm:text-base mt-2 font-semibold">
                Minesweeper Wins
              </p>
              <p className="text-xs text-white mt-1">
                {stats.minesweeper.played} played
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
