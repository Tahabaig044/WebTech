import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed Hosting — Pixelwyre Digital",
  description: "Enterprise-grade managed hosting with 99.99% uptime SLA, daily backups, SSL, CDN, and 24/7 monitoring from Pixelwyre Digital.",
};

const features = [
  { icon: "🛡️", title: "99.99% Uptime SLA", desc: "Guaranteed availability backed by financial credits if we miss the mark." },
  { icon: "⚡", title: "Global CDN", desc: "Content delivered from 200+ edge locations worldwide for sub-second load times." },
  { icon: "🔄", title: "Daily Backups", desc: "Automated daily snapshots with 30-day retention and one-click restore." },
  { icon: "🔒", title: "Free SSL Certificates", desc: "Let's Encrypt SSL auto-renewed on every domain — always HTTPS." },
  { icon: "📊", title: "BI Audit Engine", desc: "Monthly performance, SEO, and security audit reports included free." },
  { icon: "📞", title: "24/7 Support", desc: "< 2 hour response time on all critical issues via WhatsApp and ticketing." },
];

const plans = [
  {
    name: "Basic",
    price: "₨ 1,499",
    period: "/month",
    desc: "Perfect for personal websites and small blogs.",
    color: "#2563EB",
    features: [
      "1 Website",
      "5 GB SSD Storage",
      "50 GB Bandwidth",
      "Free SSL Certificate",
      "Weekly Backups",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₨ 3,499",
    period: "/month",
    desc: "For growing businesses with multiple domains.",
    color: "#16A34A",
    features: [
      "5 Websites",
      "25 GB SSD Storage",
      "250 GB Bandwidth",
      "Free SSL Certificate",
      "Daily Backups",
      "Cloudflare CDN",
      "WhatsApp Support",
      "Monthly BI Report",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₨ 8,999",
    period: "/month",
    desc: "Maximum performance for high-traffic sites and e-commerce.",
    color: "#7C3AED",
    features: [
      "Unlimited Websites",
      "100 GB SSD Storage",
      "Unlimited Bandwidth",
      "Wildcard SSL Certificate",
      "Real-Time Backups",
      "Global CDN + Edge Caching",
      "24/7 Priority Support",
      "Weekly BI Audit Reports",
      "Staging Environment",
    ],
    popular: false,
  },
];

const techSpecs = [
  { label: "Server", value: "LiteSpeed + OpenLiteSpeed" },
  { label: "Storage", value: "NVMe SSD (RAID-10)" },
  { label: "PHP", value: "8.1 / 8.2 / 8.3 ( selectable )" },
  { label: "Database", value: "MariaDB 10.11" },
  { label: "Cache", value: "LSCache + Redis Object Cache" },
  { label: "Firewall", value: "ModSecurity + CSF" },
  { label: "Monitoring", value: "UptimeRobot + Grafana" },
  { label: "Backups", value: "JetBackup ( remote S3 )" },
];

export default function HostingPage() {
  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            ☁️ Managed Hosting
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>Hosting That Never Sleeps</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            Cloud infrastructure managed end-to-end so you can focus on growing your business.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ borderTopColor: "#0284C7" }}>
                <div style={{ fontSize: "2rem", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
              💰 Hosting Plans
            </span>
            <h2 style={{ marginBottom: "12px" }}>Simple, Transparent Pricing</h2>
            <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto" }}>
              All plans include free migration, SSL, and our 99.99% uptime guarantee.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="card"
                style={{
                  borderTopColor: plan.color,
                  position: "relative",
                  padding: plan.popular ? "40px 32px" : "32px",
                  boxShadow: plan.popular ? "0 18px 45px rgba(22, 163, 74, 0.2)" : undefined,
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute",
                    top: "-1px",
                    right: "24px",
                    background: plan.color,
                    color: "#FFFFFF",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "4px 14px",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: "0.5px",
                  }}>
                    BEST VALUE
                  </div>
                )}
                <h3 style={{ marginBottom: "6px" }}>{plan.name}</h3>
                <p style={{ fontSize: "0.86rem", marginBottom: "20px" }}>{plan.desc}</p>
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: plan.color }}>{plan.price}</span>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "#475569" }}>
                      <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={plan.popular ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", padding: "12px 24px" }}
                >
                  {plan.popular ? "Get Professional →" : "Choose Plan →"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2>Technical Specifications</h2>
            <p style={{ color: "#64748B" }}>Built on enterprise-grade infrastructure for maximum performance.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", maxWidth: "800px", margin: "0 auto" }}>
            {techSpecs.map((spec) => (
              <div key={spec.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A" }}>{spec.label}</span>
                <span style={{ fontSize: "0.84rem", color: "#64748B" }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "linear-gradient(135deg, #060D19 0%, #0F2B5C 100%)", borderTop: "1px solid #1E3A8A" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#FFFFFF", marginBottom: "12px" }}>Free Migration</h2>
          <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 24px" }}>
            Moving from another host? We&apos;ll migrate your sites for free — zero downtime guaranteed.
          </p>
          <a href="/contact" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Start Free Migration →
          </a>
        </div>
      </section>
    </>
  );
}
