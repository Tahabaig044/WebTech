"use client";

import { useState } from "react";

const industries = [
  {
    id: "salon",
    label: "💇 Salon",
    badge: "Popular",
    badgeColor: "#EC4899",
    title: "Beauty Salon & Spa Growth Suite",
    description: "Rank #1 on Google Maps, automate WhatsApp bookings, and collect 5-star reviews with NFC tap cards.",
    features: [
      "📍 Google Maps Top 3 Rank",
      "💬 WhatsApp Auto Booking Engine",
      "⚡ Mobile 90+ Speed Site",
      "💳 NFC Review Tap Card",
      "🔒 Free SSL & 1 Year Hosting",
    ],
    price: "₨ 33,000",
  },
  {
    id: "restaurant",
    label: "🍽️ Restaurant",
    badge: "QR Menus",
    badgeColor: "#EF4444",
    title: "Restaurant & QR Ordering Suite",
    description: "Contactless QR menus, WhatsApp order routing, and local Google Maps ranking for restaurants.",
    features: [
      "📱 QR Contactless Table Menus",
      "💬 Direct WhatsApp Order Router",
      "📍 Local Google Maps Boost",
      "⚡ Instant Stock Toggle Engine",
      "🔒 Free 256-Bit SSL & Hosting",
    ],
    price: "₨ 43,500",
  },
  {
    id: "clinic",
    label: "🏥 Clinic",
    badge: "Healthcare",
    badgeColor: "#10B981",
    title: "Dental & Medical Clinic Booking Suite",
    description: "24/7 patient booking calendar, digital prescriptions, and automated appointment reminders.",
    features: [
      "📅 24/7 Patient Booking Calendar",
      "💬 SMS/WhatsApp Reminders",
      "📄 Digital EHR & Prescription Builder",
      "📍 GMB Doctor Profile Rank Boost",
      "🔒 HIPAA-Compliant Encryption",
    ],
    price: "₨ 55,000",
  },
  {
    id: "school",
    label: "🏫 School",
    badge: "Education",
    badgeColor: "#F59E0B",
    title: "School & Academy Management Suite",
    description: "Student admissions portal, PDF fee vouchers, exam results engine, and parent WhatsApp alerts.",
    features: [
      "🎓 Student Admissions & Staff Portal",
      "💳 PDF Fee Voucher Generator",
      "💬 Parent WhatsApp & SMS Alerts",
      "📊 Exam & Marks Calculation Engine",
      "🔒 Multi-Branch Admin Controls",
    ],
    price: "₨ 76,000",
  },
  {
    id: "realestate",
    label: "🏠 Real Estate",
    badge: "Leads",
    badgeColor: "#8B5CF6",
    title: "Real Estate Lead & Listing Suite",
    description: "Interactive property listing engine with local SEO dominance and instant buyer WhatsApp connector.",
    features: [
      "🏠 Interactive Property Listing Engine",
      "📍 Local SEO & Google Maps Dominance",
      "💬 Instant Buyer WhatsApp Connector",
      "🎬 HD Video Tour Player Embed",
      "🔒 1 Year Managed Cloud Server",
    ],
    price: "₨ 55,000",
  },
  {
    id: "ecommerce",
    label: "🛒 E-Commerce",
    badge: "Online Store",
    badgeColor: "#F97316",
    title: "Boutique & Fashion E-Commerce Suite",
    description: "Product catalog with COD gateways, WhatsApp order tracking, and 90+ PageSpeed conversion layout.",
    features: [
      "🛍️ Product Catalog & Cart Engine",
      "💳 Cash-on-Delivery (COD) Gateways",
      "💬 WhatsApp Order Tracking Alert",
      "⚡ 90+ PageSpeed Conversion Layout",
      "🔒 1 Year Free Reseller Hosting",
    ],
    price: "₨ 43,500",
  },
];

export default function IndustryHub() {
  const [activeId, setActiveId] = useState(industries[0].id);
  const active = industries.find((i) => i.id === activeId) || industries[0];

  return (
    <section style={{ padding: "60px 0", background: "var(--bg-panel)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span className="eyebrow">🏢 Industry Solutions</span>
          <h2>Packages Built for Your Industry</h2>
          <p style={{ maxWidth: "500px", margin: "0 auto" }}>
            Select your industry to see the tailored digital growth suite.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveId(ind.id)}
              className={`search-category-pill${activeId === ind.id ? " active" : ""}`}
              style={{ fontSize: "0.88rem", padding: "10px 18px" }}
            >
              {ind.label}
            </button>
          ))}
        </div>

        <div
          className="card"
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            borderTopColor: active.badgeColor,
            padding: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span
              style={{
                display: "inline-block",
                background: `${active.badgeColor}22`,
                color: active.badgeColor,
                border: `1px solid ${active.badgeColor}55`,
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
            >
              {active.badge}
            </span>
          </div>
          <h3 style={{ marginBottom: "10px" }}>{active.title}</h3>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginBottom: "18px" }}>
            {active.description}
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "18px" }}>
            {active.features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.88rem", color: "var(--text-dark)" }}>
                {f}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Starting from</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand-blue)" }}>{active.price}</div>
            </div>
            <a href="/contact" className="btn btn-primary" style={{ padding: "12px 28px" }}>
              Get Started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
