"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getProjectById, deleteProject, getAdminInvoicePayments } from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Project } from "@/lib/types";

const STATUS_BADGES: Record<string, { class: string; label: string }> = {
  in_progress: { class: "info", label: "In Progress" },
  completed: { class: "success", label: "Completed" },
  on_hold: { class: "warning", label: "On Hold" },
  pending: { class: "muted", label: "Pending" },
  draft: { class: "muted", label: "Draft" },
};

export default function AdminProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getProjectById(projectId);
    setProject(data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    const result = await deleteProject(projectId);
    if (result.success) { toast.success("Project deleted"); router.push("/admin/projects"); } else { toast.error(result.error || "Failed"); }
    setDeleteOpen(false);
  };

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading...</div>;
  if (!project) return (
    <div>
      <Link href="/admin/projects" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>← Back to Projects</Link>
      <div className="admin-card" style={{ padding: "48px", textAlign: "center", marginTop: "16px", color: "var(--admin-text-muted)" }}>Project not found.</div>
    </div>
  );

  const badge = STATUS_BADGES[project.status] || STATUS_BADGES.draft;

  return (
    <div>
      <Link href="/admin/projects" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>← Back to Projects</Link>

      <div className="admin-page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 className="admin-page-title">{project.name}</h1>
            <span className={`admin-badge ${badge.class}`}>{badge.label}</span>
          </div>
          <p className="admin-page-subtitle">{project.client_email}</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => router.push(`/admin/projects/${projectId}/edit`)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Edit</button>
          <button onClick={() => setDeleteOpen(true)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Delete</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Project Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
            {[
              { label: "Client", value: project.client_email },
              { label: "Category", value: project.category || "—" },
              { label: "Status", value: badge.label },
              { label: "Created", value: new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
              { label: "Updated", value: new Date(project.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--admin-border)" }}>
                <span style={{ color: "var(--admin-text-muted)" }}>{row.label}</span>
                <span style={{ color: "var(--admin-text)", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Progress</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "10px", borderRadius: "5px", background: "var(--admin-border)", overflow: "hidden" }}>
              <div style={{ width: `${project.progress}%`, height: "100%", borderRadius: "5px", background: project.progress === 100 ? "#10B981" : "var(--admin-accent)", transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--admin-text)", fontFamily: "var(--font-heading)", minWidth: "50px", textAlign: "right" }}>{project.progress}%</span>
          </div>
          {project.description && (
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 600, marginBottom: "6px" }}>Description</div>
              <p style={{ color: "var(--admin-text)", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>{project.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href={`/admin/invoices/new`} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "none" }}>Create Invoice</Link>
          <Link href={`/admin/projects/${projectId}/edit`} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-accent)", background: "var(--admin-accent)", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "none" }}>Edit Project</Link>
        </div>
      </div>

      <ConfirmDialog open={deleteOpen} title="Delete Project" message={`Delete "${project.name}"? This cannot be undone.`} danger confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
    </div>
  );
}
