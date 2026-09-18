import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Pixelwyre Digital",
  description: "Join Pixelwyre Digital — we're hiring developers, designers, and digital marketers. Build the future of Pakistan's digital economy.",
};

const openings = [
  { title: "Full-Stack Developer", type: "Remote / Lahore", desc: "Next.js, TypeScript, Node.js. 2+ years experience with production deployments.", tag: "Engineering", salary: "₨ 150K–250K/mo" },
  { title: "UI/UX Designer", type: "Remote / Lahore", desc: "Figma, design systems, responsive web design. Portfolio required.", tag: "Design", salary: "₨ 100K–180K/mo" },
  { title: "SEO Specialist", type: "Remote", desc: "Technical SEO, local SEO, Google Search Console. Data-driven mindset.", tag: "Marketing", salary: "₨ 80K–140K/mo" },
  { title: "DevOps Engineer", type: "Remote", desc: "AWS/GCP, Docker, CI/CD pipelines. Linux server management experience.", tag: "Infrastructure", salary: "₨ 120K–200K/mo" },
  { title: "React Native Developer", type: "Remote", desc: "React Native, TypeScript, REST APIs. Mobile app development experience.", tag: "Engineering", salary: "₨ 130K–220K/mo" },
];

const perks = [
  { icon: "🏠", title: "Remote-First", desc: "Work from anywhere. We're async-first with flexible hours." },
  { icon: "💰", title: "Competitive Pay", desc: "Above-market salaries with annual reviews and performance bonuses." },
  { icon: "📚", title: "Learning Budget", desc: "₨ 50K/year for courses, conferences, and certifications." },
  { icon: "🏥", title: "Health Coverage", desc: "Group health insurance for you and your family." },
  { icon: "🏖️", title: "Generous PTO", desc: "24 paid days off + public holidays + sick leave." },
  { icon: "💻", title: "Equipment Stipend", desc: "₨ 100K one-time for your home office setup." },
  { icon: "📈", title: "Equity Options", desc: "Early employees can earn equity in the company." },
  { icon: "🎯", title: "Growth Path", desc: "Clear career progression with mentorship from senior leaders." },
];

const culture = [
  { icon: "🚀", title: "Ship Fast", desc: "We deploy daily. Small PRs, fast feedback loops, no bureaucracy." },
  { icon: "🔍", title: "Own Your Work", desc: "You own your projects end-to-end. From code to production to metrics." },
  { icon: "🤝", title: "Collaborate Openly", desc: "Slack threads, code reviews, and weekly syncs. No silos." },
  { icon: "📈", title: "Measure Everything", desc: "Every feature has metrics. We A/B test and iterate based on data." },
];

export default function CareersPage() {
  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            💼 Careers
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>Build the Future With Us</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            Join a lean team shipping real products for real businesses. Remote-friendly, async-first.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ marginBottom: "12px" }}>Our Culture</h2>
            <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto" }}>
              We believe great products are built by small, empowered teams.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "60px" }}>
            {culture.map((c) => (
              <div key={c.title} className="card">
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{c.icon}</div>
                <h4 style={{ marginBottom: "8px" }}>{c.title}</h4>
                <p style={{ fontSize: "0.88rem", margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ marginBottom: "12px" }}>Perks & Benefits</h2>
            <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto" }}>
              We take care of our team so they can take care of our clients.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "80px" }}>
            {perks.map((p) => (
              <div key={p.title} style={{ display: "flex", gap: "14px", padding: "20px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <h4 style={{ marginBottom: "4px", fontSize: "0.95rem" }}>{p.title}</h4>
                  <p style={{ margin: 0, fontSize: "0.82rem" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
              🎯 Open Positions
            </span>
            <h2 style={{ marginBottom: "12px" }}>Join Our Team</h2>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            {openings.map((job) => (
              <div key={job.title} className="card" style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{job.title}</h3>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563EB" }}>
                      {job.tag}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 6px 0", fontSize: "0.86rem" }}>{job.desc}</p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{job.type}</span>
                    <span style={{ fontSize: "0.78rem", color: "#16A34A", fontWeight: 700 }}>{job.salary}</span>
                  </div>
                </div>
                <a href="/contact" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "10px 24px" }}>
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px" }}>Don&apos;t See Your Role?</h2>
          <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto 24px" }}>
            We&apos;re always interested in meeting talented people. Send us your portfolio and tell us how you can contribute.
          </p>
          <a href="/contact" className="btn btn-secondary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Send Open Application →
          </a>
        </div>
      </section>
    </>
  );
}
