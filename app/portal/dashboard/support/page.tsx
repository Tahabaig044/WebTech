"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getPortalTickets, createSupportTicket } from "@/lib/actions/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import EmptyState from "@/components/portal/EmptyState";
import PortalPagination from "@/components/portal/PortalPagination";
import { validatePortal, supportTicketSchema } from "@/lib/validations/portal";
import { toast } from "sonner";
import type { SupportTicket } from "@/lib/types";

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const fetchTickets = (p: number) => {
    setLoading(true);
    setError("");
    getPortalTickets({ page: p })
      .then((res) => {
        setTickets(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load tickets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session?.user?.email) return;
    fetchTickets(page);
  }, [session?.user?.email, page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    const validation = validatePortal(supportTicketSchema, form);
    if (!validation.success) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors([]);
    setSubmitting(true);
    const result = await createSupportTicket(form);
    setSubmitting(false);
    if (result.success) {
      toast.success("Ticket submitted", { description: "Our team will respond shortly." });
      setShowNewTicket(false);
      setForm({ subject: "", message: "", priority: "medium" });
      fetchTickets(1);
      setPage(1);
    } else {
      toast.error("Failed to submit ticket", { description: result.error });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Support Tickets</h1>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>Get help with your projects and account</p>
        </div>
        <button onClick={() => setShowNewTicket(true)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.35)", fontFamily: "var(--font-heading)" }}>+ New Ticket</button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#F87171", fontSize: "0.85rem" }}>{error}</div>
      )}

      <div className="portal-table-wrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div className="portal-table-grid" style={{ gridTemplateColumns: "0.8fr 2fr 1fr 0.8fr 0.8fr", padding: "14px 20px", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)", minWidth: "560px" }}>
          {["#", "Subject", "Date", "Status", "Priority"].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px" }}><LoadingSkeleton rows={5} /></div>
        ) : tickets.length === 0 ? (
          <EmptyState icon="⊘" title="No support tickets" description="Submit a ticket and our team will help you out." />
        ) : tickets.map((t, i) => (
          <Link
            key={t.id}
            href={`/portal/dashboard/support/${t.id}`}
            className="portal-table-grid"
            style={{
              gridTemplateColumns: "0.8fr 2fr 1fr 0.8fr 0.8fr",
              padding: "14px 20px",
              borderBottom: i < tickets.length - 1 ? "1px solid rgba(139,92,246,0.06)" : "none",
              textDecoration: "none",
              transition: "background 0.15s",
              minWidth: "560px",
            }}
          >
            <div style={{ color: "#C4B5FD", fontWeight: 600, fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{t.ticket_number}</div>
            <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem" }}>{t.subject}</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div><StatusBadge status={t.status} /></div>
            <div><StatusBadge status={t.priority} variant="priority" /></div>
          </Link>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <PortalPagination page={page} totalPages={totalPages} total={total} pageSize={20} onPageChange={setPage} />
      )}

      {showNewTicket && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }} onClick={() => setShowNewTicket(false)}>
          <div style={{ background: "#111827", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "16px", padding: "32px", maxWidth: "500px", width: "100%", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowNewTicket(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.06)", border: "none", color: "#9CA3AF", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ color: "#F1F5F9", fontSize: "1.2rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "20px" }}>Submit New Ticket</h2>

            {formErrors.length > 0 && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                {formErrors.map((err, i) => (
                  <div key={i} style={{ color: "#F87171", fontSize: "0.82rem" }}>• {err}</div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required placeholder="Brief description of the issue" style={{ width: "100%", background: "rgba(139,92,246,0.04)", border: "1.5px solid rgba(139,92,246,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#E5E7EB", fontSize: "0.88rem", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Priority</label>
                <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} style={{ width: "100%", background: "rgba(139,92,246,0.04)", border: "1.5px solid rgba(139,92,246,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#E5E7EB", fontSize: "0.88rem", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required placeholder="Describe your issue in detail..." style={{ width: "100%", background: "rgba(139,92,246,0.04)", border: "1.5px solid rgba(139,92,246,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#E5E7EB", fontSize: "0.88rem", fontFamily: "var(--font-body)", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowNewTicket(false)} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "var(--font-body)" }}>{submitting ? "Submitting..." : "Submit Ticket"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
