"use server";

import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BlogPostInsert, DBServiceInsert, CaseStudyInsert } from "@/lib/types";

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
    .select("*")
    .order("created_at", { ascending: false });

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
    .select("*")
    .order("sort_order", { ascending: true });

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
    .select("*")
    .order("created_at", { ascending: false });

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
