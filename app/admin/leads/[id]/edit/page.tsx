"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/lib/actions/admin";
import type { Lead } from "@/lib/types";
import LeadForm from "@/components/admin/LeadForm";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getLeadById(id);
        if (!data) {
          setError("Lead not found");
        } else {
          setLead(data);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load lead");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div>
        <div className="admin-card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#EF4444", fontSize: "0.875rem", marginBottom: 16 }}>{error || "Lead not found"}</p>
          <Link href="/admin/leads/all" style={{ color: "var(--admin-accent)", fontSize: "0.875rem" }}>
            Back to leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <Link
            href={`/admin/leads/${id}`}
            style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}
          >
            {lead.name}
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-muted)" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{ color: "var(--admin-text)", fontSize: "0.8125rem", fontWeight: 600 }}>Edit</span>
        </div>
        <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Lead
        </h1>
        <p className="admin-page-subtitle">Update lead information</p>
      </div>
      <div className="admin-card" style={{ padding: "32px" }}>
        <LeadForm
          mode="edit"
          initial={{
            id: lead.id,
            name: lead.name,
            email: lead.email ?? undefined,
            phone: lead.phone ?? undefined,
            service: lead.service,
            value: lead.value ?? undefined,
            status: lead.status,
            notes: lead.notes ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
