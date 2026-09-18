"use client";

import { useState } from "react";

const modules = [
  { icon: "📋", name: "Admissions", desc: "Online admission forms, document uploads & approval workflows" },
  { icon: "💰", name: "Fee Voucher", desc: "Automated fee challans, online payment & receipt generation" },
  { icon: "👨‍👩‍👧", name: "Parent Portal", desc: "Real-time attendance, grades, notices & teacher messaging" },
  { icon: "🔐", name: "Biometric", desc: "Fingerprint & face recognition attendance for staff and students" },
  { icon: "📝", name: "Exams", desc: "Exam scheduling, auto-mark sheets & result analytics" },
  { icon: "📅", name: "Timetable", desc: "AI-powered clash-free timetable generation & substitution" },
  { icon: "👔", name: "HR/Payroll", desc: "Staff management, salary slips, leave & tax compliance" },
  { icon: "📚", name: "LMS", desc: "E-learning, assignments, quizzes & progress tracking" },
  { icon: "📖", name: "Library", desc: "Catalog search, barcode scanning & due-date alerts" },
  { icon: "🚌", name: "Transport", desc: "Live bus tracking, route optimization & parent alerts" },
  { icon: "🏠", name: "Hostel", desc: "Room allocation, mess billing & warden dashboard" },
  { icon: "📢", name: "WhatsApp Broadcast", desc: "Bulk circulars, urgent alerts & parent engagement" },
];

const roles = [
  {
    name: "Parent",
    color: "#16A34A",
    cards: [
      { title: "Fee Status", detail: "Due: PKR 45,000 — Due Date: Jan 30", tag: "Pending" },
      { title: "Attendance", detail: "89% this month — 3 absences flagged", tag: "Average" },
      { title: "Exam Result", detail: "Mid-term GPA: 3.6 / 4.0 — Rank: 12th", tag: "Good" },
    ],
  },
  {
    name: "Teacher",
    color: "#2563EB",
    cards: [
      { title: "Class Attendance", detail: "32/35 present — 3 auto-notified parents", tag: "Active" },
      { title: "Pending Grades", detail: "14 assignments awaiting marks entry", tag: "Attention" },
      { title: "Substitution", detail: "Covering 9-B Science — Period 4", tag: "Today" },
    ],
  },
  {
    name: "Admin",
    color: "#7C3AED",
    cards: [
      { title: "Revenue Today", detail: "PKR 2.4M collected — 87 transactions", tag: "Strong" },
      { title: "Staff On Leave", detail: "6 teachers — 2 substitutes auto-assigned", tag: "Managed" },
      { title: "Bus GPS", detail: "12/12 buses online — 0 alerts", tag: "All Clear" },
    ],
  },
];

export default function SchoolSMSGuite() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">🏫 School SMS Management Suite</span>
          <h2 style={{ marginBottom: "14px" }}>12 Modules. One Dashboard. Zero Chaos.</h2>
          <p className="lede" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Purpose-built school ERP covering every operational need — from admissions to transport tracking.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {modules.map((m) => (
            <div
              key={m.name}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "var(--radius-sm)",
                padding: "20px",
                textAlign: "center",
                transition: "var(--transition)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{m.icon}</div>
              <h3 style={{ marginBottom: "6px", fontSize: "0.95rem" }}>{m.name}</h3>
              <p style={{ fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h3 style={{ marginBottom: "16px" }}>Experience the 3-Role Sandbox</h3>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {roles.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setActiveRole(i)}
                className="btn"
                style={{
                  background: activeRole === i ? r.color : "#F8FAFC",
                  color: activeRole === i ? "#FFFFFF" : "#0F172A",
                  border: `1.5px solid ${activeRole === i ? r.color : "#E2E8F0"}`,
                }}
              >
                {r.name === "Parent" ? "👨‍👩‍👧" : r.name === "Teacher" ? "👩‍🏫" : "🔧"} {r.name}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "var(--radius)",
            padding: "32px",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ marginBottom: "20px", fontSize: "1.05rem", color: roles[activeRole].color }}>
            {roles[activeRole].name} Dashboard View
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {roles[activeRole].cards.map((c) => (
              <div
                key={c.title}
                className="card"
                style={{ borderTopColor: roles[activeRole].color }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0 }}>{c.title}</h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: `${roles[activeRole].color}15`,
                      color: roles[activeRole].color,
                    }}
                  >
                    {c.tag}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.88rem" }}>{c.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/contact" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            Get a Free Demo →
          </a>
        </div>
      </div>
    </section>
  );
}
