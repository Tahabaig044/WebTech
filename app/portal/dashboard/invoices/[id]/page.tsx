"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPortalInvoiceById, getPortalInvoicePayments } from "@/lib/actions/portal";
import { formatCurrency } from "@/lib/utils/currency";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import type { Invoice, InvoicePayment } from "@/lib/types";

const PAYMENT_MODE_LABELS: Record<string, string> = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  BANK_TRANSFER: "Bank Transfer",
  ONLINE: "Online",
};

export default function InvoiceDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!session?.user?.email || !invoiceId) return;

    const [invoiceRes, paymentsRes] = await Promise.all([
      getPortalInvoiceById(invoiceId),
      getPortalInvoicePayments(invoiceId),
    ]);

    if (invoiceRes.error || !invoiceRes.data) {
      setError(invoiceRes.error || "Invoice not found");
    } else {
      setInvoice(invoiceRes.data);
      setPayments(paymentsRes.data || []);
    }
  }, [session?.user?.email, invoiceId]);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ height: "28px", width: "200px", borderRadius: "6px", background: "rgba(139,92,246,0.08)", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "16px", width: "300px", borderRadius: "4px", background: "rgba(139,92,246,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        <LoadingSkeleton rows={4} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div>
        <Link href="/portal/dashboard/invoices" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← Back to Invoices
        </Link>
        <div style={{ padding: "48px 24px", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.5 }}> ⊡ </div>
          <h3 style={{ color: "#E5E7EB", fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Invoice not found</h3>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", maxWidth: "360px", margin: "0 auto 20px", lineHeight: 1.5 }}>
            {error || "The invoice you're looking for doesn't exist or you don't have access to it."}
          </p>
          <Link href="/portal/dashboard/invoices" style={{ display: "inline-block", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
            View All Invoices
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(invoice.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
  const paidDate = invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const remainingAmount = Number(invoice.amount) - totalPaid;

  return (
    <div className="invoice-detail-page">
      {/* Print-only invoice document */}
      <div className="invoice-print-document" style={{ display: "none" }}>
        <div style={{ fontFamily: "Arial, sans-serif", color: "#1a1a1a", padding: "40px", maxWidth: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", borderBottom: "2px solid #6D28D9", paddingBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#6D28D9" }}>INVOICE</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "4px" }}>{invoice.invoice_number}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>Date: {createdDate}</div>
              {dueDate && <div style={{ fontSize: "0.85rem", color: "#666" }}>Due: {dueDate}</div>}
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>Status: {invoice.status}</div>
            </div>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Bill To</div>
            <div style={{ fontWeight: 600 }}>{session?.user?.name || "Client"}</div>
            <div style={{ fontSize: "0.85rem", color: "#444" }}>{session?.user?.email}</div>
          </div>
          {invoice.description && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Description</div>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{invoice.description}</div>
            </div>
          )}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "4px" }}>Total Amount</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#6D28D9" }}>{formatCurrency(Number(invoice.amount), invoice.currency)}</div>
            </div>
          </div>
          {payments.length > 0 && (
            <div style={{ marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
              <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Payment History</div>
              {payments.map((p) => (
                <div key={p.id} style={{ fontSize: "0.85rem", color: "#444", marginBottom: "4px" }}>
                  {new Date(p.payment_date).toLocaleDateString()} — {formatCurrency(Number(p.amount), invoice.currency)} via {PAYMENT_MODE_LABELS[p.payment_mode] || p.payment_mode}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Screen-only UI */}
      <Link href="/portal/dashboard/invoices" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
        ← Back to Invoices
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ color: "#C4B5FD", fontWeight: 600, fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{invoice.invoice_number}</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>
            Invoice Details
          </h1>
          <button onClick={handleDownloadPDF} className="no-print" style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.1)", color: "#C4B5FD", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ↓ Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="portal-invoice-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "32px" }}>
        {/* Left Column — Invoice Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Amount Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ color: "#6B7280", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Total Amount</div>
            <div style={{ color: "#F1F5F9", fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              {formatCurrency(Number(invoice.amount), invoice.currency)}
            </div>
            {invoice.status === "paid" && paidDate && (
              <div style={{ color: "#10B981", fontSize: "0.82rem", marginTop: "8px" }}>Paid on {paidDate}</div>
            )}
          </div>

          {/* Description */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "28px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Description</h3>
            {invoice.description ? (
              <p style={{ color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{invoice.description}</p>
            ) : (
              <p style={{ color: "#6B7280", fontSize: "0.88rem", fontStyle: "italic", margin: 0 }}>No description provided.</p>
            )}
          </div>

          {/* Payment History */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "28px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>
              Payment History
              {payments.length > 0 && <span style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 500, marginLeft: "8px" }}>({payments.length})</span>}
            </h3>
            {payments.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {payments.map((p) => (
                  <div key={p.id} style={{ padding: "14px", borderRadius: "10px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ color: "#E5E7EB", fontWeight: 600, fontSize: "0.88rem" }}>{formatCurrency(Number(p.amount), invoice.currency)}</span>
                      <span style={{ color: "#10B981", fontSize: "0.72rem", fontWeight: 600 }}>{PAYMENT_MODE_LABELS[p.payment_mode] || p.payment_mode}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{new Date(p.payment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span style={{ color: "#6B7280", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>{p.receipt_number}</span>
                    </div>
                    {p.reference_number && (
                      <div style={{ color: "#6B7280", fontSize: "0.72rem", marginTop: "4px" }}>Ref: {p.reference_number}</div>
                    )}
                    {p.notes && (
                      <div style={{ color: "#9CA3AF", fontSize: "0.75rem", marginTop: "4px", fontStyle: "italic" }}>{p.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6B7280", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>No payments recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right Column — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Details Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Invoice Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Status</span>
                <StatusBadge status={invoice.status} />
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Invoice #</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{invoice.invoice_number}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Currency</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{invoice.currency || "PKR"}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Issued</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{createdDate}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Due Date</span>
                <span style={{ color: dueDate ? "#E5E7EB" : "#6B7280", fontWeight: dueDate ? 600 : 400 }}>{dueDate || "Not set"}</span>
              </div>
              {paidDate && (
                <>
                  <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#9CA3AF" }}>Paid On</span>
                    <span style={{ color: "#10B981", fontWeight: 600 }}>{paidDate}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          {payments.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Payment Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9CA3AF" }}>Total Paid</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>{formatCurrency(totalPaid, invoice.currency)}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9CA3AF" }}>Remaining</span>
                  <span style={{ color: remainingAmount > 0 ? "#F59E0B" : "#10B981", fontWeight: 700 }}>{formatCurrency(remainingAmount, invoice.currency)}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9CA3AF" }}>Payments</span>
                  <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{payments.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Need help? */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "12px" }}>Need help?</h3>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", marginBottom: "16px", lineHeight: 1.5 }}>
              Questions about this invoice? Our team is here to help.
            </p>
            <Link
              href="/portal/dashboard/support"
              style={{
                display: "block", textAlign: "center", padding: "10px 18px", borderRadius: "10px",
                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
                color: "#C4B5FD", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media (max-width: 768px) {
          .portal-invoice-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          .no-print { display: none !important; }
          .invoice-print-document { display: block !important; }
          .invoice-detail-page > *:not(.invoice-print-document) { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
