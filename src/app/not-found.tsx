import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-start px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-[#CBA6F7]">
        404
      </p>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 text-white/50">
        The link may be out of date, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="border border-[#CBA6F7]/40 bg-[#CBA6F7]/15 px-4 py-2.5 text-sm font-medium text-[#CBA6F7] transition-colors hover:bg-[#CBA6F7]/25"
        >
          Back home
        </Link>
        <Link
          href="/docs"
          className="border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
        >
          Browse the docs
        </Link>
      </div>
    </main>
  );
}
