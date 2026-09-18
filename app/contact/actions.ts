"use server";

import { submitContactForm } from "@/lib/supabase/queries";
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

  const submission: ContactSubmissionInsert = {
    name,
    email,
    phone: phone || null,
    service: service || null,
    budget: budget || null,
    message,
  };

  try {
    const result = await submitContactForm(submission);
    return result;
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
