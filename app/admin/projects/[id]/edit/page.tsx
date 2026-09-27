"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/actions/admin";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/types";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(projectId).then((data) => {
      if (!data) { router.push("/admin/projects"); return; }
      setProject(data);
      setLoading(false);
    });
  }, [projectId, router]);

  if (loading || !project) return <div style={{ padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" }}>Loading...</div>;

  return (
    <div>
      <Link href="/admin/projects" style={{ color: "var(--admin-accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>← Back to Projects</Link>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>Edit Project</h1>
      <ProjectForm mode="edit" initial={project} />
    </div>
  );
}
