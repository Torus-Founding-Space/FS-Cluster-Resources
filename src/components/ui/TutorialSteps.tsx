"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Code2, Layers } from "lucide-react";

type FrameworkKey = "react" | "vue" | "next" | "svelte" | "vanilla";

interface StepItem {
  id: string;
  number: string;
  title: string;
  description: React.ReactNode;
  codeHeader: string;
  code: string;
  highlightLines?: number[];
  language?: string;
}

interface FrameworkConfig {
  name: string;
  iconName: string;
  badge: string;
  intro: string;
  steps: StepItem[];
}

const FRAMEWORK_DATA: Record<FrameworkKey, FrameworkConfig> = {
  react: {
    name: "React",
    iconName: "React",
    badge: "Vite + React",
    intro: "Installing cluster-loaders in React is seamless via NPM or our instant CLI component generator.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create your project",
        description: (
          <>
            Start by creating a new React project if you don't have one set up already. The recommended approach is using{" "}
            <span className="font-semibold text-white underline decoration-white/30 underline-offset-4">Create Vite</span>.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm create vite@latest my-app -- --template react-ts
cd my-app`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Install Cluster Loaders",
        description: (
          <>
            Install <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">cluster-loaders</code> via npm, pnpm, or copy zero-dependency components with npx.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders

# Or add single component directly into your codebase:
npx cluster-loaders add astroid`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Import and render animation",
        description: (
          <>
            Import <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">CurveLoader</code> and supply any parametric curve preset or custom equation.
          </>
        ),
        codeHeader: "App.tsx",
        code: `import { CurveLoader, curves } from "cluster-loaders";

export default function App() {
  const astroid = curves.find((c) => c.name === "Astroid");

  return (
    <div className="w-32 h-32 text-[#CBA6F7]">
      <CurveLoader config={astroid} />
    </div>
  );
}`,
        highlightLines: [1, 8],
      },
    ],
  },
  next: {
    name: "Next.js",
    iconName: "Next",
    badge: "App Router",
    intro: "Full support for Next.js 14/15 App Router & Server Components with smooth client-side Canvas rendering.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create Next.js App",
        description: (
          <>
            Initialize a new Next.js project with Tailwind CSS and TypeScript configured.
          </>
        ),
        codeHeader: "Terminal",
        code: `npx create-next-app@latest my-next-app --typescript --tailwind --app
cd my-next-app`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Install cluster-loaders",
        description: (
          <>
            Add <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">cluster-loaders</code> to your project dependencies.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Use in Client Component",
        description: (
          <>
            Add <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">"use client"</code> at the top of your loader wrapper component.
          </>
        ),
        codeHeader: "components/LoadingSpinner.tsx",
        code: `"use client";

import { CurveLoader, curves } from "cluster-loaders";

export function LoadingSpinner() {
  const Lissajous = curves.find((c) => c.name === "Lissajous 3:4");

  return (
    <div className="w-24 h-24 text-emerald-400">
      <CurveLoader config={Lissajous} speed={1.2} />
    </div>
  );
}`,
        highlightLines: [1, 3, 9],
      },
    ],
  },
  vue: {
    name: "Vue.js",
    iconName: "Vue",
    badge: "Vue 3 + Vite",
    intro: "All parametric math equations & Canvas trail mechanics work natively in Vue 3 via Web Components or Composable functions.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create Vue project",
        description: (
          <>
            Start by bootstrapping a Vue 3 project with Vite.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm create vue@latest my-vue-app
cd my-vue-app`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Add Web Component or Composable",
        description: (
          <>
            Use our framework-agnostic core package or register the custom Web Component <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">&lt;cluster-loader&gt;</code>.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Mount in Vue Template",
        description: (
          <>
            Render the parametric loader canvas inside any Vue component template.
          </>
        ),
        codeHeader: "App.vue",
        code: `<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { renderParametricCanvas } from 'cluster-loaders/core';

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvasRef.value) {
    renderParametricCanvas(canvasRef.value, { curve: 'Astroid', speed: 1.0 });
  }
});
</script>

<template>
  <div className="loader-container">
    <canvas ref="canvasRef" width="300" height="300" />
  </div>
</template>`,
        highlightLines: [3, 8, 15],
      },
    ],
  },
  svelte: {
    name: "Svelte",
    iconName: "Svelte",
    badge: "SvelteKit",
    intro: "Zero-dependency mathematical canvas animation functions embed seamlessly into Svelte & SvelteKit action directives.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create Svelte project",
        description: (
          <>
            Scaffold a SvelteKit project using the official CLI.
          </>
        ),
        codeHeader: "Terminal",
        code: `npx sv create my-app
cd my-app`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Install package",
        description: (
          <>
            Install <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">cluster-loaders</code> package.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Bind Svelte Action",
        description: (
          <>
            Use Svelte's <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">use:loader</code> action directive for automatic canvas mounting and cleanup.
          </>
        ),
        codeHeader: "Loader.svelte",
        code: `<script lang="ts">
  import { clusterAction } from 'cluster-loaders/svelte';
