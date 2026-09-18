"use client";

import { useState, useMemo } from "react";

const services = [
  {
    category: "Core Web Dev",
    items: [
      { name: "Landing Page", price: "PKR 25,000" },
      { name: "Business Website", price: "PKR 85,000" },
      { name: "E-Commerce Store", price: "PKR 180,000" },
      { name: "Custom Web App", price: "PKR 350,000" },
    ],
  },
  {
    category: "Micro-Hooks",
    items: [
      { name: "WhatsApp Bot Setup", price: "PKR 15,000" },
      { name: "Google Maps SEO", price: "PKR 20,000" },
      { name: "AI Chat Integration", price: "PKR 30,000" },
      { name: "CRM Pipeline Setup", price: "PKR 25,000" },
    ],
  },
  {
    category: "Industry SaaS",
    items: [
      { name: "School SMS Suite", price: "PKR 12,000/mo" },
      { name: "Clinic Management", price: "PKR 10,000/mo" },
      { name: "Gym/Fitness CRM", price: "PKR 8,000/mo" },
      { name: "Restaurant POS + Online", price: "PKR 15,000/mo" },
    ],
  },
];

const allItems = services.flatMap((s) =>
  s.items.map((item) => ({ ...item, category: s.category }))
);

export default function ServicesGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...services.map((s) => s.category)];

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F2B5C", margin: "8px 0 16px" }}>
                  {item.price}
                </p>
                <a href="/contact" className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
                  Get Quote →
                </a>
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
