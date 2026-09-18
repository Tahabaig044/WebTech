"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F1A", overflow: "hidden" }}>
      {/* Left branded panel - diagonal split */}
      <div
        style={{
          position: "relative",
          width: "55%",
          background: "linear-gradient(135deg, #0D1321 0%, #1a1040 40%, #0f2027 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
          overflow: "hidden",
        }}
      >
        {/* Mesh gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating shapes */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[
            { size: 80, top: "10%", left: "15%", color: "rgba(139,92,246,0.12)", delay: "0s", dur: "18s" },
            { size: 50, top: "60%", left: "70%", color: "rgba(16,185,129,0.1)", delay: "2s", dur: "22s" },
            { size: 120, top: "75%", left: "20%", color: "rgba(245,158,11,0.06)", delay: "4s", dur: "25s" },
            { size: 40, top: "20%", left: "60%", color: "rgba(139,92,246,0.08)", delay: "1s", dur: "20s" },
            { size: 65, top: "45%", left: "40%", color: "rgba(16,185,129,0.07)", delay: "3s", dur: "23s" },
            { size: 35, top: "85%", left: "55%", color: "rgba(139,92,246,0.1)", delay: "5s", dur: "19s" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${s.size}px`,
                height: `${s.size}px`,
                top: s.top,
                left: s.left,
                borderRadius: i % 2 === 0 ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%",
                background: s.color,
                border: `1px solid ${s.color.replace(/[\d.]+\)$/, "0.3)")}`,
                animation: `portalFloat ${s.dur} ease-in-out ${s.delay} infinite alternate`,
              }}
            />
          ))}
          {/* Grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "480px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 6px 20px rgba(139,92,246,0.45)",
              }}
            >
              P
            </div>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "1.3rem", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>Pixelwyre</div>
              <div style={{ color: "#8B5CF6", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Digital Agency</div>
            </div>
          </div>

          {/* Tagline */}
          <h1
            style={{
              color: "#F1F5F9",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            Client{" "}
            <span style={{ background: "linear-gradient(135deg, #8B5CF6, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Command Center
            </span>
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "40px", maxWidth: "400px" }}>
            Your projects, invoices, and support — all in one powerful dashboard. Take control of your digital presence.
          </p>

          {/* Feature bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              { icon: "◉", text: "Real-time Project Tracking", sub: "Monitor progress across all active projects" },
              { icon: "◎", text: "24/7 Portal Access", sub: "Manage your account anytime, anywhere" },
              { icon: "⬡", text: "Instant Invoice Downloads", sub: "Access and download invoices on demand" },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.1)",
                  transition: "all 0.25s ease",
                }}
              >
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.1))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#A78BFA",
                    fontSize: "1rem",
                    flexShrink: 0,
                    border: "1px solid rgba(139,92,246,0.25)",
                  }}
                >
                  {f.icon}
                </span>
                <div>
                  <div style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "0.9rem" }}>{f.text}</div>
                  <div style={{ color: "#6B7280", fontSize: "0.78rem", marginTop: "2px" }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes portalFloat {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            100% { transform: translateY(-30px) rotate(15deg) scale(1.05); }
          }
        `}</style>
      </div>

      {/* Right login form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
          position: "relative",
        }}
      >
        {/* Subtle background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "400px" }}>
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px", justifyContent: "center" }} className="portal-mobile-logo">
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              P
            </div>
            <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "1.1rem" }}>Pixelwyre Portal</span>
          </div>

          <h2
            style={{
              color: "#F1F5F9",
              fontSize: "1.6rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            Welcome back
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "32px" }}>
            Sign in to access your client dashboard
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              const result = await signIn("credentials", { email, password, redirect: false });
              setLoading(false);
              if (result?.error) {
                setError("Invalid email or password");
              } else {
                router.push("/portal/dashboard");
                router.refresh();
              }
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.3px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: "100%",
                  background: "rgba(139,92,246,0.06)",
                  border: "1.5px solid rgba(139,92,246,0.18)",
                  color: "#E5E7EB",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.3px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  background: "rgba(139,92,246,0.06)",
                  border: "1.5px solid rgba(139,92,246,0.18)",
                  color: "#E5E7EB",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <Link
                href="/contact"
                style={{ color: "#8B5CF6", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                color: "#fff",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.2px",
                boxShadow: "0 6px 20px rgba(139,92,246,0.4)",
                transition: "all 0.25s ease",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,92,246,0.15)" }} />
            <span style={{ color: "#6B7280", fontSize: "0.75rem", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,92,246,0.15)" }} />
          </div>

          {/* OAuth Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/portal/dashboard" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "10px 16px", borderRadius: "10px",
                border: "1.5px solid rgba(139,92,246,0.18)", background: "rgba(139,92,246,0.06)",
                color: "#D1D5DB", fontSize: "0.82rem", fontWeight: 600,
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
              onClick={() => signIn("github", { callbackUrl: "/portal/dashboard" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "10px 16px", borderRadius: "10px",
                border: "1.5px solid rgba(139,92,246,0.18)", background: "rgba(139,92,246,0.06)",
                color: "#D1D5DB", fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <span style={{ color: "#6B7280", fontSize: "0.85rem" }}>New here? </span>
            <Link
              href="/contact"
              style={{ color: "#10B981", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}
            >
              Request Access
            </Link>
          </div>

          <div style={{ marginTop: "36px", textAlign: "center" }}>
            <Link
              href="/"
              style={{ color: "#4B5563", fontSize: "0.78rem", textDecoration: "none" }}
            >
              ← Back to pixelwyre.com
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .portal-left-panel { display: none !important; }
          .portal-right-panel { width: 100% !important; }
          .portal-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
