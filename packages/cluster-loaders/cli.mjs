#!/usr/bin/env node

/**
 * cluster-loaders CLI
 * Powered by FS Cluster & Torus-FS
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const command = args[0];
const loaderName = (args[1] || 'astroid').toLowerCase();

console.log(`\n\x1b[36mcluster-loaders\x1b[0m — Powered by \x1b[35mFS Cluster & Torus-FS\x1b[0m\n`);

if (!command || command === 'help') {
  console.log(`Usage:`);
  console.log(`  npx cluster-loaders add <loader-name>`);
  console.log(`\nAvailable loaders:`);
  console.log(`  astroid, spring-blob, magnetic-dots, pendulum-wave, liquid-fill,`);
  console.log(`  orbital-resonance, superformula, fourier, chladni, network-grow,`);
  console.log(`  mobius, clelie, klein-bottle, lissajous, cardioid, trefoil\n`);
  process.exit(0);
}

if (command === 'add') {
  const cwd = process.cwd();
  const hasSrc = fs.existsSync(path.join(cwd, 'src'));
  const targetDir = hasSrc 
    ? path.join(cwd, 'src', 'components', 'ui') 
    : path.join(cwd, 'components', 'ui');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const useCurveAnimationCode = `import { useEffect, useRef } from 'react';

export type Point = { x: number; y: number };

export interface CurveConfig {
  name: string;
  tag: string;
  rotate: boolean;
  particleCount: number;
  trailSpan: number;
  durationMs: number;
  rotationDurationMs: number;
  pulseDurationMs: number;
  strokeWidth: number;
  point: (progress: number, detailScale: number, config: any) => Point;
  mathFormula?: string[];
  codeSnippet?: string;
  [key: string]: any;
}

export function useCurveAnimation(config: CurveConfig, isActive: boolean = true) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const group = groupRef.current;
    const path = pathRef.current;
    const particles = particlesRef.current;

    if (!group || !path) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const phaseOffset = Math.random();

    function normalizeProgress(progress: number) {
      return ((progress % 1) + 1) % 1;
    }

    function getRotation(time: number) {
      if (!config.rotate) return 0;
      return -(
        ((time + phaseOffset * config.rotationDurationMs) % config.rotationDurationMs) /
        config.rotationDurationMs
      ) * 360;
    }

    function buildPath(detailScale: number, steps = 480) {
      return Array.from({ length: steps + 1 }, (_, index) => {
        const point = config.point(index / steps, detailScale, config);
        return \`\${index === 0 ? "M" : "L"} \${point.x.toFixed(2)} \${point.y.toFixed(2)}\`;
      }).join(" ");
    }

    function getParticle(index: number, progress: number, detailScale: number) {
      const tailOffset = index / (config.particleCount - 1);
      const point = config.point(
        normalizeProgress(progress - tailOffset * config.trailSpan),
        detailScale,
        config
      );
      const fade = Math.pow(1 - tailOffset, 0.56);
      return {
        x: point.x,
        y: point.y,
        radius: 0.9 + fade * 2.7,
        opacity: 0.04 + fade * 0.96,
      };
    }

    function tick(now: number) {
      const time = now - startTime;
      const progress = ((time + phaseOffset * config.durationMs) % config.durationMs) / config.durationMs;
      const detailScale = 1;
      const rotation = getRotation(time);

      group!.setAttribute("transform", \`rotate(\${rotation} 50 50)\`);
      path!.setAttribute("d", buildPath(detailScale));
      path!.setAttribute("stroke-width", String(config.strokeWidth));

      particles.forEach((node, index) => {
        if (!node) return;
        if (index >= config.particleCount) {
          node.setAttribute("opacity", "0");
          return;
        }
        const particle = getParticle(index, progress, detailScale);
        node.setAttribute("cx", particle.x.toFixed(2));
        node.setAttribute("cy", particle.y.toFixed(2));
        node.setAttribute("r", particle.radius.toFixed(2));
        node.setAttribute("opacity", particle.opacity.toFixed(3));
      });

      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [config, isActive]);

  return { groupRef, pathRef, particlesRef };
}
`;

  const curveLoaderCode = `import React from 'react';
import { CurveConfig, useCurveAnimation } from './useCurveAnimation';

export interface CurveLoaderProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function CurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  const { groupRef, pathRef, particlesRef } = useCurveAnimation(config, isActive);

  particlesRef.current = new Array(config.particleCount).fill(null);

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
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.25"
          />
          {Array.from({ length: config.particleCount }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                particlesRef.current[i] = el;
              }}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
`;

  const astroidPresetCode = `import { CurveConfig } from './useCurveAnimation';

export const astroidConfig: CurveConfig = {
  name: "Astroid",
  tag: "4-Cusp Hypocycloid",
  rotate: false,
  particleCount: 60,
  trailSpan: 0.15,
  durationMs: 6000,
  rotationDurationMs: 0,
  pulseDurationMs: 4000,
  strokeWidth: 4.5,
  a: 40,
  b: 10,
  curveScale: 1,
  point(progress: number, detailScale: number, config: any) {
    const t = progress * Math.PI * 2;
    const a = config.a * detailScale;
    const b = config.b * detailScale;
    const x = (a - b) * Math.cos(t) + b * Math.cos(((a - b) / b) * t);
    const y = (a - b) * Math.sin(t) - b * Math.sin(((a - b) / b) * t);
    return { x: 50 + x, y: 50 + y };
  }
};
`;

  fs.writeFileSync(path.join(targetDir, 'useCurveAnimation.ts'), useCurveAnimationCode, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'CurveLoader.tsx'), curveLoaderCode, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'astroidConfig.ts'), astroidPresetCode, 'utf-8');

  console.log(`✓ Adding \x1b[32m${loaderName}\x1b[0m loader source code to \x1b[34m${targetDir}\x1b[0m...`);
  console.log(`✓ Written \x1b[32mCurveLoader.tsx\x1b[0m, \x1b[32museCurveAnimation.ts\x1b[0m and \x1b[32mastroidConfig.ts\x1b[0m`);
  console.log(`\nDone! Import it with:`);
  console.log(`\x1b[33mimport { CurveLoader } from "@/components/ui/CurveLoader";\x1b[0m`);
  console.log(`\x1b[33mimport { astroidConfig } from "@/components/ui/astroidConfig";\x1b[0m\n`);
}
