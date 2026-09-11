"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { CurveLoader } from "@/components/CurveLoader";
import { curves } from "@/curves";
import type { CurveConfig, CurveParams } from "@/hooks/useCurveAnimation";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ─── Shape parameter controls ───────────────────────────────────────────
   Declared once and driven off whatever the active curve actually defines,
   so a curve automatically gets a slider for each parameter it uses, and
   never gets one for a parameter it doesn't.                              */

type ParamKey = keyof CurveParams;

interface ParamControl {
  label: string;
  min: number;
  max: number;
  step?: number;
}

const PARAM_CONTROLS: Partial<Record<ParamKey, ParamControl>> = {
  a: { label: "Param (a)", min: 5, max: 60 },
  b: { label: "Param (b)", min: 1, max: 30 },
  c: { label: "Damping (c)", min: 0.1, max: 3, step: 0.1 },
  k: { label: "Stiffness / Ratio (k)", min: 1, max: 10 },
  m: { label: "Symmetry (m)", min: 1, max: 16 },
  n: { label: "Order (n)", min: 1, max: 12 },
  n1: { label: "Exponent (n1)", min: 0.2, max: 6, step: 0.1 },
  n2: { label: "Exponent (n2)", min: 0.2, max: 6, step: 0.1 },
  n3: { label: "Exponent (n3)", min: 0.2, max: 6, step: 0.1 },
  r: { label: "Radius (r)", min: 4, max: 30 },
  r1: { label: "Orbit Radius 1 (r1)", min: 5, max: 35 },
  r2: { label: "Orbit Radius 2 (r2)", min: 2, max: 25 },
  r3: { label: "Orbit Radius 3 (r3)", min: 1, max: 15 },
  ra: { label: "Attractor Orbit (Ra)", min: 10, max: 45 },
  rb: { label: "Rolling Radius (Rb)", min: 2, max: 25 },
  rm: { label: "Magnetic Radius (Rm)", min: 4, max: 25 },
  s: { label: "Scale (s)", min: 1, max: 40 },
  baseRadius: { label: "Base Radius", min: 8, max: 45 },
  detailAmplitude: { label: "Detail Amplitude", min: 0, max: 20 },
  freq: { label: "Frequency", min: 1, max: 20 },
  petalCount: { label: "Petals", min: 2, max: 16 },
  pulseAmp: { label: "Pulse Amp", min: 0.1, max: 0.8, step: 0.05 },
  spikes: { label: "Spikes", min: 2, max: 24 },
  waveAmp: { label: "Fluid Wave Amplitude", min: 1, max: 15 },
  waveFreq: { label: "Wave Frequency", min: 1, max: 20 },
};

const PARAM_ORDER = Object.keys(PARAM_CONTROLS) as ParamKey[];

/** Particle-count slider bounds, which mean different things per loader type. */
const PARTICLE_CONTROL: Record<string, ParamControl> = {
  "sand-timer": { label: "Sand Grains", min: 40, max: 300, step: 10 },
  voronoi: { label: "Seed Points", min: 4, max: 20 },
  default: { label: "Particles", min: 10, max: 150 },
};

function particleControl(config: CurveConfig): ParamControl {
  return (config.type && PARTICLE_CONTROL[config.type]) || PARTICLE_CONTROL.default;
}

function activeParams(config: CurveConfig): ParamKey[] {
  return PARAM_ORDER.filter((key) => typeof config[key] === "number");
}

/* ─── Dynamic Code Generator (using secondary color #CBA6F7) ────────────── */

function generateCode(curve: CurveConfig): string {
  const coreProps: Record<string, string | number | boolean> = { name: curve.name };

  if (curve.type) coreProps.type = curve.type;
  coreProps.rotate = curve.rotate;
  coreProps.particleCount = curve.particleCount;
  coreProps.trailSpan = Number(curve.trailSpan.toFixed(2));
  coreProps.durationMs = curve.durationMs;
  coreProps.strokeWidth = curve.strokeWidth;
  if (curve.pulseDurationMs !== undefined) coreProps.pulseDurationMs = curve.pulseDurationMs;

  for (const key of activeParams(curve)) {
    coreProps[key] = curve[key] as number;
  }

  const propsFormatted = Object.entries(coreProps)
    .map(([k, v]) => `  ${k}: ${typeof v === "string" ? `"${v}"` : v},`)
    .join("\n");

  const defaultPoint = `  point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const a = config.a * detailScale;
    const b = config.b * detailScale;
    const x = (a - b) * Math.cos(t) + b * Math.cos(((a - b) / b) * t);
    const y = (a - b) * Math.sin(t) - b * Math.sin(((a - b) / b) * t);
    return { x: 50 + x, y: 50 + y };
  }`;

  return `"use client";
import React from "react";
import { CurveLoader } from "@/components/CurveLoader";

const config = {
${propsFormatted}

${curve.codeSnippet ? `  ${curve.codeSnippet}` : defaultPoint}
};

export default function MyLoader() {
  return (
    <div className="w-28 h-28 text-[#CBA6F7]">
      <CurveLoader config={config} />
    </div>
  );
}`;
}

