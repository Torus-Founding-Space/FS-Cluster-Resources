import { DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "APIs",
  description: "Documentation for production-ready APIs and integration guides.",
  alternates: { canonical: "/docs/apis" },
  // Placeholder page with no published content yet.
  robots: { index: false, follow: true },
};

export default function ApisPage() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 tracking-widest uppercase mb-8">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">APIs</h1>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed">
          Documentation for production-ready APIs and integration guides will be published here.
        </p>
      </div>
    </DocsPage>
  );
}
