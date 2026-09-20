"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type ServiceItem = {
  name: string;
  price: string | null;
  category: string | null;
};

export default function ServicesGrid({ services }: { services: ServiceItem[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category || "Other"));
    return ["All", ...Array.from(cats)];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.category || "Other").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || (item.category || "Other") === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, services]);

  if (services.length === 0) {
    return (
      <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="eyebrow">⚙️ Services & Pricing</span>
            <h2 style={{ marginBottom: "14px" }}>Find What You Need</h2>
            <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
              From quick micro-hooks to full-scale SaaS products — browse our available services.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "1rem", color: "#64748B", marginBottom: "16px" }}>Services are being set up. Please check back soon.</p>
            <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.88rem", padding: "10px 24px" }}>
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">⚙️ Services & Pricing</span>
          <h2 style={{ marginBottom: "14px" }}>Find What You Need</h2>
          <p className="lede" style={{ maxWidth: "560px", margin: "0 auto" }}>
            From quick micro-hooks to full-scale SaaS products — search, filter, and get instant pricing.
          </p>
        </div>

        <div className="smart-search-container">
          <div className="smart-search-box">
            <input
              type="text"
              className="smart-search-input"
              placeholder="Search services... (e.g. WhatsApp, E-Commerce, SEO)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="search-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`search-category-pill${activeCategory === cat ? " active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "28px" }}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div key={item.name} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{item.name}</h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: "rgba(37, 99, 235, 0.1)",
                      color: "#2563EB",
                    }}
                  >
                    {item.category || "Other"}
                  </span>
                </div>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F2B5C", margin: "8px 0 16px" }}>
                  {item.price || "Contact Us"}
                </p>
                <Link href="/contact" className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
                  Get Quote →
                </Link>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "1rem", color: "#64748B" }}>No services match your search. Try a different keyword.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
