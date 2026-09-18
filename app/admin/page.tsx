"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.04) 0%, #030712 60%)",
        padding: "24px",
      }}
    >
      <div
        className="admin-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
              marginBottom: "20px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div
            className="admin-badge accent"
            style={{
              marginBottom: "16px",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Pixelwyre Admin
          </div>

          <h2
            style={{
              color: "var(--admin-text)",
              fontSize: "1.35rem",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            Admin Panel
          </h2>
          <p style={{ color: "var(--admin-text-faint)", fontSize: "0.82rem", margin: 0 }}>
            Sign in to access the administration dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#2563EB", fontSize: "0.85rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="admin-email"
              style={{
                display: "block",
                color: "var(--admin-text-muted)",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <div className="admin-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="admin-email"
                className="admin-focus"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pixelwyre.com"
                aria-label="Email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                color: "var(--admin-text-muted)",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div className="admin-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="admin-password"
                className="admin-focus"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-label="Password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary admin-focus"
            style={{
              width: "100%",
              padding: "11px 20px",
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: "var(--admin-radius)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in to Admin Panel"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--admin-border)" }} />
          <span style={{ color: "var(--admin-text-faint)", fontSize: "0.75rem", fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "var(--admin-border)" }} />
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
            className="admin-focus"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px 16px", borderRadius: "var(--admin-radius)",
              border: "1px solid var(--admin-border)", background: "var(--admin-surface)",
              color: "var(--admin-text)", fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/admin/dashboard" })}
            className="admin-focus"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px 16px", borderRadius: "var(--admin-radius)",
              border: "1px solid var(--admin-border)", background: "var(--admin-surface)",
              color: "var(--admin-text)", fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid var(--admin-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ color: "var(--admin-text-faint)", fontSize: "0.75rem", fontWeight: 500 }}>
              Secured by Pixelwyre Digital
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
