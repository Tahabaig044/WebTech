import { createClient } from "@/lib/supabase/server";
import type { BlogPost, DBService, CaseStudy, ContactSubmissionInsert } from "@/lib/types";

// ============================================================
// Blog Posts
// ============================================================

export async function getBlogPosts(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, content, excerpt, category, featured_image, author, read_time, featured, published, published_at, created_at, updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(options?.limit || 50);

  if (options?.category && options.category !== "All") {
    query = query.eq("category", options.category);
  }

  if (options?.offset) {
    const limit = options.limit || 50;
    query = query.range(options.offset, options.offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, content, excerpt, category, featured_image, author, read_time, featured, published, published_at, created_at, updated_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getBlogCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("published", true);

  if (error) return [];
  const categories = [...new Set((data || []).map((r) => r.category))];
  return categories.sort();
}

export async function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit = 3
): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, content, excerpt, category, featured_image, author, read_time, featured, published, published_at, created_at, updated_at")
    .eq("published", true)
    .eq("category", category)
    .neq("slug", currentSlug)
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ============================================================
// Services
// ============================================================

export async function getServices(options?: {
  category?: string;
  activeOnly?: boolean;
}): Promise<DBService[]> {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select("id, slug, name, description, short_description, price, price_period, category, icon, features, active, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .limit(100);

  if (options?.activeOnly !== false) {
    query = query.eq("active", true);
  }

  if (options?.category && options.category !== "All") {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getServiceBySlug(slug: string): Promise<DBService | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, name, description, short_description, price, price_period, category, icon, features, active, sort_order, created_at")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getServiceCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("category")
    .eq("active", true);

  if (error) return [];
  const categories = [...new Set((data || []).map((r) => r.category))];
  return categories.sort();
}

export async function getRelatedServices(
  category: string,
  currentSlug: string,
  limit = 3
): Promise<DBService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, name, description, short_description, price, price_period, category, icon, features, active, sort_order, created_at")
    .eq("active", true)
    .eq("category", category)
    .neq("slug", currentSlug)
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ============================================================
// Case Studies
// ============================================================

export async function getCaseStudies(options?: {
  industry?: string;
  featuredOnly?: boolean;
}): Promise<CaseStudy[]> {
  const supabase = await createClient();
  let query = supabase
    .from("case_studies")
    .select("id, slug, client_name, industry, result_summary, description, challenge, solution, metrics, tech_stack, featured_image, gallery, timeline, featured, published, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (options?.industry && options.industry !== "All") {
    query = query.eq("industry", options.industry);
  }

  if (options?.featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("id, slug, client_name, industry, result_summary, description, challenge, solution, metrics, tech_stack, featured_image, gallery, timeline, featured, published, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getCaseStudyIndustries(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("industry")
    .eq("published", true);

  if (error) return [];
  const industries = [...new Set((data || []).map((r) => r.industry))];
  return industries.sort();
}

// ============================================================
// Contact Form
// ============================================================

export async function submitContactForm(
  submission: ContactSubmissionInsert
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .insert(submission);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
