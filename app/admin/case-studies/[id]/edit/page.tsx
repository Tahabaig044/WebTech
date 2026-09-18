import { notFound } from "next/navigation";
import { getCaseStudyById } from "@/lib/actions/admin";
import CaseStudyForm from "@/components/admin/CaseStudyForm";

export const metadata = { title: "Edit Case Study — Admin" };

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const study = await getCaseStudyById(id);
  if (!study) notFound();

  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        Edit Case Study
      </h1>
      <CaseStudyForm initial={study} mode="edit" />
    </div>
  );
}
