import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Settings, BarChart3, Github } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

/**
 * Layout component provides consistent styling and navigation across all pages
 */
export default function Layout({
  children,
  title,
  showBackButton = true,
}: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { darkMode, reducedMotion, highContrast, fontSize } =
    useSettingsStore();

  const fontSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
  } as const;

  return (
    <>
      <style>{`
        :root { font-size: ${fontSizeMap[fontSize]}; }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          background: ${
            darkMode
              ? "linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483)"
              : "linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #f97316)"
          };
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          animation-play-state: ${reducedMotion ? "paused" : "running"};
        }
        .contrast-boost {
          filter: contrast(1.2) saturate(1.05);
        }
      `}</style>

      <div
        className={`gradient-bg w-full min-h-screen flex flex-col text-white ${highContrast ? "contrast-boost" : ""}`}
      >
        {/* Header Navigation */}
        <header className="w-full bg-white/10 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && !isHomePage ? (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/15 hover:text-white transition-all font-semibold"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/15 hover:text-white transition-all font-semibold"
                >
                  <Home size={20} />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              )}
            </div>

            {title && (
              <h1 className="text-xl sm:text-3xl font-extrabold text-center flex-1">
                {title}
              </h1>
            )}

            <div className="flex items-center gap-2">
              <Link
                to="/statistics"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Statistics"
              >
                <BarChart3 size={24} />
              </Link>
              <Link
                to="/settings"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={24} />
              </Link>
              <a
                href="https://github.com/hoangsonww/PuzzleForge-Game-Hub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="GitHub"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <footer className="w-full bg-white/10 backdrop-blur-md py-4 text-center text-sm">
          <p className="text-white">
            © {new Date().getFullYear()} PuzzleForge - Built with ❤️ by
            <a
              href="https://sonnguyenhoang.com"
              className="underline ml-1 hover:text-white/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Son Nguyen
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  );
}
