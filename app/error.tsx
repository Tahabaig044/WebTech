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
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--admin-text, #111827)",
        }}
      >
        Something went wrong
      </h1>
      <p style={{ color: "var(--admin-text-muted, #6b7280)", maxWidth: "32rem" }}>
        The page failed to load. This has been logged. Try again, and if it keeps
        happening contact support.
      </p>
      {error.digest && (
        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          Reference: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "var(--admin-accent, #7c3aed)",
          color: "#fff",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
