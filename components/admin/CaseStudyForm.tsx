"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCaseStudy, updateCaseStudy } from "@/lib/actions/admin";
import type { CaseStudy } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
  borderRadius: "10px", padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
  outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px",
};

interface CaseStudyFormProps {
  initial?: CaseStudy;
  mode: "create" | "edit";
}

export default function CaseStudyForm({ initial, mode }: CaseStudyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    client_name: initial?.client_name || "",
    slug: initial?.slug || "",
    industry: initial?.industry || "",
    result_summary: initial?.result_summary || "",
    description: initial?.description || "",
    challenge: initial?.challenge || "",
    solution: initial?.solution || "",
    timeline: initial?.timeline || "",
    featured_image: initial?.featured_image || "",
    tech_stack: (initial?.tech_stack || []).join(", "),
    featured: initial?.featured || false,
    published: initial?.published ?? false,
  });

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.client_name),
      tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const result = mode === "create"
      ? await createCaseStudy(payload)
      : await updateCaseStudy(initial!.id, payload);

    setSaving(false);
    if (result.success) {
      router.push("/admin/case-studies");
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
          <label style={labelStyle}>Client Name *</label>
          <input style={inputStyle} value={form.client_name} onChange={(e) => { set("client_name", e.target.value); if (mode === "create") set("slug", autoSlug(e.target.value)); }} required />
        </div>
        <div>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Industry *</label>
            <input style={inputStyle} value={form.industry} onChange={(e) => set("industry", e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Timeline</label>
            <input style={inputStyle} value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="3 months" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Result Summary *</label>
          <input style={inputStyle} value={form.result_summary} onChange={(e) => set("result_summary", e.target.value)} required placeholder="Brief result summary" />
        </div>
        <div>
          <label style={labelStyle}>Featured Image URL</label>
          <input style={inputStyle} value={form.featured_image} onChange={(e) => set("featured_image", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>Description * (Markdown)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "200px", resize: "vertical", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: "1.6" }}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Challenge</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={form.challenge}
            onChange={(e) => set("challenge", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Solution</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={form.solution}
            onChange={(e) => set("solution", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Tech Stack (comma-separated)</label>
          <input style={inputStyle} value={form.tech_stack} onChange={(e) => set("tech_stack", e.target.value)} placeholder="React, Node.js, Supabase" />
        </div>
        <div style={{ display: "flex", gap: "20px", paddingBottom: "4px" }}>
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
          {saving ? "Saving..." : mode === "create" ? "Create Case Study" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/case-studies")}
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
