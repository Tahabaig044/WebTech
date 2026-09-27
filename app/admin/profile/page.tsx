"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { updateAdminProfile, changeAdminPassword } from "@/lib/actions/admin";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSavingProfile(true);
    const result = await updateAdminProfile({ name: name.trim(), email: email.trim() });
    if (result.success) {
      await update({ name: name.trim(), email: email.trim() });
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    setSavingProfile(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSavingPassword(true);
    const result = await changeAdminPassword({ currentPassword, newPassword });
    if (result.success) {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Failed to change password");
    }
    setSavingPassword(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
    borderRadius: "10px", padding: "10px 14px", color: "#F9FAFB", fontSize: "0.875rem",
    outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "#9CA3AF", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px",
  };

  const btnStyle = (color: string, loading: boolean): React.CSSProperties => ({
    padding: "10px 20px", borderRadius: "10px", background: loading ? "var(--admin-accent-muted)" : color,
    color: "#fff", border: "none", fontSize: "0.875rem", fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
    opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
  });

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: "32px", maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "#F9FAFB", marginBottom: "32px" }}>
        My Profile
      </h1>

      {/* Avatar */}
      <div style={{
        background: "var(--admin-card)", border: "1px solid var(--admin-border)",
        borderRadius: "12px", padding: "24px", marginBottom: "24px",
        display: "flex", alignItems: "center", gap: "20px",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--admin-accent), #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "#fff",
          flexShrink: 0,
        }}>
          {initials || "A"}
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, color: "#F9FAFB" }}>
            {name || "Admin"}
          </h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.8125rem" }}>{email}</p>
          <span style={{
            display: "inline-block", marginTop: "4px", padding: "2px 8px",
            borderRadius: "6px", background: "rgba(124,58,237,0.15)",
            color: "var(--admin-accent)", fontSize: "0.75rem", fontWeight: 600,
          }}>
            {session?.user?.role === "admin" ? "Administrator" : "User"}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileUpdate} style={{
        background: "var(--admin-card)", border: "1px solid var(--admin-border)",
        borderRadius: "12px", padding: "24px", marginBottom: "24px",
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "#F9FAFB", marginBottom: "16px" }}>
          Profile Information
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={{ ...inputStyle, opacity: 0.6 }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            <p style={{ color: "var(--admin-text-faint)", fontSize: "0.7rem", marginTop: "4px" }}>
              Changing email may require re-verification
            </p>
          </div>
        </div>
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button type="submit" disabled={savingProfile} style={btnStyle("var(--admin-accent)", savingProfile)}>
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Password Form */}
      <form onSubmit={handlePasswordChange} style={{
        background: "var(--admin-card)", border: "1px solid var(--admin-border)",
        borderRadius: "12px", padding: "24px",
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "#F9FAFB", marginBottom: "16px" }}>
          Change Password
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input style={inputStyle} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input style={inputStyle} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 8 chars)" />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input style={inputStyle} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          </div>
        </div>
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button type="submit" disabled={savingPassword} style={btnStyle("#059669", savingPassword)}>
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
