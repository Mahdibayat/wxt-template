import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 p-6 text-center"
    >
      <h2 className="text-lg font-semibold">مشکلی پیش آمده است!</h2>

      <p className="text-sm text-gray-500">در بارگذاری این بخش خطایی رخ داد.</p>

      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        تلاش مجدد
      </button>

      {process.env.NODE_ENV === "development" && (
        <pre className="max-w-full overflow-auto text-left text-xs text-red-500">
          {(error as any)?.message ?? ""}
        </pre>
      )}
    </div>
  );
}
