import { useSettingsStore } from "../store/settingsStore";
import { useStatsStore } from "../store/statsStore";
import Layout from "../components/Layout";
import { Moon, Sun, Volume2, VolumeX, Timer, HelpCircle, Eye, Type, Bell, Trophy, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const settings = useSettingsStore();
  const { resetStats } = useStatsStore();

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all statistics? This cannot be undone.")) {
      resetStats();
      toast.success("Statistics reset successfully!");
    }
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      settings.resetSettings();
      toast.success("Settings reset to default!");
    }
  };

  return (
    <Layout title="Settings">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Theme Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              {settings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-sm text-gray-300">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={settings.toggleDarkMode}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    settings.darkMode ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">High Contrast</p>
                  <p className="text-sm text-gray-300">Increase color contrast for better visibility</p>
                </div>
                <button
                  onClick={settings.toggleHighContrast}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    settings.highContrast ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      settings.highContrast ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Type size={20} />
                  Font Size
                </p>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => settings.setFontSize(size)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        settings.fontSize === size
                          ? "bg-blue-500 text-white"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Audio Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              Audio
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Sound Effects</p>
                <p className="text-sm text-gray-300">Play sounds for game events</p>
              </div>
              <button
                onClick={settings.toggleSound}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? "translate-x-11" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Gameplay Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy size={24} />
              Gameplay
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={20} />
                  <div>
                    <p className="font-semibold">Show Timer</p>
                    <p className="text-sm text-gray-300">Display game timer for speed challenges</p>
                  </div>
                </div>
                <button
                  onClick={settings.toggleTimer}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    settings.showTimer ? "bg-yellow-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      settings.showTimer ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} />
                  <div>
                    <p className="font-semibold">Show Hints</p>
                    <p className="text-sm text-gray-300">Enable hint system for games</p>
                  </div>
                </div>
                <button
                  onClick={settings.toggleHints}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    settings.showHints ? "bg-purple-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      settings.showHints ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className="font-semibold mb-2">Difficulty Level</p>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => settings.setDifficulty(difficulty)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        settings.difficulty === difficulty
                          ? difficulty === 'easy' ? 'bg-green-500 text-white' :
                            difficulty === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye size={24} />
              Accessibility
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Reduced Motion</p>
                <p className="text-sm text-gray-300">Minimize animations for sensitive users</p>
              </div>
              <button
                onClick={settings.toggleReducedMotion}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                  settings.reducedMotion ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? "translate-x-11" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bell size={24} />
              Notifications
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Toast Notifications</p>
                <p className="text-sm text-gray-300">Show popup notifications for game events</p>
              </div>
              <button
                onClick={settings.toggleToasts}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                  settings.showToasts ? "bg-indigo-600" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                    settings.showToasts ? "translate-x-11" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Reset Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <RotateCcw size={24} />
              Reset
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleResetSettings}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
              >
                Reset Settings to Default
              </button>
              <button
                onClick={handleResetStats}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
              >
                Reset All Statistics (Permanent)
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
