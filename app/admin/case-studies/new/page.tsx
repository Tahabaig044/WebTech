import CaseStudyForm from "@/components/admin/CaseStudyForm";

export const metadata = { title: "New Case Study — Admin" };

export default function NewCaseStudyPage() {
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        New Case Study
      </h1>
      <CaseStudyForm mode="create" />
    </div>
  );
}
