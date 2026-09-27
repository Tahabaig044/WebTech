"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { validatePortal, supportTicketSchema, portalProfileSchema, portalPasswordSchema, ticketReplySchema } from "@/lib/validations/portal";
import { notifyAllAdmins } from "@/lib/actions/notifications";
import type { Project, Invoice, InvoicePayment, SupportTicket, TicketMessage } from "@/lib/types";

async function requireClient() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  if (session.user.role !== "client") throw new Error("Forbidden");
  return session;
}

const PAGE_SIZE = 20;

export async function getPortalProjectById(id: string): Promise<{ data: Project | null; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("id, client_email, name, category, description, progress, status, created_at, updated_at")
      .eq("id", id)
      .eq("client_email", session.user.email!)
      .single();

    if (error || !data) {
      return { data: null, error: "Project not found" };
    }

    return { data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load project";
    return { data: null, error: msg };
  }
}

export async function getPortalProjects(params?: { page?: number; status?: string }): Promise<{ data: Project[]; total: number; page: number; totalPages: number }> {
  const session = await requireClient();
  const supabase = createClient();
  const page = params?.page || 1;
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("projects")
    .select("id, client_email, name, category, description, progress, status, created_at, updated_at", { count: "exact" })
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false });

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error, count } = await query.range(offset, offset + PAGE_SIZE - 1);
  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  };
}

export async function getPortalInvoices(params?: { page?: number }): Promise<{ data: Invoice[]; total: number; page: number; totalPages: number }> {
  const session = await requireClient();
  const supabase = createClient();
  const page = params?.page || 1;
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("invoices")
    .select("id, client_email, invoice_number, amount, currency, status, description, project_id, due_date, paid_at, created_at", { count: "exact" })
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  };
}

export async function getPortalInvoiceById(id: string): Promise<{ data: Invoice | null; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("invoices")
      .select("id, client_email, invoice_number, amount, currency, status, description, project_id, due_date, paid_at, created_at")
      .eq("id", id)
      .eq("client_email", session.user.email!)
      .single();

    if (error || !data) {
      return { data: null, error: "Invoice not found" };
    }

    return { data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load invoice";
    return { data: null, error: msg };
  }
}

export async function getPortalInvoicePayments(invoiceId: string): Promise<{ data: InvoicePayment[]; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    // Verify invoice ownership first
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id")
      .eq("id", invoiceId)
      .eq("client_email", session.user.email!)
      .single();

    if (invoiceError || !invoice) {
      return { data: [], error: "Invoice not found" };
    }

    // Fetch payments for this invoice
    const { data, error } = await supabase
      .from("payments")
      .select("id, invoice_id, receipt_number, amount, payment_date, payment_mode, reference_number, notes, created_at")
      .eq("invoice_id", invoiceId)
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load payments";
    return { data: [], error: msg };
  }
}

export async function getPortalTickets(params?: { page?: number }): Promise<{ data: SupportTicket[]; total: number; page: number; totalPages: number }> {
  const session = await requireClient();
  const supabase = createClient();
  const page = params?.page || 1;
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("support_tickets")
    .select("id, client_email, ticket_number, subject, message, status, priority, created_at, updated_at", { count: "exact" })
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  };
}

export async function createSupportTicket(ticket: {
  subject: string;
  message: string;
  priority?: string;
}) {
  const session = await requireClient();
  const supabase = createClient();

  const validation = validatePortal(supportTicketSchema, ticket);
  if (!validation.success) {
    return { success: false, error: validation.errors.join(", ") };
  }

  const { subject, message, priority } = validation.data;

  const { data: newTicket, error } = await supabase.from("support_tickets").insert({
    subject,
    message,
    priority,
    client_email: session.user.email!,
  });
  if (error) return { success: false, error: error.message };
  await notifyAllAdmins({
    type: "ticket.created",
    title: "New support ticket",
    message: `${subject} — from ${session.user.email}`,
    link: "/admin/contact-submissions",
    exclude_user_id: session.user.id,
  });
  revalidatePath("/portal/dashboard/support");
  return { success: true };
}

export async function getPortalTicketById(id: string): Promise<{ data: SupportTicket | null; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("support_tickets")
      .select("id, client_email, ticket_number, subject, message, status, priority, created_at, updated_at")
      .eq("id", id)
      .eq("client_email", session.user.email!)
      .single();

    if (error) return { data: null, error: "Ticket not found" };
    return { data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load ticket";
    return { data: null, error: msg };
  }
}

export async function getPortalTicketMessages(ticketId: string): Promise<{ data: TicketMessage[]; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    // Verify ticket ownership first
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("id")
      .eq("id", ticketId)
      .eq("client_email", session.user.email!)
      .single();

    if (ticketError || !ticket) {
      return { data: [], error: "Ticket not found" };
    }

    // Fetch messages — exclude internal notes (staff-only)
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("id, ticket_id, sender_email, sender_role, message, is_internal_note, created_at")
      .eq("ticket_id", ticketId)
      .eq("is_internal_note", false)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load messages";
    return { data: [], error: msg };
  }
}

