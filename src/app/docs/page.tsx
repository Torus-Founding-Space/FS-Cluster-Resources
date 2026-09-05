import type { Metadata } from "next";
import Link from "next/link";
import { sections } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Index of every FS Cluster documentation section: UI components, dev tools, APIs, infrastructure, AI tooling, boilerplates and startup stack guides.",
  alternates: { canonical: "/docs" },
};

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl p-8">
      <div className="mb-8 inline-flex items-center border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/60">
        Documentation
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Documentation</h1>
      <p className="mb-12 text-lg leading-relaxed text-white/50">
        Every section of the FS Cluster resource set. Published material is listed
        first; the rest is in progress.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col border border-white/10 bg-white/[0.02] p-5 transition-all duration-200 hover:border-[#CBA6F7]/50 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white transition-colors group-hover:text-[#CBA6F7]">
                {section.title}
              </h2>
              {section.status === "planned" && (
                <span className="shrink-0 border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Soon
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
