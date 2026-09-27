"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdminProjects, deleteProject } from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import type { Project } from "@/lib/types";

const STATUS_BADGES: Record<string, { class: string; label: string }> = {
  in_progress: { class: "info", label: "In Progress" },
  completed: { class: "success", label: "Completed" },
  on_hold: { class: "warning", label: "On Hold" },
  pending: { class: "muted", label: "Pending" },
  draft: { class: "muted", label: "Draft" },
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const loadProjects = async (p: number, status: string) => {
    setLoading(true);
    try {
      const res = await getAdminProjects({ page: p, status });
      setProjects(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch { toast.error("Failed to load projects"); }
    setLoading(false);
  };

  useEffect(() => { loadProjects(page, statusFilter); }, [page, statusFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteProject(deleteTarget.id);
    if (result.success) { toast.success("Project deleted"); loadProjects(page, statusFilter); } else { toast.error(result.error || "Failed"); }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">{loading ? "Loading..." : `${total} projects`}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={() => router.push("/admin/projects/new")} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>New Project</button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--admin-text-muted)" }}>Loading...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Category</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const badge = STATUS_BADGES[p.status] || STATUS_BADGES.draft;
                  return (
                    <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => router.push(`/admin/projects/${p.id}`)}>
                      <td style={{ fontWeight: 600, color: "var(--admin-text)" }}>{p.name}</td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{p.client_email}</td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{p.category || "—"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "60px", height: "6px", borderRadius: "3px", background: "var(--admin-border)", overflow: "hidden" }}>
                            <div style={{ width: `${p.progress}%`, height: "100%", background: "var(--admin-accent)", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td><span className={`admin-badge ${badge.class}`}>{badge.label}</span></td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => router.push(`/admin/projects/${p.id}/edit`)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "transparent", color: "#D1D5DB", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Edit</button>
                          <button onClick={() => setDeleteTarget({ id: p.id, name: p.name })} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#EF4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {projects.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "var(--admin-text-faint)" }}>No projects found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {total > 0 && <Pagination page={page} totalPages={totalPages} total={total} pageSize={20} onPageChange={setPage} />}
      <ConfirmDialog open={!!deleteTarget} title="Delete Project" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} danger confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
