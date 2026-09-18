import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/lib/supabase/queries";
import MetricsGrid from "@/components/portfolio/MetricsGrid";
import TechStack from "@/components/portfolio/TechStack";
import CaseStudyCTA from "@/components/portfolio/CaseStudyCTA";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.client_name} Case Study`,
    description: study.result_summary,
    openGraph: {
      title: `${study.client_name} — Case Study`,
      description: study.result_summary,
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)",
          padding: "80px 0 60px",
        }}
      >
        <div className="wrap">
          <nav style={{ marginBottom: "24px" }}>
            <ol style={{ display: "flex", gap: "8px", listStyle: "none", padding: 0, margin: 0, fontSize: "0.82rem" }}>
              <li><Link href="/" style={{ color: "#94A3B8" }}>Home</Link></li>
              <li style={{ color: "#94A3B8" }}>/</li>
              <li><Link href="/case-studies" style={{ color: "#94A3B8" }}>Case Studies</Link></li>
              <li style={{ color: "#94A3B8" }}>/</li>
              <li style={{ color: "#FFFFFF" }}>{study.client_name}</li>
            </ol>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 14px",
                borderRadius: "12px",
                background: "rgba(59,130,246,0.2)",
                color: "#60A5FA",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              {study.industry}
            </span>
            {study.timeline && (
              <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Timeline: {study.timeline}</span>
            )}
          </div>

          <h1 style={{ color: "#FFFFFF", marginBottom: "12px" }}>{study.client_name}</h1>
          <p style={{ color: "#60A5FA", fontSize: "1.2rem", fontWeight: 700, maxWidth: "600px" }}>
            {study.result_summary}
          </p>
        </div>
      </section>

      {/* Metrics */}
      {study.metrics && study.metrics.length > 0 && (
        <section style={{ padding: "48px 0", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <div className="wrap">
            <h2 style={{ marginBottom: "20px" }}>Key Results</h2>
            <MetricsGrid metrics={study.metrics} />
          </div>
        </section>
      )}

      {/* Challenge + Solution */}
      <section style={{ padding: "60px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
            <div>
              <h2 style={{ marginBottom: "16px" }}>The Challenge</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                {study.challenge || study.description}
              </p>
            </div>
            {study.solution && (
              <div>
                <h2 style={{ marginBottom: "16px" }}>Our Solution</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  {study.solution}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section style={{ padding: "0 0 60px" }}>
        <div className="wrap" style={{ maxWidth: "800px" }}>
          <h2 style={{ marginBottom: "16px" }}>Project Overview</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.75, whiteSpace: "pre-line" }}>
            {study.description}
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      {study.tech_stack && study.tech_stack.length > 0 && (
        <section style={{ padding: "0 0 60px" }}>
          <div className="wrap" style={{ maxWidth: "800px" }}>
            <TechStack tech={study.tech_stack} />
          </div>
        </section>
      )}

      {/* CTA */}
      <CaseStudyCTA />
    </>
  );
}
