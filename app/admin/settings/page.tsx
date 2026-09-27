"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/admin";
import { toast } from "sonner";

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  brand: "Brand & Identity",
  contact: "Contact Information",
  social: "Social Links",
  hero: "Hero Section",
  footer: "Footer",
};

const CATEGORY_ORDER = ["brand", "contact", "social", "hero", "footer"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("brand");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSettings(result.data);
      const values: Record<string, string> = {};
      result.data.forEach((s: Setting) => {
        values[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value);
      });
      setFormValues(values);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = settings
      .filter((s) => formValues[s.key] !== undefined)
      .map((s) => ({ key: s.key, value: formValues[s.key] }));

    const result = await updateSiteSettings(toSave);
    if (result.success) {
      toast.success("Settings saved successfully");
    } else {
      toast.error(result.error || "Failed to save settings");
    }
    setSaving(false);
  };

  const currentSettings = settings.filter((s) => s.category === activeCategory);

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "#F9FAFB" }}>
            Site Settings
          </h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Manage your site configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          style={{
            padding: "10px 20px", borderRadius: "10px",
            background: saving ? "var(--admin-accent-muted)" : "var(--admin-accent)",
            color: "#fff", border: "none", fontSize: "0.875rem", fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
            opacity: saving ? 0.7 : 1, transition: "opacity 0.2s",
          }}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", flexShrink: 0 }}>
          <div style={{
            background: "var(--admin-card)", border: "1px solid var(--admin-border)",
            borderRadius: "12px", padding: "8px",
          }}>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 12px", borderRadius: "8px", border: "none",
                  background: activeCategory === cat ? "var(--admin-accent)" : "transparent",
                  color: activeCategory === cat ? "#fff" : "var(--admin-text)",
                  fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                  fontFamily: "var(--font-body)", marginBottom: "2px",
                  transition: "all 0.15s",
                }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{
              background: "var(--admin-card)", border: "1px solid var(--admin-border)",
              borderRadius: "12px", padding: "40px", textAlign: "center",
            }}>
              <div className="admin-spinner" />
              <p style={{ color: "var(--admin-text-muted)", marginTop: "12px" }}>Loading settings...</p>
            </div>
          ) : (
            <div style={{
              background: "var(--admin-card)", border: "1px solid var(--admin-border)",
              borderRadius: "12px", padding: "24px",
            }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600,
                color: "#F9FAFB", marginBottom: "20px",
                paddingBottom: "12px", borderBottom: "1px solid var(--admin-border)",
              }}>
                {CATEGORY_LABELS[activeCategory]}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {currentSettings.map((setting) => (
                  <div key={setting.key}>
                    <label style={{
                      display: "block", color: "#9CA3AF", fontSize: "0.8rem",
                      fontWeight: 600, marginBottom: "6px", textTransform: "capitalize",
                    }}>
                      {setting.key.replace(/_/g, " ")}
                    </label>
                    <input
                      type="text"
                      value={formValues[setting.key] || ""}
                      onChange={(e) => setFormValues({ ...formValues, [setting.key]: e.target.value })}
                      style={{
                        width: "100%", background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)", borderRadius: "10px",
                        padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
                        outline: "none", fontFamily: "var(--font-body)",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                    <p style={{
                      color: "var(--admin-text-faint)", fontSize: "0.7rem",
                      marginTop: "4px", fontStyle: "italic",
                    }}>
                      Key: <code style={{ background: "var(--admin-surface)", padding: "2px 6px", borderRadius: "4px" }}>{setting.key}</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
