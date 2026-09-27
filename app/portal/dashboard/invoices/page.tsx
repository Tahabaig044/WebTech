"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getPortalInvoices } from "@/lib/actions/portal";
import { formatCurrency } from "@/lib/utils/currency";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import EmptyState from "@/components/portal/EmptyState";
import PortalPagination from "@/components/portal/PortalPagination";
import type { Invoice } from "@/lib/types";

export default function InvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    setLoading(true);
    setError("");
    getPortalInvoices({ page })
      .then((res) => {
        setInvoices(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load invoices"))
      .finally(() => setLoading(false));
  }, [session?.user?.email, page]);

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  const summaryCards = [
    { label: "Total Paid", value: formatCurrency(totalPaid), icon: "✓", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
    { label: "Pending", value: formatCurrency(totalPending), icon: "◎", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
    { label: "Overdue", value: formatCurrency(totalOverdue), icon: "!", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Invoices</h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>Manage and download your invoices</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {summaryCards.map((c, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.border}`, borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: c.color, border: `1px solid ${c.border}`, flexShrink: 0, fontWeight: 800 }}>{c.icon}</div>
            <div>
              <div style={{ color: "#F1F5F9", fontSize: "1.3rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{loading ? "—" : c.value}</div>
              <div style={{ color: "#6B7280", fontSize: "0.78rem", fontWeight: 500 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#F87171", fontSize: "0.85rem" }}>{error}</div>
      )}

      <div className="portal-table-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div className="portal-table-grid" style={{ gridTemplateColumns: "1fr 1.5fr 0.8fr 1fr 0.8fr 0.6fr", padding: "14px 20px", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)", minWidth: "650px" }}>
          {["Invoice #", "Description", "Due Date", "Amount", "Status", ""].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px" }}><LoadingSkeleton rows={5} /></div>
        ) : invoices.length === 0 ? (
          <EmptyState icon="⊡" title="No invoices yet" description="Your invoices will appear here." />
        ) : invoices.map((inv, i) => (
          <Link
            key={inv.id}
            href={`/portal/dashboard/invoices/${inv.id}`}
            className="portal-table-grid"
            style={{
              gridTemplateColumns: "1fr 1.5fr 0.8fr 1fr 0.8fr 0.6fr",
              padding: "14px 20px",
              borderBottom: i < invoices.length - 1 ? "1px solid rgba(139,92,246,0.06)" : "none",
              textDecoration: "none",
              transition: "background 0.15s",
              minWidth: "650px",
            }}
          >
            <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}>{inv.invoice_number}</div>
            <div style={{ color: "#CBD5E1", fontSize: "0.84rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.description || "—"}</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "0.88rem" }}>{formatCurrency(Number(inv.amount), inv.currency)}</span>
            </div>
            <div><StatusBadge status={inv.status} /></div>
            <div style={{ color: "#8B5CF6", fontWeight: 600, fontSize: "0.82rem" }}>View →</div>
          </Link>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <PortalPagination page={page} totalPages={totalPages} total={total} pageSize={20} onPageChange={setPage} />
      )}
    </div>
  );
}
