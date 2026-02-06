import { useSettingsStore } from "../store/settingsStore";
import { useStatsStore } from "../store/statsStore";
import Layout from "../components/Layout";
import { Moon, Sun, Eye, Type, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const settings = useSettingsStore();
  const { resetStats } = useStatsStore();

  const confirmAction = (message: string, onConfirm: () => void) => {
    toast.custom((t) => (
      <div
        className={`max-w-md w-full bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl ${t.visible ? "" : "opacity-0"}`}
      >
        <p className="text-white font-semibold mb-3">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleResetStats = () => {
    confirmAction("Reset all statistics? This cannot be undone.", () => {
      resetStats();
      toast.success("Statistics reset successfully!");
    });
  };

  const handleResetSettings = () => {
    confirmAction("Reset all settings to default?", () => {
      settings.resetSettings();
      toast.success("Settings reset to default!");
    });
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
                  <p className="text-sm text-white">
                    Switch between light and dark themes
                  </p>
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
                  <p className="text-sm text-white">
                    Increase color contrast for better visibility
                  </p>
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
                  {(["small", "medium", "large"] as const).map((size) => (
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

          {/* Accessibility Section */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye size={24} />
              Accessibility
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Reduced Motion</p>
                <p className="text-sm text-white">
                  Minimize animations for sensitive users
                </p>
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
