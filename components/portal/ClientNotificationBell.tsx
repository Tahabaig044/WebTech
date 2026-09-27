"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getClientNotifications, getClientUnreadCount, markClientNotificationRead, markAllClientNotificationsRead } from "@/lib/actions/portal";
import type { Notification } from "@/lib/types";

type ClientNotification = Omit<Notification, "user_id">;

export default function ClientNotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    try {
      const count = await getClientUnreadCount();
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
        const result = await getClientNotifications({ pageSize: 10 });
        setNotifications(result.data);
      } catch {
        // ignore
      }
      setLoading(false);
    }
    setOpen(!open);
  };

  const handleMarkRead = async (id: string) => {
    await markClientNotificationRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllClientNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const formatRelativeTime = (dateStr: string) => {
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
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        style={{
          background: "none", border: "none", color: "#9CA3AF", cursor: "pointer",
          padding: "6px", borderRadius: "8px", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
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
          width: "340px", maxHeight: "420px",
          background: "#1F2937", border: "1px solid #374151",
          borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          overflow: "hidden", zIndex: 50,
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #374151", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#F9FAFB" }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "#A78BFA", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF", fontSize: "0.8125rem" }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF", fontSize: "0.8125rem" }}>No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "12px 16px", borderBottom: "1px solid #374151",
                    background: n.is_read ? "transparent" : "rgba(167,139,250,0.05)",
                    cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start",
                  }}
                  onClick={() => {
                    if (!n.is_read) handleMarkRead(n.id);
                    setOpen(false);
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8125rem", fontWeight: n.is_read ? 400 : 600, color: "#F9FAFB" }}>{n.title}</div>
                    {n.message && <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</div>}
                    <div style={{ fontSize: "0.6875rem", color: "#6B7280", marginTop: "4px" }}>{formatRelativeTime(n.created_at)}</div>
                  </div>
                  {!n.is_read && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0, marginTop: "6px" }} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
