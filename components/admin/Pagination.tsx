"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
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

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", flexWrap: "wrap", gap: "12px" }}>
      <span style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>
        Showing {from}–{to} of {total}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)", color: page === 1 ? "var(--admin-text-faint)" : "var(--admin-text)",
            fontSize: "0.8125rem", fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)", opacity: page === 1 ? 0.5 : 1,
          }}
        >
          Prev
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ padding: "6px 6px", color: "var(--admin-text-faint)", fontSize: "0.8125rem" }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                padding: "6px 10px", borderRadius: "6px",
                border: p === page ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                background: p === page ? "var(--admin-accent)" : "var(--admin-surface)",
                color: p === page ? "#fff" : "var(--admin-text)",
                fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)", color: page === totalPages ? "var(--admin-text-faint)" : "var(--admin-text)",
            fontSize: "0.8125rem", fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)", opacity: page === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
