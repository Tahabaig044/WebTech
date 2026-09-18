import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Pixelwyre Digital — a full-stack digital agency helping Pakistani businesses build, market, and scale online.",
};

const team = [
  { name: "Usman Tariq", role: "Founder & CEO", initials: "UT", color: "#2563EB", bio: "Serial entrepreneur with 12+ years in digital systems. Built Pixelwyre from a one-man shop to a 15-person team." },
  { name: "Hassan Khan", role: "Lead Developer", initials: "HK", color: "#16A34A", bio: "Full-stack architect specializing in Next.js, TypeScript, and cloud infrastructure. 50+ production deployments." },
  { name: "Ayesha Noor", role: "SEO & Ads Manager", initials: "AN", color: "#7C3AED", bio: "Data-driven marketer who has managed ₨ 50M+ in ad spend across Google, Facebook, and Instagram." },
  { name: "Bilal Ahmed", role: "ERP Architect", initials: "BA", color: "#F59E0B", bio: "Built custom CRM and ERP systems for 40+ businesses. Expert in workflow automation and integration." },
  { name: "Fatima Sheikh", role: "UI/UX Designer", initials: "FS", color: "#EC4899", bio: "Design systems specialist with a focus on conversion optimization and accessibility." },
  { name: "Ali Raza", role: "DevOps Engineer", initials: "AR", color: "#06B6D4", bio: "Cloud infrastructure expert managing 85+ client servers with 99.99% uptime record." },
];

const values = [
  { icon: "🎯", title: "Results First", desc: "Every decision is measured against ROI. We don't do vanity metrics." },
  { icon: "🤝", title: "Radical Transparency", desc: "Full access to dashboards, code repos, and real-time project boards." },
  { icon: "🚀", title: "Speed of Execution", desc: "Sprint-based delivery with weekly demos. No black holes." },
  { icon: "🔒", title: "Ownership & Security", desc: "You own your code, your data, your infrastructure. Always." },
  { icon: "📈", title: "Data-Driven", desc: "Every recommendation backed by data, not assumptions." },
  { icon: "💡", title: "Continuous Innovation", desc: "We invest 20% of our time in R&D to stay ahead of the curve." },
];

const timeline = [
  { year: "2014", title: "Founded", desc: "Started as a freelance web development shop in Lahore." },
  { year: "2016", title: "First 50 Clients", desc: "Reached 50 active clients. Launched managed hosting division." },
  { year: "2018", title: "ERP Suite Launch", desc: "Built and deployed our proprietary ERP intelligence suite." },
  { year: "2020", title: "UAE Expansion", desc: "Expanded operations to Dubai. Opened partnership with 3 UAE agencies." },
  { year: "2022", title: "SaaS Products", desc: "Launched industry-specific SaaS suites for schools, clinics, and restaurants." },
  { year: "2024", title: "240+ Projects", desc: "Crossed 240 projects delivered. 85+ active clients across Pakistan & UAE." },
  { year: "2026", title: "AI Integration", desc: "Integrating AI-powered automation across all products and services." },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            🏢 About Us
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>The Team Behind Pixelwyre</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            A lean, senior team obsessed with building digital systems that actually work.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "80px" }}>
            {values.map((v) => (
              <div key={v.title} className="card">
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{v.icon}</div>
                <h3 style={{ marginBottom: "8px", fontSize: "1rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
              📅 Our Journey
            </span>
            <h2 style={{ marginBottom: "12px" }}>From Freelancer to Full-Stack Agency</h2>
            <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto" }}>
              12 years of building, learning, and scaling — one project at a time.
            </p>
          </div>

          <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto 80px" }}>
            <div style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, #2563EB, #7C3AED)" }} />
            {timeline.map((item, i) => (
              <div key={item.year} style={{ display: "flex", gap: "24px", marginBottom: "36px", position: "relative" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: i === timeline.length - 1 ? "linear-gradient(135deg, #2563EB, #7C3AED)" : "#FFFFFF",
                  border: "3px solid #2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: i === timeline.length - 1 ? "#FFFFFF" : "#2563EB",
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  {item.year}
                </div>
                <div style={{ paddingTop: "8px" }}>
                  <h3 style={{ marginBottom: "4px", fontSize: "0.95rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.88rem", margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
              👥 Meet the Team
            </span>
            <h2 style={{ marginBottom: "12px" }}>The People Behind the Pixels</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {team.map((t) => (
              <div key={t.name} className="card" style={{ alignItems: "center", textAlign: "center", padding: "36px 28px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: t.color,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    marginBottom: "16px",
                  }}
                >
                  {t.initials}
                </div>
                <h3 style={{ marginBottom: "4px", fontSize: "0.95rem" }}>{t.name}</h3>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: t.color, fontWeight: 700 }}>{t.role}</p>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "#64748B" }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px" }}>Want to Join Our Team?</h2>
          <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto 24px" }}>
            We&apos;re always looking for talented people who share our passion for building great digital products.
          </p>
          <a href="/careers" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            View Open Positions →
          </a>
        </div>
      </section>
    </>
  );
}
