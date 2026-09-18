const badges = [
  { platform: "Trustpilot", score: "4.9/5", icon: "⭐", color: "var(--brand-trustpilot)" },
  { platform: "Google Reviews", score: "5.0/5", icon: "🏆", color: "#4285F4" },
  { platform: "Clutch", score: "4.9/5", icon: "🎖️", color: "#E03C31" },
  { platform: "SLA Guarantee", score: "100%", icon: "✅", color: "#16A34A" },
];

export default function TrustMarquee() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #060D19 0%, #0B172C 100%)",
        padding: "52px 0",
        borderBottom: "1px solid #1E3A8A",
      }}
    >
      <div className="wrap" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#60A5FA",
            marginBottom: "8px",
          }}
        >
          Trusted by 100+ Brands
        </div>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
            marginBottom: "32px",
          }}
        >
          Why Businesses Choose Pixelwyre
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {badges.map((b) => (
            <div
              key={b.platform}
              style={{
                background: "rgba(15,43,92,0.4)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "12px",
                padding: "24px 16px",
                textAlign: "center",
                transition: "all 0.25s ease",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{b.icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: b.color, marginBottom: "4px" }}>
                {b.score}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 600 }}>
                {b.platform}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
