"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { searchLeads, deleteLead } from "@/lib/actions/admin";
import type { Lead } from "@/lib/types";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { exportToCSV, LEAD_EXPORT_COLUMNS } from "@/lib/utils/export";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "#7C3AED",
  contacted: "#F59E0B",
  proposal_sent: "#3B82F6",
  closed_won: "#10B981",
  closed_lost: "#EF4444",
};

const SERVICE_OPTIONS = [
  "All Services",
  "Web Development",
  "SEO",
  "Google Ads",
  "Managed Hosting",
  "ERP / Automation",
  "Industry SaaS Suite",
  "Other",
];

export default function AdminLeadsListPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const pageSize = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      let q = debouncedQuery;
      if (serviceFilter !== "All Services") {
        q = q ? `${q} ${serviceFilter}` : serviceFilter;
      }
      const result = await searchLeads({
        query: q || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        pageSize,
      });
      let filtered = result.data;
      if (serviceFilter !== "All Services") {
        filtered = filtered.filter((l) => l.service === serviceFilter);
      }
      setLeads(filtered);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load leads";
      console.error(msg);
    }
    setLoading(false);
  }, [debouncedQuery, statusFilter, serviceFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter, serviceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteLead(deleteTarget.id);
    if (result.success) {
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setDeleteTarget(null);
      router.refresh();
    }
    setDeleting(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </svg>
              All Leads
            </h1>
            <p className="admin-page-subtitle">{total} total leads</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/admin/leads"
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Kanban View
            </Link>
            <button
              onClick={() => exportToCSV(leads, LEAD_EXPORT_COLUMNS, "leads")}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                display: "inline-flex", alignItems: "center", gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
            <Link
              href="/admin/leads/new"
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "none",
                background: "#7C3AED", color: "#fff", fontSize: "0.8125rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
              }}
            >
              + New Lead
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div className="admin-input" style={{ flex: 1, minWidth: "200px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, phone, or service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search leads"
          />
        </div>
        <div className="admin-input" style={{ width: "auto" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="admin-input" style={{ width: "auto" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filter by service"
          >
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["Name", "Email", "Service", "Value", "Assigned", "Status", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--admin-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: "1px solid var(--admin-border)", cursor: "pointer" }}
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <td style={{ padding: "12px 16px", fontSize: "0.875rem", fontWeight: 600 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {lead.name}
                        {(lead as unknown as { converted_client_id?: string | null }).converted_client_id && (
                          <span style={{ fontSize: "0.625rem", padding: "1px 5px", borderRadius: "4px", background: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: 700 }}>Converted</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8125rem", color: "var(--admin-text-muted)" }}>
                      {lead.email || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8125rem" }}>
                      {lead.service}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8125rem", fontWeight: 600 }}>
                      {lead.value || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8125rem", color: "var(--admin-text-muted)" }}>
                      {(lead as unknown as { users?: { name?: string } }).users?.name || <span style={{ opacity: 0.4 }}>Unassigned</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          background: `${STATUS_COLORS[lead.status] || "#6B7280"}20`,
                          color: STATUS_COLORS[lead.status] || "#6B7280",
                        }}
                      >
                        {lead.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8125rem", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(lead.created_at)}
                    </td>
                    <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                          title="View"
                          style={{
                            padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--admin-border)",
                            background: "var(--admin-surface)", color: "var(--admin-text-muted)",
                            fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)",
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lead)}
                          title="Delete"
                          style={{
                            padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.05)", color: "#EF4444",
                            fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
