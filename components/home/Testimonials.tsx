const testimonials = [
  {
    name: "Ahmad Raza",
    role: "CEO",
    company: "Al-Razaq Traders",
    text: "Pixelwyre transformed our online presence completely. Our e-commerce store went live in 3 weeks and we saw a 340% increase in online orders within the first quarter.",
    initials: "AR",
    color: "#2563EB",
    stars: 5,
  },
  {
    name: "Fatima Malik",
    role: "Principal",
    company: "GreenField Academy",
    text: "The School SMS Suite has cut our admin workload by 60%. Parents love the real-time updates and the fee management system is a game changer for our 1,200-student campus.",
    initials: "FM",
    color: "#16A34A",
    stars: 5,
  },
  {
    name: "Bilal Khan",
    role: "Founder",
    company: "FitZone Gym",
    text: "From Google Maps SEO to a fully automated lead pipeline, Pixelwyre handles everything. Our membership sign-ups doubled in 2 months and we haven't looked back.",
    initials: "BK",
    color: "#7C3AED",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#F59E0B", fontSize: "1.1rem" }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">⭐ Client Testimonials</span>
          <h2 style={{ marginBottom: "14px" }}>What Our Clients Say</h2>
          <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
            Real results from real businesses across Pakistan.
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
            padding: "20px",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "var(--radius)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ color: "#00B67A", fontSize: "1.8rem", fontWeight: 800 }}>★ Trustpilot</span>
          </div>
          <p style={{ fontSize: "0.9rem", margin: 0, color: "#64748B" }}>
            Rated <strong style={{ color: "#00B67A" }}>4.9 / 5</strong> on Trustpilot — Verified Reviews
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "28px" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <Stars count={t.stars} />
              <p style={{ fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: t.color,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.9rem" }}>{t.name}</h3>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
