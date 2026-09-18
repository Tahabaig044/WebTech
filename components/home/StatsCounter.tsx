const stats = [
  { value: "12+", label: "Years in Business" },
  { value: "500+", label: "Verified Clients" },
  { value: "1.2M+", label: "Leads Delivered" },
  { value: "+340%", label: "Average Client ROI" },
];

export default function StatsCounter() {
  return (
    <section
      style={{
        background: "var(--bg-panel)",
        borderTop: "1px solid var(--border-light)",
        borderBottom: "1px solid var(--border-light)",
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
                  color: "var(--brand-blue)",
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
