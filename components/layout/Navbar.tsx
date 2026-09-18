"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
        {/* Logo */}
        <Link href="/" className="brand">
          <Image
            src="/img/pwd_logo.png"
            alt="Pixelwyre Digital"
            width={180}
            height={44}
            priority
            style={{ height: 44, width: "auto" }}
          />
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
                      background: "#2563EB",
                      color: "#FFFFFF",
                      padding: "1px 6px",
                      borderRadius: 10,
                      fontWeight: 800,
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link href="/portal" className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
            Client Portal
          </Link>
          <Link href="/admin" style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600 }}>
            Admin
          </Link>
          <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
            Start a Project
          </Link>

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
      </div>
    </nav>
  );
}
