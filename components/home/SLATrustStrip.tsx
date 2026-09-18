const badges = [
  {
    icon: "🔒",
    iconClass: "sla-icon-blue",
    title: "256-Bit SSL",
    sub: "Enterprise-grade encryption",
  },
  {
    icon: "⏱️",
    iconClass: "sla-icon-green",
    title: "99.99% Uptime",
    sub: "Guaranteed availability",
  },
  {
    icon: "🛡️",
    iconClass: "sla-icon-purple",
    title: "ISO 27001",
    sub: "Certified data security",
  },
  {
    icon: "⚡",
    iconClass: "sla-icon-gold",
    title: "15-Min Response SLA",
    sub: "Priority support guarantee",
  },
];

export default function SLATrustStrip() {
  return (
    <section className="sla-trust-strip">
      <div className="wrap">
        <div className="sla-trust-grid">
          {badges.map((b) => (
            <div key={b.title} className="sla-badge-card">
              <div className={`sla-badge-icon ${b.iconClass}`}>{b.icon}</div>
              <div>
                <div className="sla-badge-title">{b.title}</div>
                <div className="sla-badge-sub">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
