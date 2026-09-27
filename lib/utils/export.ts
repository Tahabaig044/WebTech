function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const header = columns.map((c) => escapeCSV(c.label)).join(",");
  const rows = data.map((row) =>
    columns.map((c) => escapeCSV(row[c.key])).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export const LEAD_EXPORT_COLUMNS = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Phone" },
  { key: "service" as const, label: "Service" },
  { key: "value" as const, label: "Value" },
  { key: "status" as const, label: "Status" },
  { key: "notes" as const, label: "Notes" },
  { key: "created_at" as const, label: "Created At" },
];

export const INVOICE_EXPORT_COLUMNS = [
  { key: "invoice_number" as const, label: "Invoice #" },
  { key: "client_email" as const, label: "Client" },
  { key: "description" as const, label: "Description" },
  { key: "amount" as const, label: "Amount" },
  { key: "currency" as const, label: "Currency" },
  { key: "status" as const, label: "Status" },
  { key: "due_date" as const, label: "Due Date" },
  { key: "created_at" as const, label: "Created At" },
];

export const CLIENT_EXPORT_COLUMNS = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "role" as const, label: "Role" },
  { key: "project_count" as const, label: "Projects" },
  { key: "invoice_count" as const, label: "Invoices" },
  { key: "total_spent" as const, label: "Total Spent" },
  { key: "created_at" as const, label: "Member Since" },
];

export const CONTACT_EXPORT_COLUMNS = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Phone" },
  { key: "service" as const, label: "Service" },
  { key: "budget" as const, label: "Budget" },
  { key: "message" as const, label: "Message" },
  { key: "status" as const, label: "Status" },
  { key: "created_at" as const, label: "Submitted At" },
];
