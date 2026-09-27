import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
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
  metadataBase: new URL("https://webtechsolutionshub.com"),
  title: {
    default: "WebTech Solutions Hub — Web Dev · SEO · Ads · Managed Hosting",
    template: "%s | WebTech Solutions Hub",
  },
  description:
    "Full-stack digital agency delivering web development, local SEO, Google Ads, managed hosting, and ERP automation — all under one roof.",
  keywords: ["web development", "SEO", "Google Ads", "managed hosting", "ERP", "Pakistan", "digital agency"],
  openGraph: {
    title: "WebTech Solutions Hub",
    description: "Web Dev · SEO · Ads · Managed Hosting — All Under One Roof",
    url: "https://webtechsolutionshub.com",
    siteName: "WebTech Solutions Hub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebTech Solutions Hub",
    description: "Web Dev · SEO · Ads · Managed Hosting — All Under One Roof",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning>
        <Providers>
          <Toaster position="top-right" richColors closeButton />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999999] focus:bg-[#7C3AED] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
          >
            Skip to content
          </a>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
