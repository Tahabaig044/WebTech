import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/supabase/queries";
import type { BlogPost } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tutorials, and updates from Pixelwyre Digital — covering web development, SEO, hosting, and digital strategy.",
};

const fallbackPosts = [
  { title: "Why Every Pakistani Business Needs a WhatsApp Bot in 2026", slug: "whatsapp-bot-pakistani-business-2026", date: "Jan 10, 2026", category: "Automation", excerpt: "WhatsApp has 95M+ users in Pakistan. Here's how smart businesses are automating support and sales through it.", read_time: "5 min read", featured: true, author: "Pixelwyre Team" },
  { title: "cPanel vs Cloud Hosting: Which Is Right for Your Business?", slug: "cpanel-vs-cloud-hosting", date: "Jan 5, 2026", category: "Hosting", excerpt: "A practical comparison of traditional cPanel hosting versus modern cloud infrastructure for Pakistani SMEs.", read_time: "7 min read", featured: false, author: "Pixelwyre Team" },
  { title: "Local SEO Checklist: Google Maps Ranking Factors for 2026", slug: "local-seo-checklist-google-maps-2026", date: "Dec 28, 2025", category: "SEO", excerpt: "The definitive checklist to rank your business in Google Maps' local pack this year.", read_time: "10 min read", featured: true, author: "Pixelwyre Team" },
  { title: "How to Build a Landing Page That Converts at 12%+", slug: "landing-page-conversion-guide", date: "Dec 20, 2025", category: "Web Dev", excerpt: "Step-by-step guide to building high-converting landing pages with Next.js and Tailwind CSS.", read_time: "8 min read", featured: false, author: "Pixelwyre Team" },
  { title: "Google Ads for Pakistani E-Commerce: Complete Guide", slug: "google-ads-pakistani-ecommerce", date: "Dec 15, 2025", category: "Marketing", excerpt: "From campaign setup to ROAS optimization — everything you need to scale your online store.", read_time: "12 min read", featured: false, author: "Pixelwyre Team" },
  { title: "ERP vs CRM: Which System Does Your Business Need?", slug: "erp-vs-crm-comparison", date: "Dec 8, 2025", category: "ERP", excerpt: "Understanding the difference between ERP and CRM systems, and when to invest in each.", read_time: "6 min read", featured: false, author: "Pixelwyre Team" },
  { title: "PageSpeed Optimization: From 35 to 96 in 48 Hours", slug: "pagespeed-optimization-case-study", date: "Nov 30, 2025", category: "Web Dev", excerpt: "Real case study: how we optimized a Pakistani restaurant website from 35 to 96 on PageSpeed Insights.", read_time: "9 min read", featured: true, author: "Pixelwyre Team" },
  { title: "NFC Review Cards: The Secret to 5-Star Google Reviews", slug: "nfc-review-cards-google-reviews", date: "Nov 22, 2025", category: "Marketing", excerpt: "How physical NFC tap cards are generating hundreds of authentic 5-star reviews for local businesses.", read_time: "4 min read", featured: false, author: "Pixelwyre Team" },
  { title: "Managed Hosting vs VPS: Cost Analysis for 2026", slug: "managed-hosting-vs-vps-cost", date: "Nov 15, 2025", category: "Hosting", excerpt: "Detailed cost breakdown comparing managed hosting, VPS, and dedicated servers for growing businesses.", read_time: "8 min read", featured: false, author: "Pixelwyre Team" },
];

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    posts = fallbackPosts as unknown as BlogPost[];
  }

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%)", padding: "80px 0" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3B82F6" }}>
            📝 Blog
          </span>
          <h1 style={{ color: "#FFFFFF", marginBottom: "16px" }}>Insights & Updates</h1>
          <p style={{ color: "#94A3B8", maxWidth: "560px", fontSize: "1.1rem" }}>
            Practical guides, industry news, and digital strategy tips from our team.
          </p>
        </div>
      </section>

      <section style={{ padding: "50px 0 20px" }}>
        <div className="wrap">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat, i) => (
              <span
                key={cat}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  border: "1px solid #E2E8F0",
                  background: i === 0 ? "#2563EB" : "#FFFFFF",
                  color: i === 0 ? "#FFFFFF" : "#475569",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "30px 0 80px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "28px" }}>
            {posts.map((post) => (
              <div key={post.slug} className="card" style={{ borderTopColor: post.featured ? "#2563EB" : "#E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563EB" }}>
                    {post.category}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>{post.read_time || "5 min read"}</span>
                    {post.featured && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "6px", background: "#FEF3C7", color: "#D97706" }}>
                        FEATURED
                      </span>
                    )}
                  </div>
                </div>
                <h3 style={{ marginBottom: "10px", fontSize: "1.15rem" }}>{post.title}</h3>
                <p style={{ fontSize: "0.88rem", marginBottom: "16px" }}>{post.excerpt || ""}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  <Link href={`/blog/${post.slug}`} className="btn btn-secondary" style={{ fontSize: "0.82rem", padding: "8px 16px" }}>
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0", background: "linear-gradient(135deg, #060D19 0%, #0F2B5C 100%)", borderTop: "1px solid #1E3A8A" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#FFFFFF", marginBottom: "12px" }}>Subscribe to Our Newsletter</h2>
          <p style={{ color: "#94A3B8", maxWidth: "520px", margin: "0 auto 24px" }}>
            Get weekly insights on digital growth, SEO tips, and industry trends delivered to your inbox.
          </p>
          <div style={{ display: "flex", gap: "12px", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ flex: 1, minWidth: "240px", background: "#060C1B", border: "1.5px solid #3B82F6", color: "#FFFFFF", fontSize: "0.92rem", borderRadius: "10px", padding: "12px 18px" }}
            />
            <button className="btn btn-primary" style={{ padding: "12px 24px" }}>
              Subscribe →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
