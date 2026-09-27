"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllLeads, updateLeadStatus, deleteLead } from "@/lib/actions/admin";
import type { Lead } from "@/lib/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { exportToCSV, LEAD_EXPORT_COLUMNS } from "@/lib/utils/export";

interface LeadColumns {
  [key: string]: Lead[];
}

const columnOrder = ["new", "contacted", "proposal_sent", "closed_won", "closed_lost"];
const columnLabels: Record<string, string> = {
  "new": "New Lead",
  "contacted": "Contacted",
  "proposal_sent": "Proposal Sent",
  "closed_won": "Closed Won",
  "closed_lost": "Closed Lost",
};

const columnColors: Record<string, { accent: string; glow: string; badge: string }> = {
  "new": { accent: "#7C3AED", glow: "rgba(124,58,237,0.15)", badge: "info" },
  "contacted": { accent: "#F59E0B", glow: "rgba(245,158,11,0.15)", badge: "warning" },
  "proposal_sent": { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)", badge: "info" },
  "closed_won": { accent: "#10B981", glow: "rgba(16,185,129,0.15)", badge: "success" },
  "closed_lost": { accent: "#EF4444", glow: "rgba(239,68,68,0.15)", badge: "error" },
};

const serviceOptions = [
  "All Services",
  "Web Development",
  "SEO",
  "Google Ads",
  "Managed Hosting",
  "ERP / Automation",
  "Industry SaaS Suite",
  "Other",
];

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterService, setFilterService] = useState("All Services");
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; from: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load leads";
      setError(message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const columns: LeadColumns = {};
  for (const status of columnOrder) {
    columns[status] = leads.filter((l) => l.status === status);
  }

  const allFiltered = filterService === "All Services" ? leads : leads.filter((l) => l.service === filterService);

  const paginatedColumns: LeadColumns = {};
  for (const status of columnOrder) {
    paginatedColumns[status] = allFiltered.filter((l) => l.status === status);
  }

  const handleDragStart = (lead: Lead, from: string) => {
    setDraggedLead({ lead, from });
  };

  const handleDrop = async (toColumn: string) => {
    if (!draggedLead) return;
    const { lead, from } = draggedLead;
    if (from === toColumn) {
      setDraggedLead(null);
      return;
    }

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: toColumn } : l))
    );
    setDraggedLead(null);

    // Persist via server action
    setUpdating(lead.id);
    const result = await updateLeadStatus(lead.id, toColumn);

    if (result.error) {
      // Revert on error
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: from } : l))
      );
    }
    setUpdating(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteLead(deleteTarget.id);
    if (result.success) {
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDeleting(false);
  };

  const getTimeInStage = (lead: Lead) => {
    const created = new Date(lead.created_at);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </svg>
              Lead Pipeline
            </h1>
            <p className="admin-page-subtitle">Drag leads between stages to update their status</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/admin/leads/all"
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List View
            </Link>
            <div className="admin-input" style={{ width: "auto" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                aria-label="Filter leads by service"
              >
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => exportToCSV(allFiltered , LEAD_EXPORT_COLUMNS, "leads")}
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

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
          Loading leads from Supabase...
        </div>
      ) : leads.length === 0 ? (
        <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
          No leads yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <div className="admin-kanban" role="region" aria-label="Lead pipeline kanban board">
          {columnOrder.map((colName) => {
            const cc = columnColors[colName];
            const colLeads = paginatedColumns[colName] || [];
            const filtered = colLeads;

            return (
              <div
                key={colName}
                className="admin-kanban-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(colName)}
                aria-label={`${columnLabels[colName]} column, ${filtered.length} leads`}
                role="list"
              >
                <div className="admin-kanban-col-header">
                  <div className="admin-kanban-col-label">
                    <div
                      className="admin-kanban-col-dot"
                      style={{ background: cc.accent }}
                      aria-hidden="true"
                    />
                    <span className="admin-kanban-col-name">{columnLabels[colName]}</span>
                  </div>
                  <span className={`admin-badge ${cc.badge}`}>
                    {filtered.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filtered.map((lead) => (
                    <div
                      key={lead.id}
                      className="admin-kanban-card"
                      draggable
                      onDragStart={() => handleDragStart(lead, colName)}
                      role="listitem"
                      aria-label={`${lead.name}, ${lead.service}`}
                      tabIndex={0}
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      style={{ opacity: updating === lead.id ? 0.5 : 1, cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div className="admin-kanban-card-name">{lead.name}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(lead); }}
                          title="Delete lead"
                          style={{
                            padding: "2px 6px", borderRadius: "4px", border: "none",
                            background: "rgba(239,68,68,0.05)", color: "rgba(239,68,68,0.4)",
                            fontSize: "0.6875rem", cursor: "pointer", fontFamily: "var(--font-body)",
                            lineHeight: 1, flexShrink: 0,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(239,68,68,0.4)"; e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
                        >
                          ×
                        </button>
                      </div>
                      <div className="admin-kanban-card-service">{lead.service}</div>
                      {lead.email && (
                        <div style={{ fontSize: "0.75rem", color: "var(--admin-text-faint)", marginBottom: "4px" }}>
                          {lead.email}
                        </div>
                      )}
                      <div className="admin-kanban-card-footer">
                        <span style={{ color: cc.accent, fontSize: "0.8125rem", fontWeight: 700 }}>
                          {lead.value || "—"}
                        </span>
                        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                          {(lead as Lead & { converted_client_id?: string | null }).converted_client_id && (
                            <span style={{ fontSize: "0.625rem", padding: "2px 5px", borderRadius: "4px", background: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: 700 }}>CVT</span>
                          )}
                          <span className="admin-badge muted" style={{ fontSize: "0.6875rem", padding: "2px 6px" }}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              style={{ marginRight: "4px" }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {getTimeInStage(lead)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
