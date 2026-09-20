"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "Client";
  const userEmail = session?.user?.email || "";

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ marginBottom: "8px" }}>Settings</h1>
      <p style={{ color: "#9CA3AF", fontSize: "0.92rem", marginBottom: "32px" }}>
        Manage your account settings and preferences.
      </p>

      <div style={{
        background: "rgba(139,92,246,0.06)",
        border: "1px solid rgba(139,92,246,0.18)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
      }}>
        <h3 style={{ marginBottom: "12px", fontSize: "0.95rem" }}>Account Information</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.88rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Name</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{userName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Email</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{userEmail}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Role</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{session?.user?.role || "Client"}</span>
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(139,92,246,0.04)",
        border: "1px solid rgba(139,92,246,0.12)",
        borderRadius: "12px",
        padding: "24px",
      }}>
        <h3 style={{ marginBottom: "8px", fontSize: "0.95rem" }}>Need to make changes?</h3>
        <p style={{ color: "#9CA3AF", fontSize: "0.88rem", marginBottom: "16px", lineHeight: 1.6 }}>
          To update your account details, change your password, or manage billing,
          please contact our support team. We&apos;ll assist you promptly.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
