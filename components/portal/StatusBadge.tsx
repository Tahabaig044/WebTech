interface StatusBadgeProps {
  status: string;
  variant?: "status" | "priority";
}

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  in_progress: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  completed: { color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
  pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  paid: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  overdue: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  open: { color: "#7C3AED", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
  resolved: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  closed: { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" },
  on_hold: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  draft: { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" },
  high: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  low: { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" },
  urgent: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
};

export default function StatusBadge({ status, variant = "status" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700,
      color: style.color, background: style.bg, border: `1px solid ${style.border}`,
      textTransform: "capitalize", whiteSpace: "nowrap",
    }}>
      {variant === "priority" ? status : status.replace("_", " ")}
    </span>
  );
}
