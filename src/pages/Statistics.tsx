import { useStatsStore } from "../store/statsStore";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Trophy, Target, Clock, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Statistics() {
  const { stats, achievements } = useStatsStore();

  const totalGamesPlayed =
    stats.wordle.played +
    stats.connections.played +
    stats.sudoku.played +
    stats.numbers.played +
    stats.memory.played +
    stats.minesweeper.played;
  const totalGamesWon =
    stats.wordle.won +
    stats.connections.won +
    stats.sudoku.won +
    stats.numbers.won +
    stats.memory.won +
    stats.minesweeper.won;
  const overallWinRate =
    totalGamesPlayed > 0
      ? ((totalGamesWon / totalGamesPlayed) * 100).toFixed(1)
      : "0";

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const achievementProgress = (
    (unlockedAchievements / achievements.length) *
    100
  ).toFixed(0);

  // Chart data
  const gameDistribution = [
    { name: "Wordle", played: stats.wordle.played, won: stats.wordle.won },
    {
      name: "Connections",
      played: stats.connections.played,
      won: stats.connections.won,
    },
    { name: "Sudoku", played: stats.sudoku.played, won: stats.sudoku.won },
    { name: "Numbers", played: stats.numbers.played, won: stats.numbers.won },
    { name: "Memory", played: stats.memory.played, won: stats.memory.won },
    {
      name: "Minesweeper",
      played: stats.minesweeper.played,
      won: stats.minesweeper.won,
    },
  ];

  const wordleGuessDistribution = stats.wordle.guessDistribution.map(
    (count, idx) => ({
      guesses: idx + 1,
      count,
    }),
  );

  const pieData = [
    { name: "Wordle", value: stats.wordle.played, color: "#84cc16" },
    { name: "Connections", value: stats.connections.played, color: "#a855f7" },
    { name: "Sudoku", value: stats.sudoku.played, color: "#3b82f6" },
    { name: "Numbers", value: stats.numbers.played, color: "#eab308" },
    { name: "Memory", value: stats.memory.played, color: "#f97316" },
    { name: "Minesweeper", value: stats.minesweeper.played, color: "#22d3ee" },
  ].filter((d) => d.value > 0);

  const winsPieData = [
    { name: "Wordle", value: stats.wordle.won, color: "#84cc16" },
    { name: "Connections", value: stats.connections.won, color: "#a855f7" },
    { name: "Sudoku", value: stats.sudoku.won, color: "#3b82f6" },
    { name: "Numbers", value: stats.numbers.won, color: "#eab308" },
    { name: "Memory", value: stats.memory.won, color: "#f97316" },
    { name: "Minesweeper", value: stats.minesweeper.won, color: "#22d3ee" },
  ].filter((d) => d.value > 0);

  const winRateData = [
    {
      name: "Wordle",
      rate:
        stats.wordle.played > 0
          ? (stats.wordle.won / stats.wordle.played) * 100
          : 0,
    },
    {
      name: "Connections",
      rate:
        stats.connections.played > 0
          ? (stats.connections.won / stats.connections.played) * 100
          : 0,
    },
    {
      name: "Sudoku",
      rate:
        stats.sudoku.played > 0
          ? (stats.sudoku.won / stats.sudoku.played) * 100
          : 0,
    },
    {
      name: "Numbers",
      rate:
        stats.numbers.played > 0
          ? (stats.numbers.won / stats.numbers.played) * 100
          : 0,
    },
    {
      name: "Memory",
      rate:
        stats.memory.played > 0
          ? (stats.memory.won / stats.memory.played) * 100
          : 0,
    },
    {
      name: "Minesweeper",
      rate:
        stats.minesweeper.played > 0
          ? (stats.minesweeper.won / stats.minesweeper.played) * 100
          : 0,
    },
  ];

  const averagePerformanceData = [
    { name: "Wordle", value: stats.wordle.averageGuesses },
    { name: "Connections", value: stats.connections.averageMistakes },
    { name: "Sudoku", value: stats.sudoku.averageMistakes },
    { name: "Numbers", value: stats.numbers.averageMoves },
    { name: "Memory", value: stats.memory.averageMoves },
    { name: "Minesweeper", value: stats.minesweeper.averageMoves },
  ];

  const fastestWinData = [
    {
      name: "Wordle",
      seconds: Number.isFinite(stats.wordle.fastestWin)
        ? stats.wordle.fastestWin
        : 0,
    },
    {
      name: "Connections",
      seconds: Number.isFinite(stats.connections.fastestWin)
        ? stats.connections.fastestWin
        : 0,
    },
    {
      name: "Sudoku",
      seconds: Number.isFinite(stats.sudoku.fastestWin)
        ? stats.sudoku.fastestWin
        : 0,
    },
    {
      name: "Numbers",
      seconds: Number.isFinite(stats.numbers.fastestWin)
        ? stats.numbers.fastestWin
        : 0,
    },
    {
      name: "Memory",
      seconds: Number.isFinite(stats.memory.fastestWin)
        ? stats.memory.fastestWin
        : 0,
    },
    {
      name: "Minesweeper",
      seconds: Number.isFinite(stats.minesweeper.fastestWin)
        ? stats.minesweeper.fastestWin
        : 0,
    },
  ];

  const radarData = [
    { game: "Wordle", played: stats.wordle.played },
    { game: "Connections", played: stats.connections.played },
    { game: "Sudoku", played: stats.sudoku.played },
    { game: "Numbers", played: stats.numbers.played },
    { game: "Memory", played: stats.memory.played },
    { game: "Minesweeper", played: stats.minesweeper.played },
  ];

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Layout title="Statistics">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="text-yellow-400" size={32} />
              <span className="text-3xl font-extrabold">{totalGamesWon}</span>
            </div>
            <p className="text-sm text-white">Total Wins</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="text-blue-400" size={32} />
              <span className="text-3xl font-extrabold">{overallWinRate}%</span>
            </div>
            <p className="text-sm text-white">Win Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-400" size={32} />
              <span className="text-3xl font-extrabold">
                {stats.wordle.currentStreak}
              </span>
            </div>
            <p className="text-sm text-white">Current Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="text-purple-400" size={32} />
              <span className="text-3xl font-extrabold">
                {unlockedAchievements}/{achievements.length}
              </span>
            </div>
            <p className="text-sm text-white">Achievements</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Games Played vs Won */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Games Played vs Won</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gameDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="played" fill="#60a5fa" name="Played" />
                <Bar dataKey="won" fill="#34d399" name="Won" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Game Distribution Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Game Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Win Rate by Game</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Bar dataKey="rate" fill="#38bdf8" name="Win Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Average Performance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={averagePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => value.toFixed(1)}
                />
                <Bar
                  dataKey="value"
                  fill="#f97316"
                  name="Avg (Guesses/Moves/Mistakes)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Fastest Wins (Seconds)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fastestWinData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) =>
                    value > 0 ? `${Math.round(value)}s` : "N/A"
                  }
                />
                <Bar dataKey="seconds" fill="#a855f7" name="Fastest" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Wins Distribution</h3>
            {winsPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={winsPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {winsPieData.map((entry, index) => (
                      <Cell key={`win-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm text-white/80">
                No wins yet.
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Engagement Radar</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="game" stroke="#fff" />
                <PolarRadiusAxis stroke="#fff" />
                <Radar
                  name="Played"
                  dataKey="played"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">
              Wordle Guess Distribution
            </h3>
            {stats.wordle.played > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={wordleGuessDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="guesses" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#84cc16" name="Games Won" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm text-white/80">
                Play Wordle to see this chart.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Wordle Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-lime-400">Wordle</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.wordle.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.wordle.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.wordle.played > 0
                    ? ((stats.wordle.won / stats.wordle.played) * 100).toFixed(
                        1,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Guesses:</span>
                <span className="font-bold">
                  {stats.wordle.averageGuesses.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Streak:</span>
                <span className="font-bold">{stats.wordle.maxStreak}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.wordle.fastestWin)}
                </span>
              </div>
            </div>
          </div>

          {/* Connections Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-purple-400">
              Connections
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.connections.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.connections.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.connections.played > 0
                    ? (
                        (stats.connections.won / stats.connections.played) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Games:</span>
                <span className="font-bold">
                  {stats.connections.perfectGames}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Mistakes:</span>
                <span className="font-bold">
                  {stats.connections.averageMistakes.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.connections.fastestWin)}
                </span>
              </div>
            </div>
          </div>

          {/* Sudoku Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-blue-400">Sudoku</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.sudoku.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.sudoku.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.sudoku.played > 0
                    ? ((stats.sudoku.won / stats.sudoku.played) * 100).toFixed(
                        1,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Mistakes:</span>
                <span className="font-bold">
                  {stats.sudoku.averageMistakes.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.sudoku.fastestWin)}
                </span>
              </div>
            </div>
          </div>

          {/* Numbers Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Numbers</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.numbers.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.numbers.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.numbers.played > 0
                    ? (
                        (stats.numbers.won / stats.numbers.played) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Moves:</span>
                <span className="font-bold">
                  {stats.numbers.averageMoves.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.numbers.fastestWin)}
                </span>
              </div>
            </div>
          </div>

          {/* Memory Match Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-orange-400">
              Memory Match
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.memory.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.memory.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.memory.played > 0
                    ? ((stats.memory.won / stats.memory.played) * 100).toFixed(
                        1,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Moves:</span>
                <span className="font-bold">
                  {stats.memory.averageMoves.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.memory.fastestWin)}
                </span>
              </div>
            </div>
          </div>

          {/* Minesweeper Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-cyan-300">
              Minesweeper
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Played:</span>
                <span className="font-bold">{stats.minesweeper.played}</span>
              </div>
              <div className="flex justify-between">
                <span>Won:</span>
                <span className="font-bold">{stats.minesweeper.won}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold">
                  {stats.minesweeper.played > 0
                    ? (
                        (stats.minesweeper.won / stats.minesweeper.played) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Moves:</span>
                <span className="font-bold">
                  {stats.minesweeper.averageMoves.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">
                  {formatTime(stats.minesweeper.fastestWin)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Achievements</h3>
            <div className="bg-purple-500/30 px-4 py-2 rounded-lg">
              <span className="font-bold">{achievementProgress}% Complete</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-xl text-center ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-500/30 to-purple-500/30 border-2 border-yellow-400"
                    : "bg-white/5 border-2 border-gray-600 opacity-50"
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold mb-1">{achievement.name}</h4>
                <p className="text-xs text-white">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Unlocked{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
