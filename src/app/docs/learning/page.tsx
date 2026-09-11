import { DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description: "Curated reading and reference material for founding engineers.",
  alternates: { canonical: "/docs/learning" },
  // Placeholder page with no published content yet.
  robots: { index: false, follow: true },
};

export default function LearningPage() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 tracking-widest uppercase mb-8">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Learning</h1>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed">
          Curated learning resources, tutorials, and deep-dives for engineers building at scale.
        </p>
      </div>
    </DocsPage>
  );
}
