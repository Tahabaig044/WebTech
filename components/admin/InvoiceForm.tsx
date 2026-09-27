"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createInvoice, updateInvoice, getAdminProjects } from "@/lib/actions/admin";
import { invoiceSchema } from "@/lib/validations/admin";
import type { Project } from "@/lib/types";

interface InvoiceFormProps {
  initial?: {
    id?: string;
    client_email?: string;
    invoice_number?: string;
    amount?: number;
    currency?: string;
    status?: string;
    description?: string;
    project_id?: string | null;
    due_date?: string;
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

export default function InvoiceForm({ initial, mode }: InvoiceFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);

  const [clientEmail, setClientEmail] = useState(initial?.client_email ?? "");
  const [invoiceNumber, setInvoiceNumber] = useState(initial?.invoice_number ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [currency, setCurrency] = useState(initial?.currency ?? "PKR");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [projectId, setProjectId] = useState(initial?.project_id ?? "");
  const [dueDate, setDueDate] = useState(initial?.due_date ?? "");

  useEffect(() => {
    getAdminProjects({ page: 1 }).then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      client_email: clientEmail,
      invoice_number: invoiceNumber,
      amount,
      currency,
      status,
      description,
      project_id: projectId || undefined,
      due_date: dueDate || undefined,
    };

    try {
      const schemaResult = invoiceSchema.safeParse(payload);
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
        await createInvoice(payload);
      } else {
        await updateInvoice(initial!.id!, payload);
      }
      router.push("/admin/invoices");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
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
        <label style={labelStyle}>Client Email *</label>
        <input
          type="email"
          required
          value={clientEmail}
          onChange={(e) => {
            setClientEmail(e.target.value);
            setFieldErrors((prev) => { const next = { ...prev }; delete next.client_email; return next; });
          }}
          style={inputStyle}
        />
        {fieldErrors.client_email && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.client_email}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Invoice Number *</label>
        <input
          type="text"
          required
          value={invoiceNumber}
          onChange={(e) => {
            setInvoiceNumber(e.target.value);
            setFieldErrors((prev) => { const next = { ...prev }; delete next.invoice_number; return next; });
          }}
          style={inputStyle}
        />
        {fieldErrors.invoice_number && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.invoice_number}</p>}
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>Amount *</label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value));
              setFieldErrors((prev) => { const next = { ...prev }; delete next.amount; return next; });
            }}
            style={inputStyle}
          />
          {fieldErrors.amount && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "4px" }}>{fieldErrors.amount}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Linked Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#4B5563" : "#6366F1",
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
        {loading ? "Saving..." : mode === "create" ? "Create Invoice" : "Save Changes"}
      </button>
    </form>
  );
}
