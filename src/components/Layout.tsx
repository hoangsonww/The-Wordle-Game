import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Settings, BarChart3 } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

/**
 * Layout component provides consistent styling and navigation across all pages
 */
export default function Layout({ children, title, showBackButton = true }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { darkMode, reducedMotion } = useSettingsStore();

  return (
    <>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          background: ${darkMode
            ? 'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483)'
            : 'linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #facc15)'
          };
          background-size: 400% 400%;
          animation: ${reducedMotion ? 'none' : 'gradientBG 15s ease infinite'};
        }
      `}</style>

      <div className={`gradient-bg w-full min-h-screen flex flex-col ${darkMode ? 'text-gray-100' : 'text-white'}`}>
        {/* Header Navigation */}
        <header className="w-full bg-white/10 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && !isHomePage ? (
                <Link
                  to="/"
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors font-semibold"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors font-semibold"
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-white/10 backdrop-blur-md py-4 text-center text-sm">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-200'}>
            © {new Date().getFullYear()} Game Hub - Built with React & TypeScript
          </p>
        </footer>
      </div>
    </>
  );
}
