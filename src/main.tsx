import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Analytics />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
