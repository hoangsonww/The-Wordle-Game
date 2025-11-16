import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

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

  return (
    <>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #facc15);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }
      `}</style>

      <div className="gradient-bg w-full min-h-screen flex flex-col text-white">
        {/* Header Navigation */}
        <header className="w-full bg-white/10 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {showBackButton && !isHomePage ? (
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-semibold"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Games</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-semibold"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Game Hub</span>
              </Link>
            )}

            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-center flex-1">
                {title}
              </h1>
            )}

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-white/10 backdrop-blur-md py-4 text-center text-sm text-gray-200">
          <p>© {new Date().getFullYear()} Game Hub - Built with React & TypeScript</p>
        </footer>
      </div>
    </>
  );
}
