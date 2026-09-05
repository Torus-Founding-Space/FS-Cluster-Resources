#!/usr/bin/env node

/**
 * cluster-loaders CLI
 * Powered by FS Cluster & Torus-FS
 *
 * `cluster-loaders add <id>` copies the real source for that loader out of the
 * installed package, so what you get is exactly what the docs site renders.
 * Nothing here re-implements a loader. The templates below only wire the
 * copied sources together.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { curveById, curves } from './dist/registry.mjs';

const PKG_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(PKG_ROOT, 'src');

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/** Canvas-backed loaders ship a dedicated renderer component. */
const RENDERER_SOURCES = {
  'voronoi': 'VoronoiPulseCanvas.tsx',
  'winding-spiral': 'geometry-loaders/WindingSpiralCanvas.tsx',
  'cymatics-ripple': 'geometry-loaders/CymaticsRippleCanvas.tsx',
  'gear-train': 'geometry-loaders/GearTrainCanvas.tsx',
  'sand-timer': 'particle-loaders/SandTimerCanvas.tsx',
  'stochastic-static': 'particle-loaders/StochasticStaticCanvas.tsx',
  'breathing-ring': 'motion-loaders/BreathingRingCanvas.tsx',
  'noise-blob': 'motion-loaders/NoiseBlobCanvas.tsx',
  'lorenz': 'motion-loaders/LorenzCanvas.tsx',
  'topographic-contour': 'spatial-loaders/TopographicContourCanvas.tsx',
  'gravity-well': 'spatial-loaders/GravityWellCanvas.tsx',
  'braided-helix': 'spatial-loaders/BraidedHelixCanvas.tsx',
  'phase-transition': 'spatial-loaders/PhaseTransitionCanvas.tsx',
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const command = positional[0];
const requestedId = positional[1];
const force = flags.has('--force');

console.log(`\n${c.cyan}cluster-loaders${c.reset} - Powered by ${c.magenta}FS Cluster & Torus-FS${c.reset}\n`);

/* ── helpers ─────────────────────────────────────────────────────────── */

function pascalCase(id) {
  return id.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

function readPackageSource(relativePath) {
  const file = path.join(SRC, relativePath);
  if (!fs.existsSync(file)) {
    console.error(`${c.red}Internal error:${c.reset} missing packaged source ${relativePath}.`);
    console.error(`Please report this at https://github.com/Torus-Founding-Space/FS-Cluster-Resources/issues\n`);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf-8');
}

/** Docs-only metadata that would just be noise in a consumer's project. */
const OMITTED_KEYS = new Set(['point', 'codeSnippet', 'mathFormula']);

/** Serialises a preset back to TypeScript source, `point()` included. */
function serializeConfig(curve) {
  const entries = [];
  for (const [key, value] of Object.entries(curve)) {
    if (OMITTED_KEYS.has(key)) continue;
    entries.push(`  ${key}: ${JSON.stringify(value)},`);
  }
  // `point` is a method, so its own source is already `point(...) { ... }`.
  const point = curve.point.toString().trim();
  entries.push(`  ${point.startsWith('point') ? point : `point: ${point}`},`);
  return `{\n${entries.join('\n')}\n}`;
}

/** The preset's maths, rendered as a comment block above its config. */
function formulaComment(curve) {
  if (!curve.mathFormula?.length) return '';
  return curve.mathFormula.map((line) => `// ${line}`).join(String.fromCharCode(10)) + String.fromCharCode(10);
}

function listLoaders() {
  const width = Math.max(...curves.map((curve) => curve.id.length));
  const groups = new Map();
  for (const curve of curves) {
    const group = curve.category ?? 'parametric';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(curve);
  }
  for (const [group, items] of groups) {
    console.log(`${c.yellow}${group}${c.reset}`);
    for (const curve of items) {
      const kind = curve.type ? `${c.dim}canvas${c.reset}` : `${c.dim}svg${c.reset}`;
      console.log(`  ${c.green}${curve.id.padEnd(width)}${c.reset}  ${curve.name} ${kind}`);
    }
    console.log('');
  }
}

function usage() {
  console.log(`Usage:`);
  console.log(`  npx cluster-loaders add <loader-id> [--force]`);
  console.log(`  npx cluster-loaders list`);
  console.log(``);
  console.log(`Options:`);
  console.log(`  --force   Overwrite files that already exist`);
  console.log(``);
  console.log(`Available loaders (${curves.length}):\n`);
  listLoaders();
}

/* ── commands ────────────────────────────────────────────────────────── */

if (!command || command === 'help' || flags.has('--help')) {
  usage();
  process.exit(0);
}

if (command === 'list' || command === 'ls') {
  listLoaders();
  process.exit(0);
}

if (command !== 'add') {
  console.error(`${c.red}Unknown command:${c.reset} ${command}\n`);
  usage();
  process.exit(1);
}

if (!requestedId) {
  console.error(`${c.red}Missing loader id.${c.reset} Try: npx cluster-loaders add astroid\n`);
  console.log(`Available loaders (${curves.length}):\n`);
  listLoaders();
  process.exit(1);
}

const curve = curveById(requestedId.toLowerCase());

if (!curve) {
  console.error(`${c.red}Unknown loader:${c.reset} ${requestedId}\n`);
  const near = curves
    .map((item) => item.id)
    .filter((id) => id.includes(requestedId.toLowerCase()) || requestedId.toLowerCase().includes(id));
  if (near.length) console.error(`Did you mean: ${near.map((id) => c.green + id + c.reset).join(', ')}?\n`);
  console.log(`Available loaders (${curves.length}):\n`);
  listLoaders();
  process.exit(1);
}

/* ── write the loader into the consuming project ─────────────────────── */

const cwd = process.cwd();
const hasSrc = fs.existsSync(path.join(cwd, 'src'));
const targetDir = path.join(cwd, ...(hasSrc ? ['src'] : []), 'components', 'ui', 'cluster-loaders');

fs.mkdirSync(targetDir, { recursive: true });

const componentName = `${pascalCase(curve.id)}Loader`;
const rendererSource = RENDERER_SOURCES[curve.type];
const rendererName = rendererSource
  ? path.basename(rendererSource, '.tsx')
  : null;

/**
 * Files to write: [filename, contents, kind].
 *
 * `shared` files are the runtime every loader needs. They are written once
 * and then left alone, so adding a second loader doesn't collide with the
 * first. `owned` files belong to this loader alone and are never silently
 * replaced.
 */
const files = [
  ['useCurveAnimation.ts', readPackageSource('useCurveAnimation.ts'), 'shared'],
];

if (rendererSource) {
  // Canvas loaders need the shared canvas helpers and their renderer, both
  // rewritten to sit flat in one folder.
  files.push(['canvas.ts', readPackageSource('canvas.ts'), 'shared']);
  files.push([
    `${rendererName}.tsx`,
    readPackageSource(rendererSource)
      .replace(/"\.\.\/useCurveAnimation"/g, '"./useCurveAnimation"')
      .replace(/"\.\.\/canvas"/g, '"./canvas"'),
    'owned',
  ]);
}

const configSource = serializeConfig(curve);

if (rendererName) {
  files.push([
    `${componentName}.tsx`,
    `"use client";

import React from "react";
import type { CurveConfig } from "./useCurveAnimation";
import { ${rendererName} } from "./${rendererName}";

// Preset: ${curve.name} (${curve.tag})
${formulaComment(curve)}export const ${curve.id.replace(/-/g, '_')}Config: CurveConfig = ${configSource};

export function ${componentName}({
  isActive = true,
  className = "",
}: {
  isActive?: boolean;
  className?: string;
}) {
  return <${rendererName} config={${curve.id.replace(/-/g, '_')}Config} isActive={isActive} className={className} />;
}
`,
    'owned',
  ]);
} else {
  files.push(['CurveLoader.tsx', `"use client";

import React, { useMemo } from "react";
import { CurveConfig, useCurveAnimation } from "./useCurveAnimation";

export interface CurveLoaderProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function CurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  const { groupRef, pathRef, particlesRef } = useCurveAnimation(config, isActive);

  const setParticle = useMemo(
    () =>
      Array.from({ length: config.particleCount }, (_, index) => (el: SVGCircleElement | null) => {
        particlesRef.current[index] = el;
        return () => {
          particlesRef.current[index] = null;
        };
      }),
    [config.particleCount, particlesRef]
  );

  return (
    <div className={\`flex items-center justify-center \${className}\`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="w-full h-full overflow-visible"
      >
        <g ref={groupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            strokeWidth={(config.strokeWidth || 3.5) * 0.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          {Array.from({ length: config.particleCount }).map((_, i) => (
            <circle key={i} ref={setParticle[i]} fill="currentColor" />
          ))}
        </g>
      </svg>
    </div>
  );
}
`, 'shared']);

  files.push([
    `${componentName}.tsx`,
    `"use client";

import React from "react";
import type { CurveConfig } from "./useCurveAnimation";
import { CurveLoader } from "./CurveLoader";

// Preset: ${curve.name} (${curve.tag})
${formulaComment(curve)}export const ${curve.id.replace(/-/g, '_')}Config: CurveConfig = ${configSource};

export function ${componentName}({
  isActive = true,
  className = "",
}: {
  isActive?: boolean;
  className?: string;
}) {
  return <CurveLoader config={${curve.id.replace(/-/g, '_')}Config} isActive={isActive} className={className} />;
}
`,
    'owned',
  ]);
}

const clash = files.filter(
  ([name, , kind]) => kind === 'owned' && fs.existsSync(path.join(targetDir, name))
);

if (clash.length && !force) {
  console.error(`${c.red}Refusing to overwrite existing files:${c.reset}`);
  for (const [name] of clash) console.error(`  ${path.relative(cwd, path.join(targetDir, name))}`);
  console.error(`
Re-run with ${c.yellow}--force${c.reset} to replace them.
`);
  process.exit(1);
}

const written = [];
const skipped = [];
for (const [name, contents, kind] of files) {
  const target = path.join(targetDir, name);
  if (kind === 'shared' && fs.existsSync(target) && !force) {
    skipped.push(name);
    continue;
  }
  fs.writeFileSync(target, contents, 'utf-8');
  written.push(name);
}

const importBase = hasSrc ? '@/components/ui/cluster-loaders' : './components/ui/cluster-loaders';

console.log(`${c.green}✓${c.reset} Added ${c.green}${curve.name}${c.reset} (${c.dim}${curve.id}${c.reset}) to ${c.blue}${path.relative(cwd, targetDir)}${c.reset}`);
for (const name of written) console.log(`  ${c.dim}·${c.reset} ${name}`);
for (const name of skipped) console.log(`  ${c.dim}· ${name} (already present, kept)${c.reset}`);

console.log(`\nUse it with:\n`);
console.log(`${c.yellow}import { ${componentName} } from "${importBase}/${componentName}";${c.reset}`);
console.log(`${c.yellow}<${componentName} className="w-24 h-24 text-[#CBA6F7]" />${c.reset}\n`);
