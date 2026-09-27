"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getPortalProjects } from "@/lib/actions/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import EmptyState from "@/components/portal/EmptyState";
import PortalPagination from "@/components/portal/PortalPagination";
import type { Project } from "@/lib/types";

const filters = ["All", "Active", "Completed"];

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const fetchData = (p: number, filter?: string) => {
    setLoading(true);
    setError("");
    const statusFilter = filter === "Active" ? "in_progress" : filter === "Completed" ? "completed" : undefined;
    getPortalProjects({ page: p, status: statusFilter })
      .then((res) => {
        setProjects(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session?.user?.email) return;
    fetchData(page);
  }, [session?.user?.email, page]);

  const handleFilterChange = (f: string) => {
    setActiveFilter(f);
    setPage(1);
    fetchData(1, f);
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Projects</h1>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>Track all your projects and their progress</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => handleFilterChange(f)} style={{ padding: "8px 18px", borderRadius: "8px", border: activeFilter === f ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)", background: activeFilter === f ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)", color: activeFilter === f ? "#C4B5FD" : "#9CA3AF", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>{f}</button>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#F87171", fontSize: "0.85rem" }}>{error}</div>
      )}

      <div className="portal-table-wrap" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", overflow: "hidden" }}>
        <div className="portal-table-grid" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr 0.8fr", borderRadius: "10px 10px 0 0", background: "rgba(139,92,246,0.06)", borderBottom: "1px solid rgba(139,92,246,0.12)", minWidth: "650px" }}>
          {["Project", "Category", "Created", "Progress", "Status", ""].map((h) => (
            <div key={h} style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px" }}><LoadingSkeleton rows={5} /></div>
        ) : projects.length === 0 ? (
          <EmptyState icon="⊞" title="No projects found" description="You don't have any projects yet." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/portal/dashboard/projects/${p.id}`}
                style={{ borderTop: "1px solid rgba(139,92,246,0.08)", textDecoration: "none", transition: "background 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="portal-table-grid" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr 0.8fr", padding: "16px 0", minWidth: "650px", alignItems: "center" }}>
                  <div style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem", paddingLeft: "20px" }}>{p.name}</div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{p.category}</div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "20px" }}>
                    <div style={{ flex: 1, height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ width: `${p.progress}%`, height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #8B5CF6, #6D28D9)" }} />
                    </div>
                    <span style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 600 }}>{p.progress}%</span>
                  </div>
                  <div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div style={{ paddingRight: "20px", textAlign: "right" }}>
                    <span style={{ color: "#8B5CF6", fontSize: "0.78rem", fontWeight: 600 }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <PortalPagination page={page} totalPages={totalPages} total={total} pageSize={20} onPageChange={setPage} />
      )}
    </div>
  );
}
