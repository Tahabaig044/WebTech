"use server";

import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BlogPostInsert, DBServiceInsert, CaseStudyInsert, AdminClient, AdminInvoice } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "admin" && session.user.role !== "agent") {
    throw new Error("Forbidden");
  }
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
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").insert(post);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: string, post: Partial<BlogPostInsert>) {
  await requireAdmin();
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
  const supabase = createClient();
  const { error } = await supabase.from("services").insert(service);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, service: Partial<DBServiceInsert>) {
  await requireAdmin();
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
  const supabase = createClient();
  const { error } = await supabase.from("case_studies").insert(study);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
  return { success: true };
}

export async function updateCaseStudy(id: string, study: Partial<CaseStudyInsert>) {
  await requireAdmin();
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
    .select("id, client_email, invoice_number, amount, currency, status, description, due_date, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data || []) as AdminInvoice[];
}
