"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/lib/actions/admin";
import type { BlogPost } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
  borderRadius: "10px", padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
  outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px",
};

interface BlogFormProps {
  initial?: BlogPost;
  mode: "create" | "edit";
}

export default function BlogForm({ initial, mode }: BlogFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    content: initial?.content || "",
    excerpt: initial?.excerpt || "",
    category: initial?.category || "General",
    featured_image: initial?.featured_image || "",
    author: initial?.author || "Pixelwyre Team",
    read_time: initial?.read_time || "5 min read",
    featured: initial?.featured || false,
    published: initial?.published ?? false,
  });

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.title),
      published_at: form.published ? new Date().toISOString() : null,
    };

    const result = mode === "create"
      ? await createBlogPost(payload)
      : await updateBlogPost(initial!.id, payload);

    setSaving(false);
    if (result.success) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError(result.error || "Failed to save");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#EF4444", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => { set("title", e.target.value); if (mode === "create") set("slug", autoSlug(e.target.value)); }} required />
        </div>
        <div>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input style={inputStyle} value={form.author} onChange={(e) => set("author", e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Featured Image URL</label>
          <input style={inputStyle} value={form.featured_image} onChange={(e) => set("featured_image", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>Content * (Markdown)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "300px", resize: "vertical", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: "1.6" }}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Read Time</label>
            <input style={inputStyle} value={form.read_time} onChange={(e) => set("read_time", e.target.value)} placeholder="5 min read" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "end", paddingBottom: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#D1D5DB", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} style={{ accentColor: "#2563EB" }} />
              Featured
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#D1D5DB", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} style={{ accentColor: "#10B981" }} />
              Published
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 24px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : mode === "create" ? "Create Post" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          style={{
            padding: "10px 24px", borderRadius: "10px", border: "1px solid var(--admin-border)",
            background: "transparent", color: "#D1D5DB", fontSize: "0.875rem", fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
