import type { Metadata } from "next";
import Link from "next/link";
import { getCaseStudies } from "@/lib/supabase/queries";
import type { CaseStudy } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case Studies — Pixelwyre Digital",
  description: "Real results from Pixelwyre Digital clients — see how we helped businesses grow with web development, SEO, and automation.",
};

const fallbackCases = [
  { slug: "al-razak-traders", client_name: "Al-Razaq Traders", industry: "Retail & E-Commerce", result_summary: "340% increase in online orders", color: "#2563EB", timeline: "3 months", metrics: [{ label: "Online Orders", before: "120/mo", after: "528/mo", change: "+340%" }, { label: "Revenue", before: "₨ 2.1M/mo", after: "₨ 8.4M/mo", change: "+300%" }, { label: "Google Maps Rank", before: "#18", after: "#2", change: "Top 3" }], description: "Full e-commerce build with Stripe integration, Google Shopping feed, and automated WhatsApp order confirmations.", tech_stack: ["Next.js", "Stripe", "Google Shopping", "WhatsApp API", "Cloudflare"] },
  { slug: "greenfield-academy", client_name: "GreenField Academy", industry: "Education", result_summary: "60% admin workload reduction", color: "#16A34A", timeline: "2 months", metrics: [{ label: "Students Managed", before: "Manual", after: "1,200", change: "Digital" }, { label: "Parent Queries", before: "45/day", after: "8/day", change: "-82%" }, { label: "Fee Collection", before: "72%", after: "98%", change: "+26pts" }], description: "Deployed 12-module School SMS Suite serving 1,200 students with parent portal and biometric attendance.", tech_stack: ["Custom ERP", "WhatsApp Bot", "Biometric API", "Parent Portal", "SMS Gateway"] },
  { slug: "fitzone-gym", client_name: "FitZone Gym", industry: "Fitness & Wellness", result_summary: "2x membership sign-ups", color: "#7C3AED", timeline: "6 weeks", metrics: [{ label: "New Members", before: "15/mo", after: "32/mo", change: "+113%" }, { label: "Google Maps Views", before: "200/mo", after: "1,800/mo", change: "+800%" }, { label: "Lead Response Time", before: "24hrs", after: "< 2hrs", change: "12x faster" }], description: "Landing page + CRM pipeline + Google Maps SEO driving 45% of new leads organically within 60 days.", tech_stack: ["Landing Page", "CRM Pipeline", "Google Maps SEO", "WhatsApp Automation", "Analytics"] },
  { slug: "smile-dental-clinic", client_name: "Smile Dental Clinic", industry: "Healthcare", result_summary: "3x patient bookings", color: "#0284C7", timeline: "8 weeks", metrics: [{ label: "Monthly Bookings", before: "60", after: "185", change: "+208%" }, { label: "Google Reviews", before: "12", after: "89", change: "+642%" }, { label: "No-Show Rate", before: "28%", after: "6%", change: "-79%" }], description: "Built a 24/7 online booking calendar with automated SMS/WhatsApp reminders and NFC review cards.", tech_stack: ["Booking Calendar", "SMS Reminders", "NFC Review Cards", "Google Maps", "WhatsApp"] },
  { slug: "bite-and-sip-cafe", client_name: "Bite & Sip Café", industry: "Restaurant & Food", result_summary: "₨ 2.8M monthly delivery revenue", color: "#F59E0B", timeline: "4 weeks", metrics: [{ label: "QR Menu Scans", before: "0", after: "3,200/mo", change: "New Channel" }, { label: "Delivery Orders", before: "90/mo", after: "380/mo", change: "+322%" }, { label: "Avg Order Value", before: "₨ 850", after: "₨ 1,200", change: "+41%" }], description: "Contactless QR menus for 8 table locations, WhatsApp order routing system, and local Google Maps ranking optimization.", tech_stack: ["QR Menu System", "WhatsApp Router", "Google Maps SEO", "POS Integration", "Analytics"] },
];

const stats = [
  { value: "240+", label: "Projects Delivered" },
  { value: "85+", label: "Active Clients" },
  { value: "₨ 450M+", label: "Revenue Generated" },
  { value: "+340%", label: "Avg Client ROI" },
];

export default async function CaseStudiesPage() {
  let cases: CaseStudy[] = [];
  try {
    cases = await getCaseStudies();
  } catch {
    cases = fallbackCases as unknown as CaseStudy[];
  }

  if (!cases || cases.length === 0) {
    cases = fallbackCases as unknown as CaseStudy[];
  }

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            📂 Case Studies
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>Real Results, Real Businesses</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            See how our solutions drive measurable growth across industries.
          </p>
        </div>
      </section>

      <section style={{ padding: "50px 0", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px", textAlign: "center" }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--brand-blue)", lineHeight: 1.1, marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gap: "40px" }}>
            {cases.map((c) => {
              const color = "#2563EB";
              return (
                <div key={c.slug} className="card" style={{ borderTopColor: color, padding: "36px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                        <h3 style={{ margin: 0 }}>{c.client_name}</h3>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", background: `${color}15`, color }}>
                          {c.industry}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Timeline: {c.timeline || "TBD"}</span>
                    </div>
                    <span style={{ fontSize: "0.92rem", fontWeight: 800, padding: "8px 18px", borderRadius: "12px", background: `${color}15`, color }}>
                      {c.result_summary}
                    </span>
                  </div>

                  {c.metrics && c.metrics.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                      {c.metrics.map((m) => (
                        <div key={m.label} style={{ background: "#F8FAFC", borderRadius: "10px", padding: "16px", border: "1px solid #E2E8F0" }}>
                          <div style={{ fontSize: "0.76rem", color: "#94A3B8", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "0.82rem", color: "#94A3B8", textDecoration: "line-through" }}>{m.before}</span>
                            <span style={{ fontSize: "0.82rem", color: "#64748B" }}>→</span>
                            <span style={{ fontSize: "1.1rem", fontWeight: 800, color }}>{m.after}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16A34A" }}>{m.change}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ fontSize: "0.92rem", marginBottom: "16px" }}>{c.description}</p>

                  {c.tech_stack && c.tech_stack.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {c.tech_stack.map((t) => (
                        <span key={t} style={{ fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: "6px", background: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "16px" }}>
                    <Link href={`/case-studies/${c.slug}`} className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
                      Read Full Case Study →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px" }}>Ready to Be Our Next Success Story?</h2>
          <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto 24px" }}>
            Let&apos;s discuss how we can drive measurable results for your business.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Start Your Project →
          </Link>
        </div>
      </section>
    </>
  );
}
