import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Settings {
  // Theme
  darkMode: boolean;

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large";

  // Actions
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
  resetSettings: () => void;
}

const defaultSettings = {
  darkMode: false,
  highContrast: false,
  reducedMotion: false,
  fontSize: "medium" as const,
};

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleHighContrast: () =>
        set((state) => ({ highContrast: !state.highContrast })),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
      setFontSize: (fontSize) => set({ fontSize }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "puzzleforge-settings",
    },
  ),
);
