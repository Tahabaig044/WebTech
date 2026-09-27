import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/admin";
import UserForm from "@/components/admin/UserForm";

export const metadata = { title: "Edit User — Admin" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>Edit User</h1>
      <UserForm initial={user} mode="edit" />
    </div>
  );
}
