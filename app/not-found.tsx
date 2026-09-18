"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060D19",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating geometric shapes */}
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          border: "2px solid rgba(37, 99, 235, 0.3)",
          borderRadius: 16,
          top: "15%",
          left: "10%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          border: "2px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "50%",
          top: "20%",
          right: "15%",
          animation: "float-reverse 7s ease-in-out infinite",
        }}
      />
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          border: "2px solid rgba(139, 92, 246, 0.3)",
          top: "60%",
          left: "20%",
          animation: "float 8s ease-in-out infinite 1s",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          border: "2px solid rgba(244, 63, 94, 0.2)",
          borderRadius: 20,
          bottom: "20%",
          right: "10%",
          animation: "float-reverse 5s ease-in-out infinite 0.5s",
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          border: "2px solid rgba(6, 182, 212, 0.25)",
          borderRadius: 12,
          bottom: "30%",
          left: "8%",
          animation: "float 9s ease-in-out infinite 2s",
        }}
      />
      <div
        className="not-found-shape"
        style={{
          position: "absolute",
          width: 30,
          height: 30,
          background: "rgba(37, 99, 235, 0.1)",
          borderRadius: "50%",
          top: "40%",
          right: "25%",
          animation: "float-reverse 6s ease-in-out infinite 1.5s",
        }}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
        {/* Large 404 */}
        <div
          style={{
            fontSize: "clamp(6rem, 15vw, 12rem)",
            fontWeight: 900,
            fontFamily: "var(--font-heading)",
            lineHeight: 1,
            marginBottom: 16,
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 40%, #EC4899 70%, #2563EB 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-shift 4s ease infinite",
            userSelect: "none",
          }}
        >
          404
        </div>

        {/* Glowing line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "linear-gradient(90deg, transparent, #2563EB, transparent)",
            margin: "0 auto 32px",
            borderRadius: 2,
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />

        {/* Subtitle */}
        <h2
          style={{
            color: "#F8FAFC",
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            marginBottom: 12,
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            color: "#94A3B8",
            fontSize: "1rem",
            maxWidth: 420,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Go Home button */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            color: "#FFFFFF",
            padding: "14px 32px",
            borderRadius: 10,
            fontSize: "0.95rem",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            textDecoration: "none",
            boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            border: "1px solid rgba(96, 165, 250, 0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(37, 99, 235, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(37, 99, 235, 0.4)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go Home
        </Link>
      </div>
    </div>
  );
}
