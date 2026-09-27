"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageUpload({ value, onChange, folder = "uploads", label = "Featured Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError("");
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Invalid file type. Accepted: JPG, PNG, WebP, GIF");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = (await res.json()) as { success: boolean; url?: string; error?: string };

      if (!result.success || !result.url) {
        setError(result.error || "Upload failed");
        return;
      }
      onChange(result.url);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Upload failed";
      setError(message);
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      <label style={{ display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
        {label}
      </label>

      {value && (
        <div style={{ marginBottom: "12px", position: "relative" }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--admin-border)" }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: "8px", right: "8px",
              width: "28px", height: "28px", borderRadius: "6px",
              background: "rgba(0,0,0,0.6)", border: "none",
              color: "#fff", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "14px",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--admin-accent)" : "var(--admin-border)"}`,
          borderRadius: "10px",
          padding: "24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "rgba(124,58,237,0.05)" : "var(--admin-surface)",
          transition: "all 0.2s",
        }}
      >
        {uploading ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>Uploading...</div>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px" }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem" }}>
              Drop image here or <span style={{ color: "var(--admin-accent)", fontWeight: 600 }}>browse</span>
            </div>
            <div style={{ color: "var(--admin-text-faint)", fontSize: "0.75rem", marginTop: "4px" }}>
              JPG, PNG, WebP, GIF — Max {MAX_SIZE_MB}MB
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && (
        <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "6px" }}>{error}</p>
      )}

      <div style={{ marginTop: "8px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          style={{
            width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
            borderRadius: "10px", padding: "8px 12px", color: "#F9FAFB", fontSize: "0.8rem",
            outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
