import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Lock,
  EyeOff,
  ServerOff,
  Mail,
  ArrowRight,
  KeyRound,
  Layers,
  ArrowLeft,
  FileDown,
  Users,
  Baby,
  RefreshCw,
  Scale,
} from "lucide-react";

const LAST_UPDATED = "6 September 2026";
const CONTACT_EMAIL = "founders@torusfoundingspace.com";

export const metadata: Metadata = {
  title: "Privacy Policy - Webpage to Figma Extension",
  description:
    "Privacy Policy for the Webpage to Figma browser extension. Captures run entirely on your device, the export file is saved locally, and no data is sent to our servers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans">
      {/* ── Breadcrumb / Top Bar ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <Link
          href="/docs/dev-tools/webpage-to-figma"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Extension Docs</span>
        </Link>
        <span className="text-xs font-mono text-white/50">
          Last updated: {LAST_UPDATED}
        </span>
      </div>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 shrink-0 bg-white/5 border border-white/15 p-2 flex items-center justify-center rounded-none">
          <Image
            src="/logos/extension-logo.png"
            alt="Webpage to Figma logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono text-emerald-400">
              Runs on your device
            </span>
            <span className="border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono text-white/60">
              Browser Extension
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Privacy Policy: Webpage to Figma
          </h1>
        </div>
      </div>

      <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-4">
        This policy explains what the Webpage to Figma browser extension can see,
        what it does with it, and where that information can end up. It is written
        to be read, not to be skimmed past.
      </p>

      {/* ── Scope ─────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border border-white/10 bg-white/[0.02] mb-6">
        <p className="text-sm text-white/70 leading-relaxed">
          <span className="text-white font-semibold">What this covers.</span>{" "}
          The Webpage to Figma browser extension, and the companion Webpage to
          Figma plugin that imports its export file inside Figma. Together these
          are called &quot;the Extension&quot; below. &quot;We&quot; means FS Cluster
          and Torus Founding Space, who publish it.
        </p>
      </div>

      {/* ── Summary Box ───────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border border-emerald-500/20 bg-emerald-500/[0.04] mb-10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-white/80 leading-relaxed">
            <span className="font-semibold text-white">In short:</span> the
            capture runs entirely in your browser, the result is saved as a file
            on your own device, and we do not receive it. We run no analytics, no
            trackers, no telemetry, and no server that your captures are sent to.
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            The one thing worth knowing is what happens next: if you import that
            file into Figma, the captured content goes to Figma. Section 5
            explains this.
          </p>
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────────── */}
      <div className="space-y-10 text-white/80">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ServerOff className="w-5 h-5 text-[#CBA6F7]" />
            1. How the Extension is built
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            The Extension runs entirely on your machine. It has no backend. There
            is no account to create, nothing to log in to, and no server of ours
            that your captures, preferences, or usage are sent to. Parsing,
            document building, and file generation all happen inside your browser.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[#CBA6F7]" />
            2. What the Extension accesses
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            To do its job, which is turning a page layout into an editable design
            file, the Extension reads the following, and only when you start a
            capture:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-4 border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <Layers className="w-4 h-4 text-[#CBA6F7]" />
                <span className="font-mono text-xs">Page content</span>
              </div>
              <p className="text-white/70 text-sm">
                The active tab&apos;s Document Object Model, computed CSS styles,
                visible text, images, and SVG elements. If the page you capture
                shows personal or confidential information, that information is
                part of the capture, because the capture is a picture of the page
                as rendered. Only pages you explicitly capture are read.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <HardDrive className="w-4 h-4 text-[#CBA6F7]" />
                <span className="font-mono text-xs">Your preferences</span>
              </div>
              <p className="text-white/70 text-sm">
                Capture settings you choose are kept in your browser&apos;s local
                extension storage so they persist between sessions. They stay in
                your browser.
              </p>
            </div>

            <div className="p-4 border border-emerald-500/20 bg-emerald-500/[0.04]">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-mono text-xs">What it never collects</span>
              </div>
              <p className="text-white/80 text-sm">
                No names, email addresses, browsing history, keystrokes, IP
                addresses, payment details, or cookies. The Extension does not
                watch pages in the background and does not record where you go.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileDown className="w-5 h-5 text-[#CBA6F7]" />
            3. What happens to a capture
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            The captured content is parsed and compressed into a{" "}
            <code className="text-[#CBA6F7] bg-white/5 px-1 py-0.5 border border-white/10 font-mono text-xs">
              .kn
            </code>{" "}
            file, which is downloaded to your device through your browser&apos;s
            normal download mechanism. It is saved wherever your browser saves
            downloads. That file is yours. It is not uploaded, mirrored, logged,
            or copied to us at any point.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#CBA6F7]" />
            4. What we do not do
          </h2>
          <div className="space-y-2 pt-1">
            {[
              "We do not sell, rent, or trade your data.",
              "We do not use your data or captured page content for advertising, profiling, or creditworthiness decisions.",
              "We do not transfer your data to third parties, except as described in section 5, which you control.",
              "We do not execute remote or dynamically fetched code at runtime.",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-3 p-3.5 border border-white/10 bg-white/[0.02]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">{line}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#CBA6F7]" />
            5. Figma, and the one time data leaves your device
          </h2>
          <div className="p-4 border border-[#CBA6F7]/25 bg-[#CBA6F7]/[0.05] space-y-2.5">
            <p className="text-sm text-white/80 leading-relaxed">
              The Extension writes a file to your device and stops there. It does
              not send that file anywhere.
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              The file exists to be imported into the companion plugin inside
              Figma. When you choose to import it, the captured page content is
              read by that plugin and becomes part of your Figma document, which
              Figma stores on its servers under your Figma account. You start that
              transfer, not us, and once the content is in Figma it is governed by{" "}
              <a
                href="https://www.figma.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CBA6F7] underline underline-offset-4 hover:text-white transition-colors"
              >
                Figma&apos;s Privacy Policy
              </a>{" "}
              and terms, not this one.
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              If you never import the file, the captured content never leaves your
              device. If you capture a page containing sensitive information, this
              is the step to think about before taking it.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#CBA6F7]" />
            6. Retention
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            We operate no server that receives your data, so there is nothing on
            our side to retain, and nothing for us to delete on request. Export
            files stay on your device until you delete them. Saved preferences
            stay in your browser until you clear them or uninstall the Extension,
            which removes them.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#CBA6F7]" />
            7. Permissions, and why each one is needed
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            The Extension requests the smallest set of permissions that lets a
            capture work:
          </p>
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 text-white/60 font-mono">
                  <th className="py-2.5 px-3">Permission</th>
                  <th className="py-2.5 px-3">Why it is requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                <tr>
                  <td className="py-3 px-3 align-top font-semibold text-[#CBA6F7] font-mono">
                    <code>activeTab</code>, <code>scripting</code>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/70">
                    To read and parse the visual structure of the page you are on,
                    and only after you start a capture.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 align-top font-semibold text-[#CBA6F7] font-mono">
                    <code>downloads</code>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/70">
                    To save the resulting{" "}
                    <code className="font-mono text-[11px]">.kn</code> export file
                    to your device.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 align-top font-semibold text-[#CBA6F7] font-mono">
                    <code>storage</code>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/70">
                    To remember your capture preferences between sessions.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 align-top font-semibold text-[#CBA6F7] font-mono">
                    <code>&lt;all_urls&gt;</code>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/70">
                    Broad by necessity, because a capture can be run on any site
                    you choose, including localhost. It is also used to fetch
                    images the page loads from another domain, which browser CORS
                    rules otherwise block from being read into the export. It is
                    not used to browse, monitor, or read sites in the background.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#CBA6F7]" />
            8. Your rights
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            If you are in the EEA, the UK, California, or another place with data
            protection rights, those rights apply to any personal data we hold
            about you. In practice we hold none from your use of the Extension,
            because none reaches us. The only personal data we are ever likely to
            have is an email you send us. You can ask us to delete that at any
            time using the address below.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-[#CBA6F7]" />
            9. Children
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            The Extension is a tool for developers and designers. It is not
            directed at children, and we do not knowingly collect personal data
            from anyone, children included.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#CBA6F7]" />
            10. Changes to this policy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            If this policy changes, the revised version is published at this same
            address and the &quot;Last updated&quot; date at the top changes with
            it. If a change materially affects how your data is handled, we will
            say so in the extension&apos;s store listing too. This page is the
            authoritative version.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#CBA6F7]" />
            11. Contact
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">
            Questions about this policy, or about anything the Extension does, can
            go to:
          </p>
          <div className="p-4 border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 border border-white/10 bg-white/5 text-[#CBA6F7]">
                <Mail className="w-4 h-4" />
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm sm:text-base font-mono text-white hover:text-[#CBA6F7] underline underline-offset-4 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors self-start sm:self-auto"
            >
              Send email
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/docs/dev-tools/webpage-to-figma"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#CBA6F7] hover:underline"
        >
          <span>View Webpage to Figma documentation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-xs font-mono text-white/40">
          © 2026 Torus Founding Space, FS Cluster
        </span>
      </div>
    </div>
  );
}
