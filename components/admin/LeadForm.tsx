"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createLead, updateLead } from "@/lib/actions/admin";
import { leadCreateSchema, leadUpdateFullSchema } from "@/lib/validations/admin";

interface LeadFormProps {
  initial?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    value?: string;
    status?: string;
    notes?: string;
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

const serviceOptions = [
  "Web Development",
  "SEO",
  "Google Ads",
  "Managed Hosting",
  "ERP / Automation",
  "Industry SaaS Suite",
  "Other",
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

export default function LeadForm({ initial, mode }: LeadFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [service, setService] = useState(initial?.service ?? serviceOptions[0]);
  const [value, setValue] = useState(initial?.value ?? "");
  const [status, setStatus] = useState(initial?.status ?? "new");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      service,
      value: value || undefined,
      status,
      notes: notes || undefined,
    };

    try {
      const schema = mode === "create" ? leadCreateSchema : leadUpdateFullSchema;
      const schemaResult = schema.safeParse(payload);
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

      if (mode === "create") {
        const result = await createLead(payload);
        if (result.success) {
          router.push("/admin/leads");
          router.refresh();
        } else {
          setError(result.error || "Failed to create lead");
          setLoading(false);
        }
      } else {
        const result = await updateLead(initial!.id!, payload);
        if (result.success) {
          router.push(`/admin/leads/${initial!.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to update lead");
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#EF4444",
            fontSize: "0.875rem",
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFieldErrors((prev) => { const next = { ...prev }; delete next.name; return next; });
          }}
          placeholder="Lead name"
          style={inputStyle}
        />
        {fieldErrors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.name}</p>}
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
            }}
            placeholder="lead@example.com"
            style={inputStyle}
          />
          {fieldErrors.email && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.email}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setFieldErrors((prev) => { const next = { ...prev }; delete next.phone; return next; });
            }}
            placeholder="+92 300 1234567"
            style={inputStyle}
          />
          {fieldErrors.phone && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.phone}</p>}
        </div>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Service *</label>
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setFieldErrors((prev) => { const next = { ...prev }; delete next.service; return next; });
            }}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {serviceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {fieldErrors.service && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.service}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Deal Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setFieldErrors((prev) => { const next = { ...prev }; delete next.value; return next; });
            }}
            placeholder="e.g. ₨65,000"
            style={inputStyle}
          />
          {fieldErrors.value && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.value}</p>}
        </div>
      </div>

      {mode === "edit" && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Notes</label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setFieldErrors((prev) => { const next = { ...prev }; delete next.notes; return next; });
          }}
          placeholder="Additional notes about this lead..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {fieldErrors.notes && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.notes}</p>}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: "var(--admin-surface)",
            color: "var(--admin-text-muted)",
            border: "1px solid var(--admin-border)",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#4B5563" : "#7C3AED",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 24px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {loading ? "Saving..." : mode === "create" ? "Create Lead" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
