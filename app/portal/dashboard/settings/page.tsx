"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPortalProfile, updatePortalProfile, changePortalPassword } from "@/lib/actions/portal";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  // Profile state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<string[]>([]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "Client";

  useEffect(() => {
    if (!userEmail || profileLoaded) return;
    getPortalProfile().then((res) => {
      if (res.success && res.data) {
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
        setCreatedAt(res.data.created_at || "");
      }
      setProfileLoaded(true);
    }).catch(() => setProfileLoaded(true));
  }, [userEmail, profileLoaded]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors([]);

    if (!name.trim()) {
      setProfileErrors(["Name is required"]);
      return;
    }

    setSavingProfile(true);
    const result = await updatePortalProfile({ name: name.trim(), phone: phone.trim() || undefined });
    setSavingProfile(false);

    if (result.success) {
      await updateSession({ name: name.trim() });
      toast.success("Profile updated successfully");
    } else {
      const errs = result.error ? result.error.split(", ") : ["Failed to update profile"];
      setProfileErrors(errs);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors([]);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErrors(["All password fields are required"]);
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErrors(["New password must be at least 8 characters"]);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrors(["Passwords do not match"]);
      return;
    }

    setSavingPassword(true);
    const result = await changePortalPassword({ currentPassword, newPassword, confirmPassword });
    setSavingPassword(false);

    if (result.success) {
      toast.success("Password changed successfully. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const errs = result.error ? result.error.split(", ") : ["Failed to change password"];
      setPasswordErrors(errs);
      toast.error("Failed to change password");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(139,92,246,0.04)", border: "1.5px solid rgba(139,92,246,0.15)",
    borderRadius: "8px", padding: "10px 14px", color: "#E5E7EB", fontSize: "0.88rem",
    outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px",
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  const sectionStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)",
    borderRadius: "16px", padding: "28px", marginBottom: "24px",
  };

  const initials = (name || userEmail || "C").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "C";

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>Settings</h1>
      <p style={{ color: "#6B7280", fontSize: "0.88rem", marginBottom: "32px" }}>
        Manage your account settings and preferences.
      </p>

      {/* Profile Section */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "linear-gradient(135deg, #10B981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, margin: 0 }}>Profile</h3>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", margin: 0 }}>Your personal information</p>
          </div>
        </div>

        {profileErrors.length > 0 && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
            {profileErrors.map((err, i) => (
              <div key={i} style={{ color: "#F87171", fontSize: "0.82rem" }}>• {err}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleProfileUpdate}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} type="email" value={userEmail} readOnly />
              <p style={{ color: "#4B5563", fontSize: "0.72rem", marginTop: "4px" }}>Email cannot be changed from here</p>
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button type="submit" disabled={savingProfile} style={{
              padding: "10px 22px", borderRadius: "10px",
              background: savingProfile ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700,
              cursor: savingProfile ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
              opacity: savingProfile ? 0.7 : 1,
            }}>
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#EF4444",
          }}>🔒</div>
          <div>
            <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, margin: 0 }}>Security</h3>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", margin: 0 }}>Change your password</p>
          </div>
        </div>

        {passwordErrors.length > 0 && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
            {passwordErrors.map((err, i) => (
              <div key={i} style={{ color: "#F87171", fontSize: "0.82rem" }}>• {err}</div>
            ))}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input style={inputStyle} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input style={inputStyle} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input style={inputStyle} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
            </div>
          </div>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#4B5563", fontSize: "0.72rem", margin: 0 }}>Password must be at least 8 characters</p>
            <button type="submit" disabled={savingPassword} style={{
              padding: "10px 22px", borderRadius: "10px",
              background: savingPassword ? "rgba(16,185,129,0.4)" : "linear-gradient(135deg, #10B981, #059669)",
              color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 700,
              cursor: savingPassword ? "not-allowed" : "pointer", fontFamily: "var(--font-body)",
              opacity: savingPassword ? 0.7 : 1,
            }}>
              {savingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div style={sectionStyle}>
        <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Account Details</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Email</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{userEmail}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Role</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600, textTransform: "capitalize" }}>{userRole}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9CA3AF" }}>Member since</span>
            <span style={{ color: "#E5E7EB", fontWeight: 600 }}>
              {createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
