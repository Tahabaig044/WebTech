"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { validate, blogPostSchema, serviceSchema, caseStudySchema, leadUpdateSchema, leadCreateSchema, leadUpdateFullSchema, leadFollowupSchema, invoiceSchema, contactSubmissionUpdateSchema, projectSchema, paymentSchema } from "@/lib/validations/admin";
import { createNotificationForUser, notifyAllAdmins } from "@/lib/actions/notifications";
import type { BlogPostInsert, DBServiceInsert, CaseStudyInsert, AdminClient, AdminInvoice, Lead, LeadFollowup, AdminUser, Notification, CRMAnalytics, ProjectInsert, InvoicePayment } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "admin" && session.user.role !== "agent") {
    throw new Error("Forbidden");
  }
  return session;
}

/**
 * Guards actions that must stay admin-only: user/role management and site
 * settings. `requireAdmin` also admits agents, which otherwise let any agent
 * promote themselves to admin or delete an admin account.
 */
async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "admin") throw new Error("Forbidden");
  return session;
}


// ============================================================
// Blog Posts
// ============================================================

export async function getAllBlogPosts() {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, content, excerpt, category, featured_image, author, read_time, featured, published, published_at, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return data || [];
}

export async function getBlogPostById(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createBlogPost(post: BlogPostInsert) {
  await requireAdmin();
  const validation = validate(blogPostSchema, post);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").insert(post);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: string, post: Partial<BlogPostInsert>) {
  await requireAdmin();
  const validation = validate(blogPostSchema.partial(), post);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").update({ ...post, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

// ============================================================
// Services
// ============================================================

export async function getAllServices(includeInactive = true) {
  await requireAdmin();
  const supabase = createClient();
  let query = supabase
    .from("services")
    .select("id, slug, name, description, short_description, price, price_period, category, icon, features, active, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .limit(200);

  if (!includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getServiceById(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createService(service: DBServiceInsert) {
  await requireAdmin();
  const validation = validate(serviceSchema, service);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("services").insert(service);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, service: Partial<DBServiceInsert>) {
  await requireAdmin();
  const validation = validate(serviceSchema.partial(), service);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("services").update(service).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

// ============================================================
// Case Studies
// ============================================================

export async function getAllCaseStudies() {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("id, slug, client_name, industry, result_summary, description, challenge, solution, metrics, tech_stack, featured_image, gallery, timeline, featured, published, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return data || [];
}

export async function getCaseStudyById(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createCaseStudy(study: CaseStudyInsert) {
  await requireAdmin();
  const validation = validate(caseStudySchema, study);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("case_studies").insert(study);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  return { success: true };
}

export async function updateCaseStudy(id: string, study: Partial<CaseStudyInsert>) {
  await requireAdmin();
  const validation = validate(caseStudySchema.partial(), study);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("case_studies").update(study).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  return { success: true };
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  return { success: true };
}

// ============================================================
// Clients (derived from users + projects + invoices)
// ============================================================

export async function getAdminClients(): Promise<AdminClient[]> {
  await requireAdmin();
  const supabase = createClient();

  const [usersRes, projectsRes, invoicesRes] = await Promise.all([
    supabase.from("users").select("id, name, email, role, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("projects").select("client_email, id, created_at").limit(500),
    supabase.from("invoices").select("client_email, amount").limit(500),
  ]);

  if (usersRes.error) throw usersRes.error;

  const users = usersRes.data || [];
  const projects = projectsRes.data || [];
  const invoices = invoicesRes.data || [];

  const projectByEmail = new Map<string, { count: number; lastDate: string | null }>();
  for (const p of projects) {
    const existing = projectByEmail.get(p.client_email);
    if (existing) {
      existing.count++;
      if (p.created_at > (existing.lastDate || "")) existing.lastDate = p.created_at;
    } else {
      projectByEmail.set(p.client_email, { count: 1, lastDate: p.created_at });
    }
  }

  const invoiceByEmail = new Map<string, { count: number; total: number }>();
  for (const inv of invoices) {
    const existing = invoiceByEmail.get(inv.client_email);
    if (existing) {
      existing.count++;
      existing.total += Number(inv.amount) || 0;
    } else {
      invoiceByEmail.set(inv.client_email, { count: 1, total: Number(inv.amount) || 0 });
    }
  }

  return users
    .filter((u) => u.role === "client" || projectByEmail.has(u.email) || invoiceByEmail.has(u.email))
    .map((u) => {
      const proj = projectByEmail.get(u.email);
      const inv = invoiceByEmail.get(u.email);
      return {
        email: u.email,
        name: u.name,
        role: u.role || "client",
        created_at: u.created_at,
        project_count: proj?.count || 0,
        invoice_count: inv?.count || 0,
        total_spent: inv?.total || 0,
        last_project_date: proj?.lastDate || null,
      };
    });
}

// ============================================================
// Invoices (from invoices table)
// ============================================================

export async function getAdminInvoices(): Promise<AdminInvoice[]> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as AdminInvoice[];
}

// ============================================================
// Dashboard Stats (replaces browser Supabase queries)
// ============================================================

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalBlogPosts: number;
  totalServices: number;
  totalCaseStudies: number;
  totalContactSubmissions: number;
  recentLeads: Lead[];
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  const supabase = createClient();

  const [leadsRes, totalLeadsRes, newLeadsRes, blogRes, servicesRes, casesRes, contactRes] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("active", true),
    supabase.from("case_studies").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalLeads: totalLeadsRes.count || 0,
    newLeads: newLeadsRes.count || 0,
    totalBlogPosts: blogRes.count || 0,
    totalServices: servicesRes.count || 0,
    totalCaseStudies: casesRes.count || 0,
    totalContactSubmissions: contactRes.count || 0,
    recentLeads: (leadsRes.data || []) as Lead[],
  };
}

// ============================================================
// Leads CRUD (replaces browser Supabase queries)
// ============================================================

export async function getAllLeads(): Promise<Lead[]> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Lead[];
}

export async function updateLeadStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(leadUpdateSchema, { status });
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("leads")
    .select("name, status")
    .eq("id", id)
    .single();

  if (existing && existing.status === status) {
    return { success: true };
  }

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  if (existing) {
    await logActivity({
      action: "lead.status_changed",
      entity_type: "lead",
      entity_id: id,
      entity_name: existing.name,
      old_values: { status: existing.status },
      new_values: { status },
    });
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

// ============================================================
// CRM Leads (replaces browser Supabase queries)
// ============================================================

export async function getCRMLeads(): Promise<Lead[]> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data || []) as Lead[];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, users:assigned_to(name, email)")
    .eq("id", id)
    .single();

  if (error) return null;
  const lead = data as Record<string, unknown>;
  const assignee = lead.users as { name?: string; email?: string } | null;

  let convertedClientName: string | null = null;
  let convertedClientEmail: string | null = null;
  const clientId = lead.converted_client_id as string | null;
  if (clientId) {
    const { data: client } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", clientId)
      .single();
    if (client) {
      convertedClientName = client.name;
      convertedClientEmail = client.email;
    }
  }

  return {
    ...(lead as unknown as Lead),
    assignee_name: assignee?.name || null,
    assignee_email: assignee?.email || null,
    converted_client_name: convertedClientName,
    converted_client_email: convertedClientEmail,
  } as Lead & { assignee_name: string | null; assignee_email: string | null; converted_client_name: string | null; converted_client_email: string | null };
}

export async function createLead(lead: {
  name: string;
  email?: string;
  phone?: string;
  service: string;
  value?: string;
  status?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  await requireAdmin();
  const validation = validate(leadCreateSchema, lead);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: validation.data.name.trim(),
      email: validation.data.email?.trim() || null,
      phone: validation.data.phone?.trim() || null,
      service: validation.data.service,
      value: validation.data.value?.trim() || null,
      status: validation.data.status || "new",
      notes: validation.data.notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await logActivity({
    action: "lead.created",
    entity_type: "lead",
    entity_id: data.id,
    entity_name: validation.data.name,
    new_values: { service: validation.data.service, status: validation.data.status || "new" },
  });
  const session = await auth();
  await notifyAllAdmins({
    type: "lead.created",
    title: "New lead created",
    message: `${validation.data.name} — ${validation.data.service}`,
    link: `/admin/leads/${data.id}`,
    exclude_user_id: session?.user?.id,
  });
  revalidatePath("/admin/leads");
  revalidatePath("/crm/dashboard");
  return { success: true, id: data.id };
}

export async function updateLead(id: string, lead: {
  name: string;
  email?: string;
  phone?: string;
  service: string;
  value?: string;
  status: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(leadUpdateFullSchema, lead);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };

  const supabase = createClient();

  const { data: existing } = await supabase
    .from("leads")
    .select("name, status")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("leads")
    .update({
      name: validation.data.name.trim(),
      email: validation.data.email?.trim() || null,
      phone: validation.data.phone?.trim() || null,
      service: validation.data.service,
      value: validation.data.value?.trim() || null,
      status: validation.data.status,
      notes: validation.data.notes?.trim() || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  if (existing && existing.status !== validation.data.status) {
    await logActivity({
      action: "lead.status_changed",
      entity_type: "lead",
      entity_id: id,
      entity_name: existing.name,
      old_values: { status: existing.status },
      new_values: { status: validation.data.status },
    });
  } else {
    await logActivity({
      action: "lead.updated",
      entity_type: "lead",
      entity_id: id,
      entity_name: existing?.name || validation.data.name,
    });
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/crm/dashboard");
  return { success: true };
}

export async function deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("name")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  if (lead) {
    await logActivity({
      action: "lead.deleted",
      entity_type: "lead",
      entity_id: id,
      entity_name: lead.name,
    });
  }

  revalidatePath("/admin/leads");
  revalidatePath("/crm/dashboard");
  return { success: true };
}

export async function searchLeads(params: {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: Lead[]; total: number; page: number; totalPages: number }> {
  await requireAdmin();
  const supabase = createClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("leads")
    .select("*, users:assigned_to(name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.query && params.query.trim()) {
    const searchTerm = params.query.trim();
    query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,service.ilike.%${searchTerm}%`);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error, count } = await query.range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    data: (data || []) as Lead[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ============================================================
// Lead Assignment
// ============================================================

export async function getAdminUsers(): Promise<AdminUser[]> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role")
    .in("role", ["admin", "agent"])
    .order("name");

  if (error) throw error;
  return (data || []) as AdminUser[];
}

export async function assignLead(leadId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, name, assigned_to")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) return { success: false, error: "Lead not found" };

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", userId)
    .single();
  if (userErr || !user) return { success: false, error: "User not found" };

  const { error } = await supabase
    .from("leads")
    .update({ assigned_to: userId })
    .eq("id", leadId);
  if (error) return { success: false, error: error.message };

  const oldAssignee = lead.assigned_to;
  await logActivity({
    action: oldAssignee ? "lead.reassigned" : "lead.assigned",
    entity_type: "lead",
    entity_id: leadId,
    entity_name: lead.name,
    old_values: oldAssignee ? { assigned_to: oldAssignee } : undefined,
    new_values: { assigned_to: userId, assignee_name: user.name },
  });
  await createNotificationForUser({
    user_id: userId,
    type: "lead.assigned",
    title: `Lead assigned to you`,
    message: lead.name,
    link: `/admin/leads/${leadId}`,
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads/all");
  return { success: true };
}

export async function unassignLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, name, assigned_to")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) return { success: false, error: "Lead not found" };

  const { error } = await supabase
    .from("leads")
    .update({ assigned_to: null })
    .eq("id", leadId);
  if (error) return { success: false, error: error.message };

  await logActivity({
    action: "lead.unassigned",
    entity_type: "lead",
    entity_id: leadId,
    entity_name: lead.name,
    old_values: { assigned_to: lead.assigned_to },
    new_values: { assigned_to: null },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads/all");
  return { success: true };
}

// ============================================================
// Lead Conversion
// ============================================================

export async function convertLeadToClient(leadId: string): Promise<{ success: boolean; error?: string; client_id?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, name, email, phone, service, value, converted_client_id")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) return { success: false, error: "Lead not found" };
  if (lead.converted_client_id) return { success: false, error: "Lead is already converted to a client" };
  if (!lead.email) return { success: false, error: "Lead must have an email to be converted" };

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", lead.email)
    .single();
  if (existingUser) {
    const { error: linkErr } = await supabase
      .from("leads")
      .update({ converted_client_id: existingUser.id })
      .eq("id", leadId);
    if (linkErr) return { success: false, error: linkErr.message };

    await logActivity({
      action: "lead.converted",
      entity_type: "lead",
      entity_id: leadId,
      entity_name: lead.name,
      new_values: { client_id: existingUser.id, email: lead.email },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads/all");
    revalidatePath("/admin/clients");
    return { success: true, client_id: existingUser.id };
  }

  const bcryptjs = await import("bcryptjs");
  const tempPassword = await bcryptjs.hash(Math.random().toString(36).slice(-12), 12);

  const { data: newUser, error: createErr } = await supabase
    .from("users")
    .insert({
      name: lead.name,
      email: lead.email,
      password: tempPassword,
      role: "client",
      email_verified: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (createErr) return { success: false, error: createErr.message };

  const { error: linkErr } = await supabase
    .from("leads")
    .update({ converted_client_id: newUser.id })
    .eq("id", leadId);
  if (linkErr) return { success: false, error: linkErr.message };

  await logActivity({
    action: "lead.converted",
    entity_type: "lead",
    entity_id: leadId,
    entity_name: lead.name,
    new_values: { client_id: newUser.id, email: lead.email },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads/all");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/users");
  return { success: true, client_id: newUser.id };
}

export async function getLeadForClient(clientEmail: string): Promise<{ id: string; name: string } | null> {
  await requireAdmin();
  const supabase = createClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", clientEmail)
    .limit(1)
    .single();
  if (!user) return null;

  const { data, error } = await supabase
    .from("leads")
    .select("id, name")
    .eq("converted_client_id", user.id)
    .limit(1)
    .single();
  if (error || !data) return null;
  return data;
}

// ============================================================
// Lead Activity
// ============================================================

export async function getLeadActivities(leadId: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("activity_log")
    .select("*, users:user_id(name, email)")
    .eq("entity_type", "lead")
    .eq("entity_id", leadId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

// ============================================================
// Lead Follow-ups
// ============================================================

export async function getLeadFollowups(leadId: string): Promise<LeadFollowup[]> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_followups")
    .select("*, users:assigned_to(name, email)")
    .eq("lead_id", leadId)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return (data || []) as LeadFollowup[];
}

export async function createLeadFollowup(leadId: string, followup: {
  title: string;
  description?: string;
  assigned_to?: string;
  due_date: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  await requireAdmin();
  const validation = validate(leadFollowupSchema, followup);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };

  const supabase = createClient();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, name")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) return { success: false, error: "Lead not found" };

  if (validation.data.assigned_to) {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("id", validation.data.assigned_to)
      .single();
    if (!user) return { success: false, error: "Assignee not found" };
  }

  const { data, error } = await supabase
    .from("lead_followups")
    .insert({
      lead_id: leadId,
      title: validation.data.title.trim(),
      description: validation.data.description?.trim() || null,
      assigned_to: validation.data.assigned_to || null,
      due_date: validation.data.due_date,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  await logActivity({
    action: "followup.created",
    entity_type: "lead",
    entity_id: leadId,
    entity_name: lead.name,
    new_values: { title: validation.data.title, due_date: validation.data.due_date },
  });

  if (validation.data.assigned_to) {
    await createNotificationForUser({
      user_id: validation.data.assigned_to,
      type: "followup.assigned",
      title: "Follow-up assigned to you",
      message: `${validation.data.title} — Due: ${validation.data.due_date}`,
      link: `/admin/leads/${leadId}`,
    });
  }

  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true, id: data.id };
}

export async function completeLeadFollowup(followupId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: followup, error: fErr } = await supabase
    .from("lead_followups")
    .select("id, lead_id, title, status")
    .eq("id", followupId)
    .single();
  if (fErr || !followup) return { success: false, error: "Follow-up not found" };
  if (followup.status === "completed") return { success: false, error: "Already completed" };

  const { error } = await supabase
    .from("lead_followups")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", followupId);
  if (error) return { success: false, error: error.message };

  const { data: lead } = await supabase
    .from("leads")
    .select("name")
    .eq("id", followup.lead_id)
    .single();

  await logActivity({
    action: "followup.completed",
    entity_type: "lead",
    entity_id: followup.lead_id,
    entity_name: lead?.name || "Unknown",
    new_values: { title: followup.title },
  });

  revalidatePath(`/admin/leads/${followup.lead_id}`);
  return { success: true };
}

export async function reopenLeadFollowup(followupId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: followup, error: fErr } = await supabase
    .from("lead_followups")
    .select("id, lead_id, title, status")
    .eq("id", followupId)
    .single();
  if (fErr || !followup) return { success: false, error: "Follow-up not found" };
  if (followup.status === "pending") return { success: false, error: "Already pending" };

  const { error } = await supabase
    .from("lead_followups")
    .update({ status: "pending", completed_at: null })
    .eq("id", followupId);
  if (error) return { success: false, error: error.message };

  const { data: lead } = await supabase
    .from("leads")
    .select("name")
    .eq("id", followup.lead_id)
    .single();

  await logActivity({
    action: "followup.reopened",
    entity_type: "lead",
    entity_id: followup.lead_id,
    entity_name: lead?.name || "Unknown",
    new_values: { title: followup.title },
  });

  revalidatePath(`/admin/leads/${followup.lead_id}`);
  return { success: true };
}

export async function deleteLeadFollowup(followupId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();

  const { data: followup, error: fErr } = await supabase
    .from("lead_followups")
    .select("id, lead_id, title")
    .eq("id", followupId)
    .single();
  if (fErr || !followup) return { success: false, error: "Follow-up not found" };

  const { error } = await supabase
    .from("lead_followups")
    .delete()
    .eq("id", followupId);
  if (error) return { success: false, error: error.message };

  const { data: lead } = await supabase
    .from("leads")
    .select("name")
    .eq("id", followup.lead_id)
    .single();

  await logActivity({
    action: "followup.deleted",
    entity_type: "lead",
    entity_id: followup.lead_id,
    entity_name: lead?.name || "Unknown",
    old_values: { title: followup.title },
  });

  revalidatePath(`/admin/leads/${followup.lead_id}`);
  return { success: true };
}

// ============================================================
// Contact Submissions
// ============================================================

export async function getAllContactSubmissions() {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateContactSubmissionStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(contactSubmissionUpdateSchema, { status });
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contact-submissions");
  return { success: true };
}

export async function deleteContactSubmission(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contact-submissions");
  return { success: true };
}

// ============================================================
// Invoices CRUD
// ============================================================

export async function createInvoice(invoice: {
  client_email: string;
  invoice_number: string;
  amount: number;
  currency?: string;
  status?: string;
  description?: string;
  project_id?: string;
  due_date?: string;
}): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(invoiceSchema, invoice);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  if (invoice.project_id) {
    const { data: proj } = await supabase
      .from("projects")
      .select("id")
      .eq("id", invoice.project_id)
      .single();
    if (!proj) return { success: false, error: "Project not found" };
  }
  const { error } = await supabase.from("invoices").insert(invoice);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function updateInvoice(id: string, invoice: Partial<{
  client_email: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  project_id: string | null;
  due_date: string;
  paid_at: string;
}>): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(invoiceSchema.partial(), invoice);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  if (invoice.project_id) {
    const { data: proj } = await supabase
      .from("projects")
      .select("id")
      .eq("id", invoice.project_id)
      .single();
    if (!proj) return { success: false, error: "Project not found" };
  }

  // Write only the validated fields. `invoiceSchema` deliberately omits
  // `paid_at`, so it is handled explicitly below; the previous code passed the
  // raw payload through, which allowed mass assignment of any column and sent
  // `""` from "Mark Overdue" into a timestamptz column (PostgREST 22P02).
  const updateData: Record<string, unknown> = { ...validation.data };
  updateData.updated_at = new Date().toISOString();

  if (invoice.paid_at !== undefined) {
    const trimmed = invoice.paid_at?.trim();
    updateData.paid_at = trimmed ? trimmed : null;
  }

  // A non-paid status must not keep a stale paid_at timestamp.
  if (typeof updateData.status === "string" && updateData.status !== "paid") {
    updateData.paid_at = null;
  }

  const { error } = await supabase.from("invoices").update(updateData).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function getInvoiceById(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// ============================================================
// User Management
// ============================================================

export async function getAllUsers() {
  await requireSuperAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUserById(id: string) {
  await requireSuperAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ success: boolean; error?: string }> {
  await requireSuperAdmin();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", user.email)
    .single();

  if (existing) {
    return { success: false, error: "A user with this email already exists" };
  }

  const bcryptjs = await import("bcryptjs");
  const hashedPassword = await bcryptjs.hash(user.password, 12);

  const { error } = await supabase.from("users").insert({
    name: user.name,
    email: user.email,
    password: hashedPassword,
    role: user.role,
    email_verified: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUser(id: string, user: {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await requireSuperAdmin();
  const supabase = createClient();

  if (user.email) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }
  }

  // An admin must not be able to lock themselves out by demoting their own account.
  if (id === session.user.id && user.role && user.role !== "admin") {
    return { success: false, error: "You cannot change your own role." };
  }

  const updateData: Record<string, unknown> = {};
  if (user.name) updateData.name = user.name;
  if (user.email) updateData.email = user.email;
  if (user.role) updateData.role = user.role;
  if (user.password) {
    const bcryptjs = await import("bcryptjs");
    updateData.password = await bcryptjs.hash(user.password, 12);
  }
  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase.from("users").update(updateData).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await requireSuperAdmin();
  if (session.user.id === id) return { success: false, error: "You cannot delete your own account." };
  const supabase = createClient();
  const { data: target } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();
  if (!target) return { success: false, error: "User not found" };
  if (target.role === "admin") {
    return { success: false, error: "Another admin must demote this account before it can be deleted." };
  }
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

// ==================== Site Settings ====================

export async function getSiteSettings() {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("category");
    if (error) throw error;
    return { success: true, data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load settings";
    return { success: false, error: msg };
  }
}

export async function getSiteSettingsByCategory(category: string) {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", category)
      .order("key");
    if (error) throw error;
    return { success: true, data };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load settings";
    return { success: false, error: msg };
  }
}

export async function updateSiteSetting(key: string, value: string) {
  try {
    await requireSuperAdmin();
    const supabase = createClient();
    // `value` is a jsonb column but the admin form submits plain text, so the
    // string is passed through as-is and PostgREST stores it as a jsonb string.
    // Parsing it here would throw on any non-JSON text (e.g. "webtech").
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update setting";
    return { success: false, error: msg };
  }
}

export async function updateSiteSettings(settings: { key: string; value: string }[]) {
  try {
    await requireSuperAdmin();
    const supabase = createClient();
    const now = new Date().toISOString();
    // See updateSiteSetting: jsonb column + plain-text form input.
    const rows = settings.map((s) => ({
      key: s.key,
      value: s.value,
      updated_at: now,
    }));
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw error;
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update settings";
    return { success: false, error: msg };
  }
}

// ==================== Activity Log ====================

export async function logActivity(params: {
  action: string;
  entity_type: string;
  entity_id?: string;
  entity_name?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
}) {
  try {
    const session = await requireAdmin();
    const supabase = createClient();
    const { error } = await supabase.from("activity_log").insert({
      user_id: session.user.id,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id || null,
      entity_name: params.entity_name || null,
      old_values: params.old_values || null,
      new_values: params.new_values || null,
    });
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false }; // Silent fail for activity log
  }
}

export async function getActivityLog(params?: {
  entity_type?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    await requireAdmin();
    const supabase = createClient();
    let query = supabase
      .from("activity_log")
      .select("*, users:user_id(name, email)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (params?.entity_type) query = query.eq("entity_type", params.entity_type);
    if (params?.user_id) query = query.eq("user_id", params.user_id);

    const limit = params?.limit || 50;
    const offset = params?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { success: true, data, total: count || 0 };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load activity log";
    return { success: false, error: msg, data: [], total: 0 };
  }
}

// ==================== Admin Profile ====================

export async function updateAdminProfile(params: { name: string; email: string }) {
  try {
    const session = await requireAdmin();

    if (!params.name || params.name.trim().length === 0) {
      return { success: false, error: "Name is required." };
    }
    if (!params.email || !params.email.includes("@")) {
      return { success: false, error: "Valid email is required." };
    }
    if (params.name.length > 100) {
      return { success: false, error: "Name is too long." };
    }

    const supabase = createClient();
    const normalizedEmail = params.email.trim().toLowerCase();
    if (normalizedEmail !== session.user.email) {
      const { data: existing } = await supabase.from("users").select("id").eq("email", normalizedEmail).single();
      if (existing) return { success: false, error: "This email is already in use." };
    }
    const { error } = await supabase
      .from("users")
      .update({ name: params.name.trim(), email: normalizedEmail, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update profile";
    return { success: false, error: msg };
  }
}

export async function changeAdminPassword(params: { currentPassword: string; newPassword: string }) {
  try {
    const session = await requireAdmin();
    const supabase = createClient();
    
    if (params.newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters." };
    }

    // Verify current password
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("id", session.user.id)
      .single();
    if (fetchError || !userData) throw new Error("User not found");

    const isValid = await bcrypt.compare(params.currentPassword, userData.password);
    if (!isValid) return { success: false, error: "Current password is incorrect" };

    // Hash new password
    const hashedPassword = await bcrypt.hash(params.newPassword, 12);
    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);
    if (error) return { success: false, error: error.message };

    // Invalidate all sessions for this user by deleting them
    await supabase.from("sessions").delete().eq("user_id", session.user.id);

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to change password";
    return { success: false, error: msg };
  }
}

// ==================== Forgot Password ====================

export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Valid email is required." };
    }

    const { allowed } = checkRateLimit(`password-reset:${email.toLowerCase()}`);
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
    const token = require("crypto").randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Store the token in verification_tokens (NextAuth's table)
    const { error: insertError } = await supabase.from("verification_tokens").insert({
      identifier: `password-reset:${user.email}`,
      token,
      expires,
    });

    if (insertError) {
      // If table doesn't exist or fails, log and continue
      console.error("Failed to store reset token:", insertError.message);
    }

    // In production, send email here with the reset link:
    // `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    console.log(`Password reset token for ${user.email}: ${token}`);

    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to process request";
    return { success: false, error: msg };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
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
      .like("identifier", "password-reset:%")
      .single();

    if (tokenError || !tokenData) {
      return { success: false, error: "Invalid or expired reset token." };
    }

    // Check expiry
    if (new Date(tokenData.expires) < new Date()) {
      return { success: false, error: "Reset token has expired." };
    }

    // Extract email from identifier
    const email = tokenData.identifier.replace("password-reset:", "");

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
// Notifications
// ============================================================

export async function getNotifications(params?: {
  unread_only?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const supabase = createClient();
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (params?.unread_only) query = query.eq("is_read", false);

  const { data, error, count } = await query.range(offset, offset + pageSize - 1);
  if (error) throw error;

  return {
    data: (data || []) as Notification[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth();
  if (!session?.user) return 0;
  const supabase = createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("is_read", false);
  return count || 0;
}

export async function markNotificationRead(id: string): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", session.user.id);
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", session.user.id)
    .eq("is_read", false);
  revalidatePath("/admin");
  return { success: true };
}

// ============================================================
// CRM Analytics
// ============================================================

function parseValue(val: string | null): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export async function getCRMAnalytics(dateRange: string = "30d"): Promise<CRMAnalytics> {
  await requireAdmin();
  const supabase = createClient();

  let sinceDate: string | null = null;
  if (dateRange === "7d") {
    sinceDate = new Date(Date.now() - 7 * 86400000).toISOString();
  } else if (dateRange === "30d") {
    sinceDate = new Date(Date.now() - 30 * 86400000).toISOString();
  } else if (dateRange === "today") {
    sinceDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  }

  const [leadsRes, followupsRes, ticketsRes, usersRes] = await Promise.all([
    sinceDate
      ? supabase.from("leads").select("status, service, value, assigned_to, converted_client_id, created_at").gte("created_at", sinceDate)
      : supabase.from("leads").select("status, service, value, assigned_to, converted_client_id, created_at"),
    sinceDate
      ? supabase.from("lead_followups").select("status, due_date, assigned_to, completed_at, created_at").gte("created_at", sinceDate)
      : supabase.from("lead_followups").select("status, due_date, assigned_to, completed_at, created_at"),
    sinceDate
      ? supabase.from("support_tickets").select("status, priority, created_at").gte("created_at", sinceDate)
      : supabase.from("support_tickets").select("status, priority, created_at"),
    supabase.from("users").select("id, name").in("role", ["admin", "agent"]),
  ]);

  const allLeads = leadsRes.data || [];
  const allFollowups = followupsRes.data || [];
  const allTickets = ticketsRes.data || [];
  const usersMap = new Map((usersRes.data || []).map((u) => [u.id, u.name || "Unknown"]));

  const leads = sinceDate ? allLeads.filter((l) => l.created_at >= sinceDate) : allLeads;
  const followups = sinceDate ? allFollowups.filter((f) => f.created_at >= sinceDate) : allFollowups;
  const tickets = sinceDate ? allTickets.filter((t) => t.created_at >= sinceDate) : allTickets;

  // Leads by status
  const statusCounts: Record<string, number> = {};
  for (const l of leads) {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  }

  // Leads by service
  const serviceCounts: Record<string, number> = {};
  for (const l of leads) {
    serviceCounts[l.service] = (serviceCounts[l.service] || 0) + 1;
  }
  const byService = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  // Leads by assignee
  const assigneeCounts: Record<string, number> = {};
  for (const l of leads) {
    const name = l.assigned_to ? (usersMap.get(l.assigned_to) || "Unknown") : "Unassigned";
    assigneeCounts[name] = (assigneeCounts[name] || 0) + 1;
  }
  const byAssignee = Object.entries(assigneeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Conversion
  const converted = leads.filter((l) => l.converted_client_id).length;
  const totalClosed = (statusCounts["closed_won"] || 0) + (statusCounts["closed_lost"] || 0);
  const conversionRate = totalClosed > 0 ? Math.round(((statusCounts["closed_won"] || 0) / totalClosed) * 100) : 0;
  const lostRate = totalClosed > 0 ? Math.round(((statusCounts["closed_lost"] || 0) / totalClosed) * 100) : 0;

  // Follow-ups
  const today = new Date().toISOString().split("T")[0];
  const pendingFollowups = followups.filter((f) => f.status === "pending");
  const overdueFollowups = pendingFollowups.filter((f) => f.due_date < today);
  const dueTodayFollowups = pendingFollowups.filter((f) => f.due_date === today);

  const fuByAssignee: Record<string, { pending: number; completed: number }> = {};
  for (const f of followups) {
    const name = f.assigned_to ? (usersMap.get(f.assigned_to) || "Unknown") : "Unassigned";
    if (!fuByAssignee[name]) fuByAssignee[name] = { pending: 0, completed: 0 };
    if (f.status === "pending") fuByAssignee[name].pending++;
    else fuByAssignee[name].completed++;
  }
  const followupByAssignee = Object.entries(fuByAssignee)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.pending - a.pending);

  // Revenue
  const totalPipeline = leads.reduce((sum, l) => sum + parseValue(l.value), 0);
  const convertedValue = leads
    .filter((l) => l.converted_client_id)
    .reduce((sum, l) => sum + parseValue(l.value), 0);
  const lostValue = leads
    .filter((l) => l.status === "closed_lost")
    .reduce((sum, l) => sum + parseValue(l.value), 0);

  // Support tickets
  const ticketStatusCounts: Record<string, number> = {};
  const ticketPriorityCounts: Record<string, number> = {};
  for (const t of tickets) {
    ticketStatusCounts[t.status] = (ticketStatusCounts[t.status] || 0) + 1;
    ticketPriorityCounts[t.priority] = (ticketPriorityCounts[t.priority] || 0) + 1;
  }
  const byPriority = Object.entries(ticketPriorityCounts)
    .map(([priority, count]) => ({ priority, count }))
    .sort((a, b) => b.count - a.count);

  return {
    dateRange,
    leads: {
      total: leads.length,
      new: statusCounts["new"] || 0,
      contacted: statusCounts["contacted"] || 0,
      proposalSent: statusCounts["proposal_sent"] || 0,
      closedWon: statusCounts["closed_won"] || 0,
      closedLost: statusCounts["closed_lost"] || 0,
      converted,
      byService,
      byAssignee,
    },
    conversion: {
      totalConverted: converted,
      conversionRate,
      lostRate,
    },
    followups: {
      pending: pendingFollowups.length,
      completed: followups.filter((f) => f.status === "completed").length,
      overdue: overdueFollowups.length,
      dueToday: dueTodayFollowups.length,
      byAssignee: followupByAssignee,
    },
    revenue: {
      totalPipeline,
      convertedValue,
      lostValue,
    },
    support: {
      open: ticketStatusCounts["open"] || 0,
      closed: (ticketStatusCounts["closed"] || 0) + (ticketStatusCounts["resolved"] || 0),
      pending: (ticketStatusCounts["open"] || 0) + (ticketStatusCounts["in_progress"] || 0),
      byPriority,
    },
  };
}

// ============================================================
// Project Management
// ============================================================

export async function getAdminProjects(params?: { page?: number; status?: string }) {
  await requireAdmin();
  const supabase = createClient();
  const page = params?.page || 1;
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  const total = count || 0;
  return { data: data || [], total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProjectById(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createProject(project: ProjectInsert): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(projectSchema, project);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase.from("projects").insert(project);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: string, project: Partial<ProjectInsert>): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(projectSchema.partial(), project);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  return { success: true };
}

// ============================================================
// Payment Management
// ============================================================

export async function getAdminInvoicePayments(invoiceId: string): Promise<{ data: InvoicePayment[]; error?: string }> {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("payment_date", { ascending: false });
  if (error) throw error;
  return { data: (data || []) as InvoicePayment[] };
}

type SupabaseClient = ReturnType<typeof createClient>;

/**
 * Keeps invoice `status`/`paid_at` consistent with the sum of its payments.
 * Used after every payment insert or delete so an invoice can never claim to
 * be paid while its payments total less than the amount owed.
 */
async function syncInvoicePaymentState(supabase: SupabaseClient, invoiceId: string) {
  const { data: invoice } = await supabase
    .from("invoices")
    .select("amount, status, paid_at")
    .eq("id", invoiceId)
    .single();
  if (!invoice) return;

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId);
  const total = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const amount = Number(invoice.amount);

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (amount > 0 && total >= amount) {
    patch.status = "paid";
    if (!invoice.paid_at) patch.paid_at = new Date().toISOString();
  } else if (invoice.status === "paid") {
    // Payment removed or reduced: drop the stale paid state.
    patch.status = "pending";
    patch.paid_at = null;
  }
  // Any other status (draft/pending/overdue) is left untouched so a partial
  // payment no longer resets an overdue invoice back to pending.

  await supabase.from("invoices").update(patch).eq("id", invoiceId);
}

export async function createPayment(payment: {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  receipt_number: string;
  reference_number?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const validation = validate(paymentSchema, payment);
  if (!validation.success) return { success: false, error: validation.errors.join(", ") };
  const supabase = createClient();
  const { data: invoice, error: invErr } = await supabase.from("invoices").select("id, status, amount").eq("id", payment.invoice_id).single();
  if (invErr || !invoice) return { success: false, error: "Invoice not found" };
  if (invoice.status === "paid") return { success: false, error: "Invoice is already fully paid" };
  if (invoice.status === "draft") return { success: false, error: "Cannot record payment against a draft invoice" };
  const { data: existingPayments } = await supabase.from("payments").select("amount").eq("invoice_id", payment.invoice_id);
  const totalPaid = (existingPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);
  if (totalPaid + payment.amount > Number(invoice.amount)) {
    return { success: false, error: `Payment exceeds remaining balance. Remaining: ₨${(Number(invoice.amount) - totalPaid).toLocaleString()}` };
  }
  const { error } = await supabase.from("payments").insert(payment);
  if (error) return { success: false, error: error.message };
  await syncInvoicePaymentState(supabase, payment.invoice_id);
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${payment.invoice_id}`);
  return { success: true };
}

export async function deletePayment(id: string, invoiceId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await syncInvoicePaymentState(supabase, invoiceId);
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}
