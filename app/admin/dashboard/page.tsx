"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getCRMAnalytics } from "@/lib/actions/admin";
import type { CRMAnalytics } from "@/lib/types";

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "#7C3AED",
  contacted: "#F59E0B",
  proposal_sent: "#3B82F6",
  closed_won: "#10B981",
  closed_lost: "#EF4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#6B7280",
  medium: "#F59E0B",
  high: "#F97316",
  urgent: "#EF4444",
};

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `₨${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₨${(amount / 1_000).toFixed(0)}K`;
  return `₨${amount.toLocaleString()}`;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCRMAnalytics(dateRange);
      setAnalytics(data);
    } catch (e: unknown) {
      console.error(e);
    }
    setLoading(false);
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !analytics) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">CRM Dashboard</h1>
        </div>
        <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  const { leads, conversion, followups, revenue, support } = analytics;
  const maxServiceCount = Math.max(...leads.byService.map((s) => s.count), 1);
  const maxAssigneeCount = Math.max(...leads.byAssignee.map((a) => a.count), 1);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="admin-page-title">CRM Dashboard</h1>
            <p className="admin-page-subtitle">Performance metrics and analytics</p>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value)}
                style={{
                  padding: "6px 14px", borderRadius: "8px",
                  border: dateRange === opt.value ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                  background: dateRange === opt.value ? "var(--admin-accent)" : "var(--admin-surface)",
                  color: dateRange === opt.value ? "#fff" : "var(--admin-text-muted)",
                  fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dash-kpi-grid" style={{ gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Leads", value: leads.total, color: "#7C3AED", sub: "All leads" },
          { label: "New Leads", value: leads.new, color: "#F59E0B", sub: "Awaiting contact" },
          { label: "Converted", value: conversion.totalConverted, color: "#10B981", sub: `${conversion.conversionRate}% rate` },
          { label: "Lost", value: leads.closedLost, color: "#EF4444", sub: `${conversion.lostRate}% rate` },
          { label: "Pipeline Value", value: formatCurrency(revenue.totalPipeline), color: "#3B82F6", sub: "Total deal value" },
          { label: "Converted Value", value: formatCurrency(revenue.convertedValue), color: "#10B981", sub: "Won deals" },
        ].map((kpi) => (
          <div key={kpi.label} className="admin-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{kpi.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.color, fontFamily: "var(--font-heading)" }}>{kpi.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-faint)", marginTop: "4px" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-2col" style={{ gap: "20px", marginBottom: "24px" }}>
        {/* Leads by Status */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Leads by Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["new", "contacted", "proposal_sent", "closed_won", "closed_lost"].map((status) => {
              const count = status === "new" ? leads.new : status === "contacted" ? leads.contacted : status === "proposal_sent" ? leads.proposalSent : status === "closed_won" ? leads.closedWon : leads.closedLost;
              const pct = leads.total > 0 ? Math.round((count / leads.total) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "4px" }}>
                    <span style={{ color: "var(--admin-text)", textTransform: "capitalize" }}>{status.replace(/_/g, " ")}</span>
                    <span style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>{count} <span style={{ fontSize: "0.75rem" }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "var(--admin-border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: "3px", background: STATUS_COLORS[status], transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Service */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Leads by Service</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {leads.byService.slice(0, 6).map((s) => {
              const pct = Math.round((s.count / maxServiceCount) * 100);
              return (
                <div key={s.service}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "4px" }}>
                    <span style={{ color: "var(--admin-text)" }}>{s.service}</span>
                    <span style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>{s.count}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "var(--admin-border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: "3px", background: "#7C3AED", transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}
            {leads.byService.length === 0 && <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>No data</p>}
          </div>
        </div>

        {/* Leads by Assignee */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Leads by Assignee</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {leads.byAssignee.slice(0, 6).map((a) => {
              const pct = Math.round((a.count / maxAssigneeCount) * 100);
              return (
                <div key={a.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "4px" }}>
                    <span style={{ color: "var(--admin-text)" }}>{a.name}</span>
                    <span style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>{a.count}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "var(--admin-border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: "3px", background: "#3B82F6", transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}
            {leads.byAssignee.length === 0 && <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem" }}>No data</p>}
          </div>
        </div>

        {/* Follow-ups Summary */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Follow-ups</h3>
          <div className="dash-2col-inner" style={{ gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "Pending", value: followups.pending, color: "#F59E0B" },
              { label: "Completed", value: followups.completed, color: "#10B981" },
              { label: "Overdue", value: followups.overdue, color: "#EF4444" },
              { label: "Due Today", value: followups.dueToday, color: "#3B82F6" },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--admin-bg)", borderRadius: "8px", padding: "12px", border: "1px solid var(--admin-border)" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: item.color, fontFamily: "var(--font-heading)" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {followups.byAssignee.length > 0 && (
            <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 600, marginBottom: "8px" }}>By Assignee</div>
              {followups.byAssignee.slice(0, 4).map((a) => (
                <div key={a.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", padding: "4px 0" }}>
                  <span style={{ color: "var(--admin-text)" }}>{a.name}</span>
                  <span style={{ color: "var(--admin-text-muted)" }}>{a.pending} pending / {a.completed} done</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support + Quick Actions */}
      <div className="dash-2col" style={{ gap: "20px" }}>
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Support Tickets</h3>
          <div className="dash-3col-inner" style={{ gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "Open", value: support.open, color: "#F59E0B" },
              { label: "Closed", value: support.closed, color: "#10B981" },
              { label: "Pending", value: support.pending, color: "#3B82F6" },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--admin-bg)", borderRadius: "8px", padding: "12px", border: "1px solid var(--admin-border)", textAlign: "center" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: item.color, fontFamily: "var(--font-heading)" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {support.byPriority.length > 0 && (
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 600, marginBottom: "8px" }}>By Priority</div>
              {support.byPriority.map((p) => (
                <div key={p.priority} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem", padding: "4px 0" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PRIORITY_COLORS[p.priority] || "#6B7280" }} />
                  <span style={{ color: "var(--admin-text)", textTransform: "capitalize" }}>{p.priority}</span>
                  <span style={{ color: "var(--admin-text-muted)", fontWeight: 600 }}>{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Add New Lead", href: "/admin/leads/new", color: "#7C3AED" },
              { label: "View Lead Pipeline", href: "/admin/leads", color: "#3B82F6" },
              { label: "All Leads (List)", href: "/admin/leads/all", color: "#F59E0B" },
              { label: "View Notifications", href: "/admin/notifications", color: "#10B981" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid var(--admin-border)", background: "var(--admin-surface)",
                  textDecoration: "none", fontSize: "0.875rem", fontWeight: 600,
                  color: "var(--admin-text)", fontFamily: "var(--font-body)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: action.color }} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dash-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        .dash-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .dash-2col-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .dash-3col-inner {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: 900px) {
          .dash-2col { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .dash-2col-inner { grid-template-columns: 1fr; }
          .dash-3col-inner { grid-template-columns: 1fr; }
          .dash-kpi-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
