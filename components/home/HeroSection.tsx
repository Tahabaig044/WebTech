import Link from "next/link";
import HeroTabs from "./HeroTabs";

export default function HeroSection() {
  return (
    <section style={{ background: "var(--bg-page)", position: "relative", overflow: "hidden" }}>
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div className="wrap" style={{ paddingTop: "60px", paddingBottom: "40px", position: "relative" }}>
        <div className="hero-grid">
          <div>
            <span className="eyebrow">⚡ Web Dev · Local SEO · Ads · Managed Hosting</span>
            <h1 style={{ marginBottom: "18px", lineHeight: 1.2 }}>
              We Wire Together Your{" "}
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Entire Digital Presence
              </span>.
            </h1>
            <p className="lede" style={{ marginBottom: "28px", maxWidth: "520px", color: "var(--text-muted)" }}>
              One connected system for building, launching, marketing, and hosting your business online — operated centrally through our ERP intelligence suite.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                Start Your Project →
              </Link>
              <Link href="/services" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                Explore 100+ Services
              </Link>
            </div>
          </div>

          <HeroTabs />
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: "50px", position: "relative" }}>
        <div
          style={{
            background: "rgba(10, 18, 36, 0.65)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            borderRadius: "var(--radius-lg)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            boxShadow: "0 12px 35px rgba(124, 58, 237, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.05)",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>🔍</span>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h2 style={{ color: "#FFFFFF", marginBottom: "2px", fontSize: "1rem" }}>Instant Business Audit</h2>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.85rem" }}>Check your Google Maps rank, mobile speed & WhatsApp bot status</p>
          </div>
          <input
            type="url"
            placeholder="https://yourbusiness.com"
            style={{
              flex: "2",
              minWidth: "260px",
              background: "rgba(3, 7, 18, 0.8)",
              border: "1.5px solid rgba(139, 92, 246, 0.3)",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              borderRadius: "10px",
              padding: "12px 18px",
            }}
          />
          <button className="btn btn-primary" style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
            Analyze →
          </button>
        </div>
      </div>
    </section>
  );
}
