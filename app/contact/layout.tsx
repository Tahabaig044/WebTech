import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Pixelwyre Digital for web development, SEO, Google Ads, managed hosting, and ERP automation inquiries. We respond within 2 hours.",
  openGraph: {
    title: "Contact Pixelwyre Digital",
    description: "Get in touch for web development, SEO, hosting, and automation inquiries.",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
