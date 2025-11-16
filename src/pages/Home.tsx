import Layout from "../components/Layout";
import GameCard from "../components/GameCard";
import { Sparkles, Grid3x3, Calculator, GitBranch } from "lucide-react";

/**
 * Home page displays all available games in a grid layout
 */
export default function Home() {
  const games = [
    {
      title: "Wordle",
      description: "Guess the hidden 5-letter word in 6 tries. Classic word puzzle game!",
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
      description: "Fill the 9x9 grid with digits so each column, row, and 3x3 section contains 1-9.",
      icon: Grid3x3,
      path: "/sudoku",
      color: "blue",
    },
    {
      title: "Numbers",
      description: "Use mathematical operations to reach the target number. Daily brain teaser!",
      icon: Calculator,
      path: "/numbers",
      color: "yellow",
    },
  ];

  return (
    <Layout showBackButton={false}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 drop-shadow-2xl">
            🎮 Game Hub
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto">
            Challenge your mind with our collection of puzzle games. Pick your favorite and start playing!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {games.map((game) => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Your Gaming Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-4xl font-extrabold text-lime-400">{localStorage.getItem("wordle-wins") || "0"}</p>
              <p className="text-sm text-gray-300 mt-2">Wordle Wins</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-purple-400">{localStorage.getItem("connections-wins") || "0"}</p>
              <p className="text-sm text-gray-300 mt-2">Connections Solved</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-400">{localStorage.getItem("sudoku-wins") || "0"}</p>
              <p className="text-sm text-gray-300 mt-2">Sudoku Completed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-yellow-400">{localStorage.getItem("numbers-wins") || "0"}</p>
              <p className="text-sm text-gray-300 mt-2">Numbers Solved</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
