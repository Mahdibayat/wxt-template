import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "/assets/font/font.css";
import "./global.css";
import Loading from "./components/ui/loading/loading.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ui/error/error.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading suspense />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);
