"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { CurveLoader } from "@/components/CurveLoader";
import { curves } from "@/curves";
import type { CurveConfig } from "@/hooks/useCurveAnimation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ─── Dynamic Code Generator (using secondary color #CBA6F7) ────────────── */

function generateCode(curve: CurveConfig): string {
  const coreProps: Record<string, any> = {
    name: curve.name,
  };

  if (curve.type) coreProps.type = curve.type;
  coreProps.rotate = curve.rotate;
  coreProps.particleCount = curve.particleCount;
  coreProps.trailSpan = Number(curve.trailSpan.toFixed(2));
  coreProps.durationMs = curve.durationMs;
  coreProps.strokeWidth = curve.strokeWidth;
  if (curve.pulseDurationMs !== undefined) coreProps.pulseDurationMs = curve.pulseDurationMs;
  if (curve.pulseAmp !== undefined) coreProps.pulseAmp = curve.pulseAmp;

  if (curve.baseRadius !== undefined) coreProps.baseRadius = curve.baseRadius;
  if (curve.detailAmplitude !== undefined) coreProps.detailAmplitude = curve.detailAmplitude;
  if (curve.petalCount !== undefined) coreProps.petalCount = curve.petalCount;
  if (curve.curveScale !== undefined) coreProps.curveScale = curve.curveScale;
  if (curve.a !== undefined) coreProps.a = curve.a;
  if (curve.b !== undefined) coreProps.b = curve.b;
  if (curve.r !== undefined) coreProps.r = curve.r;
  if (curve.k !== undefined) coreProps.k = curve.k;
  if (curve.c !== undefined) coreProps.c = curve.c;
  if (curve.ra !== undefined) coreProps.ra = curve.ra;
  if (curve.rm !== undefined) coreProps.rm = curve.rm;
  if (curve.r1 !== undefined) coreProps.r1 = curve.r1;
  if (curve.r2 !== undefined) coreProps.r2 = curve.r2;
  if (curve.r3 !== undefined) coreProps.r3 = curve.r3;
  if (curve.waveAmp !== undefined) coreProps.waveAmp = curve.waveAmp;
  if (curve.waveFreq !== undefined) coreProps.waveFreq = curve.waveFreq;
  if (curve.freq !== undefined) coreProps.freq = curve.freq;

  const propsFormatted = Object.entries(coreProps)
    .map(([k, v]) => `  ${k}: ${typeof v === "string" && !v.startsWith("Math.") ? `"${v}"` : v},`)
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

/* ─── Viewport hook — pauses animation when card is off-screen ────────── */

function useInViewport(rootMargin = "100px") {
  const ref = useRef<HTMLDivElement | null>(null);
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
  const [copied, setCopied] = useState(false);
  const { ref: cardRef, inView } = useInViewport("120px");

  const updateParam = (key: string, val: any) => {
    setActiveConfig((prev) => ({ ...prev, [key]: val }));
  };

  const [activeTab, setActiveTab] = useState<"cli" | "npm" | "code">("cli");

  const loaderId = activeConfig.type || activeConfig.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cliSnippet = `npx cluster-loaders add ${loaderId}`;
  const npmSnippet = `import { CurveLoader, curves } from "cluster-loaders";\n\nexport default function ${activeConfig.name.replace(/[^a-zA-Z0-9]/g, "")}Loader() {\n  const config = curves.find((c) => c.name === "${activeConfig.name}");\n  return (\n    <div className="w-24 h-24 text-[#CBA6F7]">\n      <CurveLoader config={config} />\n    </div>\n  );\n}`;
  const customSnippet = useMemo(() => generateCode(activeConfig), [activeConfig]);

  const activeSnippet = activeTab === "cli" ? cliSnippet : activeTab === "npm" ? npmSnippet : customSnippet;

  function copy() {
    navigator.clipboard.writeText(activeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const [cardCliCopied, setCardCliCopied] = useState(false);

  function copyCardCli(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(cliSnippet).then(() => {
      setCardCliCopied(true);
      setTimeout(() => setCardCliCopied(false), 2000);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={cardRef} className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-[#CBA6F7]/50 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
          {/* Loader preview box — only active when in viewport */}
          <div className="flex justify-center items-center py-7 mb-3 rounded-xl bg-black/40 border border-white/[0.04] group-hover:border-[#CBA6F7]/30 transition-colors">
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

          {/* Instant CLI copy bar on card */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
            <code className="text-[11px] font-mono text-[#CBA6F7]/80 truncate bg-black/50 px-2.5 py-1.5 rounded-lg border border-[#CBA6F7]/20 flex-1">
              npx cluster-loaders add {loaderId}
            </code>
            <button
              onClick={copyCardCli}
              className="px-2.5 py-1.5 text-[11px] font-mono font-medium rounded-lg bg-[#CBA6F7]/15 text-[#CBA6F7] hover:bg-[#CBA6F7]/30 border border-[#CBA6F7]/30 transition-all shrink-0 cursor-pointer"
            >
              {cardCliCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-[#0c1017] border border-white/10 p-6 sm:p-8 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-white">{activeConfig.name}</DialogTitle>
              <p className="text-xs font-mono text-[#CBA6F7] uppercase tracking-wider mt-0.5">{activeConfig.tag}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Top Horizontal Section: Preview (left) + Dynamic Shape Controls Grid (right) */}
          <div className="flex flex-col md:flex-row gap-5 items-stretch">
            {/* Live Preview Box with subtle formula */}
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

            {/* Dynamic Controls Grid - switches per curve! */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl items-center">
              <SimpleSlider
                label={
                  activeConfig.type === "sand-timer"
                    ? "Sand Grains"
                    : activeConfig.type === "voronoi"
                    ? "Seed Points"
                    : activeConfig.type === "reaction-web"
                    ? "Web Nodes"
                    : "Particles"
                }
                value={activeConfig.particleCount}
                min={
                  activeConfig.type === "sand-timer"
                    ? 40
                    : activeConfig.type === "voronoi"
                    ? 4
                    : activeConfig.type === "reaction-web"
                    ? 10
                    : 10
                }
                max={
                  activeConfig.type === "sand-timer"
                    ? 300
                    : activeConfig.type === "voronoi"
                    ? 20
                    : activeConfig.type === "reaction-web"
                    ? 30
                    : 150
                }
                step={activeConfig.type === "sand-timer" ? 10 : 1}
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
              {!activeConfig.category && activeConfig.type !== "voronoi" && (
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

              {activeConfig.pulseAmp !== undefined && (
                <SimpleSlider
                  label="Pulse Amp"
                  value={Number(activeConfig.pulseAmp.toFixed(2))}
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  onChange={(val) => updateParam("pulseAmp", val)}
                />
              )}

              {/* Curve-specific dynamic controls */}
              {activeConfig.a !== undefined && (
                <SimpleSlider
                  label={activeConfig.b !== undefined ? "Param (a)" : "Size (a)"}
                  value={activeConfig.a}
                  min={5}
                  max={60}
                  step={1}
                  onChange={(val) => updateParam("a", val)}
                />
              )}
              {activeConfig.b !== undefined && (
                <SimpleSlider
                  label="Param (b)"
                  value={activeConfig.b}
                  min={1}
                  max={30}
                  step={1}
                  onChange={(val) => updateParam("b", val)}
                />
              )}
              {activeConfig.r !== undefined && (
                <SimpleSlider
                  label="Radius (r)"
                  value={activeConfig.r}
                  min={4}
                  max={30}
                  step={1}
                  onChange={(val) => updateParam("r", val)}
                />
              )}
              {activeConfig.ra !== undefined && (
                <SimpleSlider
                  label="Attractor Orbit (Ra)"
                  value={activeConfig.ra}
                  min={10}
                  max={45}
                  step={1}
                  onChange={(val) => updateParam("ra", val)}
                />
              )}
              {activeConfig.rm !== undefined && (
                <SimpleSlider
                  label="Magnetic Radius (Rm)"
                  value={activeConfig.rm}
                  min={4}
                  max={25}
                  step={1}
                  onChange={(val) => updateParam("rm", val)}
                />
              )}
              {activeConfig.k !== undefined && (
                <SimpleSlider
                  label="Stiffness / Ratio (k)"
                  value={activeConfig.k}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(val) => updateParam("k", val)}
                />
              )}
              {activeConfig.c !== undefined && (
                <SimpleSlider
                  label="Damping (c)"
                  value={activeConfig.c}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  onChange={(val) => updateParam("c", val)}
                />
              )}
              {activeConfig.waveAmp !== undefined && (
                <SimpleSlider
                  label="Fluid Wave Amplitude"
                  value={activeConfig.waveAmp}
                  min={1}
                  max={15}
                  step={1}
                  onChange={(val) => updateParam("waveAmp", val)}
                />
              )}
              {activeConfig.r1 !== undefined && (
                <SimpleSlider
                  label="Orbit Radius 1 (r1)"
                  value={activeConfig.r1}
                  min={5}
                  max={35}
                  step={1}
                  onChange={(val) => updateParam("r1", val)}
                />
              )}
              {activeConfig.r2 !== undefined && (
                <SimpleSlider
                  label="Orbit Radius 2 (r2)"
                  value={activeConfig.r2}
                  min={2}
                  max={25}
                  step={1}
                  onChange={(val) => updateParam("r2", val)}
                />
              )}
              {activeConfig.r3 !== undefined && (
                <SimpleSlider
                  label="Orbit Radius 3 (r3)"
                  value={activeConfig.r3}
                  min={1}
                  max={15}
                  step={1}
                  onChange={(val) => updateParam("r3", val)}
                />
              )}
            </div>
          </div>

          {/* Bottom Section: Code Snippets & Command Tabs (CLI / NPM / Standalone) */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-black/70 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("cli")}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === "cli"
                      ? "bg-[#CBA6F7]/20 text-[#CBA6F7] border border-[#CBA6F7]/30"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  npx CLI
                </button>
                <button
                  onClick={() => setActiveTab("npm")}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === "npm"
                      ? "bg-[#CBA6F7]/20 text-[#CBA6F7] border border-[#CBA6F7]/30"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  NPM Import
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === "code"
                      ? "bg-[#CBA6F7]/20 text-[#CBA6F7] border border-[#CBA6F7]/30"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  Standalone Code
                </button>
              </div>

              <button
                onClick={copy}
                className="px-3 py-1 text-xs font-medium rounded-md bg-[#CBA6F7]/20 text-[#CBA6F7] hover:bg-[#CBA6F7]/30 border border-[#CBA6F7]/30 transition-all cursor-pointer"
              >
                {copied ? "Copied!" : "Copy Command"}
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

export function LoadersGallery() {
  const parametricCurves = curves.filter(
    (c) => !c.category && c.type !== "voronoi"
  );
  const geometryLoaders = curves.filter(
    (c) => c.category === "geometry"
  );
  const particleLoaders = curves.filter(
    (c) => c.category === "particles" || c.type === "voronoi"
  );
  const motionLoaders = curves.filter(
    (c) => c.category === "motion"
  );
  const spatialLoaders = curves.filter(
    (c) => c.category === "spatial"
  );

  return (
    <div className="space-y-10 not-prose my-6">
      {/* Simple / Parametric Curves Section */}
      <div className="mb-5">
        <h3 id="parametric-curves" className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]"></span>
          Parametric Curves
        </h3>
        <p className="text-xs text-white/50 mt-1">
          Fundamental 2D parametric mathematical curves : astroids, epicycloids, rose petals, and Lissajous figures.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parametricCurves.map((curve) => (
          <LoaderCard key={curve.name} curve={curve} />
        ))}
      </div>

      {/* Motion & Physics Section */}
      <div className="pt-8 border-t border-white/[0.08]">
        <div className="mb-5">
          <h3 id="motion" className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]"></span>
            Motion & Waves
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Wave equations, chaos attractors, multi-arm epicycles, and continuous organic motion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motionLoaders.map((curve) => (
            <LoaderCard key={curve.name} curve={curve} />
          ))}
        </div>
      </div>

      {/* Spatial Section */}
      <div className="pt-8 border-t border-white/[0.08]">
        <div className="mb-5">
          <h3 id="spatial" className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]"></span>
            3D & Spatial
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Topographic heightfield contours, spacetime gravity wells, braided 3D helixes, and spin phase transitions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spatialLoaders.map((curve) => (
            <LoaderCard key={curve.name} curve={curve} />
          ))}
        </div>
      </div>

      {/* Geometry Section */}
      <div className="pt-8 border-t border-white/[0.08]">
        <div className="mb-5">
          <h3 id="geometry" className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]"></span>
            Geometry Loaders
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Mathematically precise geometric forms : spirals, standing waves, sonar sweeps, and real gear tooth profiles.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {geometryLoaders.map((curve) => (
            <LoaderCard key={curve.name} curve={curve} />
          ))}
        </div>
      </div>

      {/* Particle & Field Loaders Section */}
      <div className="pt-8 border-t border-white/[0.08]">
        <div className="mb-5">
          <h3 id="particles" className="text-lg font-semibold text-white flex items-center gap-2.5 scroll-mt-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CBA6F7]"></span>
            Particle Systems
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Dynamic particle fields, organic tessellations, and reaction-diffusion simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {particleLoaders.map((curve) => (
            <LoaderCard key={curve.name} curve={curve} />
          ))}
        </div>
      </div>
    </div>
  );
}


