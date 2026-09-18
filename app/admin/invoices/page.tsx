"use client";

import { useState, useEffect, useMemo } from "react";
import { getAdminInvoices } from "@/lib/actions/admin";
import type { AdminInvoice } from "@/lib/types";

function CurrencyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const statusBadgeClass: Record<string, string> = {
  paid: "success",
  pending: "warning",
  overdue: "error",
  draft: "muted",
};

const statusLabels: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  draft: "Draft",
};

function formatCurrency(amount: number, currency?: string | null): string {
  const cur = currency || "PKR";
  if (cur === "PKR") return `₨${amount.toLocaleString()}`;
  return `${cur} ${amount.toLocaleString()}`;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminInvoices()
      .then(setInvoices)
      .catch((e) => setError(e.message || "Failed to load invoices"))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const pending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const overdue = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    return [
      { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "var(--admin-success)", iconClass: "success" },
      { label: "Pending", value: formatCurrency(pending), color: "var(--admin-warning)", iconClass: "warning" },
      { label: "Overdue", value: formatCurrency(overdue), color: "var(--admin-error)", iconClass: "error" },
    ];
  }, [invoices]);

  const kpiIcons = [CurrencyIcon, ClockIcon, AlertIcon];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Invoice Management</h1>
          <p className="admin-page-subtitle">Track and manage all invoices</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div className="admin-grid-3" style={{ marginBottom: "24px" }}>
        {summary.map((s, i) => {
          const Icon = kpiIcons[i];
          return (
            <div className="admin-kpi" key={s.label}>
              <div className="admin-kpi-header">
                <span className="admin-kpi-label">{s.label}</span>
                <div className={`admin-kpi-icon ${s.iconClass}`} style={{ background: "var(--admin-" + s.iconClass + "-dim)", color: s.color }}>
                  <Icon />
                </div>
              </div>
              <div className="admin-kpi-value" style={{ color: s.color }}>{loading ? "—" : s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">All Invoices</h2>
            <p className="admin-card-subtitle">{loading ? "Loading..." : `${invoices.length} invoices in total`}</p>
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--admin-text-muted)" }}>Loading invoices...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table" role="table" aria-label="Invoices">
              <thead>
                <tr>
                  <th scope="col">Invoice #</th>
                  <th scope="col">Client</th>
                  <th scope="col">Description</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--admin-accent)" }}>
                          <DocumentIcon />
                        </span>
                        <span style={{ fontFamily: "monospace", fontSize: "0.825rem" }}>{inv.invoice_number}</span>
                      </span>
                    </td>
                    <td>{inv.client_email}</td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.description || "—"}</td>
                    <td style={{ fontWeight: 700, color: "var(--admin-text)" }}>{formatCurrency(Number(inv.amount), inv.currency)}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                    <td>
                      <span className={`admin-badge ${statusBadgeClass[inv.status || "draft"] || "muted"}`} role="status" aria-label={`Status: ${statusLabels[inv.status || "draft"] || inv.status}`}>
                        {statusLabels[inv.status || "draft"] || inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "var(--admin-text-faint)" }}>
                      No invoices yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
