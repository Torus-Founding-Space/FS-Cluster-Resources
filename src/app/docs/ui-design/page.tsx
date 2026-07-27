import Link from 'next/link';

export default function UiDesignPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary tracking-widest uppercase mb-8">
        UI &amp; Design
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">UI &amp; Design</h1>
      <p className="text-white/50 text-lg leading-relaxed mb-12">
        A curated collection of open-source UI components and design tools built for modern startups.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/docs/math-loaders"
          className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 group"
        >
          <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90">
            cluster-loaders
          </h2>
          <p className="text-sm text-white/40 leading-relaxed">
            Minimalist loading animations built from mathematical curves with React &amp; SVG.
          </p>
        </Link>
      </div>
    </div>
  );
}
