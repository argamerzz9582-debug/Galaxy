"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#efeee8",
          color: "#2a3526",
          padding: 32,
        }}
      >
        <h1 style={{ fontSize: 28 }}>Something went wrong</h1>
        <pre data-err="1" style={{ whiteSpace: "pre-wrap", color: "#a32518", fontSize: 13 }}>
          {error?.message || "Unknown error"}
        </pre>
        <button
          onClick={() => reset()}
          style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid #dcd9cd", background: "#fff" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
