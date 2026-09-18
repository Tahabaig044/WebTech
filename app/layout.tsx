import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pixelwyre Digital — Web Dev · SEO · Ads · Managed Hosting",
    template: "%s | Pixelwyre Digital",
  },
  description:
    "Full-stack digital agency delivering web development, local SEO, Google Ads, managed hosting, and ERP automation — all under one roof.",
  keywords: ["web development", "SEO", "Google Ads", "managed hosting", "ERP", "Pakistan", "digital agency"],
  openGraph: {
    title: "Pixelwyre Digital",
    description: "Web Dev · SEO · Ads · Managed Hosting — All Under One Roof",
    url: "https://pixelwyre.com",
    siteName: "Pixelwyre Digital",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
