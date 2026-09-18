"use client";

import { useActionState } from "react";
import { submitContactAction, type ContactFormState } from "./actions";

const contactMethods = [
  { icon: "📧", title: "Email", value: "info@pixelwyre.com", desc: "For general inquiries and quotes", color: "#16A34A" },
  { icon: "📱", title: "WhatsApp", value: "+92 300 123 4567", desc: "Quick responses, typically < 30 min", color: "#2563EB" },
  { icon: "📞", title: "Phone", value: "+92 42 3578 9012", desc: "Mon–Sat, 9 AM – 7 PM PKT", color: "#7C3AED" },
  { icon: "📍", title: "Office", value: "Lahore, Pakistan", desc: "In-person meetings by appointment", color: "#F59E0B" },
];

const faqs = [
  { q: "How long does a typical project take?", a: "Landing pages: 1–3 days. Business websites: 1–2 weeks. E-commerce stores: 2–4 weeks. Custom web applications: 4–8 weeks. We provide detailed timelines during the proposal phase." },
  { q: "Do you work with businesses outside Pakistan?", a: "Yes! We have clients across the UAE, Saudi Arabia, UK, and USA. Our team works remotely with flexible hours to accommodate different time zones." },
  { q: "What's your pricing model?", a: "We offer both fixed-price projects and monthly retainers. Fixed-price for defined scope projects, retainers for ongoing marketing, SEO, and support. All pricing is transparent with no hidden fees." },
  { q: "Do you provide ongoing support after launch?", a: "Absolutely. Our managed hosting plans include 24/7 monitoring, daily backups, and support. We also offer monthly retainer packages for SEO, ads, and content marketing." },
  { q: "Can I see examples of your work?", a: "Yes! Check our Case Studies page for detailed client success stories with real metrics. We can also share specific portfolio examples relevant to your industry during our consultation." },
  { q: "How do you handle project communication?", a: "Every client gets access to our project management dashboard, a dedicated Slack channel (or WhatsApp group), and weekly progress calls. You'll always know exactly where your project stands." },
];

const initialState: ContactFormState = { success: false };

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            📞 Contact Us
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>Let&apos;s Build Something Great</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            Tell us about your project and we&apos;ll get back to you within 2 hours during business hours.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="public-grid-2">
            <div>
              <h2 style={{ marginBottom: "24px" }}>Send Us a Message</h2>

              {state.success && (
                <div role="status" style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>✅</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#166534" }}>Message sent successfully!</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#15803D" }}>We&apos;ll get back to you within 2 hours.</p>
                  </div>
                </div>
              )}

              {state.error && (
                <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>❌</span>
                  <p style={{ margin: 0, color: "#991B1B" }}>{state.error}</p>
                </div>
              )}

              <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="public-form-row">
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Your Name</label>
                    <input id="contact-name" type="text" name="name" placeholder="Your Name" required aria-required="true" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">Email Address</label>
                    <input id="contact-email" type="email" name="email" placeholder="Email Address" required aria-required="true" />
                  </div>
                </div>
                <div className="public-form-row">
                  <div>
                    <label htmlFor="contact-phone" className="sr-only">Phone Number</label>
                    <input id="contact-phone" type="tel" name="phone" placeholder="Phone Number" />
                  </div>
                  <div>
                    <label htmlFor="contact-budget" className="sr-only">Budget Range</label>
                    <select id="contact-budget" name="budget" defaultValue="">
                      <option value="" disabled>Budget Range</option>
                      <option>Under ₨ 50,000</option>
                      <option>₨ 50,000 – 150,000</option>
                      <option>₨ 150,000 – 500,000</option>
                      <option>₨ 500,000+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-service" className="sr-only">Select a Service</label>
                  <select id="contact-service" name="service" defaultValue="">
                    <option value="" disabled>Select a Service</option>
                    <option>Web Development</option>
                    <option>SEO</option>
                    <option>Google Ads</option>
                    <option>Managed Hosting</option>
                    <option>ERP / Automation</option>
                    <option>Industry SaaS Suite</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea id="contact-message" name="message" placeholder="Tell us about your project..." rows={5} required aria-required="true" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isPending} style={{ padding: "14px 28px", fontSize: "1rem" }}>
                  {isPending ? "Sending..." : "Send Message →"}
                </button>
              </form>
            </div>

            <div>
              <h2 style={{ marginBottom: "24px" }}>Get in Touch</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                {contactMethods.map((c) => (
                  <div key={c.title} className="card" style={{ borderTopColor: c.color, flexDirection: "row", alignItems: "center", gap: "16px", padding: "20px 24px" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <h3 style={{ marginBottom: "2px", fontSize: "1rem" }}>{c.title}</h3>
                      <p style={{ margin: 0, fontSize: "0.92rem", fontWeight: 700, color: "#0F172A" }}>{c.value}</p>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#94A3B8" }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, #060D19 0%, #0F2B5C 100%)", borderRadius: "12px", padding: "24px", border: "1px solid #1E3A8A" }}>
                <h3 style={{ color: "#FFFFFF", marginBottom: "8px", fontSize: "1rem" }}>⚡ Quick Response Guarantee</h3>
                <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.88rem" }}>
                  We respond to all inquiries within 2 hours during business hours (9 AM – 7 PM PKT, Mon–Sat). For urgent matters, WhatsApp is the fastest way to reach us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ marginBottom: "12px" }}>Frequently Asked Questions</h2>
            <p style={{ color: "#64748B", maxWidth: "520px", margin: "0 auto" }}>
              Quick answers to common questions. Still have something? Reach out anytime.
            </p>
          </div>
          <div style={{ display: "grid", gap: "16px", maxWidth: "800px", margin: "0 auto" }}>
            {faqs.map((faq) => (
              <div key={faq.q} className="card" style={{ borderTopColor: "#E2E8F0", padding: "24px 28px" }}>
                <h3 style={{ marginBottom: "8px", fontSize: "1rem" }}>{faq.q}</h3>
                <p style={{ margin: 0, fontSize: "0.88rem" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "linear-gradient(135deg, #060D19 0%, #0F2B5C 100%)", borderTop: "1px solid #1E3A8A" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#FFFFFF", marginBottom: "12px" }}>Prefer a Quick Chat?</h2>
          <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 24px" }}>
            Skip the form and message us directly on WhatsApp. We typically reply within 30 minutes.
          </p>
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1rem", background: "linear-gradient(135deg, #25D366, #075E54)" }}>
            💬 Chat on WhatsApp →
          </a>
        </div>
      </section>
    </>
  );
}
