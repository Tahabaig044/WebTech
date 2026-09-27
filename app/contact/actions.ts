"use server";

import { submitContactForm } from "@/lib/supabase/queries";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import type { ContactSubmissionInsert } from "@/lib/types";

export interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const budget = formData.get("budget") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  if (name.length > 200) {
    return { success: false, error: "Name is too long." };
  }
  if (email.length > 254) {
    return { success: false, error: "Email is too long." };
  }
  if (message.length > 5000) {
    return { success: false, error: "Message is too long." };
  }

  const { allowed } = checkRateLimit(`contact:${email.toLowerCase()}`);
  if (!allowed) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const submission: ContactSubmissionInsert = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    service: service?.trim() || null,
    budget: budget?.trim() || null,
    message: message.trim(),
  };

  try {
    const result = await submitContactForm(submission);
    return result;
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
