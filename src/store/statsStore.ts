import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameStats {
  wordle: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    averageGuesses: number;
    fastestWin: number;
  };
  connections: {
    played: number;
    won: number;
    perfectGames: number;
    averageMistakes: number;
    fastestWin: number;
  };
  sudoku: {
    played: number;
    won: number;
    averageMistakes: number;
    fastestWin: number;
  };
  numbers: {
    played: number;
    won: number;
    averageMoves: number;
    fastestWin: number;
  };
  memory: {
    played: number;
    won: number;
    averageMoves: number;
    fastestWin: number;
  };
  minesweeper: {
    played: number;
    won: number;
    averageMoves: number;
    fastestWin: number;
  };
}

const safeTime = (value: unknown) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) && num > 0 ? num : Infinity;
};

const mergeStats = (current: GameStats, incoming?: Partial<GameStats>) => ({
  ...current,
  ...incoming,
  wordle: {
    ...current.wordle,
    ...incoming?.wordle,
    fastestWin: safeTime(
      incoming?.wordle?.fastestWin ?? current.wordle.fastestWin,
    ),
  },
  connections: {
    ...current.connections,
    ...incoming?.connections,
    fastestWin: safeTime(
      incoming?.connections?.fastestWin ?? current.connections.fastestWin,
    ),
  },
  sudoku: {
    ...current.sudoku,
    ...incoming?.sudoku,
    fastestWin: safeTime(
      incoming?.sudoku?.fastestWin ?? current.sudoku.fastestWin,
    ),
  },
  numbers: {
    ...current.numbers,
    ...incoming?.numbers,
    fastestWin: safeTime(
      incoming?.numbers?.fastestWin ?? current.numbers.fastestWin,
    ),
  },
  memory: {
    ...current.memory,
    ...incoming?.memory,
    fastestWin: safeTime(
      incoming?.memory?.fastestWin ?? current.memory.fastestWin,
    ),
  },
  minesweeper: {
    ...current.minesweeper,
    ...incoming?.minesweeper,
    fastestWin: safeTime(
      incoming?.minesweeper?.fastestWin ?? current.minesweeper.fastestWin,
    ),
  },
});

const computeUnlockedIds = (stats: GameStats) => {
  const unlocked = new Set<string>();

  const totalWins =
    stats.wordle.won +
    stats.connections.won +
    stats.sudoku.won +
    stats.numbers.won +
    stats.memory.won +
    stats.minesweeper.won;
  if (totalWins >= 1) unlocked.add("first-win");

  if (stats.wordle.currentStreak >= 5) unlocked.add("streak-5");
  if (stats.wordle.currentStreak >= 10) unlocked.add("streak-10");

  if (
    stats.wordle.won >= 1 &&
    stats.connections.won >= 1 &&
    stats.sudoku.won >= 1 &&
    stats.numbers.won >= 1 &&
    stats.memory.won >= 1 &&
    stats.minesweeper.won >= 1
  ) {
    unlocked.add("all-games");
  }

  if (stats.connections.perfectGames >= 1) unlocked.add("perfect-connections");

  const fastestTime = Math.min(
    safeTime(stats.wordle.fastestWin),
    safeTime(stats.connections.fastestWin),
    safeTime(stats.sudoku.fastestWin),
    safeTime(stats.numbers.fastestWin),
    safeTime(stats.memory.fastestWin),
    safeTime(stats.minesweeper.fastestWin),
  );
  if (fastestTime < 60) unlocked.add("speed-demon");

  const totalPlayed =
    stats.wordle.played +
    stats.connections.played +
    stats.sudoku.played +
    stats.numbers.played +
    stats.memory.played +
    stats.minesweeper.played;
  if (totalPlayed >= 100) unlocked.add("century");

  if (stats.wordle.won >= 50) unlocked.add("wordle-master");

  return unlocked;
};

const reconcileAchievements = (
  stats: GameStats,
  achievements: Achievement[],
) => {
  const unlocked = computeUnlockedIds(stats);
  return achievements.map((achievement) => {
    if (unlocked.has(achievement.id)) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: achievement.unlockedAt ?? new Date(),
      };
    }
    return { ...achievement, unlocked: false, unlockedAt: undefined };
  });
};

interface StatsStore {
  stats: GameStats;
  achievements: Achievement[];

  // Start tracking
  recordWordleStart: () => void;
  recordConnectionsStart: () => void;
  recordSudokuStart: () => void;
  recordNumbersStart: () => void;
  recordMemoryStart: () => void;
  recordMinesweeperStart: () => void;

  // Wordle actions
  recordWordleGame: (won: boolean, guesses: number, time: number) => void;

  // Connections actions
  recordConnectionsGame: (won: boolean, mistakes: number, time: number) => void;

