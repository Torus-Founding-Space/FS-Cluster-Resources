import { DocsPage } from 'fumadocs-ui/page';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import type { Metadata } from "next";

function ChromeIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Dev Tools",
  description: "Browser extensions and CLIs that shorten the design-to-code loop, including the free Webpage to Figma converter.",
  alternates: { canonical: "/docs/dev-tools" },
};

export default function DevToolsPage() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
      <div className="max-w-4xl font-sans">
        {/* Category Tag - Sharp corners */}
        <div className="inline-flex items-center gap-2 border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono font-medium text-sky-400 tracking-wider uppercase mb-6 rounded-none">
          <Sparkles className="w-3.5 h-3.5" />
          Dev Tools
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-white">Dev Tools</h1>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-12 max-w-2xl">
          Essential developer utilities, browser extensions, and CLIs engineered to accelerate design-to-code workflows.
        </p>

        {/* ── Extensions Section ──────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 border border-white/10 text-[#CBA6F7] rounded-none">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-white tracking-tight uppercase text-sm font-mono font-semibold">Extensions</h2>
                <p className="text-xs text-white/40">Production-ready browser extensions &amp; converter tools</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-white/[0.05] border border-white/10 text-white/60 rounded-none">
              1 tool • Launch Ready
            </span>
          </div>

          {/* Extension Card - Sharp Corners (rounded-none) */}
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/docs/dev-tools/webpage-to-figma"
              className="group relative block p-5 sm:p-7 bg-white/[0.02] border border-white/10 hover:border-[#CBA6F7]/60 hover:bg-white/[0.05] transition-all duration-200 rounded-none"
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  {/* Extension Logo - Sharp Corners */}
                  <div className="relative w-14 h-14 shrink-0 bg-white/5 border border-white/15 p-2 flex items-center justify-center rounded-none group-hover:border-[#CBA6F7]/50 transition-colors">
                    <Image
                      src="/logos/extension-logo.png"
                      alt="Webpage to Figma converter logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-400 rounded-none">
                        <CheckCircle2 className="w-3 h-3" />
                        Free
                      </span>
                      <span className="inline-flex items-center gap-1 border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-sky-400 rounded-none">
                        <ChromeIcon className="w-3 h-3" />
                        Browser Extension
                      </span>
                      <span className="inline-flex items-center gap-1 border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-purple-300 rounded-none">
                        Manifest V3 Ready
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#CBA6F7] transition-colors">
                      Webpage to Figma converter ( free )
                    </h3>

                    <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                      Turns any live web page or localhost development into clean, high-quality, fully editable Figma designs. Extracts nested DOM hierarchies, flexbox auto-layouts, custom web typography, and vector SVG assets without subscriptions or paywalls.
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-xs font-mono text-white/40">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none" />
                        Full DOM to Vector
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-none" />
                        Native Auto-Layout
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#CBA6F7] rounded-none" />
                        Clipboard &amp; .fig Export
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white/60 group-hover:text-white shrink-0 self-start md:self-center border border-white/10 px-3 py-2 bg-white/5 rounded-none group-hover:border-[#CBA6F7]/50">
                  <span>View Converter Docs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#CBA6F7]" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </DocsPage>
  );
}
