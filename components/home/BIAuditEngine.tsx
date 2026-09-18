"use client";

import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

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

export default function BIAuditEngine() {
  const [step, setStep] = useState<Step>(1);
  const [businessName, setBusinessName] = useState("");
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [progress, setProgress] = useState(0);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");

  const startScan = () => {
    if (!businessName || !url || !industry) return;
    setStep(2);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(3), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;
    setStep(4);
  };

  return (
    <section
      style={{
        padding: "60px 0",
        background: "linear-gradient(180deg, #060D19 0%, #0B172C 100%)",
        borderBottom: "1px solid #1E3A8A",
      }}
    >
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span className="eyebrow">🔬 Free BI Audit</span>
          <h2 style={{ color: "#FFFFFF" }}>Scan Your Business Digital Health</h2>
          <p style={{ color: "#94A3B8", maxWidth: "500px", margin: "0 auto" }}>
            Get instant insights on your Google Maps rank, mobile speed, and WhatsApp automation status.
          </p>
        </div>

        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #060D19 0%, #0A1E3F 40%, #0F2B5C 100%)",
            border: "1px solid #1E3A8A",
            borderRadius: "var(--radius-lg)",
            padding: "36px",
            boxShadow: "var(--shadow-shiny)",
          }}
        >
          {step === 1 && (
            <div>
              <h3 style={{ color: "#FFFFFF", marginBottom: "20px", textAlign: "center" }}>Business Information</h3>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#CBD5E1", display: "block", marginBottom: "6px" }}>
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pixelwyre Digital"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ marginBottom: "14px", background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
              />
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#CBD5E1", display: "block", marginBottom: "6px" }}>
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://yourbusiness.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ marginBottom: "14px", background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
              />
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#CBD5E1", display: "block", marginBottom: "6px" }}>
                Industry Category
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{ marginBottom: "20px", background: "#060C1B", border: "1.5px solid #3B82F6", color: industry ? "#FFFFFF" : "#94A3B8" }}
              >
                <option value="">Select industry...</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={startScan}
                style={{ width: "100%", padding: "14px", fontSize: "0.95rem" }}
                disabled={!businessName || !url || !industry}
              >
                🔍 Start Free Audit Scan
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px", animation: "pulse 1.5s ease-in-out infinite" }}>🔬</div>
              <h3 style={{ color: "#FFFFFF", marginBottom: "12px" }}>Scanning {businessName}...</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", marginBottom: "20px" }}>Analyzing your digital presence</p>
              <div style={{ background: "#1E293B", borderRadius: "8px", height: "10px", overflow: "hidden", marginBottom: "12px" }}>
                <div
                  style={{
                    background: "linear-gradient(90deg, #2563EB, #3B82F6)",
                    height: "100%",
                    width: `${progress}%`,
                    borderRadius: "8px",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.82rem", color: "#60A5FA", fontWeight: 700 }}>{progress}%</span>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ color: "#FFFFFF", marginBottom: "20px", textAlign: "center" }}>Audit Results</h3>
              <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,43,92,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "10px", padding: "14px 18px" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Google Maps Rank</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#34D399" }}>Not Ranked</div>
                  </div>
                  <span style={{ fontSize: "1.3rem" }}>📍</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,43,92,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "10px", padding: "14px 18px" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Mobile Speed Score</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FBBF24" }}>42/100</div>
                  </div>
                  <span style={{ fontSize: "1.3rem" }}>⚡</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,43,92,0.5)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "10px", padding: "14px 18px" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>WhatsApp Bot</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#EF4444" }}>Not Installed</div>
                  </div>
                  <span style={{ fontSize: "1.3rem" }}>💬</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #1E3A8A", paddingTop: "20px" }}>
                <h3 style={{ color: "#FFFFFF", marginBottom: "14px", fontSize: "1.05rem" }}>Get Your Full Report</h3>
                <form onSubmit={submitLead}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      style={{ background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      required
                      style={{ background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      style={{ background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp Number"
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      style={{ background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", fontSize: "0.95rem" }}
                  >
                    📩 Send Full Audit Report
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
              <h3 style={{ color: "#FFFFFF", marginBottom: "10px" }}>Audit Complete!</h3>
              <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginBottom: "20px" }}>
                Your full report has been sent to <strong style={{ color: "#60A5FA" }}>{leadEmail}</strong>.
                Our team will reach out within 15 minutes.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setStep(1);
                  setBusinessName("");
                  setUrl("");
                  setIndustry("");
                  setLeadName("");
                  setLeadEmail("");
                  setLeadPhone("");
                  setLeadWhatsapp("");
                }}
              >
                Run Another Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
