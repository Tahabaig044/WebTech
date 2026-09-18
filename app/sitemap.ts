import type { MetadataRoute } from "next";
import { getBlogPosts, getCaseStudies, getServices } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pixelwyre.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/hosting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [posts, studies, services] = await Promise.all([
      getBlogPosts().catch(() => []),
      getCaseStudies().catch(() => []),
      getServices().catch(() => []),
    ]);

    const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const caseStudyPages: MetadataRoute.Sitemap = (studies || []).map((study) => ({
      url: `${baseUrl}/case-studies/${study.slug}`,
      lastModified: new Date(study.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const servicePages: MetadataRoute.Sitemap = (services || []).map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    dynamicPages = [...blogPages, ...caseStudyPages, ...servicePages];
  } catch {
    // If DB queries fail, return only static pages
  }

  return [...staticPages, ...dynamicPages];
}
