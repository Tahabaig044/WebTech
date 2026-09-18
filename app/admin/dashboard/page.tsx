"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";

/* ── SVG Icons ──────────────────────────────────────────────── */
const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const KpiIcons = {
  leads: <svg {...iconProps}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  newLeads: <svg {...iconProps}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
  blog: <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  services: <svg {...iconProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  cases: <svg {...iconProps}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  inbox: <svg {...iconProps}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
  plus: <svg {...iconProps}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  doc: <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  folder: <svg {...iconProps}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
};

/* ── Badge config ───────────────────────────────────────────── */
const statusBadge: Record<string, string> = {
  "new": "accent",
  "contacted": "warning",
  "proposal_sent": "info",
  "closed_won": "success",
  "closed_lost": "muted",
};

const statusLabels: Record<string, string> = {
  "new": "New",
  "contacted": "Contacted",
  "proposal_sent": "Proposal Sent",
  "closed_won": "Closed Won",
  "closed_lost": "Closed Lost",
};

/* ── Types ──────────────────────────────────────────────────── */
interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalBlogPosts: number;
  totalServices: number;
  totalCaseStudies: number;
  totalContactSubmissions: number;
}

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0, newLeads: 0, totalBlogPosts: 0,
    totalServices: 0, totalCaseStudies: 0, totalContactSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(6),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("active", true),
      supabase.from("case_studies").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    ]).then(([leadsRes, totalLeadsRes, newLeadsRes, blogRes, servicesRes, casesRes, contactRes]) => {
      setLeads((leadsRes.data as Lead[] | null) || []);
      setStats({
        totalLeads: totalLeadsRes.count || 0,
        newLeads: newLeadsRes.count || 0,
        totalBlogPosts: blogRes.count || 0,
        totalServices: servicesRes.count || 0,
        totalCaseStudies: casesRes.count || 0,
        totalContactSubmissions: contactRes.count || 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const barData = [65, 85, 45, 95, 70, 55, 80, 90, 60, 75, 88, 92];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const kpis = [
    { label: "Total Leads", value: stats.totalLeads, icon: KpiIcons.leads, color: "#2563EB", dim: "rgba(37,99,235,0.12)", sub: "All time" },
    { label: "New Leads", value: stats.newLeads, icon: KpiIcons.newLeads, color: "#F59E0B", dim: "rgba(245,158,11,0.12)", sub: "Awaiting contact" },
    { label: "Blog Posts", value: stats.totalBlogPosts, icon: KpiIcons.blog, color: "#10B981", dim: "rgba(16,185,129,0.12)", sub: "Published" },
    { label: "Services", value: stats.totalServices, icon: KpiIcons.services, color: "#8B5CF6", dim: "rgba(139,92,246,0.12)", sub: "Active" },
    { label: "Case Studies", value: stats.totalCaseStudies, icon: KpiIcons.cases, color: "#06B6D4", dim: "rgba(6,182,212,0.12)", sub: "Published" },
    { label: "Contact Forms", value: stats.totalContactSubmissions, icon: KpiIcons.inbox, color: "#6366F1", dim: "rgba(99,102,241,0.12)", sub: "Submissions" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Welcome back, Admin. Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* KPI Grid — 6 cards in 3x2 */}
      <div className="admin-grid-3" style={{ marginBottom: 24 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className="admin-kpi">
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">{kpi.label}</span>
              <div className="admin-kpi-icon" style={{ background: kpi.dim, color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            <div className="admin-kpi-value">{loading ? "—" : kpi.value}</div>
            <span className="admin-kpi-change neutral">{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="admin-grid-main" style={{ marginBottom: 24 }}>
        {/* Revenue Overview Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Activity Overview</h3>
              <p className="admin-card-subtitle">Lead activity across months</p>
            </div>
            <span className="admin-badge info">Sample Data</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 180, paddingBottom: 8 }}>
            {barData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: "100%",
                    height: `${val * 1.6}px`,
                    background: i === 8
                      ? "linear-gradient(180deg, #2563EB, #1D4ED8)"
                      : "rgba(37, 99, 235, 0.18)",
                    borderRadius: "4px 4px 2px 2px",
                    transition: "height 0.3s ease",
                    boxShadow: i === 8 ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
                  }}
                  title={`${months[i]}: ${val}%`}
                />
                <span style={{ color: "var(--admin-text-faint)", fontSize: "0.625rem", fontWeight: 600 }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/admin/leads" className="admin-action admin-focus">
              <div className="admin-action-icon" style={{ background: "var(--admin-accent-dim)", color: "var(--admin-accent)" }}>
                {KpiIcons.plus}
              </div>
              <div className="admin-action-text">
                <span className="admin-action-title">Add Lead</span>
                <span className="admin-action-desc">Create a new lead entry</span>
              </div>
            </Link>
            <Link href="/admin/blog/new" className="admin-action admin-focus">
              <div className="admin-action-icon" style={{ background: "var(--admin-info-dim)", color: "var(--admin-info)" }}>
                {KpiIcons.blog}
              </div>
              <div className="admin-action-text">
                <span className="admin-action-title">New Blog Post</span>
                <span className="admin-action-desc">Write and publish a post</span>
              </div>
            </Link>
            <Link href="/admin/services/new" className="admin-action admin-focus">
              <div className="admin-action-icon" style={{ background: "var(--admin-success-dim)", color: "var(--admin-success)" }}>
                {KpiIcons.doc}
              </div>
              <div className="admin-action-text">
                <span className="admin-action-title">Add Service</span>
                <span className="admin-action-desc">Create a new service listing</span>
              </div>
            </Link>
            <Link href="/admin/case-studies/new" className="admin-action admin-focus">
              <div className="admin-action-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8B5CF6" }}>
                {KpiIcons.folder}
              </div>
              <div className="admin-action-text">
                <span className="admin-action-title">New Case Study</span>
                <span className="admin-action-desc">Document a client success</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Leads</h3>
          <Link href="/admin/leads" className="admin-btn admin-btn-ghost admin-focus" style={{ fontSize: "0.8125rem", padding: "6px 12px" }}>
            View All {KpiIcons.arrowRight}
          </Link>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--admin-text-muted)" }}>
              Loading leads from Supabase...
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--admin-text-muted)" }}>
              No leads yet. Submissions from the contact form will appear here.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.service}</td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{lead.email || "—"}</td>
                    <td>
                      <span className={`admin-badge ${statusBadge[lead.status] || "muted"}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>
                      {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
