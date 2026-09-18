import HeroTabs from "./HeroTabs";

export default function HeroSection() {
  return (
    <section style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)" }}>
      <div className="wrap" style={{ paddingTop: "60px", paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <span className="eyebrow">⚡ Web Dev · Local SEO · Ads · Managed Hosting</span>
            <h1 style={{ marginBottom: "18px", lineHeight: 1.2 }}>
              We Wire Together Your Entire Digital Presence.
            </h1>
            <p className="lede" style={{ marginBottom: "28px", maxWidth: "520px" }}>
              One connected system for building, launching, marketing, and hosting your business online — operated centrally through our ERP intelligence suite.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a href="/contact" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                Start Your Project →
              </a>
              <a href="/services" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                Explore 100+ Services
              </a>
            </div>
          </div>

          <HeroTabs />
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: "50px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #060D19 0%, #0F2B5C 100%)",
            border: "1px solid #1E3A8A",
            borderRadius: "var(--radius-lg)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            boxShadow: "var(--shadow-shiny)",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>🔍</span>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ color: "#FFFFFF", marginBottom: "2px", fontSize: "1rem" }}>Instant Business Audit</h4>
            <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.85rem" }}>Check your Google Maps rank, mobile speed & WhatsApp bot status</p>
          </div>
          <input
            type="url"
            placeholder="https://yourbusiness.com"
            style={{
              flex: "2",
              minWidth: "260px",
              background: "#060C1B",
              border: "1.5px solid #3B82F6",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              borderRadius: "10px",
              padding: "12px 18px",
            }}
          />
          <button className="btn btn-primary" style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
            Analyze →
          </button>
        </div>
      </div>
    </section>
  );
}
