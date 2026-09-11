import { DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Curated AI tools, integrations, and prompting guides for founders and engineers.",
  alternates: { canonical: "/docs/ai-tools" },
  // Placeholder page with no published content yet.
  robots: { index: false, follow: true },
};

export default function AiToolsPage() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 tracking-widest uppercase mb-8">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">AI Tools</h1>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed">
          Curated AI tools, integrations, and prompting guides for founders and engineers.
        </p>
      </div>
    </DocsPage>
  );
}
