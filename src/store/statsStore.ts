import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

interface StatsStore {
  stats: GameStats;
  achievements: Achievement[];

  // Wordle actions
  recordWordleGame: (won: boolean, guesses: number, time: number) => void;

  // Connections actions
  recordConnectionsGame: (won: boolean, mistakes: number, time: number) => void;

  // Sudoku actions
  recordSudokuGame: (won: boolean, mistakes: number, time: number) => void;

  // Numbers actions
  recordNumbersGame: (won: boolean, moves: number, time: number) => void;

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
};

const initialAchievements: Achievement[] = [
  { id: 'first-win', name: 'First Victory', description: 'Win your first game', icon: '🎉', unlocked: false },
  { id: 'streak-5', name: 'Hot Streak', description: 'Win 5 games in a row', icon: '🔥', unlocked: false },
  { id: 'streak-10', name: 'Unstoppable', description: 'Win 10 games in a row', icon: '⚡', unlocked: false },
  { id: 'all-games', name: 'Jack of All Trades', description: 'Win at least one game of each type', icon: '🎮', unlocked: false },
  { id: 'perfect-connections', name: 'Perfect Mind', description: 'Win Connections with no mistakes', icon: '🧠', unlocked: false },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Win a game in under 60 seconds', icon: '💨', unlocked: false },
  { id: 'century', name: 'Century Club', description: 'Play 100 total games', icon: '💯', unlocked: false },
  { id: 'wordle-master', name: 'Word Master', description: 'Win 50 Wordle games', icon: '📝', unlocked: false },
];

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      achievements: initialAchievements,

      recordWordleGame: (won, guesses, time) => set((state) => {
        const newStats = { ...state.stats };
        newStats.wordle.played++;

        if (won) {
          newStats.wordle.won++;
          newStats.wordle.currentStreak++;
          newStats.wordle.maxStreak = Math.max(newStats.wordle.maxStreak, newStats.wordle.currentStreak);
          newStats.wordle.guessDistribution[guesses - 1]++;

          const totalGuesses = newStats.wordle.guessDistribution.reduce((sum, count, idx) =>
            sum + (count * (idx + 1)), 0
          );
          newStats.wordle.averageGuesses = totalGuesses / newStats.wordle.won;
          newStats.wordle.fastestWin = Math.min(newStats.wordle.fastestWin, time);
        } else {
          newStats.wordle.currentStreak = 0;
        }

        setTimeout(() => get().checkAchievements(), 100);
        return { stats: newStats };
      }),

      recordConnectionsGame: (won, mistakes, time) => set((state) => {
        const newStats = { ...state.stats };
        newStats.connections.played++;

        if (won) {
          newStats.connections.won++;
          if (mistakes === 0) {
            newStats.connections.perfectGames++;
          }

          const totalMistakes = (newStats.connections.averageMistakes * (newStats.connections.won - 1)) + mistakes;
          newStats.connections.averageMistakes = totalMistakes / newStats.connections.won;
          newStats.connections.fastestWin = Math.min(newStats.connections.fastestWin, time);
        }

        setTimeout(() => get().checkAchievements(), 100);
        return { stats: newStats };
      }),

      recordSudokuGame: (won, mistakes, time) => set((state) => {
        const newStats = { ...state.stats };
        newStats.sudoku.played++;

        if (won) {
          newStats.sudoku.won++;
          const totalMistakes = (newStats.sudoku.averageMistakes * (newStats.sudoku.won - 1)) + mistakes;
          newStats.sudoku.averageMistakes = totalMistakes / newStats.sudoku.won;
          newStats.sudoku.fastestWin = Math.min(newStats.sudoku.fastestWin, time);
        }

        setTimeout(() => get().checkAchievements(), 100);
        return { stats: newStats };
      }),

      recordNumbersGame: (won, moves, time) => set((state) => {
        const newStats = { ...state.stats };
        newStats.numbers.played++;

        if (won) {
          newStats.numbers.won++;
          const totalMoves = (newStats.numbers.averageMoves * (newStats.numbers.won - 1)) + moves;
          newStats.numbers.averageMoves = totalMoves / newStats.numbers.won;
          newStats.numbers.fastestWin = Math.min(newStats.numbers.fastestWin, time);
        }

        setTimeout(() => get().checkAchievements(), 100);
        return { stats: newStats };
      }),

      unlockAchievement: (achievementId) => set((state) => ({
        achievements: state.achievements.map(a =>
          a.id === achievementId && !a.unlocked
            ? { ...a, unlocked: true, unlockedAt: new Date() }
            : a
        ),
      })),

      checkAchievements: () => {
        const state = get();
        const { stats, achievements } = state;

        // First Victory
        const totalWins = stats.wordle.won + stats.connections.won + stats.sudoku.won + stats.numbers.won;
        if (totalWins >= 1 && !achievements.find(a => a.id === 'first-win')?.unlocked) {
          state.unlockAchievement('first-win');
        }

        // Hot Streak
        if (stats.wordle.currentStreak >= 5 && !achievements.find(a => a.id === 'streak-5')?.unlocked) {
          state.unlockAchievement('streak-5');
        }

        // Unstoppable
        if (stats.wordle.currentStreak >= 10 && !achievements.find(a => a.id === 'streak-10')?.unlocked) {
          state.unlockAchievement('streak-10');
        }

        // Jack of All Trades
        if (stats.wordle.won >= 1 && stats.connections.won >= 1 &&
            stats.sudoku.won >= 1 && stats.numbers.won >= 1 &&
            !achievements.find(a => a.id === 'all-games')?.unlocked) {
          state.unlockAchievement('all-games');
        }

        // Perfect Mind
        if (stats.connections.perfectGames >= 1 && !achievements.find(a => a.id === 'perfect-connections')?.unlocked) {
          state.unlockAchievement('perfect-connections');
        }

        // Speed Demon
        const fastestTime = Math.min(
          stats.wordle.fastestWin,
          stats.connections.fastestWin,
          stats.sudoku.fastestWin,
          stats.numbers.fastestWin
        );
        if (fastestTime < 60 && !achievements.find(a => a.id === 'speed-demon')?.unlocked) {
          state.unlockAchievement('speed-demon');
        }

        // Century Club
        const totalPlayed = stats.wordle.played + stats.connections.played +
                           stats.sudoku.played + stats.numbers.played;
        if (totalPlayed >= 100 && !achievements.find(a => a.id === 'century')?.unlocked) {
          state.unlockAchievement('century');
        }

        // Word Master
        if (stats.wordle.won >= 50 && !achievements.find(a => a.id === 'wordle-master')?.unlocked) {
          state.unlockAchievement('wordle-master');
        }
      },

      resetStats: () => set({
        stats: initialStats,
        achievements: initialAchievements,
      }),
    }),
    {
      name: 'game-hub-stats',
    }
  )
);
