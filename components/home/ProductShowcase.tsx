const products = [
  {
    icon: "🧠",
    badge: "Core",
    badgeColor: "#2563EB",
    title: "ERP Suite",
    description: "Central dashboard to manage all clients, invoicing, tasks, and automations.",
    ctaText: "Explore ERP",
    ctaLink: "/services#erp",
    borderColor: "#2563EB",
  },
  {
    icon: "👥",
    badge: "Client",
    badgeColor: "#7C3AED",
    title: "Client Portal",
    description: "Dedicated login for your clients to track projects, invoices, and tickets.",
    ctaText: "View Portal",
    ctaLink: "/services#portal",
    borderColor: "#7C3AED",
  },
  {
    icon: "📊",
    badge: "Analytics",
    badgeColor: "#0284C7",
    title: "BI Audit Engine",
    description: "Automated business intelligence audits with AI-powered recommendations.",
    ctaText: "Run Audit",
    ctaLink: "/services#bi-audit",
    borderColor: "#0284C7",
  },
  {
    icon: "☁️",
    badge: "Infrastructure",
    badgeColor: "#0891B2",
    title: "Managed Hosting",
    description: "99.99% uptime cloud hosting with SSL, CDN, and daily backups.",
    ctaText: "View Plans",
    ctaLink: "/services#hosting",
    borderColor: "#0891B2",
  },
  {
    icon: "🏪",
    badge: "Micro SaaS",
    badgeColor: "#16A34A",
    title: "PKR Store",
    description: "E-commerce storefront optimized for Pakistani COD and bank transfer payments.",
    ctaText: "Launch Store",
    ctaLink: "/services#pkr-store",
    borderColor: "#16A34A",
  },
  {
    icon: "🏫",
    badge: "Education",
    badgeColor: "#F59E0B",
    title: "School SMS Suite",
    description: "Student admissions, fee vouchers, exam results, and parent WhatsApp alerts.",
    ctaText: "Learn More",
    ctaLink: "/services#school",
    borderColor: "#F59E0B",
  },
  {
    icon: "💇",
    badge: "Salon",
    badgeColor: "#EC4899",
    title: "Salon Growth Suite",
    description: "Google Maps ranking, WhatsApp booking engine, and NFC review cards.",
    ctaText: "View Suite",
    ctaLink: "/services#salon",
    borderColor: "#EC4899",
  },
  {
    icon: "🍽️",
    badge: "Restaurant",
    badgeColor: "#EF4444",
    title: "Restaurant & QR Menu",
    description: "QR contactless menus, WhatsApp order routing, and stock toggle engine.",
    ctaText: "View Suite",
    ctaLink: "/services#restaurant",
    borderColor: "#EF4444",
  },
  {
    icon: "🏥",
    badge: "Healthcare",
    badgeColor: "#10B981",
    title: "Clinic Booking Suite",
    description: "24/7 patient booking calendar, digital prescriptions, and WhatsApp reminders.",
    ctaText: "View Suite",
    ctaLink: "/services#clinic",
    borderColor: "#10B981",
  },
  {
    icon: "🏠",
    badge: "Real Estate",
    badgeColor: "#8B5CF6",
    title: "Real Estate Listings",
    description: "Interactive property engine, local SEO, and instant buyer WhatsApp connector.",
    ctaText: "View Suite",
    ctaLink: "/services#realestate",
    borderColor: "#8B5CF6",
  },
  {
    icon: "🛒",
    badge: "E-Commerce",
    badgeColor: "#F97316",
    title: "E-Commerce Suite",
    description: "Product catalog, COD gateways, WhatsApp order tracking, and 90+ speed.",
    ctaText: "View Suite",
    ctaLink: "/services#ecommerce",
    borderColor: "#F97316",
  },
  {
    icon: "💳",
    badge: "NFC",
    badgeColor: "#14B8A6",
    title: "NFC Smart Card",
    description: "Tap-to-review NFC business cards that drive instant Google reviews.",
    ctaText: "Order Now",
    ctaLink: "/services#nfc",
    borderColor: "#14B8A6",
  },
];

export default function ProductShowcase() {
  return (
    <section style={{ padding: "60px 0", background: "var(--bg-page)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="eyebrow">🛠️ Our Products</span>
          <h2>Everything Your Business Needs</h2>
          <p style={{ maxWidth: "560px", margin: "0 auto" }}>
            From websites to ERP systems, we build the complete digital infrastructure for your business.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.title}
              className="card"
              style={{
                borderTopColor: p.borderColor,
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "1.6rem" }}>{p.icon}</span>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      background: `${p.badgeColor}22`,
                      color: p.badgeColor,
                      border: `1px solid ${p.badgeColor}55`,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              </div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>{p.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "14px", flex: 1 }}>
                {p.description}
              </p>
              <a
                href={p.ctaLink}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--brand-blue)",
                }}
              >
                {p.ctaText} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
