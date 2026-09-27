"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", badge: "100+" },
  { label: "Hosting", href: "/hosting" },
  { label: "Case Studies", href: "/case-studies", badge: "50+" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="wrap">
        <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={36} />
          <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "var(--font-heading)", color: "#F8FAFC" }}>WebTech</span>
        </Link>

        {/* Desktop nav links */}
        <ul id="nav-links" className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.badge && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: "0.7rem",
                      background: "rgba(124, 58, 237, 0.25)",
                      color: "#A855F7",
                      padding: "1px 6px",
                      borderRadius: 10,
                      fontWeight: 800,
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {/* Mobile-only CTA links inside dropdown */}
          <li className="mobile-only-cta">
            <Link href="/portal" onClick={() => setMenuOpen(false)}>Client Portal</Link>
          </li>
          <li className="mobile-only-cta">
            <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          </li>
          <li className="mobile-only-cta">
            <Link href="/contact" className="btn btn-primary" style={{ width: "100%", textAlign: "center", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Start a Project →</Link>
          </li>
        </ul>

        {/* Right side buttons (desktop only) */}
        <div className="nav-desktop-cta" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link href="/portal" className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
            Client Portal
          </Link>
          <Link href="/admin" style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>
            Admin
          </Link>
          <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
            Start a Project
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
