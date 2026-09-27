import { z } from "zod";

export const supportTicketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;

export const portalProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z.string().max(30, "Phone number is too long").optional().or(z.literal("")),
});

export type PortalProfileInput = z.infer<typeof portalProfileSchema>;

export const portalPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PortalPasswordInput = z.infer<typeof portalPasswordSchema>;

export const ticketReplySchema = z.object({
  message: z.string().min(1, "Reply cannot be empty").max(5000, "Reply is too long"),
});

export type TicketReplyInput = z.infer<typeof ticketReplySchema>;

export function validatePortal<T>(schema: z.ZodSchema<T>, data: unknown): {
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
