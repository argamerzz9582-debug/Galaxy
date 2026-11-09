"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("route error:", error);
  }, [error]);

  return (
    <div className="wrap gutter view" style={{ minHeight: "50vh" }}>
      <h1 style={{ fontSize: 34 }}>Something went wrong</h1>
      <p className="lede">The page could not be displayed. Try again, or head back to the home page.</p>
      <pre
        data-err="1"
        style={{
          background: "#fffdf8",
          border: "1px solid var(--line)",
          borderRadius: 10,
          padding: 12,
          fontSize: 12,
          whiteSpace: "pre-wrap",
          color: "#a32518",
          maxHeight: 260,
          overflow: "auto",
        }}
      >
        {error?.message || "Unknown error"}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
      </pre>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button className="btn solid" onClick={() => reset()}>
          Try again
        </button>
        <a className="btn" href="/">
          Back to Home
        </a>
      </div>
    </div>
  );
}
