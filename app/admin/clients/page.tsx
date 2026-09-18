"use client";

import { useState } from "react";

const clients = [
  { name: "Raza Holdings", email: "info@razaholdings.pk", phone: "+92 300 1234567", projects: 3, totalSpent: "₨1,250,000", status: "Active" },
  { name: "Fatima Enterprises", email: "contact@fatima.pk", phone: "+92 321 7654321", projects: 2, totalSpent: "₨680,000", status: "Active" },
  { name: "BlueSky Trading", email: "admin@bluesky.pk", phone: "+92 333 9876543", projects: 1, totalSpent: "₨320,000", status: "Active" },
  { name: "Apex Solutions", email: "hello@apexsol.pk", phone: "+92 345 1122334", projects: 4, totalSpent: "₨2,100,000", status: "Active" },
  { name: "Digital Dynamics", email: "team@digdyn.pk", phone: "+92 300 5566778", projects: 1, totalSpent: "₨520,000", status: "Inactive" },
  { name: "Karim & Co.", email: "karim@karimco.pk", phone: "+92 312 9988776", projects: 0, totalSpent: "₨0", status: "Lead" },
  { name: "Nova Industries", email: "info@novaind.pk", phone: "+92 345 4433221", projects: 0, totalSpent: "₨0", status: "Lead" },
  { name: "Safi Brothers", email: "safi@safibros.pk", phone: "+92 321 6677889", projects: 2, totalSpent: "₨890,000", status: "Active" },
];

const statusBadge: Record<string, string> = {
  Active: "success",
  Inactive: "muted",
  Lead: "warning",
};

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Client Management</h1>
        <p className="admin-page-subtitle">Manage and view all your clients</p>
      </div>

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
            {["All", "Active", "Inactive", "Lead"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card" style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table" aria-label="Clients list">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style={{ textAlign: "center" }}>Projects</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedClient(client)}
                    style={{
                      cursor: "pointer",
                      background: selectedClient === client ? "rgba(37,99,235,0.06)" : undefined,
                    }}
                    aria-label={`Select ${client.name}`}
                  >
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{client.projects}</td>
                    <td style={{ fontWeight: 600 }}>{client.totalSpent}</td>
                    <td>
                      <span className={`admin-badge ${statusBadge[client.status]}`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px 16px", color: "var(--admin-text-faint)" }}>
                      No clients match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedClient && (
          <div
            className="admin-card"
            style={{
              width: "340px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 220px)",
              position: "sticky",
              top: "20px",
            }}
            role="complementary"
            aria-label={`Details for ${selectedClient.name}`}
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
                  <div style={{ color: "var(--admin-text)", fontSize: "0.92rem", fontWeight: 600 }}>{selectedClient.name}</div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Email</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", color: "var(--admin-text-faint)", flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" /></svg>
                    {selectedClient.email}
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Phone</div>
                  <div style={{ color: "var(--admin-text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", color: "var(--admin-text-faint)", flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    {selectedClient.phone}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--admin-border)", paddingTop: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "var(--admin-bg)", borderRadius: "var(--admin-radius)", padding: "14px 16px", border: "1px solid var(--admin-border)" }}>
                      <div style={{ color: "var(--admin-text-faint)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Projects</div>
                      <div style={{ color: "var(--admin-accent)", fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{selectedClient.projects}</div>
                    </div>
                    <div style={{ background: "var(--admin-bg)", borderRadius: "var(--admin-radius)", padding: "14px 16px", border: "1px solid var(--admin-border)" }}>
                      <div style={{ color: "var(--admin-text-faint)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total Spent</div>
                      <div style={{ color: "var(--admin-success)", fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{selectedClient.totalSpent}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Status</div>
                  <span className={`admin-badge ${statusBadge[selectedClient.status]}`} style={{ padding: "5px 14px", fontSize: "0.8rem" }}>
                    {selectedClient.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-card[style*="display: flex"][style*="gap: 20px"] {
            flex-direction: column !important;
          }
          .admin-card[style*="display: flex"][style*="gap: 20px"] > div[style*="width: 340px"] {
            width: 100% !important;
            max-height: none !important;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
