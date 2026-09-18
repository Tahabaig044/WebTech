"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";

export default function CRMDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Lead[] | null }) => {
        setLeads(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    proposal_sent: leads.filter((l) => l.status === "proposal_sent").length,
    closed_won: leads.filter((l) => l.status === "closed_won").length,
  };

  const totalLeads = leads.length;
  const maxCount = Math.max(statusCounts.new, statusCounts.contacted, statusCounts.proposal_sent, statusCounts.closed_won, 1);

  const pipelineStages = [
    { name: "New Leads", count: statusCounts.new, color: "#06B6D4", width: `${(statusCounts.new / maxCount) * 100}%` },
    { name: "Contacted", count: statusCounts.contacted, color: "#8B5CF6", width: `${(statusCounts.contacted / maxCount) * 100}%` },
    { name: "Proposal Sent", count: statusCounts.proposal_sent, color: "#F59E0B", width: `${(statusCounts.proposal_sent / maxCount) * 100}%` },
    { name: "Closed Won", count: statusCounts.closed_won, color: "#10B981", width: `${(statusCounts.closed_won / maxCount) * 100}%` },
  ];

  const recentLeads = leads.slice(0, 6);

  const statusColors: Record<string, string> = {
    new: "#06B6D4",
    contacted: "#8B5CF6",
    proposal_sent: "#F59E0B",
    closed_won: "#10B981",
    closed_lost: "#EF4444",
  };

  const statusLabels: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    proposal_sent: "Proposal Sent",
    closed_won: "Closed Won",
    closed_lost: "Closed Lost",
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 4px" }}>
          CRM Dashboard
        </h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>
          ERP Intelligence Suite — {totalLeads} total leads
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Pipeline Funnel */}
        <div style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(3,7,18,0.98) 100%)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: "14px", padding: "24px" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1rem", fontWeight: 700, margin: "0 0 20px" }}>Lead Pipeline Funnel</h3>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#6B7280" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pipelineStages.map((stage) => (
                <div key={stage.name} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ color: "#9CA3AF", fontSize: "0.82rem", width: "110px", textAlign: "right", flexShrink: 0 }}>{stage.name}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ width: "100%", height: "32px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ width: stage.width || "0%", height: "100%", background: `linear-gradient(90deg, ${stage.color}40, ${stage.color}90)`, borderRadius: "8px", display: "flex", alignItems: "center", paddingLeft: "12px", boxShadow: `0 0 12px ${stage.color}30`, transition: "width 0.6s ease" }}>
                        <span style={{ color: "#F1F5F9", fontSize: "0.82rem", fontWeight: 700 }}>{stage.count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(3,7,18,0.98) 100%)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: "14px", padding: "24px" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1rem", fontWeight: 700, margin: "0 0 16px" }}>Recent Leads</h3>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#6B7280" }}>Loading...</div>
          ) : recentLeads.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#6B7280" }}>No leads yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentLeads.map((lead) => (
                <div key={lead.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ color: "#E5E7EB", fontSize: "0.85rem", fontWeight: 600 }}>{lead.name}</div>
                    <div style={{ color: "#6B7280", fontSize: "0.72rem" }}>{lead.service}</div>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 700, color: statusColors[lead.status] || "#6B7280", background: `${statusColors[lead.status] || "#6B7280"}18` }}>
                    {statusLabels[lead.status] || lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
