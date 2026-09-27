"use client";

import { useState, useEffect, useCallback } from "react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/actions/admin";
import type { Notification } from "@/lib/types";
import Pagination from "@/components/admin/Pagination";
import { useRouter } from "next/navigation";

const TYPE_ICONS: Record<string, string> = {
  "lead.created": "🟢",
  "lead.assigned": "📋",
  "lead.reassigned": "📋",
  "lead.converted": "✅",
  "followup.assigned": "⏰",
  "followup.completed": "✅",
  "ticket.created": "🎫",
  "ticket.replied": "💬",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const pageSize = 20;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNotifications({ page, pageSize, unread_only: unreadOnly });
      setNotifications(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [page, unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="admin-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Notifications
            </h1>
            <p className="admin-page-subtitle">{total} total notifications</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => { setUnreadOnly(!unreadOnly); setPage(1); }}
              style={{
                padding: "8px 16px", borderRadius: "8px",
                border: unreadOnly ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                background: unreadOnly ? "var(--admin-accent)" : "var(--admin-surface)",
                color: unreadOnly ? "#fff" : "var(--admin-text)",
                fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >
              {unreadOnly ? "Showing Unread" : "Show Unread"}
            </button>
            <button
              onClick={handleMarkAllRead}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                background: "var(--admin-surface)", color: "var(--admin-text)",
                fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>
            {unreadOnly ? "No unread notifications" : "No notifications yet"}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--admin-border)",
                background: n.is_read ? "transparent" : "rgba(124,58,237,0.03)",
                cursor: "pointer",
                display: "flex", gap: "12px", alignItems: "flex-start",
              }}
              onClick={() => {
                if (!n.is_read) handleMarkRead(n.id);
                if (n.link) router.push(n.link);
              }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "2px" }}>{TYPE_ICONS[n.type] || "📌"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: n.is_read ? 400 : 600, color: "var(--admin-text)" }}>{n.title}</div>
                {n.message && <div style={{ fontSize: "0.8125rem", color: "var(--admin-text-muted)", marginTop: "2px" }}>{n.message}</div>}
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-faint)", marginTop: "4px" }}>{formatDate(n.created_at)}</div>
              </div>
              {!n.is_read && (
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: "6px" }} />
              )}
            </div>
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
