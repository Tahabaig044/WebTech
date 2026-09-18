"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How fast can you deploy a website?",
    answer: "Most landing pages go live within 48-72 hours. Full business websites take 2-4 weeks depending on complexity. E-commerce stores with 100+ products typically take 4-6 weeks. We follow an agile sprint model with weekly demos so you're never in the dark.",
  },
  {
    question: "Do you integrate with existing cPanel hosting?",
    answer: "Absolutely. While we recommend our managed cloud hosting for optimal performance, we can deploy and maintain sites on your existing cPanel server. We handle DNS migration, SSL setup, email forwarding, and database configuration as part of the handoff.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers (HBL, Meezan, JazzCash), Stripe for international clients, and installment plans for projects over PKR 100,000. Typical structure is 50% upfront, 25% at midpoint demo, and 25% on final delivery. Monthly SaaS subscriptions are billed via auto-debit.",
  },
  {
    question: "What is the BI Audit Engine?",
    answer: "Our Business Intelligence Audit Engine automatically scans your digital presence — website speed, SEO health, ad performance, social media metrics, and competitor benchmarks — and generates a unified scorecard every 30 days. It's included free with all managed hosting plans.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow">❓ Frequently Asked Questions</span>
          <h2 style={{ marginBottom: "14px" }}>Got Questions? We Have Answers</h2>
        </div>

        <div style={{ maxWidth: "740px", margin: "0 auto" }}>
          {faqs.map((faq, i) => {
            const isExpanded = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    id={buttonId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isExpanded ? null : i)}
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
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: isExpanded ? "#2563EB" : "#0F172A",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        fontSize: "1.3rem",
                        color: "#64748B",
                        transition: "transform 0.25s ease",
                        transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                        flexShrink: 0,
                        marginLeft: "16px",
                      }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isExpanded}
                  style={{
                    maxHeight: isExpanded ? "300px" : "0",
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
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
