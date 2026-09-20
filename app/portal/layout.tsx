"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: "◈" },
  { label: "Projects", href: "/portal/dashboard/projects", icon: "⊞" },
  { label: "Invoices", href: "/portal/dashboard/invoices", icon: " ⊡" },
  { label: "Support", href: "/portal/dashboard/support", icon: " ⊘" },
  { label: "Settings", href: "/portal/dashboard/settings", icon: " ⊚" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/portal";
  const { data: session } = useSession();

  const userName = session?.user?.name || "Client";
  const userRole = session?.user?.role || "Client";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "C";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B0F1A" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        id="portal-sidebar"
        aria-label="Portal navigation"
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-260px",
          width: "260px",
          height: "100vh",
          background: "linear-gradient(180deg, #0D1321 0%, #111827 100%)",
          borderRight: "1px solid rgba(139,92,246,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "left 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
          <Link href="/portal/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
              }}
            >
              P
            </div>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-heading)" }}>Pixelwyre</div>
              <div style={{ color: "#6B7280", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Client Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
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
                  background: isActive ? "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(109,40,217,0.08))" : "transparent",
                  border: isActive ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.1rem", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(139,92,246,0.12)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/portal" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "#EF4444",
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

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: "0", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(11,15,26,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(139,92,246,0.1)",
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
              aria-controls="portal-sidebar"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#C4B5FD",
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
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.82rem",
                boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
              }}
            >
              {userInitials}
            </div>
            <div style={{ display: "none" }} className="md-show">
              <div style={{ color: "#F1F5F9", fontSize: "0.82rem", fontWeight: 600 }}>{userName}</div>
              <div style={{ color: "#6B7280", fontSize: "0.7rem" }}>{userRole}</div>
            </div>
          </div>
        </header>

        {/* Content */}
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
