import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = { title: "New Project — Admin" };

export default function NewProjectPage() {
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
