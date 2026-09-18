"use server";

import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Project, Invoice, SupportTicket } from "@/lib/types";

async function requireClient() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  if (session.user.role !== "client") throw new Error("Forbidden");
  return session;
}

export async function getPortalProjects(): Promise<Project[]> {
  const session = await requireClient();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPortalInvoices(): Promise<Invoice[]> {
  const session = await requireClient();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPortalTickets(): Promise<SupportTicket[]> {
  const session = await requireClient();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("client_email", session.user.email!)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSupportTicket(ticket: {
  subject: string;
  message: string;
  priority?: string;
}) {
  const session = await requireClient();
  const supabase = createClient();
  const { error } = await supabase.from("support_tickets").insert({
    ...ticket,
    client_email: session.user.email!,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getPortalStats() {
  const session = await requireClient();
  const supabase = createClient();
  const email = session.user.email!;

  const [projectsRes, invoicesRes, ticketsRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("client_email", email),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("client_email", email),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("client_email", email).eq("status", "open"),
  ]);

  return {
    activeProjects: projectsRes.count || 0,
    totalInvoices: invoicesRes.count || 0,
    openTickets: ticketsRes.count || 0,
  };
}
