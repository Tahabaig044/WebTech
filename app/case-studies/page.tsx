import type { Metadata } from "next";
import Link from "next/link";
import { getCaseStudies } from "@/lib/supabase/queries";
import type { CaseStudy } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real results from Pixelwyre Digital clients — see how we helped businesses grow with web development, SEO, and automation.",
};

export default async function CaseStudiesPage() {
  let cases: CaseStudy[] = [];
  try {
    cases = await getCaseStudies();
  } catch {
    cases = [];
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

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          {cases.length > 0 ? (
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
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "1rem", color: "#64748B", marginBottom: "16px" }}>Case studies are being prepared. Check back soon for real client success stories.</p>
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.88rem", padding: "10px 24px" }}>
                Start Your Project →
              </Link>
            </div>
          )}
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