  // Sudoku actions
  recordSudokuGame: (won: boolean, mistakes: number, time: number) => void;

  // Numbers actions
  recordNumbersGame: (won: boolean, moves: number, time: number) => void;

  // Memory actions
  recordMemoryGame: (won: boolean, moves: number, time: number) => void;

  // Minesweeper actions
  recordMinesweeperGame: (won: boolean, moves: number, time: number) => void;

  // Achievement actions
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;

  // Utility
  resetStats: () => void;
}

const initialStats: GameStats = {
  wordle: {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    averageGuesses: 0,
    fastestWin: Infinity,
  },
  connections: {
    played: 0,
    won: 0,
    perfectGames: 0,
    averageMistakes: 0,
    fastestWin: Infinity,
  },
  sudoku: {
    played: 0,
    won: 0,
    averageMistakes: 0,
    fastestWin: Infinity,
  },
  numbers: {
    played: 0,
    won: 0,
    averageMoves: 0,
    fastestWin: Infinity,
  },
  memory: {
    played: 0,
    won: 0,
    averageMoves: 0,
    fastestWin: Infinity,
  },
  minesweeper: {
    played: 0,
    won: 0,
    averageMoves: 0,
    fastestWin: Infinity,
  },
};

const initialAchievements: Achievement[] = [
  {
    id: "first-win",
    name: "First Victory",
    description: "Win your first game",
    icon: "🎉",
    unlocked: false,
  },
  {
    id: "streak-5",
    name: "Hot Streak",
    description: "Win 5 games in a row",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "streak-10",
    name: "Unstoppable",
    description: "Win 10 games in a row",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "all-games",
    name: "Jack of All Trades",
    description: "Win at least one game of each type",
    icon: "🎮",
    unlocked: false,
  },
  {
    id: "perfect-connections",
    name: "Perfect Mind",
    description: "Win Connections with no mistakes",
    icon: "🧠",
    unlocked: false,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Win a game in under 60 seconds",
    icon: "💨",
    unlocked: false,
  },
  {
    id: "century",
    name: "Century Club",
    description: "Play 100 total games",
    icon: "💯",
    unlocked: false,
  },
  {
    id: "wordle-master",
    name: "Word Master",
    description: "Win 50 Wordle games",
    icon: "📝",
    unlocked: false,
  },
];

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      achievements: initialAchievements,

      recordWordleStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            wordle: {
              ...state.stats.wordle,
              played: state.stats.wordle.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordConnectionsStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            connections: {
              ...state.stats.connections,
              played: state.stats.connections.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordSudokuStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            sudoku: {
              ...state.stats.sudoku,
              played: state.stats.sudoku.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordNumbersStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            numbers: {
              ...state.stats.numbers,
              played: state.stats.numbers.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordMemoryStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            memory: {
              ...state.stats.memory,
              played: state.stats.memory.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordMinesweeperStart: () =>
        set((state) => {
          const newStats = {
            ...state.stats,
            minesweeper: {
              ...state.stats.minesweeper,
              played: state.stats.minesweeper.played + 1,
            },
          };
          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordWordleGame: (won, guesses, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.wordle.won++;
            newStats.wordle.currentStreak++;
            newStats.wordle.maxStreak = Math.max(
              newStats.wordle.maxStreak,
              newStats.wordle.currentStreak,
            );
            newStats.wordle.guessDistribution[guesses - 1]++;

            const totalGuesses = newStats.wordle.guessDistribution.reduce(
              (sum, count, idx) => sum + count * (idx + 1),
              0,
            );
            newStats.wordle.averageGuesses = totalGuesses / newStats.wordle.won;
            newStats.wordle.fastestWin = Math.min(
              safeTime(newStats.wordle.fastestWin),
              time,
            );
          } else {
            newStats.wordle.currentStreak = 0;
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordConnectionsGame: (won, mistakes, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.connections.won++;
            if (mistakes === 0) {
              newStats.connections.perfectGames++;
            }

            const totalMistakes =
              newStats.connections.averageMistakes *
                (newStats.connections.won - 1) +
              mistakes;
            newStats.connections.averageMistakes =
              totalMistakes / newStats.connections.won;
            newStats.connections.fastestWin = Math.min(
              safeTime(newStats.connections.fastestWin),
              time,
            );
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordSudokuGame: (won, mistakes, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.sudoku.won++;
            const totalMistakes =
              newStats.sudoku.averageMistakes * (newStats.sudoku.won - 1) +
              mistakes;
            newStats.sudoku.averageMistakes =
              totalMistakes / newStats.sudoku.won;
            newStats.sudoku.fastestWin = Math.min(
              safeTime(newStats.sudoku.fastestWin),
              time,
            );
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordNumbersGame: (won, moves, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.numbers.won++;
            const totalMoves =
              newStats.numbers.averageMoves * (newStats.numbers.won - 1) +
              moves;
            newStats.numbers.averageMoves = totalMoves / newStats.numbers.won;
            newStats.numbers.fastestWin = Math.min(
              safeTime(newStats.numbers.fastestWin),
              time,
            );
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordMemoryGame: (won, moves, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.memory.won++;
            const totalMoves =
              newStats.memory.averageMoves * (newStats.memory.won - 1) + moves;
            newStats.memory.averageMoves = totalMoves / newStats.memory.won;
            newStats.memory.fastestWin = Math.min(
              safeTime(newStats.memory.fastestWin),
              time,
            );
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      recordMinesweeperGame: (won, moves, time) =>
        set((state) => {
          const newStats = { ...state.stats };

          if (won) {
            newStats.minesweeper.won++;
            const totalMoves =
              newStats.minesweeper.averageMoves *
                (newStats.minesweeper.won - 1) +
              moves;
            newStats.minesweeper.averageMoves =
              totalMoves / newStats.minesweeper.won;
            newStats.minesweeper.fastestWin = Math.min(
              safeTime(newStats.minesweeper.fastestWin),
              time,
            );
          }

          setTimeout(() => get().checkAchievements(), 100);
          return { stats: newStats };
        }),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId && !a.unlocked
              ? { ...a, unlocked: true, unlockedAt: new Date() }
              : a,
          ),
        })),

      checkAchievements: () => {
        const state = get();
        const { stats, achievements } = state;

        // First Victory
        const totalWins =
          stats.wordle.won +
          stats.connections.won +
          stats.sudoku.won +
          stats.numbers.won +
          stats.memory.won +
          stats.minesweeper.won;
        if (
          totalWins >= 1 &&
          !achievements.find((a) => a.id === "first-win")?.unlocked
        ) {
          state.unlockAchievement("first-win");
        }

        // Hot Streak
        if (
          stats.wordle.currentStreak >= 5 &&
          !achievements.find((a) => a.id === "streak-5")?.unlocked
        ) {
          state.unlockAchievement("streak-5");
        }

        // Unstoppable
        if (
          stats.wordle.currentStreak >= 10 &&
          !achievements.find((a) => a.id === "streak-10")?.unlocked
        ) {
          state.unlockAchievement("streak-10");
        }

        // Jack of All Trades
        if (
          stats.wordle.won >= 1 &&
          stats.connections.won >= 1 &&
          stats.sudoku.won >= 1 &&
          stats.numbers.won >= 1 &&
          stats.memory.won >= 1 &&
          stats.minesweeper.won >= 1 &&
          !achievements.find((a) => a.id === "all-games")?.unlocked
        ) {
          state.unlockAchievement("all-games");
        }

        // Perfect Mind
        if (
          stats.connections.perfectGames >= 1 &&
          !achievements.find((a) => a.id === "perfect-connections")?.unlocked
        ) {
          state.unlockAchievement("perfect-connections");
        }

        // Speed Demon
        const fastestTime = Math.min(
          safeTime(stats.wordle.fastestWin),
          safeTime(stats.connections.fastestWin),
          safeTime(stats.sudoku.fastestWin),
          safeTime(stats.numbers.fastestWin),
          safeTime(stats.memory.fastestWin),
          safeTime(stats.minesweeper.fastestWin),
        );
        if (
          fastestTime < 60 &&
          !achievements.find((a) => a.id === "speed-demon")?.unlocked
        ) {
          state.unlockAchievement("speed-demon");
        }

        // Century Club
        const totalPlayed =
          stats.wordle.played +
          stats.connections.played +
          stats.sudoku.played +
          stats.numbers.played +
          stats.memory.played +
          stats.minesweeper.played;
        if (
          totalPlayed >= 100 &&
          !achievements.find((a) => a.id === "century")?.unlocked
        ) {
          state.unlockAchievement("century");
        }

        // Word Master
        if (
          stats.wordle.won >= 50 &&
          !achievements.find((a) => a.id === "wordle-master")?.unlocked
        ) {
          state.unlockAchievement("wordle-master");
        }
      },

      resetStats: () =>
        set({
          stats: initialStats,
          achievements: initialAchievements,
        }),
    }),
    {
      name: "puzzleforge-stats",
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as StatsStore) ?? currentState;
        const mergedStats = mergeStats(currentState.stats, persisted.stats);
        const mergedAchievements = reconcileAchievements(
          mergedStats,
          persisted.achievements ?? currentState.achievements,
        );
        return {
          ...currentState,
          ...persisted,
          stats: mergedStats,
          achievements: mergedAchievements,
        };
      },
    },
  ),
);