export async function replyToTicket(ticketId: string, params: { message: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireClient();
    const supabase = createClient();

    const validation = validatePortal(ticketReplySchema, params);
    if (!validation.success) {
      return { success: false, error: validation.errors.join(", ") };
    }

    // Verify ticket ownership
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("id")
      .eq("id", ticketId)
      .eq("client_email", session.user.email!)
      .single();

    if (ticketError || !ticket) {
      return { success: false, error: "Ticket not found" };
    }

    // Insert the reply
    const { error: insertError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_email: session.user.email!,
      sender_role: "client",
      message: validation.data.message.trim(),
      is_internal_note: false,
    });

    if (insertError) return { success: false, error: insertError.message };

    // Update ticket's updated_at timestamp
    await supabase
      .from("support_tickets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    await notifyAllAdmins({
      type: "ticket.replied",
      title: "Client replied to ticket",
      message: `Ticket ${ticketId.slice(0, 8)}... — from ${session.user.email}`,
      link: "/admin/contact-submissions",
      exclude_user_id: session.user.id,
    });

    revalidatePath(`/portal/dashboard/support/${ticketId}`);
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to send reply";
    return { success: false, error: msg };
  }
}

export async function getPortalStats() {
  const session = await requireClient();
  const supabase = createClient();
  const email = session.user.email!;

  const [projectsRes, invoicesRes, ticketsRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("client_email", email).eq("status", "in_progress"),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("client_email", email),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("client_email", email).in("status", ["open", "in_progress"]),
  ]);

  return {
    activeProjects: projectsRes.count || 0,
    totalInvoices: invoicesRes.count || 0,
    openTickets: ticketsRes.count || 0,
  };
}

// ============================================================
// Profile Management
// ============================================================

export async function getPortalProfile() {
  try {
    const session = await requireClient();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, created_at")
      .eq("email", session.user.email!)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load profile";
    return { success: false, error: msg };
  }
}

export async function updatePortalProfile(params: { name: string; phone?: string }) {
  try {
    const session = await requireClient();

    const validation = validatePortal(portalProfileSchema, params);
    if (!validation.success) {
      return { success: false, error: validation.errors.join(", ") };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({
        name: validation.data.name.trim(),
        phone: validation.data.phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("email", session.user.email!);

    if (error) return { success: false, error: error.message };
    revalidatePath("/portal/dashboard/settings");
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update profile";
    return { success: false, error: msg };
  }
}

// ============================================================
// Password Management
// ============================================================

export async function changePortalPassword(params: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  try {
    const session = await requireClient();

    const validation = validatePortal(portalPasswordSchema, params);
    if (!validation.success) {
      return { success: false, error: validation.errors.join(", ") };
    }

    const supabase = createClient();

    // Fetch current password hash
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("email", session.user.email!)
      .single();

    if (fetchError || !userData) return { success: false, error: "User not found" };

    // Verify current password
    const isValid = await bcrypt.compare(params.currentPassword, userData.password);
    if (!isValid) return { success: false, error: "Current password is incorrect" };

    // Hash new password
    const hashedPassword = await bcrypt.hash(params.newPassword, 12);
    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq("email", session.user.email!);

    if (error) return { success: false, error: error.message };

    // Invalidate all sessions for this user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email!)
      .single();

    if (user) {
      await supabase.from("sessions").delete().eq("user_id", user.id);
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to change password";
    return { success: false, error: msg };
  }
}

export async function requestPortalPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Valid email is required." };
    }

    const { allowed } = checkRateLimit(`portal-password-reset:${email.toLowerCase()}`);
    if (!allowed) {
      return { success: false, error: "Too many reset attempts. Please try again later." };
    }

    const supabase = createClient();
    const { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }

    // Generate a reset token
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Store the token in verification_tokens
    const { error: insertError } = await supabase.from("verification_tokens").insert({
      identifier: `portal-password-reset:${user.email}`,
      token,
      expires,
    });

    if (insertError) {
      console.error("Failed to store reset token:", insertError.message);
      return { success: false, error: "Could not start a password reset. Please try again later." };
    }

    // The reset link is `${NEXTAUTH_URL}/portal/reset-password?token=...`.
    // Delivery requires a configured transactional email provider; until one is
    // wired up the token is intentionally NOT logged, because server logs are
    // not a safe channel for account-recovery secrets.
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to process request";
    return { success: false, error: msg };
  }
}

export async function resetPortalPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token || !newPassword) {
      return { success: false, error: "Token and new password are required." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." };
    }

    const supabase = createClient();

    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .like("identifier", "portal-password-reset:%")
      .single();

    if (tokenError || !tokenData) {
      return { success: false, error: "Invalid or expired reset token." };
    }

    // Check expiry
    if (new Date(tokenData.expires) < new Date()) {
      return { success: false, error: "Reset token has expired." };
    }

    // Extract email from identifier
    const email = tokenData.identifier.replace("portal-password-reset:", "");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq("email", email);

    if (updateError) {
      return { success: false, error: "Failed to reset password." };
    }

    // Delete the used token
    await supabase
      .from("verification_tokens")
      .delete()
      .eq("token", token);

    // Invalidate all sessions for this user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (user) {
      await supabase.from("sessions").delete().eq("user_id", user.id);
    }

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to reset password";
    return { success: false, error: msg };
  }
}

// ============================================================
// Client Notifications
// ============================================================

export async function getClientNotifications(params?: {
  page?: number;
  pageSize?: number;
}) {
  const session = await requireClient();
  const supabase = createClient();
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    data: (data || []) as Array<{ id: string; type: string; title: string; message: string | null; link: string | null; is_read: boolean; created_at: string }>,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getClientUnreadCount(): Promise<number> {
  const session = await requireClient();
  const supabase = createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("is_read", false);
  return count || 0;
}

export async function markClientNotificationRead(id: string): Promise<{ success: boolean }> {
  const session = await requireClient();
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", session.user.id);
  return { success: true };
}

export async function markAllClientNotificationsRead(): Promise<{ success: boolean }> {
  const session = await requireClient();
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", session.user.id)
    .eq("is_read", false);
  revalidatePath("/portal/dashboard");
  return { success: true };
}
