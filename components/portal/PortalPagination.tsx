"use client";

interface PortalPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function PortalPagination({ page, totalPages, total, pageSize, onPageChange }: PortalPaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "6px 10px", borderRadius: "6px",
    border: active ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
    color: active ? "#C4B5FD" : disabled ? "#4B5563" : "#9CA3AF",
    fontSize: "0.8125rem", fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)", opacity: disabled ? 0.5 : 1,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", flexWrap: "wrap", gap: "12px" }}>
      <span style={{ color: "#6B7280", fontSize: "0.8125rem" }}>
        Showing {from}–{to} of {total}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={btnStyle(false, page === 1)}>
          Prev
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ padding: "6px 6px", color: "#4B5563", fontSize: "0.8125rem" }}>...</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p === page, false)}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={btnStyle(false, page === totalPages)}>
          Next
        </button>
      </div>
    </div>
  );
}
