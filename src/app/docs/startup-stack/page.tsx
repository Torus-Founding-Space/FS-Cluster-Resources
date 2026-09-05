import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Stack",
  description: "The tools and services worth paying for, and the ones that are not.",
  alternates: { canonical: "/docs/startup-stack" },
  // Placeholder page with no published content yet.
  robots: { index: false, follow: true },
};

export default function StartupStackPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 tracking-widest uppercase mb-8">
        Coming Soon
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Startup Stack</h1>
      <p className="text-white/50 text-lg leading-relaxed">
        Opinionated tech stack recommendations and architecture guides for early-stage startups.
      </p>
    </div>
  );
}
