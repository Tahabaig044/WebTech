"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllUsers, deleteUser } from "@/lib/actions/admin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const roleBadge: Record<string, { bg: string; color: string }> = {
  admin: { bg: "rgba(16,185,129,0.15)", color: "#10B981" },
  agent: { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6" },
  client: { bg: "rgba(107,114,128,0.15)", color: "#9CA3AF" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data as User[]))
      .catch((e: unknown) => {
        console.error("Failed to load users:", e);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    const result = await deleteUser(id);
    if (result.success) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: 0 }}>Users</h1>
          <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: "4px 0 0" }}>{users.length} total users</p>
        </div>
        <Link
          href="/admin/users/new"
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
          New User
        </Link>
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
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {users.length === 0 ? "No users yet" : "No results found"}
          </div>
          {users.length === 0 && (
            <Link href="/admin/users/new" style={{ color: "#7C3AED", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
              Create your first user →
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
          borderRadius: "12px", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <th style={{ textAlign: "left", padding: "12px 20px", color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px 20px", color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px 20px", color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</th>
                <th style={{ textAlign: "left", padding: "12px 20px", color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Created At</th>
                <th style={{ textAlign: "right", padding: "12px 20px", color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const badge = roleBadge[user.role] || roleBadge.client;
                return (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <td style={{ padding: "14px 20px", color: "#F9FAFB", fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: "14px 20px", color: "#D1D5DB" }}>{user.email}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: badge.bg, color: badge.color, fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", textTransform: "capitalize" }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "#6B7280", fontSize: "0.8rem" }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                          style={{
                            padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)",
                            background: "transparent", color: "#D1D5DB", fontSize: "0.78rem", fontWeight: 600,
                            cursor: "pointer", fontFamily: "var(--font-body)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          style={{
                            padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)",
                            background: "transparent", color: "#EF4444", fontSize: "0.78rem", fontWeight: 600,
                            cursor: "pointer", fontFamily: "var(--font-body)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteTarget?.name}"? This action cannot be undone.`}
        danger
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
