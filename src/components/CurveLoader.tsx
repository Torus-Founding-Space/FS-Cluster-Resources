"use client";

import React, { lazy, Suspense } from 'react';
import { CurveConfig, useCurveAnimation } from '../hooks/useCurveAnimation';

// ── Lazy-loaded canvas components (code-split per group) ─────────────────────
const VoronoiPulseCanvas     = lazy(() => import('./VoronoiPulseCanvas').then(m => ({ default: m.VoronoiPulseCanvas })));

// Particle loaders
const SandTimerCanvas        = lazy(() => import('./particle-loaders/SandTimerCanvas').then(m => ({ default: m.SandTimerCanvas })));
const StochasticStaticCanvas = lazy(() => import('./particle-loaders/StochasticStaticCanvas').then(m => ({ default: m.StochasticStaticCanvas })));

// Motion loaders
const BreathingRingCanvas    = lazy(() => import('./motion-loaders/BreathingRingCanvas').then(m => ({ default: m.BreathingRingCanvas })));
const NoiseBlobCanvas        = lazy(() => import('./motion-loaders/NoiseBlobCanvas').then(m => ({ default: m.NoiseBlobCanvas })));
const LorenzCanvas           = lazy(() => import('./motion-loaders/LorenzCanvas').then(m => ({ default: m.LorenzCanvas })));

// Geometry loaders
const WindingSpiralCanvas    = lazy(() => import('./geometry-loaders/WindingSpiralCanvas').then(m => ({ default: m.WindingSpiralCanvas })));
const CymaticsRippleCanvas   = lazy(() => import('./geometry-loaders/CymaticsRippleCanvas').then(m => ({ default: m.CymaticsRippleCanvas })));
const GearTrainCanvas        = lazy(() => import('./geometry-loaders/GearTrainCanvas').then(m => ({ default: m.GearTrainCanvas })));

// Spatial loaders
const TopographicContourCanvas = lazy(() => import('./spatial-loaders/TopographicContourCanvas').then(m => ({ default: m.TopographicContourCanvas })));
const GravityWellCanvas        = lazy(() => import('./spatial-loaders/GravityWellCanvas').then(m => ({ default: m.GravityWellCanvas })));
const BraidedHelixCanvas       = lazy(() => import('./spatial-loaders/BraidedHelixCanvas').then(m => ({ default: m.BraidedHelixCanvas })));
const PhaseTransitionCanvas    = lazy(() => import('./spatial-loaders/PhaseTransitionCanvas').then(m => ({ default: m.PhaseTransitionCanvas })));

function CanvasPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 rounded-full border border-current opacity-20 animate-pulse" />
    </div>
  );
}

interface CurveLoaderProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function CurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  const fallback = <CanvasPlaceholder className={className} />;

  if (config.type === "voronoi") {
    return <Suspense fallback={fallback}><VoronoiPulseCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "sand-timer") {
    return <Suspense fallback={fallback}><SandTimerCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "stochastic-static") {
    return <Suspense fallback={fallback}><StochasticStaticCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "breathing-ring") {
    return <Suspense fallback={fallback}><BreathingRingCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "noise-blob") {
    return <Suspense fallback={fallback}><NoiseBlobCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "lorenz") {
    return <Suspense fallback={fallback}><LorenzCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "winding-spiral") {
    return <Suspense fallback={fallback}><WindingSpiralCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "cymatics-ripple") {
    return <Suspense fallback={fallback}><CymaticsRippleCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "gear-train") {
    return <Suspense fallback={fallback}><GearTrainCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "topographic-contour") {
    return <Suspense fallback={fallback}><TopographicContourCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "gravity-well") {
    return <Suspense fallback={fallback}><GravityWellCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "braided-helix") {
    return <Suspense fallback={fallback}><BraidedHelixCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }
  if (config.type === "phase-transition") {
    return <Suspense fallback={fallback}><PhaseTransitionCanvas config={config} isActive={isActive} className={className} /></Suspense>;
  }

  // SVG parametric curve (default)
  const { groupRef, pathRef, particlesRef } = useCurveAnimation(config, isActive);
  particlesRef.current = new Array(config.particleCount).fill(null);

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
            <circle
              key={i}
              ref={(el) => { particlesRef.current[i] = el; }}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
