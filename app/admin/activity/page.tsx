"use client";

import { useState, useEffect, useCallback } from "react";
import { getActivityLog } from "@/lib/actions/admin";
import Pagination from "@/components/admin/Pagination";

interface ActivityEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
  users: { name: string; email: string } | null;
}

const ACTION_COLORS: Record<string, string> = {
  create: "#10B981",
  update: "#F59E0B",
  delete: "#EF4444",
  login: "#3B82F6",
  logout: "#6B7280",
};

const ENTITY_ICONS: Record<string, string> = {
  blog_post: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z",
  service: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  case_study: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  lead: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  invoice: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
  user: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  contact_submission: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  site_setting: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState("all");
  const pageSize = 30;

  const loadActivities = useCallback(async () => {
    setLoading(true);
    const result = await getActivityLog({
      entity_type: entityFilter === "all" ? undefined : entityFilter,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    if (result.success) {
      setActivities(result.data || []);
      setTotal(result.total || 0);
    }
    setLoading(false);
  }, [entityFilter, page]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "#F9FAFB" }}>
            Activity Log
          </h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Track all admin actions
          </p>
        </div>
      </div>

      {/* Filter */}
      <div style={{
        background: "var(--admin-card)", border: "1px solid var(--admin-border)",
        borderRadius: "12px", padding: "16px 20px", marginBottom: "24px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <span style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem", fontWeight: 600 }}>Entity:</span>
        {["all", "blog_post", "service", "case_study", "lead", "invoice", "user", "contact_submission", "site_setting"].map((e) => (
          <button
            key={e}
            onClick={() => { setEntityFilter(e); setPage(1); }}
            style={{
              padding: "6px 12px", borderRadius: "8px",
              border: entityFilter === e ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
              background: entityFilter === e ? "var(--admin-accent)" : "var(--admin-surface)",
              color: entityFilter === e ? "#fff" : "var(--admin-text)",
              fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
              fontFamily: "var(--font-body)", textTransform: "capitalize",
            }}
          >
            {e === "all" ? "All" : e.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Activity List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="admin-spinner" />
          <p style={{ color: "var(--admin-text-muted)", marginTop: "12px" }}>Loading activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div style={{
          background: "var(--admin-card)", border: "1px solid var(--admin-border)",
          borderRadius: "12px", padding: "60px", textAlign: "center",
        }}>
          <p style={{ color: "var(--admin-text-muted)" }}>No activity recorded yet</p>
        </div>
      ) : (
        <div style={{
          background: "var(--admin-card)", border: "1px solid var(--admin-border)",
          borderRadius: "12px", overflow: "hidden",
        }}>
          {activities.map((activity, i) => (
            <div
              key={activity.id}
              style={{
                padding: "16px 20px",
                borderBottom: i < activities.length - 1 ? "1px solid var(--admin-border)" : "none",
                display: "flex", alignItems: "flex-start", gap: "14px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Icon */}
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: `${ACTION_COLORS[activity.action] || "#6B7280"}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACTION_COLORS[activity.action] || "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ENTITY_ICONS[activity.entity_type] || ENTITY_ICONS.user} />
                </svg>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#F9FAFB", fontSize: "0.8125rem", lineHeight: "1.4" }}>
                  <span style={{ fontWeight: 600 }}>{activity.users?.name || "System"}</span>
                  {" "}
                  <span style={{
                    padding: "1px 6px", borderRadius: "4px",
                    background: `${ACTION_COLORS[activity.action] || "#6B7280"}20`,
                    color: ACTION_COLORS[activity.action] || "#6B7280",
                    fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {activity.action}
                  </span>
                  {" "}
                  <span style={{ color: "var(--admin-text-muted)" }}>
                    {activity.entity_type.replace(/_/g, " ")}
                  </span>
                  {activity.entity_name && (
                    <span style={{ fontWeight: 500 }}> &quot;{activity.entity_name}&quot;</span>
                  )}
                </p>
                <p style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", marginTop: "2px" }}>
                  {formatDate(activity.created_at)}
                </p>
              </div>
            </div>
          ))}

          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--admin-border)" }}>
            <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
