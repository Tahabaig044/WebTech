"use client";

import { useState, useCallback } from "react";

const tabs = [
  { id: "web", label: "Web Dev" },
  { id: "gmb", label: "GMB SEO" },
  { id: "hosting", label: "Hosting" },
  { id: "erp", label: "ERP Suite" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function HeroTabs() {
  const [active, setActive] = useState<TabId>("web");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.id === active);
      let nextIndex = currentIndex;

      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      setActive(tabs[nextIndex].id);
    },
    [active]
  );

  return (
    <div
      className="card-dark"
      style={{ padding: "0", overflow: "hidden", minHeight: "340px" }}
    >
      <div
        role="tablist"
        aria-label="Service categories"
        onKeyDown={handleKeyDown}
        style={{
          display: "flex",
          borderBottom: "1px solid #1E3A8A",
          background: "rgba(6,13,25,0.5)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            style={{
              flex: 1,
              padding: "14px 10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: active === tab.id ? "#FFFFFF" : "#94A3B8",
              background: active === tab.id ? "rgba(37,99,235,0.2)" : "transparent",
              borderBottom: active === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px" }}>
        {active === "web" && (
          <div role="tabpanel" id="tabpanel-web" aria-labelledby="tab-web">
            <h3 style={{ marginBottom: "6px", fontSize: "1.1rem" }}>⚡ Mobile 90+ PageSpeed</h3>
            <p style={{ fontSize: "0.88rem", marginBottom: "16px" }}>
              Lightning-fast websites that convert visitors into customers.
            </p>
            <div style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.82rem", color: "#CBD5E1" }}>Performance Score</span>
                <span style={{ fontSize: "0.82rem", color: "#34D399", fontWeight: 700 }}>96/100</span>
              </div>
              <div style={{ background: "#1E293B", borderRadius: "6px", height: "8px" }}>
                <div
                  style={{
                    background: "linear-gradient(90deg, #16A34A, #34D399)",
                    height: "100%",
                    width: "96%",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                background: "rgba(30,58,138,0.3)",
                border: "1px solid #1E40AF",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "1.5rem" }}>🚀</span>
              <div>
                <p style={{ color: "#FFFFFF", margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Conversion-Optimized Layout</p>
                <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.8rem" }}>90+ speed on all devices</p>
              </div>
            </div>
          </div>
        )}

        {active === "gmb" && (
          <div role="tabpanel" id="tabpanel-gmb" aria-labelledby="tab-gmb">
            <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>📍 Google Maps Top 3 Rank</h3>
            <div className="hero-tabs-grid-3">
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "rgba(37,99,235,0.15)",
                    border: "1px solid #2563EB",
                    borderRadius: "10px",
                    padding: "18px 10px",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#60A5FA" }}>#1</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "4px" }}>Google Maps Rank</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "rgba(22,163,74,0.15)",
                    border: "1px solid #16A34A",
                    borderRadius: "10px",
                    padding: "18px 10px",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34D399" }}>+450%</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "4px" }}>Lead Growth</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid #F59E0B",
                    borderRadius: "10px",
                    padding: "18px 10px",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FBBF24" }}>4.9★</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "4px" }}>Avg Review Score</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: "16px", marginBottom: 0 }}>
              We optimize your Google Business Profile for maximum local visibility.
            </p>
          </div>
        )}

        {active === "hosting" && (
          <div role="tabpanel" id="tabpanel-hosting" aria-labelledby="tab-hosting" className="hero-tabs-grid-2">
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.4)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div aria-hidden="true" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>🔒</div>
              <h3 style={{ fontSize: "0.92rem", marginBottom: "4px" }}>256-Bit SSL</h3>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0 }}>
                Free with every hosting plan
              </p>
            </div>
            <div
              style={{
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.4)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div aria-hidden="true" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>💰</div>
              <h3 style={{ fontSize: "0.92rem", marginBottom: "4px" }}>From ₨1,499/mo</h3>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0 }}>
                Managed cloud hosting in PKR
              </p>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <p style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                99.99% uptime SLA with daily backups and Cloudflare CDN included.
              </p>
            </div>
          </div>
        )}

        {active === "erp" && (
          <div role="tabpanel" id="tabpanel-erp" aria-labelledby="tab-erp">
            <h3 style={{ marginBottom: "8px", fontSize: "1.1rem" }}>🧠 Central ERP Intelligence Suite</h3>
            <p style={{ fontSize: "0.88rem", marginBottom: "18px" }}>
              One dashboard to manage clients, invoicing, tasks, and automations across every service your business offers.
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "18px" }}>
              {["Client CRM & Lead Pipeline", "Invoice & Payment Tracking", "Automated Task Assignments"].map(
                (item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#CBD5E1", fontSize: "0.88rem" }}>
                    <span aria-hidden="true" style={{ color: "#34D399" }}>✓</span> {item}
                  </li>
                )
              )}
            </ul>
            <a href="/contact" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              Get ERP Access →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
