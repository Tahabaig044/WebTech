import Link from "next/link";
import Image from "next/image";

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Hosting", href: "/hosting" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/pixelwyre", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "Instagram", href: "https://instagram.com/pixelwyre", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "TikTok", href: "https://tiktok.com/@pixelwyre", icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.82a4.84 4.84 0 01-1-.13z" },
  { label: "X", href: "https://x.com/pixelwyre", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "LinkedIn", href: "https://linkedin.com/company/pixelwyre", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "YouTube", href: "https://youtube.com/@pixelwyre", icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { label: "WhatsApp", href: "https://wa.me/923112980115", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L0 24l6.335-1.652A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* 4-column grid */}
        <div className="grid grid-4" style={{ gap: 36, marginBottom: 48 }}>
          {/* Col 1: Brand + Social */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Image
                src="/img/pwd_logo.png"
                alt="Pixelwyre Digital"
                width={160}
                height={40}
                style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginBottom: 16 }}>
              Enterprise Web Development, Growth Marketing &amp; Reseller Hosting.
              Operated centrally through our ERP Intelligence Suite.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(30,58,138,0.3)",
                    border: "1px solid #1E3A8A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94A3B8",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>Navigation</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/portal" style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                  Portal Login
                </Link>
              </li>
              <li>
                <Link href="/admin" style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/crm" style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                  CRM Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>Contact</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.85rem", color: "#94A3B8" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#60A5FA" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a href="mailto:hello@pixelwyre.com" style={{ color: "#94A3B8" }}>hello@pixelwyre.com</a>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#60A5FA" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href="tel:+923112980115" style={{ color: "#94A3B8" }}>+92 311 2980115</a>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#60A5FA" style={{ marginTop: 2, flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Suite 402, Pixelwyre Enterprise Tower, Shahrah-e-Faisal, Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Col 4: Enterprise ERP CTA */}
          <div>
            <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>Enterprise ERP Suite</h3>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginBottom: 16 }}>
              Central ERP Intelligence for invoicing, CRM, hosting, ticketing &amp; analytics — all in one dashboard.
            </p>
            <Link href="/portal" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
              Access ERP Portal
            </Link>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid #1E293B",
            paddingTop: 24,
            paddingBottom: 12,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Trust badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#34D399",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              256-Bit SSL
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#60A5FA",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              Google 90+ Speed
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,182,122,0.1)",
                border: "1px solid rgba(0,182,122,0.3)",
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#00B67A",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              Trustpilot Verified
            </div>
          </div>

          {/* Payment methods */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {["Visa", "MasterCard", "Stripe", "Bank Transfer", "EasyPaisa", "JazzCash"].map((method) => (
              <span
                key={method}
                style={{
                  background: "rgba(30,58,138,0.3)",
                  border: "1px solid #1E3A8A",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#CBD5E1",
                  whiteSpace: "nowrap",
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: "1px solid #1E293B",
            paddingTop: 16,
            marginTop: 16,
            textAlign: "center",
            fontSize: "0.78rem",
            color: "#64748B",
          }}
        >
          &copy; 2026 Pixelwyre Digital. All rights reserved. Operating through Central ERP Intelligence Suite.
        </div>
      </div>

    </footer>
  );
}
