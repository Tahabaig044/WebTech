"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CRMLoginPage() {
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
      router.push("/crm/dashboard");
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
        background: "linear-gradient(135deg, #030712 0%, #0C1526 50%, #030712 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "linear-gradient(180deg, rgba(6,182,212,0.06) 0%, rgba(3,7,18,0.98) 100%)",
          border: "1px solid rgba(6,182,212,0.15)",
          borderRadius: "18px",
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(6,182,212,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #06B6D4, #0891B2)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(6,182,212,0.4)",
              marginBottom: "16px",
            }}
          >
            ◈
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(6,182,212,0.12)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#22D3EE",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            ◈ ERP Intelligence Suite
          </div>
          <h2 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 6px" }}>
            CRM Portal
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>
            Access your ERP intelligence dashboard
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", color: "#EF4444", fontSize: "0.85rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@pixelwyre.com"
              required
              style={{
                width: "100%",
                background: "rgba(6,182,212,0.06)",
                border: "1.5px solid rgba(6,182,212,0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#F1F5F9",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                background: "rgba(6,182,212,0.06)",
                border: "1.5px solid rgba(6,182,212,0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#F1F5F9",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #06B6D4, #0891B2)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "13px 20px",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 20px rgba(6,182,212,0.35)",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-body)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in to CRM"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ color: "#4B5563", fontSize: "0.8rem" }}>
            Powered by Pixelwyre Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
