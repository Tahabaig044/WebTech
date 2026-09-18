import Link from "next/link";
import type { DBService } from "@/lib/types";

export default function RelatedServices({ services }: { services: DBService[] }) {
  if (services.length === 0) return null;

  return (
    <section style={{ padding: "60px 0 80px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow">🔗 Related Services</span>
          <h2 style={{ marginBottom: "12px" }}>Explore Similar Services</h2>
          <p style={{ color: "#64748B", maxWidth: "480px", margin: "0 auto" }}>
            Discover other services in this category that might fit your needs.
          </p>
        </div>

        <div className="grid grid-3">
          {services.map((service) => (
            <div key={service.id} className="card">
              {service.icon && (
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{service.icon}</div>
              )}
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#2563EB",
                  background: "rgba(37, 99, 235, 0.08)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              >
                {service.category}
              </span>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>{service.name}</h3>
              {service.short_description && (
                <p style={{ fontSize: "0.88rem", marginBottom: "16px", flex: 1 }}>
                  {service.short_description}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "18px" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#2563EB" }}>
                  {service.price}
                </span>
                {service.price_period && (
                  <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                    /{service.price_period}
                  </span>
                )}
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
