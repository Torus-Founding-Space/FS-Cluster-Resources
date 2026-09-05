import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sections, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founder resources by Cluster",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="max-w-3xl">
        <p className="inline-flex items-center border border-[#CBA6F7]/30 bg-[#CBA6F7]/10 px-3 py-1 text-xs font-mono font-medium uppercase tracking-widest text-[#CBA6F7]">
          Free &amp; open source
        </p>

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Founder resources by Cluster
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-white/60">
          Developer tools, architecture guides and startup stack references, built
          and maintained in the open by FS&nbsp;Cluster &amp; Torus Founding Space.
          No paywalls, no sign-up.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/docs/math-loaders"
            className="group inline-flex items-center gap-2 border border-[#CBA6F7]/40 bg-[#CBA6F7]/15 px-4 py-2.5 text-sm font-medium text-[#CBA6F7] transition-colors hover:bg-[#CBA6F7]/25"
          >
            Browse cluster-loaders
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            All documentation
          </Link>
        </div>
      </section>

      {/* ── Sections ────────────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="mb-6 border-b border-white/10 pb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/40">
          Sections
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col border border-white/10 bg-white/[0.02] p-5 transition-all duration-200 hover:border-[#CBA6F7]/50 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white transition-colors group-hover:text-[#CBA6F7]">
                  {section.title}
                </h3>
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
      </section>
    </main>
  );
}
