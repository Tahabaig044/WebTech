"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/lib/actions/admin";
import type { DBService } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
  borderRadius: "10px", padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
  outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px",
};

interface ServiceFormProps {
  initial?: DBService;
  mode: "create" | "edit";
}

export default function ServiceForm({ initial, mode }: ServiceFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    short_description: initial?.short_description || "",
    price: initial?.price || "",
    price_period: initial?.price_period || "",
    category: initial?.category || "",
    icon: initial?.icon || "",
    features: (initial?.features || []).join("\n"),
    active: initial?.active ?? true,
    sort_order: initial?.sort_order || 0,
  });

  const set = (key: string, value: string | number | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.name),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    const result = mode === "create"
      ? await createService(payload)
      : await updateService(initial!.id, payload);

    setSaving(false);
    if (result.success) {
      router.push("/admin/services");
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
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => { set("name", e.target.value); if (mode === "create") set("slug", autoSlug(e.target.value)); }} required />
        </div>
        <div>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <input style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Icon (emoji)</label>
            <input style={inputStyle} value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🌐" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Price</label>
            <input style={inputStyle} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="PKR 25,000" />
          </div>
          <div>
            <label style={labelStyle}>Price Period</label>
            <input style={inputStyle} value={form.price_period} onChange={(e) => set("price_period", e.target.value)} placeholder="/one-time" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Short Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
            value={form.short_description}
            onChange={(e) => set("short_description", e.target.value)}
          />
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
          <label style={labelStyle}>Features (one per line)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "120px", resize: "vertical", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: "1.6" }}
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
            placeholder="Custom domain&#10;SSL certificate&#10;24/7 support"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Sort Order</label>
            <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} />
          </div>
          <div style={{ display: "flex", alignItems: "end", paddingBottom: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#D1D5DB", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} style={{ accentColor: "#10B981" }} />
              Active
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
          {saving ? "Saving..." : mode === "create" ? "Create Service" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
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
