import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";
import Link from "next/link";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";
import { LoadersGallery } from "./_gallery";
import { TutorialSteps } from "@/components/ui/TutorialSteps";

const toc: TOCItemType[] = [
  { title: "Installation & Setup Guide", url: "#quickstart", depth: 2 },
  { title: "Interactive Gallery", url: "#gallery", depth: 2 },
  { title: "Parametric Curves", url: "#parametric-curves", depth: 3 },
  { title: "Motion & Waves", url: "#motion", depth: 3 },
  { title: "3D & Spatial", url: "#spatial", depth: 3 },
  { title: "Geometry Loaders", url: "#geometry", depth: 3 },
  { title: "Particle Systems", url: "#particles", depth: 3 },
];

export default function MathLoadersPage() {
  return (
    <DocsPage toc={toc}>
      <DocsTitle>Math Loaders</DocsTitle>
      <DocsDescription>
        Parametric, continuous mathematical loading animations rendered in pure SVG & HTML5 Canvas. Zero dependencies.
      </DocsDescription>

      <DocsBody>
        {/* ── Quickstart & Framework Guide ───────────────────────────── */}
        <h2 id="quickstart">Installation & Setup Guide</h2>
        
        <TutorialSteps />

        {/* ── Interactive Gallery ─────────────────────────────────────── */}
        <h2 id="gallery">Interactive Gallery</h2>
        <p>Copy the instant CLI command directly from any loader card, or click a card to customize live speed, particles, and view full code options.</p>

        <LoadersGallery />

        {/* ── Bottom Next / Previous Page Navigation ───────────────────── */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-16 not-prose">
          <Link
            href="/docs/ui-design"
            className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:border-[#CBA6F7]/50 hover:bg-white/[0.04] transition-all text-left"
          >
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">← Previous</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#CBA6F7] transition-colors">UI &amp; Design Overview</span>
          </Link>

          <Link
            href="/docs/dev-tools"
            className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:border-[#CBA6F7]/50 hover:bg-white/[0.04] transition-all text-right ms-auto"
          >
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Next →</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#CBA6F7] transition-colors">Dev Tools</span>
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
