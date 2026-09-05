import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/lib/site";

// Static export: these metadata routes must be emitted as files at build time.
export const dynamic = "force-static";

/**
 * Generated at build time from the shared route list so new pages can never be
 * silently left out (and removed ones can't linger).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
