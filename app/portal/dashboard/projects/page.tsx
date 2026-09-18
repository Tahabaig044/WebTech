"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPortalProjects } from "@/lib/actions/portal";
import type { Project } from "@/lib/types";

const filters = ["All", "Active", "Completed"];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "in_progress": return { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", label: "In Progress" };
    case "completed": return { color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)", label: "Completed" };
    case "on_hold": return { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", label: "On Hold" };
    default: return { color: "#6B7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)", label: status };
  }
};

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    getPortalProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  const filtered = projects.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return p.status === "in_progress";
    if (activeFilter === "Completed") return p.status === "completed";
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Projects</h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>Track all your projects and their progress</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: "8px 18px", borderRadius: "8px", border: activeFilter === f ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)", background: activeFilter === f ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)", color: activeFilter === f ? "#C4B5FD" : "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>{f}</button>
        ))}
      </div>

      <div className="portal-table-wrap" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div className="portal-table-grid" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr", borderRadius: "10px 10px 0 0", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)", minWidth: "600px" }}>
          {["Project", "Category", "Deadline", "Progress", "Status"].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#4B5563", fontSize: "0.9rem" }}>No projects found.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((p) => {
              const st = getStatusStyle(p.status);
              const isExpanded = expandedId === p.id;
              return (
                <div key={p.id} style={{ borderTop: "1px solid rgba(139,92,246,0.08)", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                  <div className="portal-table-grid" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr", minWidth: "600px" }}>
                    <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem" }}>{p.name}</div>
                    <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{p.category}</div>
                    <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ width: `${p.progress}%`, height: "100%", borderRadius: "3px", background: st.color }} />
                      </div>
                      <span style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 600 }}>{p.progress}%</span>
                    </div>
                    <div>
                      <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{st.label}</span>
                    </div>
                  </div>

                  {isExpanded && p.description && (
                    <div style={{ padding: "16px", borderTop: "1px solid rgba(139,92,246,0.1)" }}>
                      <div style={{ color: "#6B7280", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Description</div>
                      <div style={{ color: "#CBD5E1", fontSize: "0.84rem", lineHeight: 1.5 }}>{p.description}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
