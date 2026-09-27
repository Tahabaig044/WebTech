"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject, updateProject } from "@/lib/actions/admin";
import { projectSchema } from "@/lib/validations/admin";

interface ProjectFormProps {
  initial?: {
    id?: string;
    client_email?: string;
    name?: string;
    category?: string;
    description?: string;
    progress?: number;
    status?: string;
  };
  mode: "create" | "edit";
}

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

export default function ProjectForm({ initial, mode }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [clientEmail, setClientEmail] = useState(initial?.client_email ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [status, setStatus] = useState(initial?.status ?? "in_progress");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { client_email: clientEmail, name, category, description, progress, status };

    try {
      const schemaResult = projectSchema.safeParse(payload);
      if (!schemaResult.success) {
        const errors: Record<string, string> = {};
        schemaResult.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        });
        setFieldErrors(errors);
        setLoading(false);
        return;
      }
      setFieldErrors({});

      const result = mode === "create" ? await createProject(payload) : await updateProject(initial!.id!, payload);
      if (result.success) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#EF4444", fontSize: "0.875rem", marginBottom: 20 }}>{error}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Client Email *</label>
        <input type="email" required value={clientEmail} onChange={(e) => { setClientEmail(e.target.value); setFieldErrors((prev) => { const next = { ...prev }; delete next.client_email; return next; }); }} style={inputStyle} />
        {fieldErrors.client_email && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.client_email}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Project Name *</label>
        <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setFieldErrors((prev) => { const next = { ...prev }; delete next.name; return next; }); }} style={inputStyle} />
        {fieldErrors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.name}</p>}
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} placeholder="e.g. Web Development" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Progress ({progress}%)</label>
        <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--admin-accent)" }} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Description</label>
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <button type="submit" disabled={loading} style={{ background: loading ? "#4B5563" : "#6366F1", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 24px", fontSize: "0.875rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>
        {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
      </button>
    </form>
  );
}
