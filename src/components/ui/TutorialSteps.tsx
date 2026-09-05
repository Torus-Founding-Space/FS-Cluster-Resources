"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

type FrameworkKey = "react" | "next" | "vue" | "svelte" | "vanilla";

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
  badge: string;
  intro: string;
  steps: StepItem[];
}

const Inline = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBA6F7] text-xs font-mono">
    {children}
  </code>
);

/**
 * cluster-loaders ships React components. The non-React guides below mount a
 * React root inside the host framework rather than pretending a native
 * binding exists; that is the setup those stacks actually need.
 */
const FRAMEWORK_DATA: Record<FrameworkKey, FrameworkConfig> = {
  react: {
    name: "React",
    badge: "Vite + React",
    intro:
      "Installing cluster-loaders in React is seamless via npm or our instant CLI component generator.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create your project",
        description: (
          <>
            Start by creating a new React project if you don&apos;t have one set up
            already. The recommended approach is using{" "}
            <span className="font-semibold text-white underline decoration-white/30 underline-offset-4">
              Vite
            </span>
            .
          </>
        ),
        codeHeader: "Terminal",
        code: `npm create vite@latest my-app -- --template react-ts
cd my-app`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Install cluster-loaders",
        description: (
          <>
            Install <Inline>cluster-loaders</Inline> from npm, or copy a single
            loader&apos;s source straight into your project with the CLI.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders

# Or copy one loader's source into your codebase:
npx cluster-loaders add astroid

# Not sure which one? List every preset id:
npx cluster-loaders list`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Import and render",
        description: (
          <>
            Import <Inline>CurveLoader</Inline> and look a preset up by its id, or
            pass a config object of your own.
          </>
        ),
        codeHeader: "App.tsx",
        code: `import { CurveLoader, curveById } from "cluster-loaders";

const astroid = curveById("astroid")!;

export default function App() {
  return (
    <div className="w-32 h-32 text-[#CBA6F7]">
      <CurveLoader config={astroid} />
    </div>
  );
}`,
        highlightLines: [1, 3, 8],
      },
    ],
  },
  next: {
    name: "Next.js",
    badge: "App Router",
    intro:
      "Works with the Next.js App Router. The loaders animate in the browser, so they render from a Client Component.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Create a Next.js app",
        description: (
          <>Initialize a new Next.js project with TypeScript and Tailwind configured.</>
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
            Add <Inline>cluster-loaders</Inline> to your project dependencies.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders`,
      },
      {
        id: "step-3",
        number: "03",
        title: "Use it in a Client Component",
        description: (
          <>
            The loaders use <Inline>requestAnimationFrame</Inline> and{" "}
            <Inline>&lt;canvas&gt;</Inline>, so mark the wrapper with{" "}
            <Inline>&quot;use client&quot;</Inline>.
          </>
        ),
        codeHeader: "components/LoadingSpinner.tsx",
        code: `"use client";

import { CurveLoader, curveById } from "cluster-loaders";

const gravityWell = curveById("gravity-well")!;

export function LoadingSpinner() {
  return (
    <div className="w-24 h-24 text-emerald-400">
      <CurveLoader config={gravityWell} />
    </div>
  );
}`,
        highlightLines: [1, 3, 5],
      },
    ],
  },
  vue: {
    name: "Vue.js",
    badge: "Vue 3 + Vite",
    intro:
      "cluster-loaders is a React component library. In Vue, mount it into a container element with a small React root, about ten lines, and you get every preset.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Install the package and React",
        description: (
          <>
            React and React DOM are peer dependencies, so install them alongside{" "}
            <Inline>cluster-loaders</Inline>.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders react react-dom`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Wrap it in a Vue component",
        description: (
          <>
            Create the React root on mount and tear it down on unmount so the
            animation loop is always cleaned up.
          </>
        ),
        codeHeader: "ClusterLoader.vue",
        code: `<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CurveLoader, curveById } from "cluster-loaders";

const props = defineProps<{ preset: string }>();
const host = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

onMounted(() => {
  if (!host.value) return;
  root = createRoot(host.value);
  root.render(createElement(CurveLoader, { config: curveById(props.preset)! }));
});

onBeforeUnmount(() => root?.unmount());
</script>

<template>
  <div ref="host" class="w-32 h-32 text-[#CBA6F7]" />
</template>`,
        highlightLines: [3, 4, 12, 13, 17],
      },
      {
        id: "step-3",
        number: "03",
        title: "Use it anywhere",
        description: <>Pass any preset id from the gallery below.</>,
        codeHeader: "App.vue",
        code: `<script setup lang="ts">
import ClusterLoader from "./ClusterLoader.vue";
</script>

<template>
  <ClusterLoader preset="astroid" />
</template>`,
        highlightLines: [6],
      },
    ],
  },
  svelte: {
    name: "Svelte",
    badge: "SvelteKit",
    intro:
      "Same approach as Vue: a Svelte action creates a React root on the node and unmounts it when the node goes away.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Install the package and React",
        description: (
          <>
            Install <Inline>cluster-loaders</Inline> together with its React peer
            dependencies.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders react react-dom`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Write a Svelte action",
        description: (
          <>
            The action&apos;s <Inline>destroy</Inline> hook unmounts the React root,
            which stops the animation frame loop.
          </>
        ),
        codeHeader: "clusterLoader.ts",
        code: `import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { CurveLoader, curveById } from "cluster-loaders";

export function clusterLoader(node: HTMLElement, preset: string) {
  const root = createRoot(node);
  root.render(createElement(CurveLoader, { config: curveById(preset)! }));

  return {
    destroy: () => root.unmount(),
  };
}`,
        highlightLines: [6, 7, 10],
      },
      {
        id: "step-3",
        number: "03",
        title: "Bind it to an element",
        description: (
          <>
            Apply the action with <Inline>use:</Inline> and pass a preset id.
          </>
        ),
        codeHeader: "Loader.svelte",
        code: `<script lang="ts">
  import { clusterLoader } from "./clusterLoader";
</script>

<div class="w-32 h-32 text-[#CBA6F7]" use:clusterLoader={"gear-train"} />`,
        highlightLines: [5],
      },
    ],
  },
  vanilla: {
    name: "Vanilla JS",
    badge: "Any stack",
    intro:
      "No framework? Mount a React root onto any element. Works inside Rails, Laravel, Django, WordPress or a plain HTML page built with a bundler.",
    steps: [
      {
        id: "step-1",
        number: "01",
        title: "Install with a bundler",
        description: (
          <>
            The package ships ESM and CJS builds. Use any bundler (Vite, esbuild,
            webpack) to resolve <Inline>cluster-loaders</Inline> and React.
          </>
        ),
        codeHeader: "Terminal",
        code: `npm install cluster-loaders react react-dom`,
      },
      {
        id: "step-2",
        number: "02",
        title: "Mount onto an element",
        description: (
          <>
            Give the container a size and a <Inline>color</Inline>. Loaders draw in
            the inherited text colour.
          </>
        ),
        codeHeader: "main.js",
        code: `import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { CurveLoader, curveById } from "cluster-loaders";

const host = document.querySelector("#loader");
const root = createRoot(host);

root.render(createElement(CurveLoader, { config: curveById("noise-blob") }));

// Stop the animation and release the element when you're done:
// root.unmount();`,
        highlightLines: [6, 8, 11],
      },
      {
        id: "step-3",
        number: "03",
        title: "Or copy the source, no dependency",
        description: (
          <>
            The CLI writes a loader&apos;s actual source into your project, so you can
            drop the dependency entirely and edit the maths yourself.
          </>
        ),
        codeHeader: "Terminal",
        code: `npx cluster-loaders add braided-helix

# Writes into components/ui/cluster-loaders/:
#   useCurveAnimation.ts, canvas.ts,
#   BraidedHelixCanvas.tsx, BraidedHelixLoader.tsx`,
      },
    ],
  },
};

export function TutorialSteps() {
  const [activeTab, setActiveTab] = useState<FrameworkKey>("react");
  const { copy, isCopied } = useCopyToClipboard();

  const currentFramework = FRAMEWORK_DATA[activeTab];

  return (
    <div className="w-full my-8 text-white/90">
      {/* ── Framework Tabs Bar ────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Framework"
        className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-white/10"
      >
        {(Object.keys(FRAMEWORK_DATA) as FrameworkKey[]).map((key) => {
          const fw = FRAMEWORK_DATA[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
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
          const copyId = `${activeTab}-${step.id}`;

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
                      type="button"
                      onClick={() => void copy(step.code, copyId)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label={`Copy the ${step.title} snippet`}
                    >
                      {isCopied(copyId) ? (
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
                          const isHighlighted =
                            step.codeHeader !== "Terminal" &&
                            step.highlightLines?.includes(lineNumber);

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
