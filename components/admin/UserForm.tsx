"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/lib/actions/admin";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/admin";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
  borderRadius: "10px", padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
  outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px",
};

interface UserFormProps {
  initial?: { id: string; name: string; email: string; role: string };
  mode: "create" | "edit";
}

export default function UserForm({ initial, mode }: UserFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    password: "",
    role: initial?.role || "client",
  });

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (mode === "create") {
      const result = userCreateSchema.safeParse({ name: form.name, email: form.email, password: form.password, role: form.role });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        });
        setFieldErrors(errors);
        setSaving(false);
        return;
      }
      setFieldErrors({});
    } else if (form.password) {
      const result = userUpdateSchema.safeParse({ name: form.name, email: form.email, role: form.role, password: form.password });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        });
        setFieldErrors(errors);
        setSaving(false);
        return;
      }
      setFieldErrors({});
    }

    const serverResult = mode === "create"
      ? await createUser({ name: form.name, email: form.email, password: form.password, role: form.role })
      : await updateUser(initial!.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });

    setSaving(false);
    if (serverResult.success) {
      router.push("/admin/users");
      router.refresh();
    } else {
      setError(serverResult.error || "Failed to save");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
      {error && (
        <div role="alert" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label htmlFor="user-name" style={labelStyle}>Name *</label>
          <input id="user-name" style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          {fieldErrors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="user-email" style={labelStyle}>Email *</label>
          <input id="user-email" type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} required />
          {fieldErrors.email && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="user-password" style={labelStyle}>
            Password {mode === "create" ? "*" : ""}
          </label>
          <input
            id="user-password"
            type="password"
            style={inputStyle}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
            required={mode === "create"}
          />
          {fieldErrors.password && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.password}</p>}
        </div>
        <div>
          <label htmlFor="user-role" style={labelStyle}>Role *</label>
          <select
            id="user-role"
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="client">Client</option>
          </select>
          {fieldErrors.role && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.role}</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 24px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          style={{
            padding: "10px 24px", borderRadius: "10px", border: "1px solid var(--admin-border)",
            background: "transparent", color: "#D1D5DB", fontSize: "0.875rem", fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