/* ─── Simple Slider Input ────────────────────────────────────────────── */

function SimpleSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-white/70">
        <span>{label}</span>
        <span className="font-mono text-[#CBA6F7]">{value}{unit}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#CBA6F7]"
      />
    </div>
  );
}

/* ─── Viewport hook: pauses animation when card is off-screen ────────── */

function useInViewport(rootMargin = "100px") {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true); // SSR / old browser fallback
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/* ─── Single Loader Card & Dynamic Curve Customizer Modal ────────────── */

function LoaderCard({ curve }: { curve: CurveConfig }) {
  const [activeConfig, setActiveConfig] = useState<CurveConfig>(curve);
  const { ref: cardRef, inView } = useInViewport("120px");
  const { copy, isCopied } = useCopyToClipboard();

  const updateParam = (key: string, val: number) => {
    setActiveConfig((prev) => ({ ...prev, [key]: val }));
  };

  const [activeTab, setActiveTab] = useState<"cli" | "npm" | "code">("cli");

  const cliSnippet = `npx cluster-loaders add ${curve.id}`;
  const npmSnippet = `import { CurveLoader, curves } from "cluster-loaders";

export default function ${activeConfig.name.replace(/[^a-zA-Z0-9]/g, "")}Loader() {
  const config = curves.find((c) => c.id === "${curve.id}")!;
  return (
    <div className="w-24 h-24 text-[#CBA6F7]">
      <CurveLoader config={config} />
    </div>
  );
}`;
  const customSnippet = useMemo(() => generateCode(activeConfig), [activeConfig]);

  const activeSnippet =
    activeTab === "cli" ? cliSnippet : activeTab === "npm" ? npmSnippet : customSnippet;

  const particles = particleControl(activeConfig);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* A real button: the card opens a dialog, so it has to be reachable
            and operable from the keyboard. */}
        <button
          ref={cardRef}
          type="button"
          aria-label={`Customize the ${curve.name} loader`}
          className="group flex flex-col text-left rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-[#CBA6F7]/50 hover:bg-white/[0.04] focus-visible:border-[#CBA6F7]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CBA6F7]/60 transition-all duration-300 cursor-pointer"
        >
          {/* Loader preview box, only animates while in the viewport */}
          <div className="flex justify-center items-center py-7 mb-3 rounded-xl bg-black/40 border border-white/[0.04] group-hover:border-[#CBA6F7]/30 transition-colors w-full">
            <div className="w-28 h-28 text-[#CBA6F7] group-hover:scale-105 transition-transform duration-300">
              <CurveLoader config={curve} isActive={inView} />
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-[#CBA6F7] transition-colors">
              {curve.name}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">{curve.tag}</p>
          </div>

          {/* Instant CLI copy bar on the card */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 w-full">
            <code className="text-[11px] font-mono text-[#CBA6F7]/80 truncate bg-black/50 px-2.5 py-1.5 rounded-lg border border-[#CBA6F7]/20 flex-1 min-w-0 text-left">
              {cliSnippet}
            </code>
            {/* A nested <button> inside the dialog trigger would be invalid
                HTML, so this is a span with an explicit button role. */}
            <span
              role="button"
              tabIndex={0}
              aria-label={`Copy the install command for ${curve.name}`}
              onClick={(e) => {
                e.stopPropagation();
                void copy(cliSnippet, "card-cli");
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                e.stopPropagation();
                void copy(cliSnippet, "card-cli");
              }}
              className="px-2.5 py-1.5 text-[11px] font-mono font-medium rounded-lg bg-[#CBA6F7]/15 text-[#CBA6F7] hover:bg-[#CBA6F7]/30 border border-[#CBA6F7]/30 transition-all shrink-0 cursor-pointer select-none"
            >
              {isCopied("card-cli") ? "Copied!" : "Copy"}
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl bg-[#0c1017] border border-white/10 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {activeConfig.name}
          </DialogTitle>
          <DialogDescription className="text-xs font-mono text-[#CBA6F7] uppercase tracking-wider mt-0.5">
            {activeConfig.tag}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Preview (left) + dynamic shape controls (right) */}
          <div className="flex flex-col md:flex-row gap-5 items-stretch">
            <div className="w-full md:w-48 h-48 bg-black/60 border border-white/10 rounded-xl flex flex-col items-center justify-center shrink-0 p-4 relative overflow-hidden">
              <div className="w-32 h-32 text-[#CBA6F7]">
                <CurveLoader config={activeConfig} />
              </div>
              {activeConfig.mathFormula && (
                <span className="absolute bottom-2 text-[9px] font-mono text-white/20 truncate px-2 max-w-full">
                  {activeConfig.mathFormula[0]}
                </span>
              )}
            </div>

            {/* Controls are generated from the curve's own parameters */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl items-center">
              <SimpleSlider
                label={particles.label}
                value={activeConfig.particleCount}
                min={particles.min}
                max={particles.max}
                step={particles.step ?? 1}
                onChange={(val) => updateParam("particleCount", val)}
              />
              <SimpleSlider
                label="Speed"
                value={Number((activeConfig.durationMs / 1000).toFixed(1))}
                min={1}
                max={12}
                step={0.2}
                unit="s"
                onChange={(val) => updateParam("durationMs", Math.round(val * 1000))}
              />
              {!activeConfig.category && (
                <SimpleSlider
                  label="Trail Length"
                  value={Math.round(activeConfig.trailSpan * 100)}
                  min={5}
                  max={80}
                  step={5}
                  unit="%"
                  onChange={(val) => updateParam("trailSpan", val / 100)}
                />
              )}
              <SimpleSlider
                label="Stroke Width"
                value={activeConfig.strokeWidth}
                min={1}
                max={10}
                step={0.5}
                unit="px"
                onChange={(val) => updateParam("strokeWidth", val)}
              />

              {activeParams(activeConfig).map((key) => {
                const control = PARAM_CONTROLS[key]!;
                const value = activeConfig[key] as number;
                return (
                  <SimpleSlider
                    key={key}
                    label={control.label}
                    value={Number(value.toFixed(2))}
                    min={control.min}
                    max={control.max}
                    step={control.step ?? 1}
                    onChange={(val) => updateParam(key, val)}
                  />
                );
              })}
            </div>
          </div>

          {/* Code snippets & command tabs (CLI / NPM / standalone) */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-black/70 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
              <div className="flex items-center gap-2">
                {(
                  [
                    ["cli", "npx CLI"],
                    ["npm", "NPM Import"],
                    ["code", "Standalone Code"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    aria-pressed={activeTab === key}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                      activeTab === key
                        ? "bg-[#CBA6F7]/20 text-[#CBA6F7] border border-[#CBA6F7]/30"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => void copy(activeSnippet, "dialog")}
                className="px-3 py-1 text-xs font-medium rounded-md bg-[#CBA6F7]/20 text-[#CBA6F7] hover:bg-[#CBA6F7]/30 border border-[#CBA6F7]/30 transition-all cursor-pointer"
              >
                {isCopied("dialog") ? "Copied!" : "Copy Command"}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-white/70 overflow-x-auto leading-relaxed max-h-56">
              <code>{activeSnippet}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Exported Loaders Gallery (Categorized) ────────────────────────── */

const SECTIONS: {
  id: string;
  title: string;
  blurb: string;
  match: (c: CurveConfig) => boolean;
}[] = [
  {
    id: "parametric-curves",
    title: "Parametric Curves",
    blurb:
      "Fundamental 2D parametric mathematical curves : astroids, epicycloids, rose petals, and Lissajous figures.",
    match: (c) => !c.category && c.type !== "voronoi",
  },
  {
    id: "motion",
    title: "Motion & Waves",
    blurb:
      "Wave equations, chaos attractors, multi-arm epicycles, and continuous organic motion.",
    match: (c) => c.category === "motion",
  },
  {
    id: "spatial",
    title: "3D & Spatial",
    blurb:
      "Topographic heightfield contours, spacetime gravity wells, braided 3D helixes, and spin phase transitions.",
    match: (c) => c.category === "spatial",
  },
  {
    id: "geometry",
    title: "Geometry Loaders",
    blurb:
      "Mathematically precise geometric forms : spirals, standing waves, sonar sweeps, and real gear tooth profiles.",
    match: (c) => c.category === "geometry",
  },
  {
    id: "particles",
    title: "Particle Systems",
    blurb:
      "Dynamic particle fields, organic tessellations, and reaction-diffusion simulations.",
    match: (c) => c.category === "particles" || c.type === "voronoi",
  },
];

export function LoadersGallery() {
  return (
    <div className="space-y-10 not-prose my-6">
      {SECTIONS.map((section, index) => {
        const items = curves.filter(section.match);
        if (items.length === 0) return null;

        return (
          <section
            key={section.id}
            className={index === 0 ? undefined : "pt-8 border-t border-white/[0.08]"}
          >
            <div className="mb-5">
              <h3
                id={section.id}
                className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]" />
                {section.title}
              </h3>
              <p className="text-xs text-white/50 mt-1">{section.blurb}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((curve) => (
                <LoaderCard key={curve.id} curve={curve} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
