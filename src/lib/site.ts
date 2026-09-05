/**
 * Single source of truth for the site's identity and section list.
 *
 * The root layout nav, the docs page tree, the sitemap and the landing page
 * all read from here so they cannot drift apart.
 */

export const siteConfig = {
  name: "Founder resources by Cluster",
  shortName: "Cluster Docs",
  url: "https://clusterdocs.torusfoundingspace.com",
  description:
    "Free open-source developer tools, architecture guides, and startup stack resources for founders by FS Cluster & Torus Founding Space.",
  githubUrl: "https://github.com/Torus-Founding-Space/FS-Cluster-Resources",
  parentUrl: "https://torusfoundingspace.com",
} as const;

export interface SiteSection {
  title: string;
  href: string;
  description: string;
  /** Sections without published content are flagged so we never over-promise. */
  status: "live" | "planned";
}

export const sections: SiteSection[] = [
  {
    title: "UI & Design",
    href: "/docs/ui-design",
    description:
      "Open-source UI components and design tooling, including the cluster-loaders animation library.",
    status: "live",
  },
  {
    title: "Dev Tools",
    href: "/docs/dev-tools",
    description:
      "Browser extensions and CLIs that shorten the design-to-code loop.",
    status: "live",
  },
  {
    title: "APIs",
    href: "/docs/apis",
    description: "Production-ready APIs and integration guides.",
    status: "planned",
  },
  {
    title: "Infrastructure",
    href: "/docs/infrastructure",
    description: "Deployment, hosting and architecture references.",
    status: "planned",
  },
  {
    title: "AI Tools",
    href: "/docs/ai-tools",
    description: "Practical AI tooling and integration patterns for small teams.",
    status: "planned",
  },
  {
    title: "Boilerplates",
    href: "/docs/boilerplates",
    description: "Starter templates you can fork and ship from.",
    status: "planned",
  },
  {
    title: "Startup Stack",
    href: "/docs/startup-stack",
    description: "The tools and services worth paying for, and the ones that aren't.",
    status: "planned",
  },
  {
    title: "Learning",
    href: "/docs/learning",
    description: "Curated reading and reference material for founding engineers.",
    status: "planned",
  },
];

/**
 * Routes advertised in the sitemap.
 *
 * The "planned" sections are deliberately absent: they carry `noindex` until
 * they have real content, and a sitemap that lists noindexed URLs is a
 * contradiction search engines report as an error.
 */
export const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/docs", priority: 0.9 },
  { path: "/docs/math-loaders", priority: 0.9 },
  { path: "/docs/ui-design", priority: 0.8 },
  { path: "/docs/dev-tools", priority: 0.8 },
  { path: "/docs/dev-tools/webpage-to-figma", priority: 0.8 },
  { path: "/privacy", priority: 0.3 },
];
