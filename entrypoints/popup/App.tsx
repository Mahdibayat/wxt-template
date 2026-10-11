import { Suspense } from "react";
import wxtLogo from "/wxt.svg";
import Loading from "./components/ui/loading/loading";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ui/error/error";
import Templates from "./components/templates/templates";

function App() {
  return (
    <main className="main">
      <div className="title">
        <h5>نمونه های آماده رایانامه</h5>
        <img src={wxtLogo} className="logo" alt="WXT logo" />
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <Templates />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export default App;
