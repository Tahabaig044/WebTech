"use client";

import { useState } from "react";

const clientProjects = [
  { name: "Al-Razaq Traders", status: "In Progress", progress: 68, task: "E-Commerce Store", deadline: "Feb 15, 2026" },
  { name: "GreenField Academy", status: "Review", progress: 92, task: "School SMS Setup", deadline: "Jan 28, 2026" },
  { name: "FitZone Gym", status: "Deployed", progress: 100, task: "Landing + CRM", deadline: "Completed" },
];

const adminLog = [
  { time: "14:32:01", type: "LEAD", msg: "New lead captured: Al-Razaq Traders — WhatsApp Bot" },
  { time: "14:32:03", type: "DISPATCH", msg: "Assigned to Agent: Hassan K. — Priority: High" },
  { time: "14:35:12", type: "DEAL", msg: "Quote sent: PKR 180,000 — E-Commerce Package" },
  { time: "14:38:45", type: "DEPLOY", msg: "GreenField Academy — staging site live" },
  { time: "14:41:07", type: "BILL", msg: "Invoice #1047 generated — FitZone Gym — PKR 85,000" },
  { time: "14:43:22", type: "HOST", msg: "SSL renewed: pixelwyre.com — valid till 2027-01-13" },
  { time: "14:45:58", type: "ALERT", msg: "Server CPU spike detected — auto-scaled to 2 vCPU" },
  { time: "14:48:11", type: "MSG", msg: "WhatsApp broadcast sent: 247 contacts — New Year Offer" },
];

const typeColors: Record<string, string> = {
  LEAD: "#16A34A",
  DISPATCH: "#2563EB",
  DEAL: "#F59E0B",
  DEPLOY: "#7C3AED",
  BILL: "#0284C7",
  HOST: "#06B6D4",
  ALERT: "#EF4444",
  MSG: "#8B5CF6",
};

export default function ERPSandbox() {
  const [view, setView] = useState<"client" | "admin">("client");

  return (
    <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #060D19 0%, #0A1E3F 100%)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">📡 ERP Command Center</span>
          <h2 style={{ color: "#FFFFFF", marginBottom: "14px" }}>See Both Sides of the Coin</h2>
          <p style={{ color: "#94A3B8", maxWidth: "560px", margin: "0 auto", fontSize: "1.05rem" }}>
            Toggle between what your clients see and the backend operations powering it all.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "36px" }}>
          <button
            onClick={() => setView("client")}
            className="btn"
            style={{
              background: view === "client" ? "#2563EB" : "rgba(30, 58, 138, 0.4)",
              color: view === "client" ? "#FFFFFF" : "#94A3B8",
              border: `1.5px solid ${view === "client" ? "#3B82F6" : "#1E40AF"}`,
            }}
          >
            👁️ Client View
          </button>
          <button
            onClick={() => setView("admin")}
            className="btn"
            style={{
              background: view === "admin" ? "#2563EB" : "rgba(30, 58, 138, 0.4)",
              color: view === "admin" ? "#FFFFFF" : "#94A3B8",
              border: `1.5px solid ${view === "admin" ? "#3B82F6" : "#1E40AF"}`,
            }}
          >
            🔧 Admin / ERP View
          </button>
        </div>

        {view === "client" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {clientProjects.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "rgba(15, 43, 92, 0.4)",
                  border: "1px solid #1E3A8A",
                  borderRadius: "var(--radius)",
                  padding: "28px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ color: "#FFFFFF", margin: 0, fontSize: "0.95rem" }}>{p.name}</h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: p.status === "Deployed" ? "rgba(22, 163, 74, 0.2)" : "rgba(37, 99, 235, 0.2)",
                      color: p.status === "Deployed" ? "#34D399" : "#60A5FA",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <p style={{ color: "#94A3B8", fontSize: "0.86rem", margin: "0 0 4px" }}>{p.task}</p>
                <p style={{ color: "#64748B", fontSize: "0.78rem", margin: "0 0 16px" }}>Deadline: {p.deadline}</p>
                <div style={{ background: "#060C1B", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${p.progress}%`,
                      height: "100%",
                      background: p.progress === 100 ? "#16A34A" : "#2563EB",
                      borderRadius: "8px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <p style={{ color: "#64748B", fontSize: "0.76rem", margin: "8px 0 0", textAlign: "right" }}>{p.progress}%</p>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#060C1B",
              border: "1px solid #1E3A8A",
              borderRadius: "var(--radius)",
              padding: "24px",
              fontFamily: "var(--font-mono, 'Courier New', monospace)",
              maxHeight: "420px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16A34A" }} />
              <span style={{ color: "#64748B", fontSize: "0.78rem", marginLeft: "8px" }}>ERP Lead Dispatcher Log</span>
            </div>
            {adminLog.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(30, 58, 138, 0.3)",
                  fontSize: "0.82rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#64748B", flexShrink: 0, minWidth: "65px" }}>{entry.time}</span>
                <span
                  style={{
                    color: typeColors[entry.type] || "#94A3B8",
                    fontWeight: 700,
                    flexShrink: 0,
                    minWidth: "72px",
                  }}
                >
                  [{entry.type}]
                </span>
                <span style={{ color: "#CBD5E1" }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
