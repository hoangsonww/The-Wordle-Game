import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  // Theme
  darkMode: boolean;

  // Sound
  soundEnabled: boolean;

  // Gameplay
  showTimer: boolean;
  showHints: boolean;
  difficulty: 'easy' | 'medium' | 'hard';

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';

  // Notifications
  showToasts: boolean;

  // Daily Challenge
  dailyChallengeEnabled: boolean;

  // Actions
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleTimer: () => void;
  toggleHints: () => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleToasts: () => void;
  toggleDailyChallenge: () => void;
  resetSettings: () => void;
}

const defaultSettings = {
  darkMode: false,
  soundEnabled: true,
  showTimer: false,
  showHints: true,
  difficulty: 'medium' as const,
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium' as const,
  showToasts: true,
  dailyChallengeEnabled: false,
};

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleTimer: () => set((state) => ({ showTimer: !state.showTimer })),
      toggleHints: () => set((state) => ({ showHints: !state.showHints })),
      setDifficulty: (difficulty) => set({ difficulty }),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleToasts: () => set((state) => ({ showToasts: !state.showToasts })),
      toggleDailyChallenge: () => set((state) => ({ dailyChallengeEnabled: !state.dailyChallengeEnabled })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'game-hub-settings',
    }
  )
);
