"use client";

import { useState, useEffect } from "react";
import { getAdminClients } from "@/lib/actions/admin";
import type { AdminClient } from "@/lib/types";

function getStatusLabel(client: AdminClient): string {
  if (client.project_count > 0) return "Active";
  if (client.invoice_count > 0) return "Active";
  return "Client";
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `₨${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₨${(amount / 1_000).toFixed(0)}K`;
  return `₨${amount.toLocaleString()}`;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);

  useEffect(() => {
    getAdminClients()
      .then(setClients)
      .catch((e) => setError(e.message || "Failed to load clients"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) => {
    const matchSearch =
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const status = getStatusLabel(c);
    const matchStatus = statusFilter === "All" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Client Management</h1>
        <p className="admin-page-subtitle">Manage and view all your clients</p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div className="admin-input" style={{ flex: 1, minWidth: "250px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-focus"
            aria-label="Search clients by name or email"
          />
        </div>
        <div className="admin-input" style={{ width: "160px", flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-focus"
            aria-label="Filter clients by status"
          >
            {["All", "Active", "Client"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card admin-client-split" style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--admin-text-muted)" }}>Loading clients...</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table" aria-label="Clients list">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th style={{ textAlign: "center" }}>Projects</th>
                    <th style={{ textAlign: "center" }}>Invoices</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => {
                    const status = getStatusLabel(client);
                    return (
                      <tr
                        key={client.email}
                        onClick={() => setSelectedClient(client)}
                        style={{
                          cursor: "pointer",
                          background: selectedClient?.email === client.email ? "rgba(37,99,235,0.06)" : undefined,
                        }}
                        aria-label={`Select ${client.name || client.email}`}
                      >
                        <td>{client.name || "—"}</td>
                        <td>{client.email}</td>
                        <td style={{ textAlign: "center", fontWeight: 600 }}>{client.project_count}</td>
                        <td style={{ textAlign: "center", fontWeight: 600 }}>{client.invoice_count}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(client.total_spent)}</td>
                        <td>
                          <span className={`admin-badge ${status === "Active" ? "success" : "muted"}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px 16px", color: "var(--admin-text-faint)" }}>
                        {clients.length === 0 ? "No clients yet. Clients appear here once they have projects or invoices." : "No clients match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedClient && (
          <div
            className="admin-card admin-client-detail"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 220px)",
              position: "sticky",
              top: "20px",
            }}
            role="complementary"
            aria-label={`Details for ${selectedClient.name || selectedClient.email}`}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <h3 style={{ color: "var(--admin-text)", fontSize: "0.95rem", fontWeight: 700, margin: 0, fontFamily: "var(--font-heading)" }}>Client Details</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="admin-focus"
                aria-label="Close client details"
                style={{
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "6px",
                  color: "var(--admin-text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  transition: "all var(--admin-transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-border-strong)"; e.currentTarget.style.color = "var(--admin-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; e.currentTarget.style.color = "var(--admin-text-muted)"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Name</div>
                  <div style={{ color: "var(--admin-text)", fontSize: "0.92rem", fontWeight: 600 }}>{selectedClient.name || "—"}</div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Email</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", color: "var(--admin-text-faint)", flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" /></svg>
                    {selectedClient.email}
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Role</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>
                    {selectedClient.role || "client"}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "var(--admin-bg)", borderRadius: "var(--admin-radius)", padding: "14px 16px", border: "1px solid var(--admin-border)" }}>
                      <div style={{ color: "var(--admin-text-faint)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Projects</div>
                      <div style={{ color: "var(--admin-accent)", fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{selectedClient.project_count}</div>
                    </div>
                    <div style={{ background: "var(--admin-bg)", borderRadius: "var(--admin-radius)", padding: "14px 16px", border: "1px solid var(--admin-border)" }}>
                      <div style={{ color: "var(--admin-text-faint)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total Spent</div>
                      <div style={{ color: "var(--admin-success)", fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{formatCurrency(selectedClient.total_spent)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Status</div>
                  <span className={`admin-badge ${getStatusLabel(selectedClient) === "Active" ? "success" : "muted"}`} style={{ padding: "5px 14px", fontSize: "0.8rem" }}>
                    {getStatusLabel(selectedClient)}
                  </span>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Member Since</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>
                    {new Date(selectedClient.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
