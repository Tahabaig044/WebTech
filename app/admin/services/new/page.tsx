import ServiceForm from "@/components/admin/ServiceForm";

export const metadata = { title: "New Service — Admin" };

export default function NewServicePage() {
  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        New Service
      </h1>
      <ServiceForm mode="create" />
    </div>
  );
}
