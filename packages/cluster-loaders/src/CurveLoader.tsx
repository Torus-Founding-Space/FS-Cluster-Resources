"use client";

import React, { lazy, Suspense, useMemo } from 'react';
import type { ComponentType } from 'react';
import { CurveConfig, CurveType, useCurveAnimation } from './useCurveAnimation';

interface LoaderCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

// ── Lazy-loaded canvas components (code-split per group) ─────────────────────
const CANVAS_LOADERS: Record<CurveType, ComponentType<LoaderCanvasProps>> = {
  'voronoi': lazy(() => import('./VoronoiPulseCanvas').then(m => ({ default: m.VoronoiPulseCanvas }))),

  // Particle loaders
  'sand-timer': lazy(() => import('./particle-loaders/SandTimerCanvas').then(m => ({ default: m.SandTimerCanvas }))),
  'stochastic-static': lazy(() => import('./particle-loaders/StochasticStaticCanvas').then(m => ({ default: m.StochasticStaticCanvas }))),

  // Motion loaders
  'breathing-ring': lazy(() => import('./motion-loaders/BreathingRingCanvas').then(m => ({ default: m.BreathingRingCanvas }))),
  'noise-blob': lazy(() => import('./motion-loaders/NoiseBlobCanvas').then(m => ({ default: m.NoiseBlobCanvas }))),
  'lorenz': lazy(() => import('./motion-loaders/LorenzCanvas').then(m => ({ default: m.LorenzCanvas }))),

  // Geometry loaders
  'winding-spiral': lazy(() => import('./geometry-loaders/WindingSpiralCanvas').then(m => ({ default: m.WindingSpiralCanvas }))),
  'cymatics-ripple': lazy(() => import('./geometry-loaders/CymaticsRippleCanvas').then(m => ({ default: m.CymaticsRippleCanvas }))),
  'gear-train': lazy(() => import('./geometry-loaders/GearTrainCanvas').then(m => ({ default: m.GearTrainCanvas }))),

  // Spatial loaders
  'topographic-contour': lazy(() => import('./spatial-loaders/TopographicContourCanvas').then(m => ({ default: m.TopographicContourCanvas }))),
  'gravity-well': lazy(() => import('./spatial-loaders/GravityWellCanvas').then(m => ({ default: m.GravityWellCanvas }))),
  'braided-helix': lazy(() => import('./spatial-loaders/BraidedHelixCanvas').then(m => ({ default: m.BraidedHelixCanvas }))),
  'phase-transition': lazy(() => import('./spatial-loaders/PhaseTransitionCanvas').then(m => ({ default: m.PhaseTransitionCanvas }))),
};

function CanvasPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 rounded-full border border-current opacity-20 animate-pulse" />
    </div>
  );
}

export interface CurveLoaderProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

/**
 * The generic SVG parametric renderer.
 *
 * Kept as its own component so `useCurveAnimation` is never called
 * conditionally. `CurveLoader` picks a renderer, it does not branch around a
 * hook.
 */
function SvgCurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  const { groupRef, pathRef, particlesRef } = useCurveAnimation(config, isActive);

  // Particle nodes are registered (and unregistered) through ref callbacks.
  // Writing to `particlesRef.current` during render would mutate a ref while
  // React is rendering, which is not allowed and drops nodes on re-render.
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

  const defaultStrokeW = config.strokeWidth || 3.5;

  return (
    <div className={`flex items-center justify-center ${className}`}>
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
            strokeWidth={defaultStrokeW * 0.4}
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

export function CurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  // `config.type` can change between renders (the gallery lets you swap presets
  // live), so the canvas branch must not sit above a hook.
  const Canvas = config.type ? CANVAS_LOADERS[config.type] : undefined;

  if (Canvas) {
    return (
      <Suspense fallback={<CanvasPlaceholder className={className} />}>
        <Canvas config={config} isActive={isActive} className={className} />
      </Suspense>
    );
  }

  return <SvgCurveLoader config={config} isActive={isActive} className={className} />;
}
