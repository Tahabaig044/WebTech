interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.5 }}>{icon}</div>
      <h3 style={{ color: "#E5E7EB", fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#6B7280", fontSize: "0.88rem", maxWidth: "360px", margin: "0 auto", lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}
