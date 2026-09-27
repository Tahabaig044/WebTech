import InvoiceForm from "@/components/admin/InvoiceForm";

export const metadata = { title: "New Invoice — Admin" };

export default function NewInvoicePage() {
  return (
    <div>
      <h1
        style={{
          color: "#F9FAFB",
          fontSize: "1.5rem",
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
          margin: "0 0 24px",
        }}
      >
        New Invoice
      </h1>
      <InvoiceForm mode="create" />
    </div>
  );
}
