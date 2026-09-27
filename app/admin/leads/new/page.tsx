"use client";

import LeadForm from "@/components/admin/LeadForm";

export default function NewLeadPage() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Lead
        </h1>
        <p className="admin-page-subtitle">Add a new lead to the pipeline</p>
      </div>
      <div className="admin-card" style={{ padding: "32px" }}>
        <LeadForm mode="create" />
      </div>
    </div>
  );
}
