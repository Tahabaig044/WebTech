"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPortalProjectById } from "@/lib/actions/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingSkeleton from "@/components/portal/LoadingSkeleton";
import type { Project } from "@/lib/types";

export default function ProjectDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email || !projectId) return;

    getPortalProjectById(projectId)
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setProject(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
        setError("Failed to load project. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [session?.user?.email, projectId]);

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ height: "28px", width: "200px", borderRadius: "6px", background: "rgba(139,92,246,0.08)", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "16px", width: "300px", borderRadius: "4px", background: "rgba(139,92,246,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        <LoadingSkeleton rows={4} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div>
        <Link href="/portal/dashboard/projects" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← Back to Projects
        </Link>
        <div style={{ padding: "48px 24px", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px", opacity: 0.5 }}>⊞</div>
          <h3 style={{ color: "#E5E7EB", fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Project not found</h3>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", maxWidth: "360px", margin: "0 auto 20px", lineHeight: 1.5 }}>
            {error || "The project you're looking for doesn't exist or you don't have access to it."}
          </p>
          <Link href="/portal/dashboard/projects" style={{ display: "inline-block", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
            View All Projects
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(project.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const updatedDate = new Date(project.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* Back link */}
      <Link href="/portal/dashboard/projects" style={{ color: "#8B5CF6", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
        ← Back to Projects
      </Link>

      {/* Project Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "6px" }}>
              {project.name}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.88rem", margin: 0 }}>{project.category}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="portal-project-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "32px" }}>
        {/* Left Column — Description */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "28px" }}>
          <h3 style={{ color: "#F1F5F9", fontSize: "1.05rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>About this project</h3>
          {project.description ? (
            <p style={{ color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{project.description}</p>
          ) : (
            <p style={{ color: "#6B7280", fontSize: "0.88rem", fontStyle: "italic", margin: 0 }}>No description provided.</p>
          )}
        </div>

        {/* Right Column — Sidebar Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Progress Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Progress</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }}>
                <div style={{
                  width: `${project.progress}%`,
                  height: "100%",
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #8B5CF6, #6D28D9)",
                  transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ color: "#F1F5F9", fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-heading)", minWidth: "48px", textAlign: "right" }}>
                {project.progress}%
              </span>
            </div>
            <p style={{ color: "#6B7280", fontSize: "0.78rem", margin: 0 }}>
              {project.progress === 100 ? "Project completed" : project.progress > 0 ? "In progress" : "Not yet started"}
            </p>
          </div>

          {/* Details Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Status</span>
                <StatusBadge status={project.status} />
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Category</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{project.category}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Created</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{createdDate}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Last updated</span>
                <span style={{ color: "#E5E7EB", fontWeight: 600 }}>{updatedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: "#F1F5F9", fontSize: "0.95rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "16px" }}>Need help?</h3>
            <p style={{ color: "#6B7280", fontSize: "0.82rem", marginBottom: "16px", lineHeight: 1.5 }}>
              Have a question about this project? Our team is here to help.
            </p>
            <Link
              href="/portal/dashboard/support"
              style={{
                display: "block", textAlign: "center", padding: "10px 18px", borderRadius: "10px",
                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
                color: "#C4B5FD", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portal-project-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
