import { notFound } from "next/navigation";
import { getInvoiceById } from "@/lib/actions/admin";
import InvoiceForm from "@/components/admin/InvoiceForm";

export const metadata = { title: "Edit Invoice — Admin" };

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  return (
    <div>
      <h1 style={{ color: "#F9FAFB", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", margin: "0 0 24px" }}>
        Edit Invoice
      </h1>
      <InvoiceForm initial={invoice} mode="edit" />
    </div>
  );
}
