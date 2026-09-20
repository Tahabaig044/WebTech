"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

/* ── SVG Icons (consistent size, stroke) ───────────────────── */
const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const NavIcons = {
  dashboard: <svg {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  leads: <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  clients: <svg {...iconProps}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  blog: <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  services: <svg {...iconProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  caseStudies: <svg {...iconProps}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  invoices: <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
};

const UIIcons = {
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  externalLink: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>,
};

/* ── Nav Items ──────────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: NavIcons.dashboard },
  { label: "Leads", href: "/admin/leads", icon: NavIcons.leads },
  { label: "Clients", href: "/admin/clients", icon: NavIcons.clients },
  { label: "Blog", href: "/admin/blog", icon: NavIcons.blog },
  { label: "Services", href: "/admin/services", icon: NavIcons.services },
  { label: "Case Studies", href: "/admin/case-studies", icon: NavIcons.caseStudies },
  { label: "Invoices", href: "/admin/invoices", icon: NavIcons.invoices },
];

/* ── Component ──────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin";

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      <div
        className={`admin-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <Link href="/admin/dashboard" className="admin-focus" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.95rem", color: "#fff", fontWeight: 800,
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            }}>
              P
            </div>
            <div>
              <div style={{ color: "#F9FAFB", fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--font-heading)" }}>Pixelwyre</div>
              <div style={{ color: "#60A5FA", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav" role="navigation" aria-label="Admin menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link admin-focus ${isActive(item.href) ? "active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" className="admin-sidebar-link admin-focus" style={{ color: "var(--admin-text-muted)" }}>
            {UIIcons.externalLink}
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="admin-sidebar-link admin-focus"
            style={{ color: "var(--admin-accent)", marginTop: 4, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", font: "inherit" }}
          >
            {UIIcons.logout}
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-content">
        {/* Header */}
        <header className="admin-header" role="banner">
          <div className="admin-header-left">
            <button
              className="admin-menu-btn admin-focus"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? UIIcons.close : UIIcons.menu}
            </button>
          </div>

          <div className="admin-header-right">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="admin-avatar" aria-hidden="true">SA</div>
              <div className="md-show">
                <div style={{ color: "#F9FAFB", fontSize: "0.8125rem", fontWeight: 600 }}>Super Admin</div>
                <div style={{ color: "#6B7280", fontSize: "0.6875rem" }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main" role="main">
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { transform: none; }
          .admin-menu-btn { display: none !important; }
          .md-show { display: block !important; }
        }
      `}</style>
    </div>
  );
}