</script>

<div class="w-32 h-32">
  <canvas use:clusterAction={{ preset: 'RoseCurve', petals: 7 }} />
</div>`,
        highlightLines: [2, 6],
      },
    ],
  },
  vanilla: {
    name: "Vanilla JS / HTML5",
    iconName: "HTML5",
    badge: "Framework Agnostic",
    intro: "Use pure JavaScript modules, Web Components, or standalone script tags directly in any web stack.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Include Script or Web Component",
        description: (
          <>
            Import via CDN bundle or standalone ES module into your HTML document.
          </>
        ),
        codeHeader: "index.html",
        code: `<script type="module" src="https://cdn.jsdelivr.net/npm/cluster-loaders/dist/index.mjs"></script>`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Use HTML Custom Element",
        description: (
          <>
            Place the custom element anywhere in your DOM hierarchy.
          </>
        ),
        codeHeader: "index.html",
        code: `<!-- Works in PHP, Laravel, Ruby, Django, HTML5, WordPress & everywhere -->
<cluster-loader 
  preset="astroid" 
  color="#CBA6F7" 
  speed="1"
></cluster-loader>`,
        highlightLines: [2, 3, 4, 5, 6],
      },
      {
        id: "step-3",
        number: "03",
        title: "Or initialize via JS API",
        description: (
          <>
            Imperatively target any HTML5 <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">&lt;canvas&gt;</code> element.
          </>
        ),
        codeHeader: "main.js",
        code: `import { createClusterLoader } from 'cluster-loaders';

const canvas = document.querySelector('#loader-canvas');
const instance = createClusterLoader(canvas, {
  curve: 'Hypotrochoid',
  trailLength: 0.95
});

// Clean up when done loading
// instance.destroy();`,
        highlightLines: [1, 4, 5, 6, 7],
      },
    ],
  },
};

export function TutorialSteps() {
  const [activeTab, setActiveTab] = useState<FrameworkKey>("react");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentFramework = FRAMEWORK_DATA[activeTab];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full my-8 text-white/90">
      {/* ── Framework Tabs Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-white/10">
        {(Object.keys(FRAMEWORK_DATA) as FrameworkKey[]).map((key) => {
          const fw = FRAMEWORK_DATA[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#CBA6F7]/15 text-[#CBA6F7] border border-[#CBA6F7]/40 shadow-sm"
                  : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07] border border-white/5"
              }`}
            >
              <span>{fw.name}</span>
              <span className="text-[10px] font-mono opacity-60 bg-white/10 px-1.5 py-0.5 rounded">
                {fw.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Intro Text ─────────────────────────────────────────────────── */}
      <div className="mb-8 text-sm text-white/70 leading-relaxed font-sans">
        {currentFramework.intro}
      </div>

      {/* ── Steps List ──────────────────────────────────────────────────── */}
      <div className="space-y-10">
        {currentFramework.steps.map((step) => {
          const isCopied = copiedId === `${activeTab}-${step.id}`;

          return (
            <div
              key={step.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-6 border-t border-white/[0.07] first:border-t-0 first:pt-0"
            >
              {/* Left Column: Number + Info */}
              <div className="lg:col-span-5 flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center font-mono text-[11px] font-semibold text-white/50 bg-white/[0.03] border border-white/10 rounded px-2.5 py-1 tracking-wider shadow-inner">
                  [{step.number}]
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <div className="text-xs text-white/60 leading-relaxed font-sans">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Right Column: Terminal / Code Card */}
              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0b0e] shadow-xl">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      {step.codeHeader === "Terminal" ? (
                        <Terminal className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        <Code2 className="w-3.5 h-3.5 text-[#CBA6F7]/70" />
                      )}
                      <span className="text-xs font-mono text-white/70">
                        {step.codeHeader}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(step.code, `${activeTab}-${step.id}`)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title="Copy code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Body */}
                  <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0a0b0e] text-white/90">
                    <pre>
                      <code>
                        {step.code.split("\n").map((line, idx) => {
                          const lineNumber = idx + 1;
                          const isHighlighted = step.codeHeader !== "Terminal" && step.highlightLines?.includes(lineNumber);

                          return (
                            <div
                              key={idx}
                              className={`flex items-center px-2 -mx-2 rounded ${
                                isHighlighted
                                  ? "bg-[#CBA6F7]/15 border-l-2 border-[#CBA6F7] text-white font-medium"
                                  : ""
                              }`}
                            >
                              <span className="inline-block select-none text-white/20 w-6 text-right pr-3 text-[10px]">
                                {lineNumber}
                              </span>
                              <span className="flex-1 whitespace-pre">{line}</span>
                            </div>
                          );
                        })}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
