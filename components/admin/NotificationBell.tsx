"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "@/lib/actions/admin";
import type { Notification } from "@/lib/types";

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

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const toggleOpen = async () => {
    if (!open) {
      setLoading(true);
      try {
        const result = await getNotifications({ pageSize: 10 });
        setNotifications(result.data);
      } catch {
        // ignore
      }
      setLoading(false);
    }
    setOpen(!open);
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        style={{
          background: "none",
          border: "none",
          color: "var(--admin-text-muted)",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "0", right: "0",
            width: "16px", height: "16px", borderRadius: "50%",
            background: "#EF4444", color: "#fff",
            fontSize: "0.6rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: "8px",
          width: "360px", maxHeight: "480px",
          background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
          borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          overflow: "hidden", zIndex: 50,
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--admin-text)" }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "var(--admin-accent)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--admin-border)",
                    background: n.is_read ? "transparent" : "rgba(124,58,237,0.04)",
                    cursor: "pointer",
                    display: "flex", gap: "10px", alignItems: "flex-start",
                  }}
                  onClick={() => {
                    if (!n.is_read) handleMarkRead(n.id);
                    if (n.link) window.location.href = n.link;
                    setOpen(false);
                  }}
                >
                  <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "2px" }}>{TYPE_ICONS[n.type] || "📌"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8125rem", fontWeight: n.is_read ? 400 : 600, color: "var(--admin-text)" }}>{n.title}</div>
                    {n.message && <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</div>}
                    <div style={{ fontSize: "0.6875rem", color: "var(--admin-text-faint)", marginTop: "4px" }}>{formatRelativeTime(n.created_at)}</div>
                  </div>
                  {!n.is_read && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: "6px" }} />}
                </div>
              ))
            )}
          </div>
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--admin-border)", textAlign: "center" }}>
            <Link href="/admin/notifications" onClick={() => setOpen(false)} style={{ fontSize: "0.8125rem", color: "var(--admin-accent)", textDecoration: "none", fontWeight: 600 }}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
