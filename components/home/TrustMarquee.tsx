const badges = [
  { title: "Full-Stack Development", desc: "Web, mobile, and custom applications", icon: "🌐", color: "#7C3AED" },
  { title: "Digital Marketing", desc: "SEO, Google Ads, and social media", icon: "📈", color: "#F59E0B" },
  { title: "Business Automation", desc: "ERP, CRM, and workflow systems", icon: "⚡", color: "#A855F7" },
  { title: "24/7 Managed Hosting", desc: "Cloud infrastructure and monitoring", icon: "☁️", color: "#06B6D4" },
];

export default function TrustMarquee() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #020617 0%, #0A1224 100%)",
        padding: "52px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="wrap" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#A855F7",
            marginBottom: "8px",
          }}
        >
          Trusted by Businesses Across Pakistan
        </div>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
            marginBottom: "32px",
          }}
        >
          Why Businesses Choose WebTech Solutions Hub
        </h2>
        <div className="trust-grid">
          {badges.map((b) => (
            <div
              key={b.title}
              style={{
                background: "rgba(10, 18, 36, 0.65)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "12px",
                padding: "24px 16px",
                textAlign: "center",
                transition: "all 0.25s ease",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{b.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: b.color, marginBottom: "4px" }}>
                {b.title}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .trust-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
