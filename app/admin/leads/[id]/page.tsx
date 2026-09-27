"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getLeadById, deleteLead, updateLeadStatus,
  getAdminUsers, assignLead, unassignLead,
  getLeadFollowups, createLeadFollowup, completeLeadFollowup, reopenLeadFollowup, deleteLeadFollowup,
  getLeadActivities, convertLeadToClient,
} from "@/lib/actions/admin";
import type { Lead, AdminUser, LeadFollowup } from "@/lib/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const STATUS_COLORS: Record<string, string> = {
  new: "#7C3AED",
  contacted: "#F59E0B",
  proposal_sent: "#3B82F6",
  closed_won: "#10B981",
  closed_lost: "#EF4444",
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

const ACTIVITY_ICONS: Record<string, { color: string; label: string }> = {
  "lead.created": { color: "#10B981", label: "Created" },
  "lead.assigned": { color: "#3B82F6", label: "Assigned" },
  "lead.reassigned": { color: "#F59E0B", label: "Reassigned" },
  "lead.unassigned": { color: "#6B7280", label: "Unassigned" },
  "lead.status_changed": { color: "#7C3AED", label: "Status Changed" },
  "lead.updated": { color: "#3B82F6", label: "Updated" },
  "lead.deleted": { color: "#EF4444", label: "Deleted" },
  "followup.created": { color: "#3B82F6", label: "Follow-up Created" },
  "followup.completed": { color: "#10B981", label: "Follow-up Completed" },
  "followup.reopened": { color: "#F59E0B", label: "Follow-up Reopened" },
  "followup.deleted": { color: "#EF4444", label: "Follow-up Deleted" },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#F9FAFB",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "var(--font-body)",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#9CA3AF",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "6px",
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [followups, setFollowups] = useState<LeadFollowup[]>([]);
  const [activities, setActivities] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupTitle, setFollowupTitle] = useState("");
  const [followupDesc, setFollowupDesc] = useState("");
  const [followupAssignee, setFollowupAssignee] = useState("");
  const [followupDue, setFollowupDue] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [leadData, usersData, followupsData, activitiesData] = await Promise.all([
        getLeadById(id),
        getAdminUsers(),
        getLeadFollowups(id),
        getLeadActivities(id),
      ]);
      if (!leadData) {
        setError("Lead not found");
      } else {
        setLead(leadData as Lead & { assignee_name?: string | null; assignee_email?: string | null });
      }
      setUsers(usersData);
      setFollowups(followupsData as LeadFollowup[]);
      setActivities(activitiesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load lead");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteLead(id);
    if (result.success) {
      router.push("/admin/leads/all");
      router.refresh();
    } else {
      setError(result.error || "Failed to delete lead");
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    const result = await updateLeadStatus(id, newStatus);
    if (result.success) {
      setLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      showToast("success", "Status updated");
      const acts = await getLeadActivities(id);
      setActivities(acts);
    } else {
      showToast("error", result.error || "Failed to update status");
    }
    setStatusUpdating(false);
  };

  const handleAssign = async (userId: string) => {
    setAssigning(true);
    if (!userId) {
      const result = await unassignLead(id);
      if (result.success) {
        setLead((prev) => prev ? { ...prev, assigned_to: null, assignee_name: null, assignee_email: null } : null);
        showToast("success", "Lead unassigned");
      } else {
        showToast("error", result.error || "Failed to unassign");
      }
    } else {
      const result = await assignLead(id, userId);
      if (result.success) {
        const user = users.find((u) => u.id === userId);
        setLead((prev) => prev ? { ...prev, assigned_to: userId, assignee_name: user?.name || null, assignee_email: user?.email || null } : null);
        showToast("success", "Lead assigned");
      } else {
        showToast("error", result.error || "Failed to assign");
      }
      const acts = await getLeadActivities(id);
      setActivities(acts);
    }
    setAssigning(false);
  };

  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupTitle.trim() || !followupDue) return;
    setFollowupLoading(true);
    const result = await createLeadFollowup(id, {
      title: followupTitle.trim(),
      description: followupDesc.trim() || undefined,
      assigned_to: followupAssignee || undefined,
      due_date: followupDue,
    });
    if (result.success) {
      showToast("success", "Follow-up created");
      setShowFollowupForm(false);
      setFollowupTitle("");
      setFollowupDesc("");
      setFollowupAssignee("");
      setFollowupDue("");
      const [f, a] = await Promise.all([getLeadFollowups(id), getLeadActivities(id)]);
      setFollowups(f as LeadFollowup[]);
      setActivities(a);
    } else {
      showToast("error", result.error || "Failed to create follow-up");
    }
    setFollowupLoading(false);
  };

  const handleCompleteFollowup = async (followupId: string) => {
    const result = await completeLeadFollowup(followupId);
    if (result.success) {
      showToast("success", "Follow-up completed");
      const [f, a] = await Promise.all([getLeadFollowups(id), getLeadActivities(id)]);
      setFollowups(f as LeadFollowup[]);
      setActivities(a);
    } else {
      showToast("error", result.error || "Failed to complete");
    }
  };

  const handleReopenFollowup = async (followupId: string) => {
    const result = await reopenLeadFollowup(followupId);
    if (result.success) {
      showToast("success", "Follow-up reopened");
      const [f, a] = await Promise.all([getLeadFollowups(id), getLeadActivities(id)]);
      setFollowups(f as LeadFollowup[]);
      setActivities(a);
    } else {
      showToast("error", result.error || "Failed to reopen");
    }
  };

  const handleDeleteFollowup = async (followupId: string) => {
    const result = await deleteLeadFollowup(followupId);
    if (result.success) {
      showToast("success", "Follow-up deleted");
      const [f, a] = await Promise.all([getLeadFollowups(id), getLeadActivities(id)]);
      setFollowups(f as LeadFollowup[]);
      setActivities(a);
    } else {
      showToast("error", result.error || "Failed to delete");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
  };

  const handleConvert = async () => {
    setConverting(true);
    const result = await convertLeadToClient(id);
    if (result.success) {
      setLead((prev) => prev ? { ...prev, converted_client_id: result.client_id || "converted" } : null);
      showToast("success", "Lead converted to client");
      setConvertOpen(false);
      const acts = await getLeadActivities(id);
      setActivities(acts);
    } else {
      showToast("error", result.error || "Failed to convert lead");
    }
    setConverting(false);
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== "completed" && new Date(dueDate) < new Date();
  };

  const pendingFollowups = followups.filter((f) => f.status === "pending");
  const completedFollowups = followups.filter((f) => f.status === "completed");

  if (loading) {
    return (
      <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="admin-card" style={{ padding: "48px", textAlign: "center" }}>
        <p style={{ color: "#EF4444", fontSize: "0.875rem", marginBottom: 16 }}>{error || "Lead not found"}</p>
        <Link href="/admin/leads/all" style={{ color: "var(--admin-accent)", fontSize: "0.875rem" }}>Back to leads</Link>
      </div>
    );
  }

  const leadData = lead as Lead & { assignee_name?: string | null; assignee_email?: string | null };

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "12px 20px", borderRadius: "10px",
          background: toast.type === "success" ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
          color: "#fff", fontSize: "0.875rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}>
          {toast.msg}
        </div>
      )}

      <div className="admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <Link href="/admin/leads/all" style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}>Leads</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <span style={{ color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600 }}>{leadData.name}</span>
            </div>
            <h1 className="admin-page-title">{leadData.name}</h1>
            <p className="admin-page-subtitle">{leadData.service}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href={`/admin/leads/${id}/edit`} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>Edit</Link>
            <button onClick={() => setDeleteOpen(true)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: "6px" }}>Delete</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Contact Information */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Contact Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Email</div>
              <div style={{ fontSize: "0.875rem", color: "var(--admin-text)" }}>{leadData.email || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Phone</div>
              <div style={{ fontSize: "0.875rem", color: "var(--admin-text)" }}>{leadData.phone || "—"}</div>
            </div>
          </div>
        </div>

        {/* Deal Information */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Deal Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Service</div>
              <div style={{ fontSize: "0.875rem", color: "var(--admin-text)" }}>{leadData.service}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Value</div>
              <div style={{ fontSize: "0.875rem", color: "var(--admin-text)", fontWeight: 700 }}>{leadData.value || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginBottom: "2px" }}>Created</div>
              <div style={{ fontSize: "0.875rem", color: "var(--admin-text)" }}>{formatDate(leadData.created_at)}</div>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Assignment</h3>
          <select
            value={leadData.assigned_to || ""}
            onChange={(e) => handleAssign(e.target.value)}
            disabled={assigning}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name || u.email}</option>
            ))}
          </select>
          {leadData.assignee_name && (
            <div style={{ marginTop: "8px", fontSize: "0.8125rem", color: "var(--admin-text-muted)" }}>
              Assigned to <strong style={{ color: "var(--admin-text)" }}>{leadData.assignee_name}</strong>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Status</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => handleStatusChange(s.value)}
                disabled={statusUpdating || leadData.status === s.value}
                style={{
                  padding: "6px 16px", borderRadius: "20px",
                  border: leadData.status === s.value ? "none" : "1px solid var(--admin-border)",
                  background: leadData.status === s.value ? STATUS_COLORS[s.value] : "var(--admin-surface)",
                  color: leadData.status === s.value ? "#fff" : "var(--admin-text-muted)",
                  fontSize: "0.8125rem", fontWeight: 600,
                  cursor: statusUpdating ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)", opacity: statusUpdating ? 0.6 : 1,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion */}
        <div className="admin-card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Conversion</h3>
          {(leadData as Lead & { converted_client_id?: string | null; converted_client_name?: string | null }).converted_client_id ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8125rem", fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                Converted
              </span>
              <Link
                href="/admin/clients"
                style={{ fontSize: "0.875rem", color: "var(--admin-accent)", textDecoration: "none" }}
              >
                View Client →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)" }}>Not yet converted</span>
              <button
                onClick={() => setConvertOpen(true)}
                disabled={!leadData.email}
                title={!leadData.email ? "Lead must have an email to convert" : ""}
                style={{
                  padding: "6px 16px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)",
                  background: "rgba(16,185,129,0.05)", color: "#10B981", fontSize: "0.8125rem",
                  fontWeight: 600, cursor: !leadData.email ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)", opacity: !leadData.email ? 0.5 : 1,
                }}
              >
                Convert to Client
              </button>
            </div>
          )}
        </div>

        {/* Notes */}
        {leadData.notes && (
          <div className="admin-card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>Notes</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{leadData.notes}</p>
          </div>
        )}

        {/* Follow-ups */}
        <div className="admin-card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", fontFamily: "var(--font-heading)" }}>
              Follow-ups {pendingFollowups.length > 0 && <span style={{ color: "#F59E0B", fontSize: "0.8rem" }}>({pendingFollowups.length} open)</span>}
            </h3>
            <button
              onClick={() => setShowFollowupForm(!showFollowupForm)}
              style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#7C3AED", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}
            >
              {showFollowupForm ? "Cancel" : "+ Add Follow-up"}
            </button>
          </div>

          {showFollowupForm && (
            <form onSubmit={handleCreateFollowup} style={{ background: "var(--admin-surface)", borderRadius: "10px", padding: "16px", marginBottom: "16px", border: "1px solid var(--admin-border)" }}>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Title *</label>
                <input required value={followupTitle} onChange={(e) => setFollowupTitle(e.target.value)} placeholder="Follow-up title" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Description</label>
                <textarea rows={2} value={followupDesc} onChange={(e) => setFollowupDesc(e.target.value)} placeholder="Optional description" style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Assign to</label>
                  <select value={followupAssignee} onChange={(e) => setFollowupAssignee(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Anyone</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Due Date *</label>
                  <input type="date" required value={followupDue} onChange={(e) => setFollowupDue(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={followupLoading} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: followupLoading ? "#4B5563" : "#7C3AED", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: followupLoading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>
                  {followupLoading ? "Creating..." : "Create Follow-up"}
                </button>
              </div>
            </form>
          )}

          {followups.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)" }}>No follow-ups yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pendingFollowups.map((f) => {
                const overdue = isOverdue(f.due_date, f.status);
                return (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: overdue ? "rgba(239,68,68,0.05)" : "var(--admin-surface)", border: overdue ? "1px solid rgba(239,68,68,0.2)" : "1px solid var(--admin-border)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--admin-text)" }}>{f.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "2px" }}>
                        Due: {new Date(f.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {overdue && <span style={{ color: "#EF4444", fontWeight: 700, marginLeft: "8px" }}>Overdue</span>}
                      </div>
                    </div>
                    <button onClick={() => handleCompleteFollowup(f.id)} style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)", color: "#10B981", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                      Complete
                    </button>
                    <button onClick={() => handleDeleteFollowup(f.id)} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "rgba(239,68,68,0.5)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                      ×
                    </button>
                  </div>
                );
              })}
              {completedFollowups.map((f) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "var(--admin-surface)", border: "1px solid var(--admin-border)", opacity: 0.6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)", textDecoration: "line-through" }}>{f.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                      Completed {f.completed_at ? formatRelativeTime(f.completed_at) : ""}
                    </div>
                  </div>
                  <button onClick={() => handleReopenFollowup(f.id)} style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text-muted)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                    Reopen
                  </button>
                  <button onClick={() => handleDeleteFollowup(f.id)} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "rgba(239,68,68,0.5)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="admin-card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Activity Timeline</h3>
          {activities.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)" }}>No activity yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {activities.map((act, i) => {
                const action = act.action as string;
                const meta = ACTIVITY_ICONS[action] || { color: "#6B7280", label: action };
                const user = act.users as { name?: string; email?: string } | null;
                const actorName = user?.name || user?.email || "System";
                const oldVal = act.old_values as Record<string, string> | null;
                const newVal = act.new_values as Record<string, string> | null;
                const created = act.created_at as string;

                let detail = "";
                if (action === "lead.status_changed" && oldVal && newVal) {
                  detail = `Status changed from "${oldVal.status}" to "${newVal.status}"`;
                } else if (action === "lead.assigned" && newVal?.assignee_name) {
                  detail = `Assigned to ${newVal.assignee_name}`;
                } else if (action === "lead.reassigned" && newVal?.assignee_name) {
                  detail = `Reassigned to ${newVal.assignee_name}`;
                } else if (action === "lead.unassigned") {
                  detail = "Lead unassigned";
                } else if (action === "followup.created" && newVal?.title) {
                  detail = `Follow-up: "${newVal.title}"`;
                } else if (action === "followup.completed" && newVal?.title) {
                  detail = `Completed: "${newVal.title}"`;
                } else if (action === "followup.reopened" && newVal?.title) {
                  detail = `Reopened: "${newVal.title}"`;
                } else if (action === "followup.deleted" && oldVal?.title) {
                  detail = `Deleted: "${oldVal.title}"`;
                }

                return (
                  <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < activities.length - 1 ? "1px solid var(--admin-border)" : "none" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.color, marginTop: "6px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.8125rem", color: "var(--admin-text)" }}>
                        <strong>{actorName}</strong> <span style={{ color: "var(--admin-text-muted)" }}>{meta.label.toLowerCase()}</span>
                      </div>
                      {detail && <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "2px" }}>{detail}</div>}
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", whiteSpace: "nowrap" }}>{formatRelativeTime(created)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={deleteOpen} title="Delete Lead" message={`Are you sure you want to delete "${leadData.name}"? This action cannot be undone.`} confirmLabel={deleting ? "Deleting..." : "Delete"} danger onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
      <ConfirmDialog
        open={convertOpen}
        title="Convert to Client"
        message={`Create a client account for "${leadData.name}" (${leadData.email})? This will create a user account with role "client".`}
        confirmLabel={converting ? "Converting..." : "Convert"}
        onConfirm={handleConvert}
        onCancel={() => setConvertOpen(false)}
      />
    </div>
  );
}
