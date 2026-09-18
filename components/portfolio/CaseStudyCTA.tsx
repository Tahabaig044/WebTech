import Link from "next/link";

export default function CaseStudyCTA() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 100%)",
        padding: "60px 0",
        textAlign: "center",
      }}
    >
      <div className="wrap">
        <h2 style={{ color: "#FFFFFF", marginBottom: "12px" }}>Want Similar Results?</h2>
        <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 28px" }}>
          Let&apos;s discuss how we can help your business grow with a custom digital strategy.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Start Your Project →
          </Link>
          <Link href="/case-studies" className="btn btn-secondary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            View All Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}
