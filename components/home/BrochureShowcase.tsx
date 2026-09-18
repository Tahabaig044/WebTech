const docs = [
  {
    icon: "📄",
    title: "Executive Proposal",
    desc: "Full-scope project proposal with timelines, milestones, and investment breakdown for stakeholders.",
    format: "Google Doc",
    tag: "Proposal",
  },
  {
    icon: "🖼️",
    title: "Brochure Cards",
    desc: "Visually rich service showcase cards designed for print and digital distribution.",
    format: "PDF / PNG",
    tag: "Marketing",
  },
  {
    icon: "📊",
    title: "Sample PDF Report",
    desc: "Auto-generated analytics report showing KPIs, traffic metrics and ROI projections.",
    format: "PDF",
    tag: "Report",
  },
];

export default function BrochureShowcase() {
  return (
    <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">📑 Collateral & Proposals</span>
          <h2 style={{ marginBottom: "14px" }}>Ready-to-Share Documents</h2>
          <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
            Download polished brochures, proposals, and sample reports to share with your team.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {docs.map((doc) => (
            <div key={doc.title} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div style={{ fontSize: "2rem" }}>{doc.icon}</div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "#2563EB",
                  }}
                >
                  {doc.tag}
                </span>
              </div>
              <h4 style={{ marginBottom: "8px" }}>{doc.title}</h4>
              <p style={{ fontSize: "0.88rem", marginBottom: "16px" }}>{doc.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "#64748B" }}>{doc.format}</span>
                <button className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
                  Download →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
