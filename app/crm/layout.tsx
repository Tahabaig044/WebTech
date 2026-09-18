"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/crm/dashboard", icon: "◈" },
  { label: "Pipeline", href: "/crm/dashboard", icon: "◉" },
  { label: "Tasks", href: "/crm/dashboard", icon: "⊞" },
  { label: "SLA Monitor", href: "/crm/dashboard", icon: "⏱" },
  { label: "Agents", href: "/crm/dashboard", icon: "◎" },
  { label: "Reports", href: "/crm/dashboard", icon: " ⊟" },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/crm";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#030712" }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }}
        />
      )}

      <aside
        id="crm-sidebar"
        aria-label="CRM navigation"
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-260px",
          width: "260px",
          height: "100vh",
          background: "linear-gradient(180deg, #030712 0%, #0A0F1A 100%)",
          borderRight: "1px solid rgba(6,182,212,0.12)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "left 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
          <Link href="/crm/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 4px 14px rgba(6,182,212,0.4)",
              }}
            >
              ◈
            </div>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-heading)" }}>ERP Suite</div>
              <div style={{ color: "#06B6D4", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Intelligence CRM</div>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/crm/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#F1F5F9" : "#9CA3AF",
                  background: isActive ? "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(8,145,178,0.08))" : "transparent",
                  border: isActive ? "1px solid rgba(6,182,212,0.3)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.1rem", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(6,182,212,0.1)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/crm" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "#06B6D4",
              transition: "all 0.2s ease",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⊘</span>
            Logout
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: "0", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(3,7,18,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(6,182,212,0.1)",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-expanded={sidebarOpen}
              aria-controls="crm-sidebar"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              style={{
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.25)",
                color: "#22D3EE",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
            <div
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.15)",
                borderRadius: "10px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: "220px",
              }}
            >
              <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>⌕</span>
              <input
                type="text"
                placeholder="Search CRM..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#E5E7EB",
                  fontSize: "0.85rem",
                  width: "100%",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              style={{
                position: "relative",
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#22D3EE",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              🔔
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  background: "#F43F5E",
                  borderRadius: "50%",
                  border: "2px solid #030712",
                }}
              />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  boxShadow: "0 2px 8px rgba(6,182,212,0.4)",
                }}
              >
                AG
              </div>
              <div style={{ display: "none" }} className="md-show">
                <div style={{ color: "#F1F5F9", fontSize: "0.82rem", fontWeight: 600 }}>Agent</div>
                <div style={{ color: "#6B7280", fontSize: "0.7rem" }}>CRM Agent</div>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px 24px" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          aside { left: 0 !important; }
          .md-show { display: block !important; }
        }
      `}</style>
    </div>
  );
}
