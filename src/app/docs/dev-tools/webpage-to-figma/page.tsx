import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";
import Link from "next/link";
import Image from "next/image";
import { ScreenshotSlot } from "@/components/ScreenshotSlot";
import { FolderOpen, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

const toc: TOCItemType[] = [
  { title: "How It Works", url: "#how-it-works", depth: 2 },
  { title: "Step 1: Open Extension", url: "#step-1", depth: 2 },
  { title: "Step 2: Capture & Copy", url: "#step-2", depth: 2 },
  { title: "Step 3: Run Figma Plugin", url: "#step-3", depth: 2 },
  { title: "Step 4: Paste & Import", url: "#step-4", depth: 2 },
  { title: "Screenshots Folder", url: "#screenshots-folder", depth: 2 },
  { title: "Privacy & Permissions", url: "#privacy-security", depth: 2 },
];

export const metadata: Metadata = {
  title: "Webpage to Figma",
  description: "Turn any live web page or localhost site into editable Figma layers with auto-layout, using a free Chrome extension and Figma plugin.",
  alternates: { canonical: "/docs/dev-tools/webpage-to-figma" },
};

export default function WebpageToFigmaPage() {
  return (
    <DocsPage toc={toc}>
      {/* ── Top Header Tags ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs">
        <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/70 rounded-none">
          Free
        </span>
        <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/70 rounded-none">
          Chrome Extension + Figma Plugin
        </span>
        <Link
          href="/privacy"
          className="border border-[#CBA6F7]/30 bg-[#CBA6F7]/10 hover:bg-[#CBA6F7]/20 px-2.5 py-1 text-[#CBA6F7] rounded-none inline-flex items-center gap-1.5 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Privacy Policy
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/15 p-1.5 flex items-center justify-center rounded-none">
          <Image
            src="/logos/extension-logo.png"
            alt="Webpage to Figma Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain rounded-none"
            priority
          />
        </div>
        <div>
          <DocsTitle>Webpage to Figma</DocsTitle>
        </div>
      </div>

      <DocsDescription>
        Turn any web page into editable Figma layers.
      </DocsDescription>

      <DocsBody>
        {/* ── How it works (Simple & Direct) ─────────────────────────── */}
        <div id="how-it-works" className="not-prose my-6 p-4 border border-white/10 bg-white/[0.02] rounded-none space-y-2">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#CBA6F7]">
            How it works
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            This tool uses a <strong>Chrome extension</strong> and a <strong>Figma plugin</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 border border-white/10 bg-white/[0.02] rounded-none">
              <span className="text-xs font-mono text-white/50 block mb-1">1. Chrome Extension</span>
              <p className="text-xs text-white/70">
                Captures the layout, text, and styles from your browser tab and copies it.
              </p>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02] rounded-none">
              <span className="text-xs font-mono text-white/50 block mb-1">2. Figma Plugin</span>
              <p className="text-xs text-white/70">
                Pastes the copied design directly into Figma as editable layers and auto-layout.
              </p>
            </div>
          </div>
        </div>

        {/* ── Step 1 ─────────────────────────────────────────────────── */}
        <h2 id="step-1">Step 1: Open the extension on your webpage</h2>
        <p className="text-sm text-white/70">
          Open the webpage you want to convert (live website or <code>localhost:3000</code>). Click the extension icon in your Chrome toolbar.
        </p>

        <ScreenshotSlot
          src="/images/webpage-to-figma/step-1.png"
          alt="Step 1: Click extension icon in Chrome toolbar"
          stepNumber="STEP 01"
          clickTarget="Webpage to Figma icon in your browser toolbar"
          whatToCapture="Show the webpage in your browser with the extension icon clicked and the popup opening."
        />

        {/* ── Step 2 ─────────────────────────────────────────────────── */}
        <h2 id="step-2">Step 2: Choose what to capture and click Copy</h2>
        <p className="text-sm text-white/70">
          Choose <strong>Full Page</strong> (to capture the entire scrollable page) or <strong>Select Element</strong> (to hover and pick a specific section). Once the scan finishes, click <strong>Copy for Figma</strong>.
        </p>

        <ScreenshotSlot
          src="/images/webpage-to-figma/step-2.png"
          alt="Step 2: Click Copy for Figma in the extension popup"
          stepNumber="STEP 02"
          clickTarget="&quot;Copy for Figma&quot; button"
          whatToCapture="Show the extension popup with the capture options and the 'Copy for Figma' button highlighted."
        />

        {/* ── Step 3 ─────────────────────────────────────────────────── */}
        <h2 id="step-3">Step 3: Open Figma and run the plugin</h2>
        <p className="text-sm text-white/70">
          Open a Figma file. Press <kbd className="px-1.5 py-0.5 bg-white/10 text-white font-mono text-xs rounded-none">Shift + I</kbd> to open Plugins, search for <strong>Webpage to Figma</strong> (or html.to.design), and click <strong>Run</strong>.
        </p>

        <ScreenshotSlot
          src="/images/webpage-to-figma/step-3.png"
          alt="Step 3: Run the plugin in Figma"
          stepNumber="STEP 03"
          clickTarget="&quot;Run&quot; button next to the plugin in Figma"
          whatToCapture="Show Figma with the Plugins menu open and the 'Run' button for the converter plugin."
        />

        {/* ── Step 4 ─────────────────────────────────────────────────── */}
        <h2 id="step-4">Step 4: Paste and click Import</h2>
        <p className="text-sm text-white/70">
          In the plugin window, paste your copied data (<kbd className="px-1.5 py-0.5 bg-white/10 text-white font-mono text-xs rounded-none">Ctrl + V</kbd> or <kbd className="px-1.5 py-0.5 bg-white/10 text-white font-mono text-xs rounded-none">Cmd + V</kbd>), then click <strong>Import</strong>. Your webpage will appear on the canvas with editable text, vectors, and auto-layout.
        </p>

        <ScreenshotSlot
          src="/images/webpage-to-figma/step-4.png"
          alt="Step 4: Click Import in the Figma plugin"
          stepNumber="STEP 04"
          clickTarget="&quot;Import&quot; button in the plugin modal"
          whatToCapture="Show the plugin window inside Figma with the paste box and the 'Import' button."
        />

        {/* ── Screenshots Folder Reference ───────────────────────────── */}
        <h2 id="screenshots-folder">Screenshots Folder</h2>
        <p className="text-sm text-white/70">
          Drop your screenshots into this folder:
        </p>

        <div className="not-prose my-4 p-3 border border-white/15 bg-white/[0.02] font-mono text-xs text-white/80 flex items-center gap-2 rounded-none">
          <FolderOpen className="w-4 h-4 text-[#CBA6F7] shrink-0" />
          <span>public/images/webpage-to-figma/</span>
        </div>

        <div className="not-prose my-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-white/10 rounded-none font-mono">
            <thead>
              <tr className="border-b border-white/15 bg-white/5 text-white/60">
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3">What to show in the screenshot</th>
                <th className="py-2.5 px-3">Where to click</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/70">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#CBA6F7]">step-1.png</td>
                <td className="py-2.5 px-3">Webpage with extension icon opened</td>
                <td className="py-2.5 px-3 text-white/90">Extension icon in toolbar</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#CBA6F7]">step-2.png</td>
                <td className="py-2.5 px-3">Extension popup with capture complete</td>
                <td className="py-2.5 px-3 text-white/90">&quot;Copy for Figma&quot; button</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#CBA6F7]">step-3.png</td>
                <td className="py-2.5 px-3">Figma plugins search list</td>
                <td className="py-2.5 px-3 text-white/90">&quot;Run&quot; button</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#CBA6F7]">step-4.png</td>
                <td className="py-2.5 px-3">Plugin modal with paste box &amp; imported layers</td>
                <td className="py-2.5 px-3 text-white/90">&quot;Import&quot; button</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Privacy & Permissions ───────────────────────────────────── */}
        <h2 id="privacy-security">Privacy &amp; Permissions</h2>
        <p className="text-sm text-white/70">
          The Webpage to Figma extension runs 100% client-side in your local browser. It does not send your data, telemetry, DOM structures, or generated designs to any external servers or third-party networks.
        </p>

        <div className="not-prose my-6 p-4 border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Full Privacy Policy &amp; Permissions Justification</h4>
              <p className="text-xs text-white/60">
                Review our zero-telemetry architecture and Chrome Web Store permission disclosures.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors shrink-0"
          >
            <span>Read Privacy Policy</span>
            <span className="text-[#CBA6F7]">→</span>
          </Link>
        </div>

        {/* ── Bottom Nav ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-12 not-prose">
          <Link
            href="/docs/dev-tools"
            className="border border-white/10 bg-white/[0.02] px-3.5 py-2 hover:bg-white/[0.05] transition-all text-left rounded-none font-mono text-xs text-white/70"
          >
            ← Dev Tools
          </Link>

          <Link
            href="/docs/apis"
            className="border border-white/10 bg-white/[0.02] px-3.5 py-2 hover:bg-white/[0.05] transition-all text-right ms-auto rounded-none font-mono text-xs text-white/70"
          >
            APIs →
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
