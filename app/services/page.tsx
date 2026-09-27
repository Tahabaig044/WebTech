import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/supabase/queries";
import type { DBService } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description: "Explore 100+ digital services — web development, SEO, Google Ads, managed hosting, and custom ERP automation from WebTech Solutions Hub.",
};

const categoryMeta: Record<string, { icon: string; color: string }> = {
  "Web Development": { icon: "🌐", color: "#A855F7" },
  "SEO": { icon: "🔍", color: "#16A34A" },
  "Search Engine Optimization": { icon: "🔍", color: "#16A34A" },
  "Paid Advertising": { icon: "📈", color: "#F59E0B" },
  "Google Ads": { icon: "📈", color: "#F59E0B" },
  "Managed Hosting": { icon: "☁️", color: "#0284C7" },
  "Hosting": { icon: "☁️", color: "#0284C7" },
  "ERP & Automation": { icon: "⚡", color: "#7C3AED" },
  "ERP": { icon: "⚡", color: "#7C3AED" },
  "Industry SaaS Products": { icon: "🏭", color: "#10B981" },
  "SaaS": { icon: "🏭", color: "#10B981" },
  "Marketing": { icon: "📈", color: "#F59E0B" },
};

const fallbackPricing = [
  { name: "Starter", price: "₨ 25,000", period: "one-time", desc: "Perfect for new businesses launching their first digital presence.", color: "#7C3AED", features: ["5-Page Business Website", "Mobile Responsive Design", "Basic SEO Setup", "SSL Certificate", "1 Month Managed Hosting", "WhatsApp Business Integration"], popular: false },
  { name: "Growth", price: "₨ 65,000", period: "one-time", desc: "For businesses ready to generate leads and rank on Google Maps.", color: "#16A34A", features: ["10-Page Website + Blog", "Google Maps SEO (Top 3 Rank)", "Landing Page for Ads", "WhatsApp Chatbot Setup", "3 Months Managed Hosting", "Monthly Performance Report", "Google Ads Campaign Setup"], popular: true },
  { name: "Scale", price: "₨ 150,000+", period: "project-based", desc: "Full-stack digital transformation with custom ERP and automation.", color: "#7C3AED", features: ["Custom Web Application", "Full ERP + CRM Dashboard", "Multi-Channel Ad Campaigns", "Advanced Analytics & BI", "12 Months Managed Hosting", "Dedicated Account Manager", "Priority 24/7 Support", "Quarterly Strategy Sessions"], popular: false },
];

export default async function ServicesPage() {
  let services;
  try {
    services = await getServices();
  } catch {
    services = null;
  }

  // Group services by category
  const categoryMap = new Map<string, DBService[]>();

  if (services && services.length > 0) {
    for (const svc of services) {
      const cat = svc.category || "Other";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(svc);
    }
  }

  const useFallback = !services || services.length === 0;
  const categories = useFallback ? [] : Array.from(categoryMap.entries()).map(([title, svcList]) => ({
    title,
    desc: `Explore our ${title.toLowerCase()} services.`,
    icon: (categoryMeta[title] || { icon: "⚙️" }).icon,
    color: (categoryMeta[title] || { color: "#94A3B8" }).color,
    services: svcList.map((s) => s.name),
    startingAt: svcList[0]?.price || "Contact Us",
  }));

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, rgba(10, 18, 36, 0.8), rgba(13, 23, 48, 0.6), rgba(124, 58, 237, 0.3))", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(124, 58, 237, 0.2)", border: "1px solid #7C3AED" }}>
            ⚙️ Our Services
          </span>
          <h1 style={{ color: "#F8FAFC", marginBottom: "16px" }}>100+ Digital Services</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            Everything you need to build, market, and scale your business online — delivered by one team, managed through our ERP.
          </p>
        </div>
      </section>

      <section style={{ padding: "60px 0 80px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "28px" }}>
            {categories.length > 0 ? categories.map((cat) => (
              <div key={cat.title} className="card" style={{ borderTopColor: cat.color }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "2.2rem" }}>{cat.icon}</div>
                  <div>
                    <h3 style={{ marginBottom: "0" }}>{cat.title}</h3>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: cat.color }}>From {cat.startingAt}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", marginBottom: "16px" }}>{cat.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {cat.services.map((s) => (
                    <li key={s} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem", color: "#94A3B8" }}>
                      <span style={{ color: cat.color, fontWeight: 700 }}>✓</span> {s}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "10px 20px", marginTop: "auto" }}>
                  Get Quote →
                </Link>
              </div>
            )) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontSize: "1rem", color: "#94A3B8", marginBottom: "16px" }}>Services are being set up. Please check back soon.</p>
                <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.88rem", padding: "10px 24px" }}>
                  Contact Us →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "rgba(10,18,36,0.65)", borderTop: "1px solid rgba(148,163,184,0.14)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow" style={{ background: "rgba(124, 58, 237, 0.2)", border: "1px solid #7C3AED" }}>
              💰 Pricing Tiers
            </span>
            <h2 style={{ marginBottom: "12px" }}>Choose Your Growth Plan</h2>
            <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto" }}>
              Transparent pricing, no hidden fees. Every plan includes our quality guarantee.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "28px" }}>
            {fallbackPricing.map((tier) => (
              <div
                key={tier.name}
                className="card"
                style={{
                  borderTopColor: tier.color,
                  position: "relative",
                  padding: tier.popular ? "40px 32px" : "32px",
                  boxShadow: tier.popular ? "0 18px 45px rgba(124, 58, 237, 0.2)" : undefined,
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: "absolute",
                    top: "-1px",
                    right: "24px",
                    background: tier.color,
                    color: "#F8FAFC",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "4px 14px",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: "0.5px",
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ marginBottom: "6px" }}>{tier.name}</h3>
                <p style={{ fontSize: "0.86rem", marginBottom: "20px" }}>{tier.desc}</p>
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: tier.color }}>{tier.price}</span>
                  <span style={{ fontSize: "0.82rem", color: "#94A3B8", marginLeft: "8px" }}>{tier.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "#94A3B8" }}>
                      <span style={{ color: tier.color, fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={tier.popular ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", padding: "12px 24px" }}
                >
                  {tier.popular ? "Start Growing →" : "Get Started →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "var(--bg-page)", borderTop: "1px solid rgba(148,163,184,0.14)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px" }}>Need a Custom Solution?</h2>
          <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 24px" }}>
            We build custom ERPs, CRMs, and automation workflows tailored to your exact business needs.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Schedule a Free Consultation →
          </Link>
        </div>
      </section>
    </>
  );
}
