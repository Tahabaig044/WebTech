"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPortalPasswordReset } from "@/lib/actions/portal";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await requestPortalPasswordReset(email);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F1A", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.5rem" }}>✓</div>
          <h1 style={{ color: "#F1F5F9", fontSize: "1.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "12px" }}>Check your email</h1>
          <p style={{ color: "#9CA3AF", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "32px" }}>
            If an account exists with <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{email}</span>, we&apos;ve sent a password reset link.
          </p>
          <Link href="/portal" style={{ color: "#8B5CF6", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F1A", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link href="/portal" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#fff", fontWeight: 800 }}>P</div>
          </Link>
          <h1 style={{ color: "#F1F5F9", fontSize: "1.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "8px" }}>Forgot your password?</h1>
          <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={{
                width: "100%", background: "rgba(139,92,246,0.06)", border: "1.5px solid rgba(139,92,246,0.18)",
                color: "#E5E7EB", padding: "12px 16px", borderRadius: "10px", fontSize: "0.9rem",
                outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px 24px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff",
              fontSize: "0.92rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-heading)", opacity: loading ? 0.7 : 1,
              boxShadow: "0 6px 20px rgba(139,92,246,0.4)",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Link href="/portal" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
