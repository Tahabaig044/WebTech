import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/supabase/queries";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Pixelwyre Digital blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      tags: [post.category],
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://pixelwyre.com/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94A3B8" }}>
        Share:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${link.name}`}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
            transition: "all 0.2s ease",
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function RelatedPostCard({
  slug,
  title,
  excerpt,
  category,
  read_time,
}: {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  read_time: string | null;
}) {
  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          height: "100%",
          borderTopColor: "#E2E8F0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
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
            {category}
          </span>
          {read_time && (
            <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
              {read_time}
            </span>
          )}
        </div>
        <h4 style={{ marginBottom: "8px", fontSize: "1.05rem" }}>{title}</h4>
        <p style={{ fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>
          {excerpt || ""}
        </p>
      </div>
    </Link>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug, 3);

  return (
    <>
      <style>{`
        .blog-hero-section {
          background: linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%);
          padding: 60px 0 50px;
        }
        .blog-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .blog-breadcrumb a {
          color: #94A3B8;
          font-size: 0.82rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .blog-breadcrumb a:hover {
          color: #FFFFFF;
        }
        .blog-breadcrumb span {
          color: #64748B;
          font-size: 0.82rem;
        }
        .blog-hero-title {
          color: #FFFFFF;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-family: var(--font-heading);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 20px;
          max-width: 800px;
        }
        .blog-hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .blog-hero-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94A3B8;
          font-size: 0.85rem;
        }
        .blog-content-section {
          padding: 48px 0 80px;
        }
        .blog-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 48px;
          align-items: start;
        }
        .blog-main-content {
          min-width: 0;
        }
        .blog-sidebar {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .blog-share-section {
          padding: 24px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }
        .blog-cta-section {
          padding: 60px 0;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
        }
        .blog-cta-card {
          background: linear-gradient(135deg, #0A1E3F 0%, #0F2B5C 50%, #1E40AF 100%);
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          border: 1px solid #1E3A8A;
        }
        @media (max-width: 960px) {
          .blog-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .blog-sidebar {
            order: -1;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="blog-hero-section">
        <div className="wrap">
          <nav className="blog-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
              {post.category}
            </Link>
            <span>/</span>
            <span style={{ color: "#CBD5E1" }}>{post.title}</span>
          </nav>

          <div style={{ marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "16px",
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid #3B82F6",
                color: "#60A5FA",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {post.category}
            </span>
          </div>

          <h1 className="blog-hero-title">{post.title}</h1>

          <div className="blog-hero-meta">
            <div className="blog-hero-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {post.author}
            </div>
            <div className="blog-hero-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(post.published_at)}
            </div>
            {post.read_time && (
              <div className="blog-hero-meta-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {post.read_time}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="blog-content-section">
        <div className="wrap">
          <div className="blog-layout">
            {/* Main Content */}
            <article className="blog-main-content">
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                    marginBottom: "32px",
                    border: "1px solid #E2E8F0",
                  }}
                />
              )}

              <MarkdownRenderer content={post.content} />

              <div
                style={{
                  marginTop: "48px",
                  paddingTop: "24px",
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="blog-sidebar">
              <Suspense fallback={null}>
                <TableOfContents content={post.content} />
              </Suspense>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section style={{ padding: "60px 0", borderTop: "1px solid #E2E8F0" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "16px",
                  background: "rgba(37, 99, 235, 0.1)",
                  color: "#2563EB",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Related Articles
              </span>
              <h2 style={{ marginTop: "12px", marginBottom: "8px" }}>
                You Might Also Like
              </h2>
              <p style={{ color: "#64748B", maxWidth: "480px", margin: "0 auto" }}>
                More insights on {post.category.toLowerCase()} from our team.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {relatedPosts.map((rp) => (
                <RelatedPostCard
                  key={rp.id}
                  slug={rp.slug}
                  title={rp.title}
                  excerpt={rp.excerpt}
                  category={rp.category}
                  read_time={rp.read_time}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="blog-cta-section">
        <div className="wrap">
          <div className="blog-cta-card">
            <h2 style={{ color: "#FFFFFF", marginBottom: "12px" }}>
              Need a Digital Solution?
            </h2>
            <p
              style={{
                color: "#94A3B8",
                maxWidth: "480px",
                margin: "0 auto 24px",
                fontSize: "1.05rem",
              }}
            >
              From web development to SEO and automation — we build systems that
              scale your business.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/contact"
                className="btn btn-primary"
                style={{ padding: "14px 32px", fontSize: "1rem" }}
              >
                Contact Us →
              </Link>
              <Link
                href="/services"
                className="btn btn-outline"
                style={{ padding: "14px 32px", fontSize: "1rem" }}
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
