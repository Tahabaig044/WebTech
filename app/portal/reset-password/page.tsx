"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPortalPassword } from "@/lib/actions/portal";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No reset token found. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("No reset token found.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await resetPortalPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to reset password.");
    }
  };

  if (success) {
    return (
      <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.5rem" }}>✓</div>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "12px" }}>Password reset successful</h1>
        <p style={{ color: "#9CA3AF", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "32px" }}>
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          href="/portal"
          style={{
            display: "inline-block", padding: "12px 28px", borderRadius: "10px",
            background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff",
            fontSize: "0.92rem", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 6px 20px rgba(139,92,246,0.4)",
          }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "420px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <Link href="/portal" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#fff", fontWeight: 800 }}>P</div>
        </Link>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.4rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "8px" }}>Set new password</h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>Choose a strong password for your account.</p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem", textAlign: "center" }}>
          {error}
        </div>
      )}

      {!token ? (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <p style={{ color: "#EF4444", fontSize: "0.88rem", marginBottom: "16px" }}>Invalid or missing reset token.</p>
          <Link href="/portal/forgot-password" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              style={{
                width: "100%", background: "rgba(139,92,246,0.06)", border: "1.5px solid rgba(139,92,246,0.18)",
                color: "#E5E7EB", padding: "12px 16px", borderRadius: "10px", fontSize: "0.9rem",
                outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <Link href="/portal" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F1A", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <Suspense fallback={
        <div style={{ width: "100%", maxWidth: "420px", textAlign: "center", color: "#6B7280" }}>
          <p>Loading...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
