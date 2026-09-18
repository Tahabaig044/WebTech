import type { CaseMetric } from "@/lib/types";

export default function MetricsGrid({ metrics }: { metrics: CaseMetric[] }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "12px" }}>
            {m.label}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.88rem", color: "#94A3B8", textDecoration: "line-through" }}>{m.before}</span>
            <span style={{ color: "#CBD5E1" }}>→</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16A34A" }}>{m.after}</span>
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "12px",
              background: "rgba(22,163,74,0.1)",
              color: "#16A34A",
            }}
          >
            {m.change}
          </span>
        </div>
      ))}
    </div>
  );
}
