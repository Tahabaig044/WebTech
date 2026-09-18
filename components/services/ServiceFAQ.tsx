"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most services are delivered within 1-4 weeks depending on complexity. We provide a detailed timeline during the proposal phase.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes, all our projects include revisions until you're 100% satisfied. The number of revisions depends on the service package.",
  },
  {
    q: "What's included in the price?",
    a: "All prices include design, development, testing, deployment, and 1 month of free support. Hosting and maintenance are separate plans.",
  },
  {
    q: "Do you work with businesses outside Pakistan?",
    a: "Absolutely! We have clients across UAE, Saudi Arabia, UK, and USA. Our team works remotely with flexible hours.",
  },
];

export default function ServiceFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: "60px 0 80px", background: "#FFFFFF" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow">❓ Frequently Asked Questions</span>
          <h2 style={{ marginBottom: "12px" }}>Common Questions</h2>
          <p style={{ color: "#64748B", maxWidth: "480px", margin: "0 auto" }}>
            Everything you need to know before getting started.
          </p>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "20px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: openIndex === i ? "#2563EB" : "#0F172A",
                    transition: "color 0.2s ease",
                  }}
                >
                  {faq.q}
                </h4>
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#64748B",
                    transition: "transform 0.25s ease",
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                    marginLeft: "16px",
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: openIndex === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    paddingBottom: "20px",
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
