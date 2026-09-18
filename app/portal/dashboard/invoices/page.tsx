"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPortalInvoices } from "@/lib/actions/portal";
import type { Invoice } from "@/lib/types";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "paid": return { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" };
    case "pending": return { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" };
    case "overdue": return { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" };
    default: return { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };
  }
};

export default function InvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    getPortalInvoices()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  const summaryCards = [
    { label: "Total Paid", value: `PKR ${totalPaid.toLocaleString()}`, icon: "✓", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
    { label: "Pending", value: `PKR ${totalPending.toLocaleString()}`, icon: "◎", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
    { label: "Overdue", value: `PKR ${totalOverdue.toLocaleString()}`, icon: "!", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
  ];

  const preview = invoices.find((i) => i.id === previewId);

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

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 0.8fr", gap: "12px", padding: "14px 20px", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
          {["Invoice #", "Description", "Date", "Amount", "Status"].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>No invoices yet</div>
        ) : invoices.map((inv, i) => {
          const st = getStatusStyle(inv.status);
          return (
            <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 0.8fr", gap: "12px", padding: "14px 20px", alignItems: "center", borderBottom: i < invoices.length - 1 ? "1px solid rgba(139,92,246,0.06)" : "none" }}>
              <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}>{inv.invoice_number}</div>
              <div style={{ color: "#CBD5E1", fontSize: "0.84rem" }}>{inv.description}</div>
              <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{new Date(inv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "0.88rem" }}>{inv.currency} {Number(inv.amount).toLocaleString()}</span>
                <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "0.68rem", fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, textTransform: "capitalize" }}>{inv.status}</span>
              </div>
              <div>
                <button onClick={() => setPreviewId(inv.id)} style={{ padding: "6px 12px", borderRadius: "7px", border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.1)", color: "#C4B5FD", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Preview</button>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }} onClick={() => setPreviewId(null)}>
          <div style={{ background: "#111827", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "16px", padding: "32px", maxWidth: "520px", width: "100%", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewId(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.06)", border: "none", color: "#9CA3AF", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ color: "#6B7280", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Invoice Preview</div>
              <div style={{ color: "#F1F5F9", fontSize: "1.2rem", fontWeight: 700 }}>{preview.invoice_number}</div>
            </div>
            <div style={{ background: "#0D1321", borderRadius: "10px", padding: "24px", border: "1px solid rgba(139,92,246,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "1rem" }}>Pixelwyre Digital</div>
                  <div style={{ color: "#6B7280", fontSize: "0.78rem" }}>Karachi, Pakistan</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#C4B5FD", fontWeight: 700, fontSize: "0.88rem" }}>{preview.invoice_number}</div>
                  <div style={{ color: "#6B7280", fontSize: "0.78rem" }}>{new Date(preview.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.1)", paddingTop: "16px", marginBottom: "16px" }}>
                <div style={{ color: "#9CA3AF", fontSize: "0.78rem", marginBottom: "4px" }}>Description</div>
                <div style={{ color: "#E5E7EB", fontSize: "0.88rem", fontWeight: 600 }}>{preview.description}</div>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.15)", paddingTop: "12px", marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "0.92rem" }}>Total</span>
                <span style={{ color: "#10B981", fontWeight: 800, fontSize: "1rem" }}>{preview.currency} {Number(preview.amount).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setPreviewId(null)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
