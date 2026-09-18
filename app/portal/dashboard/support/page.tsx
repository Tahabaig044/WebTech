"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPortalTickets, createSupportTicket } from "@/lib/actions/portal";
import type { SupportTicket } from "@/lib/types";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "open": return { color: "#3B82F6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" };
    case "in_progress": return { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" };
    case "resolved": return { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" };
    default: return { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "high": return { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" };
    case "medium": return { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" };
    case "low": return { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };
    default: return { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" };
  }
};

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    getPortalTickets()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;
    setSubmitting(true);
    const result = await createSupportTicket({
      subject: form.subject,
      message: form.message,
      priority: form.priority,
    });
    setSubmitting(false);
    if (result.success) {
      setShowNewTicket(false);
      setForm({ subject: "", message: "", priority: "medium" });
      getPortalTickets().then(setTickets);
    }
  };

  const selected = tickets.find((t) => t.id === selectedTicket);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Support Tickets</h1>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>Get help with your projects and account</p>
        </div>
        <button onClick={() => setShowNewTicket(true)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.35)", fontFamily: "var(--font-heading)" }}>+ New Ticket</button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 2fr 1fr 0.8fr 0.8fr", gap: "12px", padding: "14px 20px", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
          {["#", "Subject", "Date", "Status", "Priority"].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>No support tickets yet</div>
        ) : tickets.map((t, i) => {
          const st = getStatusStyle(t.status);
          const pr = getPriorityStyle(t.priority);
          const isSelected = selectedTicket === t.id;
          return (
            <div key={t.id} onClick={() => setSelectedTicket(isSelected ? null : t.id)} style={{ display: "grid", gridTemplateColumns: "0.8fr 2fr 1fr 0.8fr 0.8fr", gap: "12px", padding: "14px 20px", alignItems: "center", borderBottom: i < tickets.length - 1 ? "1px solid rgba(139,92,246,0.06)" : "none", background: isSelected ? "rgba(139,92,246,0.06)" : "transparent", cursor: "pointer" }}>
              <div style={{ color: "#C4B5FD", fontWeight: 600, fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>TK-{String(i + 1).padStart(3, "0")}</div>
              <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem" }}>{t.subject}</div>
              <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div><span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, textTransform: "capitalize" }}>{t.status.replace("_", " ")}</span></div>
              <div><span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700, color: pr.color, background: pr.bg, border: `1px solid ${pr.border}`, textTransform: "capitalize" }}>{t.priority}</span></div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "16px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ color: "#F1F5F9", fontSize: "1.1rem", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{selected.subject}</span>
            <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: 700, color: getStatusStyle(selected.status).color, background: getStatusStyle(selected.status).bg, border: `1px solid ${getStatusStyle(selected.status).border}`, textTransform: "capitalize" }}>{selected.status.replace("_", " ")}</span>
          </div>
          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)", marginBottom: "12px" }}>
            <div style={{ color: "#6B7280", fontSize: "0.72rem", fontWeight: 600, marginBottom: "6px" }}>{new Date(selected.created_at).toLocaleString()}</div>
            <p style={{ color: "#CBD5E1", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{selected.message}</p>
          </div>
        </div>
      )}

      {showNewTicket && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }} onClick={() => setShowNewTicket(false)}>
          <div style={{ background: "#111827", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "16px", padding: "32px", maxWidth: "500px", width: "100%", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowNewTicket(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.06)", border: "none", color: "#9CA3AF", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ color: "#F1F5F9", fontSize: "1.2rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "20px" }}>Submit New Ticket</h2>
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
