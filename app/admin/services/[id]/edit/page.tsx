import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/actions/admin";
import ServiceForm from "@/components/admin/ServiceForm";

export const metadata = { title: "Edit Service — Admin" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        Edit Service
      </h1>
      <ServiceForm initial={service} mode="edit" />
    </div>
  );
}
