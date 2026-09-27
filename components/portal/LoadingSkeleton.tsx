export default function LoadingSkeleton({ rows = 3, type = "list" }: { rows?: number; type?: "list" | "cards" }) {
  if (type === "cards") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)",
            borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(139,92,246,0.08)", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: "20px", width: "60px", borderRadius: "4px", background: "rgba(139,92,246,0.08)", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "14px", width: "100px", borderRadius: "4px", background: "rgba(139,92,246,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.1)",
          borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ height: "16px", width: "70%", borderRadius: "4px", background: "rgba(139,92,246,0.08)", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: "12px", width: "40%", borderRadius: "4px", background: "rgba(139,92,246,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ height: "24px", width: "60px", borderRadius: "6px", background: "rgba(139,92,246,0.08)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
