import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getServices } from "@/lib/supabase/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pixelwyre Digital for web development, SEO, Google Ads, managed hosting, and ERP automation. We reply within 2 hours.",
};

export default async function ContactPage() {
  let categories: string[] = [];
  try {
    const services = await getServices();
    const catSet = new Set(services.map((s) => s.category).filter(Boolean));
    categories = Array.from(catSet) as string[];
  } catch {
    categories = [];
  }

  return <ContactForm categories={categories} />;
}
