"use client";

import { useState } from "react";

const industries = [
  "Beauty Salon & Spa",
  "Restaurant & Café",
  "Dental & Medical Clinic",
  "School & Academy",
  "Real Estate Agency",
  "Gym & Fitness Club",
  "Auto Repair Shop",
  "Photography Studio",
  "Law Firm",
  "Travel Agency",
  "E-Commerce Store",
  "Courier & Logistics",
];

const addons = [
  { id: "gmb", label: "GMB SEO Boost", price: 5799 },
  { id: "speed", label: "Mobile 90+ Speed", price: 5699 },
  { id: "nfc", label: "NFC Review Card", price: 4699 },
];

const allServices = [
  "Web Development",
  "Google Maps SEO",
  "WhatsApp Bot",
  "Managed Hosting",
  "SSL Certificate",
  "Logo & Branding",
  "Social Media Ads",
  "Email Marketing",
  "ERP Setup",
  "Client Portal",
  "Custom CRM",
  "SEO Copywriting",
];

export default function ROICalculator() {
  const [industry, setIndustry] = useState("");
  const [customers, setCustomers] = useState(50);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((sv) => sv !== s) : [...prev, s]
    );
  };

  const addonTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const projectedROI = Math.round(customers * 340 * (1 + selectedServices.length * 0.05));
  const setupCost = 33000 + addonTotal + selectedServices.length * 2500;

  const filteredServices = allServices.filter((s) =>
    s.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <section style={{ padding: "60px 0", background: "var(--bg-page)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="eyebrow">📊 ROI Estimator</span>
          <h2>Calculate Your Projected Growth</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          <div className="card" style={{ padding: "28px" }}>
            <h4 style={{ marginBottom: "16px" }}>Configure Your Package</h4>

            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{ marginBottom: "18px" }}
            >
              <option value="">Select your industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
              Target Monthly Customers: <strong style={{ color: "var(--brand-blue)" }}>{customers}</strong>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              style={{ width: "100%", marginBottom: "18px", accentColor: "var(--brand-blue)" }}
            />

            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "8px" }}>
              Add-Ons
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
              {addons.map((a) => (
                <label key={a.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.88rem" }}>
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                    style={{ accentColor: "var(--brand-blue)", width: "16px", height: "16px" }}
                  />
                  {a.label} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>₨{a.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>
              Additional Services
            </label>
            <input
              type="text"
              placeholder="Search services..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              style={{ marginBottom: "8px" }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
              {filteredServices.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`search-category-pill${selectedServices.includes(s) ? " active" : ""}`}
                  style={{ fontSize: "0.78rem" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card-dark" style={{ padding: "28px" }}>
            <h4 style={{ marginBottom: "20px" }}>Your Projected ROI</h4>

            <div style={{ background: "rgba(37,99,235,0.15)", border: "1px solid #2563EB", borderRadius: "10px", padding: "18px", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: "4px" }}>Projected Annual ROI</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#34D399" }}>₨{projectedROI.toLocaleString()}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(15,43,92,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Recommended Package</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }}>
                  {customers <= 50 ? "Starter Suite" : customers <= 120 ? "Growth Suite" : "Enterprise Suite"}
                </div>
              </div>
              <div style={{ background: "rgba(15,43,92,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Estimated Setup</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }}>₨{setupCost.toLocaleString()}</div>
              </div>
            </div>

            {selectedAddons.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: "6px" }}>Selected Add-Ons</div>
                {addons
                  .filter((a) => selectedAddons.includes(a.id))
                  .map((a) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#CBD5E1", padding: "4px 0" }}>
                      <span>{a.label}</span>
                      <span>₨{a.price.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            )}

            <a href="/contact" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: "8px" }}>
              Get Custom Quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
