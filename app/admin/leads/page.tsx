"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";

interface LeadColumns {
  [key: string]: Lead[];
}

const columnOrder = ["new", "contacted", "proposal_sent", "closed_won"];
const columnLabels: Record<string, string> = {
  "new": "New Lead",
  "contacted": "Contacted",
  "proposal_sent": "Proposal Sent",
  "closed_won": "Closed Won",
};

const columnColors: Record<string, { accent: string; glow: string; badge: string }> = {
  "new": { accent: "#2563EB", glow: "rgba(37,99,235,0.15)", badge: "info" },
  "contacted": { accent: "#F59E0B", glow: "rgba(245,158,11,0.15)", badge: "warning" },
  "proposal_sent": { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)", badge: "info" },
  "closed_won": { accent: "#10B981", glow: "rgba(16,185,129,0.15)", badge: "success" },
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState("All Services");
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; from: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const columns: LeadColumns = {};
  for (const status of columnOrder) {
    columns[status] = leads.filter((l) => l.status === status);
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

    // Persist to Supabase
    setUpdating(lead.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status: toColumn })
      .eq("id", lead.id);

    if (error) {
      // Revert on error
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: from } : l))
      );
    }
    setUpdating(null);
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
          </div>
        </div>
      </div>

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
            const colLeads = columns[colName] || [];
            const filtered =
              filterService === "All Services"
                ? colLeads
                : colLeads.filter((l) => l.service === filterService);

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
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      style={{ opacity: updating === lead.id ? 0.5 : 1 }}
                    >
                      <div className="admin-kanban-card-name">{lead.name}</div>
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
