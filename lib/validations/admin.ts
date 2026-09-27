import { z } from "zod";

// ============================================================
// Blog Post
// ============================================================

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt too long").optional().nullable(),
  category: z.string().min(1, "Category is required").max(100),
  featured_image: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  author: z.string().max(100).optional().nullable(),
  read_time: z.string().max(50).optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  published_at: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ============================================================
// Service
// ============================================================

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string().min(1, "Description is required"),
  short_description: z.string().max(300).optional().nullable(),
  price: z.string().min(1, "Price is required"),
  price_period: z.string().max(50).optional().nullable(),
  category: z.string().min(1, "Category is required").max(100),
  icon: z.string().max(100).optional().nullable(),
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// ============================================================
// Case Study
// ============================================================

export const caseStudySchema = z.object({
  client_name: z.string().min(1, "Client name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  industry: z.string().min(1, "Industry is required").max(100),
  result_summary: z.string().min(1, "Result summary is required").max(500),
  description: z.string().min(1, "Description is required"),
  challenge: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        before: z.string(),
        after: z.string(),
        change: z.string(),
      })
    )
    .optional(),
  tech_stack: z.array(z.string()).optional(),
  featured_image: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  gallery: z.array(z.string()).optional(),
  timeline: z.string().max(100).optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;

// ============================================================
// Invoice
// ============================================================

export const invoiceSchema = z.object({
  client_email: z.string().email("Valid email is required"),
  invoice_number: z.string().min(1, "Invoice number is required").max(50),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().max(10).optional().nullable(),
  status: z.enum(["draft", "pending", "paid", "overdue"]).optional(),
  description: z.string().max(500).optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// ============================================================
// Lead
// ============================================================

export const leadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "proposal_sent", "closed_won", "closed_lost"]),
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const leadCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.string().email("Invalid email address").max(254).optional().or(z.literal("")),
  phone: z.string().max(30, "Phone is too long").optional().or(z.literal("")),
  service: z.string().min(1, "Service is required").max(100),
  value: z.string().max(50).optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "proposal_sent", "closed_won", "closed_lost"]).optional(),
  notes: z.string().max(5000, "Notes are too long").optional().or(z.literal("")),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadUpdateFullSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.string().email("Invalid email address").max(254).optional().or(z.literal("")),
  phone: z.string().max(30, "Phone is too long").optional().or(z.literal("")),
  service: z.string().min(1, "Service is required").max(100),
  value: z.string().max(50).optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "proposal_sent", "closed_won", "closed_lost"]),
  notes: z.string().max(5000, "Notes are too long").optional().or(z.literal("")),
});

export type LeadUpdateFullInput = z.infer<typeof leadUpdateFullSchema>;

export const leadFollowupSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional().or(z.literal("")),
  assigned_to: z.string().uuid("Invalid assignee").optional().or(z.literal("")),
  due_date: z.string().min(1, "Due date is required"),
});

export type LeadFollowupInput = z.infer<typeof leadFollowupSchema>;

// ============================================================
// Project
// ============================================================

export const projectSchema = z.object({
  client_email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Project name is required").max(200),
  category: z.string().max(100).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  progress: z.number().int().min(0).max(100).optional().default(0),
  status: z.enum(["in_progress", "completed", "on_hold", "pending", "draft"]).optional().default("in_progress"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ============================================================
// Payment
// ============================================================

export const paymentSchema = z.object({
  invoice_id: z.string().uuid("Valid invoice is required"),
  amount: z.number().positive("Amount must be positive"),
  payment_date: z.string().min(1, "Payment date is required"),
  payment_mode: z.enum(["CASH", "CHEQUE", "BANK_TRANSFER", "ONLINE"]),
  receipt_number: z.string().min(1, "Receipt number is required").max(50),
  reference_number: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

// ============================================================
// User
// ============================================================

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "agent", "client"]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "agent", "client"]).optional(),
  password: z.string().min(8).optional().nullable(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// ============================================================
// Contact Submission
// ============================================================

export const contactSubmissionUpdateSchema = z.object({
  status: z.enum(["new", "read", "replied"]),
});

export type ContactSubmissionUpdateInput = z.infer<typeof contactSubmissionUpdateSchema>;

// ============================================================
// Settings
// ============================================================

export const settingsSchema = z.object({
  brand_name: z.string().max(100).optional(),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().max(20).optional().nullable(),
  office_address: z.string().max(500).optional().nullable(),
  whatsapp_number: z.string().max(20).optional().nullable(),
  copyright_text: z.string().max(200).optional().nullable(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ============================================================
// Generic helpers
// ============================================================

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  errors: string[];
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
  };
}
