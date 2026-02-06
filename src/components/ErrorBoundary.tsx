import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="gradient-bg w-full h-screen flex flex-col justify-center items-center text-white p-6">
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h1 className="text-4xl font-extrabold mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-lg mb-6 text-white">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            {this.state.error && (
              <p className="text-sm bg-red-500/20 p-3 rounded-lg mb-6 font-mono text-left">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
