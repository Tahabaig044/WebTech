import UserForm from "@/components/admin/UserForm";

export const metadata = { title: "New User — Admin" };

export default function NewUserPage() {
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>New User</h1>
      <UserForm mode="create" />
    </div>
  );
}
