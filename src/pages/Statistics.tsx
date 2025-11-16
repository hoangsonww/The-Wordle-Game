import { useStatsStore } from "../store/statsStore";
import Layout from "../components/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trophy, Target, Clock, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Statistics() {
  const { stats, achievements } = useStatsStore();

  const totalGamesPlayed = stats.wordle.played + stats.connections.played +
                           stats.sudoku.played + stats.numbers.played;
  const totalGamesWon = stats.wordle.won + stats.connections.won +
                        stats.sudoku.won + stats.numbers.won;
  const overallWinRate = totalGamesPlayed > 0 ? ((totalGamesWon / totalGamesPlayed) * 100).toFixed(1) : '0';

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const achievementProgress = ((unlockedAchievements / achievements.length) * 100).toFixed(0);

  // Chart data
  const gameDistribution = [
    { name: 'Wordle', played: stats.wordle.played, won: stats.wordle.won },
    { name: 'Connections', played: stats.connections.played, won: stats.connections.won },
    { name: 'Sudoku', played: stats.sudoku.played, won: stats.sudoku.won },
    { name: 'Numbers', played: stats.numbers.played, won: stats.numbers.won },
  ];

  const wordleGuessDistribution = stats.wordle.guessDistribution.map((count, idx) => ({
    guesses: idx + 1,
    count,
  }));

  const pieData = [
    { name: 'Wordle', value: stats.wordle.played, color: '#84cc16' },
    { name: 'Connections', value: stats.connections.played, color: '#a855f7' },
    { name: 'Sudoku', value: stats.sudoku.played, color: '#3b82f6' },
    { name: 'Numbers', value: stats.numbers.played, color: '#eab308' },
  ].filter(d => d.value > 0);

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Layout title="Statistics">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="text-yellow-400" size={32} />
              <span className="text-3xl font-extrabold">{totalGamesWon}</span>
            </div>
            <p className="text-sm text-gray-300">Total Wins</p>
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
            <p className="text-sm text-gray-300">Win Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-400" size={32} />
              <span className="text-3xl font-extrabold">{stats.wordle.currentStreak}</span>
            </div>
            <p className="text-sm text-gray-300">Current Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="text-purple-400" size={32} />
              <span className="text-3xl font-extrabold">{unlockedAchievements}/{achievements.length}</span>
            </div>
            <p className="text-sm text-gray-300">Achievements</p>
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
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
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
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Wordle Guess Distribution */}
        {stats.wordle.played > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-4">Wordle Guess Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wordleGuessDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="guesses" stroke="#fff" label={{ value: 'Number of Guesses', position: 'insideBottom', offset: -5, fill: '#fff' }} />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#84cc16" name="Games Won" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  {stats.wordle.played > 0 ? ((stats.wordle.won / stats.wordle.played) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Guesses:</span>
                <span className="font-bold">{stats.wordle.averageGuesses.toFixed(1)}</span>
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
                <span className="font-bold">{formatTime(stats.wordle.fastestWin)}</span>
              </div>
            </div>
          </div>

          {/* Connections Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Connections</h3>
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
                  {stats.connections.played > 0 ? ((stats.connections.won / stats.connections.played) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Games:</span>
                <span className="font-bold">{stats.connections.perfectGames}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Mistakes:</span>
                <span className="font-bold">{stats.connections.averageMistakes.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">{formatTime(stats.connections.fastestWin)}</span>
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
                  {stats.sudoku.played > 0 ? ((stats.sudoku.won / stats.sudoku.played) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Mistakes:</span>
                <span className="font-bold">{stats.sudoku.averageMistakes.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">{formatTime(stats.sudoku.fastestWin)}</span>
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
                  {stats.numbers.played > 0 ? ((stats.numbers.won / stats.numbers.played) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Moves:</span>
                <span className="font-bold">{stats.numbers.averageMoves.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Fastest:
                </span>
                <span className="font-bold">{formatTime(stats.numbers.fastestWin)}</span>
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
                <p className="text-xs text-gray-300">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
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
