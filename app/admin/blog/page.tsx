"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllBlogPosts, deleteBlogPost } from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import { exportToCSV } from "@/lib/utils/export";
import type { BlogPost } from "@/lib/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const router = useRouter();

  useEffect(() => {
    getAllBlogPosts()
      .then(setPosts)
      .catch((e: unknown) => {
        console.error("Failed to load blog posts:", e);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, title } = deleteTarget;
    setDeleteTarget(null);
    const result = await deleteBlogPost(id);
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } else {
      toast.error(result.error || "Failed to delete post");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: 0 }}>Blog Posts</h1>
          <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: "4px 0 0" }}>{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "#fff", fontSize: "0.875rem", fontWeight: 700,
            textDecoration: "none", boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16 }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </Link>
        <button
          onClick={() => exportToCSV(filtered , [
            { key: "title", label: "Title" },
            { key: "category", label: "Category" },
            { key: "author", label: "Author" },
            { key: "published", label: "Published" },
            { key: "created_at", label: "Created" },
          ], "blog-posts")}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: "0.8125rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export
        </button>
      </div>

      <div style={{
        background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
        borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18, color: "#6B7280", flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            flex: 1, background: "transparent", border: "none", color: "#F9FAFB",
            fontSize: "0.875rem", outline: "none", fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ color: "#6B7280", fontSize: "0.95rem", marginBottom: "12px" }}>
            {posts.length === 0 ? "No blog posts yet" : "No results found"}
          </div>
          {posts.length === 0 && (
            <Link href="/admin/blog/new" style={{ color: "#7C3AED", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
              Create your first post →
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {paginated.map((post) => (
            <div
              key={post.id}
              style={{
                background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
                borderRadius: "12px", padding: "16px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "16px", flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ color: "#7C3AED", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {post.category}
                  </span>
                  {post.published ? (
                    <span style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>Published</span>
                  ) : (
                    <span style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>Draft</span>
                  )}
                  {post.featured && (
                    <span style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>Featured</span>
                  )}
                </div>
                <div style={{ color: "#F9FAFB", fontSize: "0.92rem", fontWeight: 600, marginBottom: "2px" }}>{post.title}</div>
                <div style={{ color: "#6B7280", fontSize: "0.78rem" }}>
                  {post.author} · {post.read_time || "—"} · {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                  style={{
                    padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                    background: "transparent", color: "#D1D5DB", fontSize: "0.78rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-body)",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  style={{
                    padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)",
                    background: "transparent", color: "#EF4444", fontSize: "0.78rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-body)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        danger
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
