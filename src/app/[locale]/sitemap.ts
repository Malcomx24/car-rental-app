import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

const locales = ["en", "fr", "ar"];
const defaultLocale = "fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/cars", "/about", "/contact", "/locations", "/blog", "/privacy", "/terms"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${APP_URL}/${locale}${route === "/" ? "" : route}`,
        lastModified: new Date(),
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${APP_URL}/${l}${route === "/" ? "" : route}`])
          ),
        },
      });
    }
  }

  return entries;
}
