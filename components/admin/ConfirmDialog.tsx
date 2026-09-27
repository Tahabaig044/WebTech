"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCancel();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onCancel]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      style={{
        background: "var(--admin-bg)",
        border: "1px solid var(--admin-border)",
        borderRadius: "16px",
        padding: "0",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        color: "var(--admin-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ padding: "28px 28px 0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px", fontFamily: "var(--font-heading)" }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--admin-text-muted)", margin: 0, lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "20px 28px 24px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
            color: "var(--admin-text-muted)",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          autoFocus
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: danger ? "rgba(239,68,68,0.9)" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
