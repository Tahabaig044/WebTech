"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getPortalStats } from "@/lib/actions/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import type { Project, Invoice, SupportTicket } from "@/lib/types";
import { getPortalProjects, getPortalInvoices, getPortalTickets } from "@/lib/actions/portal";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({ activeProjects: 0, totalInvoices: 0, openTickets: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientEmail = session?.user?.email || "";

  useEffect(() => {
    if (!clientEmail) return;
    Promise.all([
      getPortalProjects({ page: 1 }),
      getPortalInvoices({ page: 1 }),
      getPortalTickets({ page: 1 }),
      getPortalStats(),
    ]).then(([p, inv, t, s]) => {
      setProjects(p.data);
      setInvoices(inv.data);
      setTickets(t.data);
      setStats(s);
      setLoading(false);
    }).catch((err) => {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    });
  }, [clientEmail]);

  const userName = session?.user?.name || "Client";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const statsCards = [
    { label: "Active Projects", value: stats.activeProjects, icon: "⊞", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
    { label: "Total Invoices", value: stats.totalInvoices, icon: "⊡", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
    { label: "Open Tickets", value: stats.openTickets, icon: "⊘", color: "#7C3AED", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
  ];

  if (error) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⚠️</div>
        <h3 style={{ color: "#EF4444", fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Something went wrong</h3>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", marginBottom: "20px" }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.12)", color: "#C4B5FD", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "linear-gradient(135deg, #10B981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "1rem",
            boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "2px" }}>
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", margin: 0 }}>Client Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/portal/dashboard/invoices" style={{ padding: "9px 18px", borderRadius: "10px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#C4B5FD", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
            View Invoices
          </Link>
          <Link href="/portal/dashboard/support" style={{ padding: "9px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
            New Ticket
          </Link>
        </div>
      </div>

      {/* Stats row */}
      {loading ? (
        <div style={{ marginBottom: "28px" }}>
          <LoadingSkeleton rows={3} type="cards" />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {statsCards.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: s.color, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ color: "#F1F5F9", fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{s.value}</div>
                <div style={{ color: "#6B7280", fontSize: "0.78rem", fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main grid */}
      <div className="portal-main-grid" style={{ marginBottom: "28px" }}>
        {/* Left - Projects */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, margin: 0 }}>Projects</h3>
            <Link href="/portal/dashboard/projects" style={{ color: "#8B5CF6", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>View All →</Link>
          </div>
          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : projects.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#6B7280", fontSize: "0.88rem" }}>No projects yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {projects.map((p) => (
                <div key={p.id} style={{ padding: "16px", borderRadius: "12px", background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "0.92rem", marginBottom: "3px" }}>{p.name}</div>
                      <div style={{ color: "#6B7280", fontSize: "0.78rem" }}>{p.category}</div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ width: `${p.progress}%`, height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #8B5CF6, #6D28D9)" }} />
                    </div>
                    <span style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 600, minWidth: "32px", textAlign: "right" }}>{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Recent Invoices */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, margin: "0 0 20px 0" }}>Recent Invoices</h3>
          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : invoices.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#6B7280", fontSize: "0.88rem" }}>No invoices yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} style={{ padding: "14px", borderRadius: "10px", background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "0.85rem" }}>{inv.invoice_number}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{inv.description}</span>
                    <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "0.85rem" }}>
                      {inv.currency} {Number(inv.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support Tickets */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, margin: 0 }}>Support Tickets</h3>
          <Link href="/portal/dashboard/support" style={{ color: "#8B5CF6", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>View All →</Link>
        </div>
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : tickets.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#6B7280", fontSize: "0.88rem" }}>No support tickets</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tickets.slice(0, 3).map((t) => (
              <div key={t.id} style={{ padding: "14px", borderRadius: "10px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.85rem", marginBottom: "2px" }}>{t.subject}</div>
                  <div style={{ color: "#6B7280", fontSize: "0.72rem" }}>{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
