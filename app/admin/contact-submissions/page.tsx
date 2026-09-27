"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  getAllContactSubmissions,
  updateContactSubmissionStatus,
  deleteContactSubmission,
} from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import { exportToCSV, CONTACT_EXPORT_COLUMNS } from "@/lib/utils/export";
import type { ContactSubmission } from "@/lib/types";

const statusBadgeClass: Record<string, string> = {
  new: "info",
  read: "warning",
  replied: "success",
};

const statusLabels: Record<string, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
};

export default function AdminContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    getAllContactSubmissions()
      .then(setSubmissions)
      .catch((e) => setError(e.message || "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchSearch =
        (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.message || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [submissions, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const total = submissions.length;
    const newCount = submissions.filter((s) => s.status === "new").length;
    const readCount = submissions.filter((s) => s.status === "read").length;
    const repliedCount = submissions.filter((s) => s.status === "replied").length;
    return [
      { label: "Total", value: total, color: "var(--admin-text)" },
      { label: "New", value: newCount, color: "var(--admin-info)" },
      { label: "Read", value: readCount, color: "var(--admin-warning)" },
      { label: "Replied", value: repliedCount, color: "var(--admin-success)" },
    ];
  }, [submissions]);

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id);
    const result = await updateContactSubmissionStatus(id, "read");
    if (result.error) {
      setError(result.error);
    } else {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "read" } : s))
      );
      if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status: "read" } : null));
    }
    setActionLoading(null);
  };

  const handleMarkAsReplied = async (id: string) => {
    setActionLoading(id);
    const result = await updateContactSubmissionStatus(id, "replied");
    if (result.error) {
      setError(result.error);
    } else {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "replied" } : s))
      );
      if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status: "replied" } : null));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    setDeleteTarget(sub);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    setActionLoading(id);
    const result = await deleteContactSubmission(id);
    if (result.error) {
      toast.error(result.error || "Failed to delete submission");
    } else {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Submission deleted");
    }
    setActionLoading(null);
  };

  const truncate = (text: string, max: number) => {
    if (!text) return "—";
    return text.length > max ? text.slice(0, max) + "…" : text;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contact Submissions</h1>
        <p className="admin-page-subtitle">View and manage all contact form submissions</p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div className="admin-grid-3" style={{ marginBottom: "24px", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {stats.map((s) => (
          <div className="admin-kpi" key={s.label}>
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">{s.label}</span>
            </div>
            <div className="admin-kpi-value" style={{ color: s.color }}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div className="admin-input" style={{ flex: 1, minWidth: "250px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="admin-focus"
            aria-label="Search submissions"
          />
        </div>
        <div className="admin-input" style={{ width: "160px", flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="admin-focus"
            aria-label="Filter submissions by status"
          >
            {["All", "new", "read", "replied"].map((s) => (
              <option key={s} value={s}>{s === "All" ? "All" : statusLabels[s]}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => exportToCSV(filtered , CONTACT_EXPORT_COLUMNS, "contact-submissions")}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export
        </button>
      </div>

      <div className="admin-card admin-client-split" style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--admin-text-muted)" }}>Loading submissions...</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table" aria-label="Contact submissions">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((sub) => (
                    <tr
                      key={sub.id}
                      onClick={() => setSelected(sub)}
                      style={{
                        cursor: "pointer",
                        background: selected?.id === sub.id ? "rgba(124,58,237,0.06)" : undefined,
                      }}
                      aria-label={`Select submission from ${sub.name}`}
                    >
                      <td style={{ fontWeight: 600 }}>{sub.name}</td>
                      <td>{sub.email}</td>
                      <td>{sub.service || "—"}</td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {truncate(sub.message, 60)}
                      </td>
                      <td>
                        <span className={`admin-badge ${statusBadgeClass[sub.status] || "muted"}`} role="status" aria-label={`Status: ${statusLabels[sub.status] || sub.status}`}>
                          {statusLabels[sub.status] || sub.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                        {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          {sub.status === "new" && (
                            <button
                              onClick={() => handleMarkAsRead(sub.id)}
                              disabled={actionLoading === sub.id}
                              className="admin-focus"
                              title="Mark as Read"
                              style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                borderRadius: "6px",
                                color: "var(--admin-warning)",
                                cursor: actionLoading === sub.id ? "not-allowed" : "pointer",
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                transition: "all var(--admin-transition)",
                                opacity: actionLoading === sub.id ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-warning)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; }}
                            >
                              Read
                            </button>
                          )}
                          {sub.status !== "replied" && (
                            <button
                              onClick={() => handleMarkAsReplied(sub.id)}
                              disabled={actionLoading === sub.id}
                              className="admin-focus"
                              title="Mark as Replied"
                              style={{
                                background: "var(--admin-surface)",
                                border: "1px solid var(--admin-border)",
                                borderRadius: "6px",
                                color: "var(--admin-success)",
                                cursor: actionLoading === sub.id ? "not-allowed" : "pointer",
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                transition: "all var(--admin-transition)",
                                opacity: actionLoading === sub.id ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-success)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; }}
                            >
                              Reply
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={actionLoading === sub.id}
                            className="admin-focus"
                            title="Delete submission"
                            style={{
                              background: "var(--admin-surface)",
                              border: "1px solid var(--admin-border)",
                              borderRadius: "6px",
                              color: "var(--admin-error)",
                              cursor: actionLoading === sub.id ? "not-allowed" : "pointer",
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              transition: "all var(--admin-transition)",
                              opacity: actionLoading === sub.id ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-error)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "var(--admin-text-faint)" }}>
                        {submissions.length === 0 ? "No contact submissions yet. Submissions from the contact form will appear here." : "No submissions match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div
            className="admin-card admin-client-detail"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 220px)",
              position: "sticky",
              top: "20px",
              width: "380px",
              flexShrink: 0,
            }}
            role="complementary"
            aria-label={`Details for submission from ${selected.name}`}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <h3 style={{ color: "var(--admin-text)", fontSize: "0.95rem", fontWeight: 700, margin: 0, fontFamily: "var(--font-heading)" }}>Submission Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="admin-focus"
                aria-label="Close submission details"
                style={{
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "6px",
                  color: "var(--admin-text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  transition: "all var(--admin-transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-border-strong)"; e.currentTarget.style.color = "var(--admin-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; e.currentTarget.style.color = "var(--admin-text-muted)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Name</div>
                  <div style={{ color: "var(--admin-text)", fontSize: "0.92rem", fontWeight: 600 }}>{selected.name}</div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Email</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", color: "var(--admin-text-faint)", flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" /></svg>
                    {selected.email}
                  </div>
                </div>

                {selected.phone && (
                  <div>
                    <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Phone</div>
                    <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>{selected.phone}</div>
                  </div>
                )}

                {selected.service && (
                  <div>
                    <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Service</div>
                    <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>{selected.service}</div>
                  </div>
                )}

                {selected.budget && (
                  <div>
                    <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Budget</div>
                    <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>{selected.budget}</div>
                  </div>
                )}

                <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "20px" }}>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Status</div>
                  <span className={`admin-badge ${statusBadgeClass[selected.status] || "muted"}`} style={{ padding: "5px 14px", fontSize: "0.8rem" }}>
                    {statusLabels[selected.status] || selected.status}
                  </span>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Message</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{selected.message}</div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Submitted</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>
                    {new Date(selected.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selected.status === "new" && (
                    <button
                      onClick={() => handleMarkAsRead(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="admin-focus"
                      style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-warning)",
                        borderRadius: "8px",
                        color: "var(--admin-warning)",
                        cursor: actionLoading === selected.id ? "not-allowed" : "pointer",
                        padding: "8px 16px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        transition: "all var(--admin-transition)",
                        opacity: actionLoading === selected.id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--admin-warning-dim)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--admin-surface)"; }}
                    >
                      Mark as Read
                    </button>
                  )}
                  {selected.status !== "replied" && (
                    <button
                      onClick={() => handleMarkAsReplied(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="admin-focus"
                      style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-success)",
                        borderRadius: "8px",
                        color: "var(--admin-success)",
                        cursor: actionLoading === selected.id ? "not-allowed" : "pointer",
                        padding: "8px 16px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        transition: "all var(--admin-transition)",
                        opacity: actionLoading === selected.id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--admin-success-dim)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--admin-surface)"; }}
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="admin-focus"
                    style={{
                      background: "var(--admin-surface)",
                      border: "1px solid var(--admin-error)",
                      borderRadius: "8px",
                      color: "var(--admin-error)",
                      cursor: actionLoading === selected.id ? "not-allowed" : "pointer",
                      padding: "8px 16px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      transition: "all var(--admin-transition)",
                      opacity: actionLoading === selected.id ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--admin-error-dim)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--admin-surface)"; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Submission"
        message={`Are you sure you want to delete this submission from ${deleteTarget?.name}? This action cannot be undone.`}
        danger
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
