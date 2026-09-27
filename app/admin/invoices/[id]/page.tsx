"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getInvoiceById, getAdminInvoicePayments, createPayment, deletePayment, updateInvoice } from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { AdminInvoice, InvoicePayment } from "@/lib/types";

const PAYMENT_MODE_LABELS: Record<string, string> = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  BANK_TRANSFER: "Bank Transfer",
  ONLINE: "Online",
};

const STATUS_BADGES: Record<string, { class: string; label: string }> = {
  paid: { class: "success", label: "Paid" },
  pending: { class: "warning", label: "Pending" },
  overdue: { class: "error", label: "Overdue" },
  draft: { class: "muted", label: "Draft" },
};

function formatCurrency(amount: number, currency?: string | null): string {
  const cur = currency || "PKR";
  if (cur === "PKR") return `₨${amount.toLocaleString()}`;
  return `${cur} ${amount.toLocaleString()}`;
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

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<AdminInvoice | null>(null);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [payForm, setPayForm] = useState({ amount: 0, payment_date: "", payment_mode: "BANK_TRANSFER", receipt_number: "", reference_number: "", notes: "" });
  const [payLoading, setPayLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoadError(null);
    try {
      const [invoiceRes, paymentsRes] = await Promise.all([
        getInvoiceById(invoiceId),
        getAdminInvoicePayments(invoiceId),
      ]);
      setInvoice(invoiceRes);
      setPayments(paymentsRes.data || []);
    } catch (e: unknown) {
      // Without this the page would stay on "Loading invoice..." forever.
      console.error("Failed to load invoice", invoiceId, e);
      setLoadError(e instanceof Error ? e.message : "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = invoice ? Number(invoice.amount) - totalPaid : 0;

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.amount || !payForm.payment_date || !payForm.receipt_number) return;
    setPayLoading(true);
    const result = await createPayment({
      invoice_id: invoiceId,
      amount: payForm.amount,
      payment_date: payForm.payment_date,
      payment_mode: payForm.payment_mode,
      receipt_number: payForm.receipt_number,
      reference_number: payForm.reference_number || undefined,
      notes: payForm.notes || undefined,
    });
    if (result.success) {
      toast.success("Payment recorded");
      setShowPaymentForm(false);
      setPayForm({ amount: 0, payment_date: "", payment_mode: "BANK_TRANSFER", receipt_number: "", reference_number: "", notes: "" });
      loadData();
    } else {
      toast.error(result.error || "Failed to record payment");
    }
    setPayLoading(false);
  };

  const handleMarkPaid = async () => {
    const result = await updateInvoice(invoiceId, { status: "paid", paid_at: new Date().toISOString() });
    if (result.success) { toast.success("Invoice marked as paid"); loadData(); } else { toast.error(result.error || "Failed"); }
  };

  const handleMarkOverdue = async () => {
    const result = await updateInvoice(invoiceId, { status: "overdue", paid_at: "" });
    if (result.success) { toast.success("Invoice marked as overdue"); loadData(); } else { toast.error(result.error || "Failed"); }
  };

  const handleDeletePayment = async () => {
    if (!deleteTarget) return;
    const result = await deletePayment(deleteTarget.id, invoiceId);
    if (result.success) { toast.success("Payment deleted"); loadData(); } else { toast.error(result.error || "Failed"); }
    setDeleteTarget(null);
  };

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading invoice...</div>;
  }

  if (loadError) {
    return (
      <div>
        <Link href="/admin/invoices" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>← Back to Invoices</Link>
        <div className="admin-card" style={{ padding: "48px", textAlign: "center", marginTop: "16px", color: "var(--admin-text-muted)" }}>
          <p style={{ color: "var(--admin-danger, #ef4444)", marginBottom: "16px" }}>Could not load this invoice.</p>
          <button type="button" onClick={() => { setLoading(true); loadData(); }} style={{ background: "var(--admin-accent)", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div>
        <Link href="/admin/invoices" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>← Back to Invoices</Link>
        <div className="admin-card" style={{ padding: "48px", textAlign: "center", marginTop: "16px", color: "var(--admin-text-muted)" }}>Invoice not found.</div>
      </div>
    );
  }

  const status = STATUS_BADGES[invoice.status || "draft"] || STATUS_BADGES.draft;

  return (
    <div>
      <Link href="/admin/invoices" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
        ← Back to Invoices
      </Link>

      <div className="admin-page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 className="admin-page-title">Invoice {invoice.invoice_number}</h1>
            <span className={`admin-badge ${status.class}`}>{status.label}</span>
          </div>
          <p className="admin-page-subtitle">{invoice.client_email}</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {invoice.status !== "paid" && <button onClick={handleMarkPaid} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10B981", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Mark Paid</button>}
          {invoice.status !== "overdue" && invoice.status !== "paid" && <button onClick={handleMarkOverdue} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.1)", color: "#F59E0B", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Mark Overdue</button>}
          <button onClick={() => router.push(`/admin/invoices/${invoiceId}/edit`)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Edit</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Invoice Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
            {[
              { label: "Amount", value: formatCurrency(Number(invoice.amount), invoice.currency) },
              { label: "Currency", value: invoice.currency || "PKR" },
              { label: "Status", value: status.label },
              { label: "Due Date", value: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not set" },
              { label: "Paid At", value: invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
              { label: "Project", value: invoice.project_id ? "Linked" : "None" },
              { label: "Created", value: new Date(invoice.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--admin-border)" }}>
                <span style={{ color: "var(--admin-text-muted)" }}>{row.label}</span>
                <span style={{ color: "var(--admin-text)", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Payment Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "var(--admin-bg)", borderRadius: "8px", padding: "12px", border: "1px solid var(--admin-border)" }}>
              <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Paid</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10B981", fontFamily: "var(--font-heading)" }}>{formatCurrency(totalPaid, invoice.currency)}</div>
            </div>
            <div style={{ background: "var(--admin-bg)", borderRadius: "8px", padding: "12px", border: "1px solid var(--admin-border)" }}>
              <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Remaining</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: remaining > 0 ? "#F59E0B" : "#10B981", fontFamily: "var(--font-heading)" }}>{formatCurrency(remaining, invoice.currency)}</div>
            </div>
          </div>
          {invoice.description && (
            <div style={{ marginTop: "16px", borderTop: "1px solid var(--admin-border)", paddingTop: "16px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", fontWeight: 600, marginBottom: "6px" }}>Description</div>
              <p style={{ color: "var(--admin-text)", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>{invoice.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--admin-text)", fontFamily: "var(--font-heading)" }}>Payments ({payments.length})</h3>
          {invoice.status !== "paid" && (
            <button onClick={() => setShowPaymentForm(!showPaymentForm)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-accent)", background: "var(--admin-accent)", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              {showPaymentForm ? "Cancel" : "Record Payment"}
            </button>
          )}
        </div>

        {showPaymentForm && (
          <form onSubmit={handleRecordPayment} style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: "10px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Amount *</label>
                <input type="number" min={0} step="0.01" required value={payForm.amount || ""} onChange={(e) => setPayForm({ ...payForm, amount: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Payment Date *</label>
                <input type="date" required value={payForm.payment_date} onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Method *</label>
                <select value={payForm.payment_mode} onChange={(e) => setPayForm({ ...payForm, payment_mode: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                  {Object.entries(PAYMENT_MODE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Receipt Number *</label>
                <input type="text" required value={payForm.receipt_number} onChange={(e) => setPayForm({ ...payForm, receipt_number: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Reference Number</label>
                <input type="text" value={payForm.reference_number} onChange={(e) => setPayForm({ ...payForm, reference_number: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <input type="text" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={payLoading} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: payLoading ? "#4B5563" : "#10B981", color: "#fff", fontSize: "0.8125rem", fontWeight: 600, cursor: payLoading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>
              {payLoading ? "Saving..." : "Save Payment"}
            </button>
          </form>
        )}

        {payments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {payments.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#10B981", marginRight: "12px" }}>{formatCurrency(Number(p.amount), invoice.currency)}</span>
                  <span style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{PAYMENT_MODE_LABELS[p.payment_mode] || p.payment_mode}</span>
                  <span style={{ color: "var(--admin-text-faint)", fontSize: "0.75rem", marginLeft: "12px" }}>{new Date(p.payment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--admin-text-faint)", marginLeft: "12px" }}>{p.receipt_number}</span>
                </div>
                <button onClick={() => setDeleteTarget({ id: p.id, label: p.receipt_number })} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#EF4444", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>No payments recorded yet.</p>
        )}
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Delete Payment" message={`Delete payment "${deleteTarget?.label}"?`} danger confirmLabel="Delete" onConfirm={handleDeletePayment} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
