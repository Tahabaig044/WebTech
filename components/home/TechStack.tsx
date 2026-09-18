const integrations = [
  { icon: "☁️", name: "AWS / Google Cloud", desc: "Auto-scaling cloud infrastructure with 99.99% uptime SLA" },
  { icon: "🖥️", name: "cPanel Hosting", desc: "Traditional hosting with full cPanel access and WHM control" },
  { icon: "🤖", name: "OpenAI API", desc: "GPT-powered chatbots, content generation & smart automations" },
  { icon: "📱", name: "WhatsApp Business API", desc: "Verified green-tick WhatsApp for broadcasts & support bots" },
  { icon: "⚡", name: "Google Apps Script", desc: "Serverless workflow automation connecting Sheets, Gmail & Forms" },
  { icon: "💳", name: "Stripe / PayFast", desc: "Secure payment processing with multi-currency & subscription billing" },
];

export default function TechStack() {
  return (
    <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">🔧 Integrations & Tech Stack</span>
          <h2 style={{ marginBottom: "14px" }}>Built on What Works</h2>
          <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
            Enterprise-grade infrastructure and APIs powering every Pixelwyre solution.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {integrations.map((item) => (
            <div
              key={item.name}
              className="card-dark"
              style={{ flexDirection: "row", alignItems: "flex-start", gap: "18px", padding: "28px" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ marginBottom: "6px", fontSize: "0.95rem" }}>{item.name}</h3>
                <p style={{ margin: 0, fontSize: "0.86rem" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
