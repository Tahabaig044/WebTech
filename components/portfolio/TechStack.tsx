export default function TechStack({ tech }: { tech: string[] }) {
  if (!tech || tech.length === 0) return null;

  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>Tech Stack</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {tech.map((t) => (
          <span
            key={t}
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "5px 14px",
              borderRadius: "6px",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              color: "#CBD5E1",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
