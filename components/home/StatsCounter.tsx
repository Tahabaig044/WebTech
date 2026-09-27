const stats = [
  { value: "Full-Stack", label: "Web Development" },
  { value: "SEO & Ads", label: "Digital Marketing" },
  { value: "ERP & CRM", label: "Business Automation" },
  { value: "24/7", label: "Managed Hosting" },
];

export default function StatsCounter() {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 0",
      }}
    >
      <div className="wrap">
        <div
          className="public-stats-grid"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                  marginBottom: "6px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
