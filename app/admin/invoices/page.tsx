"use client";

const invoices = [
  { number: "INV-2026-001", client: "Raza Holdings", amount: "₨280,000", date: "Sep 1, 2026", dueDate: "Sep 15, 2026", status: "Paid" },
  { number: "INV-2026-002", client: "Fatima Enterprises", amount: "₨45,000", date: "Sep 3, 2026", dueDate: "Sep 17, 2026", status: "Pending" },
  { number: "INV-2026-003", client: "BlueSky Trading", amount: "₨120,000", date: "Sep 5, 2026", dueDate: "Sep 19, 2026", status: "Pending" },
  { number: "INV-2026-004", client: "Apex Solutions", amount: "₨350,000", date: "Aug 28, 2026", dueDate: "Sep 11, 2026", status: "Overdue" },
  { number: "INV-2026-005", client: "Digital Dynamics", amount: "₨520,000", date: "Aug 20, 2026", dueDate: "Sep 3, 2026", status: "Overdue" },
  { number: "INV-2026-006", client: "Safi Brothers", amount: "₨85,000", date: "Sep 8, 2026", dueDate: "Sep 22, 2026", status: "Pending" },
  { number: "INV-2026-007", client: "Karim & Co.", amount: "₨185,000", date: "Sep 10, 2026", dueDate: "Sep 24, 2026", status: "Draft" },
  { number: "INV-2026-008", client: "Nova Industries", amount: "₨95,000", date: "Sep 12, 2026", dueDate: "Sep 26, 2026", status: "Draft" },
];

const summary = [
  { label: "Total Revenue", value: "₨12.5M", color: "var(--admin-success)", iconClass: "success" },
  { label: "Pending", value: "₨250,000", color: "var(--admin-warning)", iconClass: "warning" },
  { label: "Overdue", value: "₨870,000", color: "var(--admin-error)", iconClass: "error" },
];

const statusBadgeClass: Record<string, string> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "error",
  Draft: "muted",
};

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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

const kpiIcons = [CurrencyIcon, ClockIcon, AlertIcon];

export default function AdminInvoicesPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Invoice Management</h1>
          <p className="admin-page-subtitle">Track and manage all invoices</p>
        </div>
        <button className="admin-btn admin-btn-primary admin-focus" aria-label="Generate new invoice">
          <PlusIcon />
          Generate Invoice
        </button>
      </div>

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
              <div className="admin-kpi-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">All Invoices</h2>
            <p className="admin-card-subtitle">8 invoices in total</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table" role="table" aria-label="Invoices">
            <thead>
              <tr>
                <th scope="col">Invoice #</th>
                <th scope="col">Client</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.number}>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--admin-accent)" }}>
                        <DocumentIcon />
                      </span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.825rem" }}>{inv.number}</span>
                    </span>
                  </td>
                  <td>{inv.client}</td>
                  <td style={{ fontWeight: 700, color: "var(--admin-text)" }}>{inv.amount}</td>
                  <td style={{ color: "var(--admin-text-muted)" }}>{inv.date}</td>
                  <td style={{ color: "var(--admin-text-muted)" }}>{inv.dueDate}</td>
                  <td>
                    <span className={`admin-badge ${statusBadgeClass[inv.status]}`} role="status" aria-label={`Status: ${inv.status}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
