import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceBySlug, getRelatedServices } from "@/lib/supabase/queries";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import RelatedServices from "@/components/services/RelatedServices";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.name}`,
    description:
      service.short_description ||
      `${service.name} — professional ${service.category.toLowerCase()} service from Pixelwyre Digital. ${service.price}.`,
    openGraph: {
      title: service.name,
      description:
        service.short_description ||
        `${service.name} — ${service.category} service from Pixelwyre Digital`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(service.category, service.slug, 3);

  const whatsappNumber = "923001234567";
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the ${service.name} service. Can you share more details?`
  );

  return (
    <>
      {/* Breadcrumb */}
      <section style={{ padding: "20px 0", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div className="wrap">
          <nav style={{ fontSize: "0.84rem", color: "#64748B" }}>
            <Link href="/" style={{ color: "#64748B" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href="/services" style={{ color: "#64748B" }}>Services</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href={`/services?category=${encodeURIComponent(service.category)}`} style={{ color: "#64748B" }}>
              {service.category}
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0F172A", fontWeight: 600 }}>{service.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section
        style={{
          padding: "60px 0 50px",
          background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)",
        }}
      >
        <div className="wrap">
          <span
            className="eyebrow"
            style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}
          >
            {service.icon && <span>{service.icon}</span>}
            {service.category}
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>{service.name}</h1>
          {service.short_description && (
            <p style={{ color: "#94A3B8", fontSize: "1.1rem", maxWidth: "600px", marginBottom: "24px" }}>
              {service.short_description}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "#60A5FA" }}>{service.price}</span>
            {service.price_period && (
              <span style={{ fontSize: "0.95rem", color: "#94A3B8" }}>/{service.price_period}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href="/contact" className="btn btn-primary" style={{ padding: "13px 32px", fontSize: "1rem" }}>
              Get a Free Quote →
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34D399",
                border: "1.5px solid #10B981",
                padding: "13px 32px",
                fontSize: "1rem",
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
            {/* Main content (2/3) */}
            <div>
              <h2 style={{ marginBottom: "20px" }}>About This Service</h2>
              <div
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  color: "#475569",
                  marginBottom: "36px",
                }}
              >
                {service.description.split("\n").map((paragraph, i) => (
                  <p key={i} style={{ marginBottom: "16px" }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {service.features && service.features.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "20px" }}>What&apos;s Included</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {service.features.map((feature, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "14px 16px",
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                        }}
                      >
                        <span style={{ color: "#16A34A", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}>
                          ✓
                        </span>
                        <span style={{ fontSize: "0.88rem", color: "#334155" }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <div style={{ position: "sticky", top: "100px" }}>
              {/* Price card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderTop: "4px solid #2563EB",
                  borderRadius: "var(--radius)",
                  padding: "32px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p style={{ fontSize: "0.82rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, margin: "0 0 8px" }}>
                  Starting at
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#2563EB" }}>{service.price}</span>
                  {service.price_period && (
                    <span style={{ fontSize: "0.88rem", color: "#94A3B8" }}>/{service.price_period}</span>
                  )}
                </div>
                <p style={{ fontSize: "0.86rem", color: "#64748B", marginBottom: "24px", margin: "0 0 24px" }}>
                  All-inclusive pricing. No hidden fees.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <a
                    href="/contact"
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "13px 24px" }}
                  >
                    Get a Free Quote →
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "13px 24px",
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#10B981",
                      border: "1.5px solid #10B981",
                    }}
                  >
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Trust signals */}
              <div style={{ marginTop: "20px", padding: "20px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { icon: "⚡", text: "Fast delivery" },
                    { icon: "🔄", text: "Revisions included" },
                    { icon: "🛡️", text: "1 month free support" },
                    { icon: "💬", text: "24/7 WhatsApp" },
                  ].map((item) => (
                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                      <span style={{ fontSize: "0.86rem", color: "#475569", fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ServiceFAQ />

      {/* Related Services */}
      <RelatedServices services={relatedServices} />

      {/* CTA Banner */}
      <section
        style={{
          padding: "70px 0",
          background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)",
          textAlign: "center",
        }}
      >
        <div className="wrap">
          <h2 style={{ color: "#FFFFFF", marginBottom: "14px" }}>Ready to Get Started?</h2>
          <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 28px", fontSize: "1.05rem" }}>
            Let&apos;s discuss your project and find the perfect solution for your business.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/contact" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
              Schedule a Free Consultation →
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                padding: "14px 36px",
                fontSize: "1rem",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34D399",
                border: "1.5px solid #10B981",
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .wrap > div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
