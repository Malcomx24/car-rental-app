import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${APP_URL}/cars`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${APP_URL}/locations`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${APP_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${APP_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${APP_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${APP_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${APP_URL}/sign-in`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${APP_URL}/sign-up`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return staticPages;
}
