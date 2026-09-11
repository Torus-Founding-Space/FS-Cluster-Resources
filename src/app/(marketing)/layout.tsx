import Image from "next/image";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { sections, siteConfig } from "@/lib/site";

/**
 * Chrome for the marketing surface (landing page + privacy policy).
 *
 * The docs routes have their own `DocsLayout` in `app/docs/layout.tsx`, so this
 * `HomeLayout` deliberately does NOT wrap them — nesting the two Fumadocs
 * layouts stacks two navbars on top of each other and breaks the mobile nav.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: (
          <div className="flex items-center gap-2.5">
            <Image
              src="/logos/LOGOGIF.gif"
              alt={siteConfig.name}
              width={48}
              height={48}
              style={{ width: "auto", height: "48px" }}
              className="mix-blend-screen opacity-95 rounded-none"
              unoptimized
              priority
            />
          </div>
        ),
        transparentMode: "top",
      }}
      links={sections.map((section) => ({
        text: section.title,
        url: section.href,
        active: "nested-url" as const,
      }))}
      githubUrl={siteConfig.githubUrl}
    >
      {children}
    </HomeLayout>
  );
}
