import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Static export: these metadata routes must be emitted as files at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
