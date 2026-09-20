const highlights = [
  {
    title: "E-Commerce Transformation",
    metric: "340% more online orders",
    desc: "Full-stack web development with payment integration, Google Shopping feed, and automated WhatsApp order confirmations.",
    color: "#2563EB",
    icon: "🛒",
  },
  {
    title: "Education Automation",
    metric: "60% less admin workload",
    desc: "Custom ERP suite serving 1,200+ students with parent portal, biometric attendance, and automated fee management.",
    color: "#16A34A",
    icon: "🏫",
  },
  {
    title: "Local Business Growth",
    metric: "2x membership sign-ups",
    desc: "Landing page + CRM pipeline + Google Maps SEO driving 45% of new leads organically within 60 days.",
    color: "#7C3AED",
    icon: "💪",
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">⭐ Case Study Highlights</span>
          <h2 style={{ marginBottom: "14px" }}>Proven Results Across Industries</h2>
          <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
            Real solutions delivering measurable growth for businesses in Pakistan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "28px" }}>
          {highlights.map((h) => (
            <div key={h.title} className="card" style={{ borderTopColor: h.color }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{h.icon}</div>
              <h3 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{h.title}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: h.color, margin: "0 0 12px" }}>
                {h.metric}
              </p>
              <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0 }}>
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
