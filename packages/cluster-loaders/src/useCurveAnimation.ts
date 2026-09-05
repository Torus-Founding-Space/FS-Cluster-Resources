import { useEffect, useRef } from 'react';

export type Point = { x: number; y: number };

/**
 * Canvas-backed loaders are selected by `type`; everything else falls through
 * to the generic SVG parametric renderer driven by `point()`.
 */
export type CurveType =
  | 'winding-spiral'
  | 'cymatics-ripple'
  | 'gear-train'
  | 'voronoi'
  | 'sand-timer'
  | 'stochastic-static'
  | 'breathing-ring'
  | 'noise-blob'
  | 'lorenz'
  | 'topographic-contour'
  | 'gravity-well'
  | 'braided-helix'
  | 'phase-transition';

export type CurveCategory = 'geometry' | 'particles' | 'motion' | 'spatial';

/**
 * Shape parameters consumed by `point()` and surfaced as sliders in the docs
 * gallery. All optional, since each curve declares only the ones it uses.
 */
export interface CurveParams {
  a?: number;
  b?: number;
  c?: number;
  k?: number;
  m?: number;
  n?: number;
  n1?: number;
  n2?: number;
  n3?: number;
  r?: number;
  r1?: number;
  r2?: number;
  r3?: number;
  ra?: number;
  rb?: number;
  rm?: number;
  s?: number;
  baseRadius?: number;
  curveScale?: number;
  detailAmplitude?: number;
  freq?: number;
  petalCount?: number;
  pulseAmp?: number;
  spikes?: number;
  waveAmp?: number;
  waveFreq?: number;
}

/**
 * The config as a `point()` implementation sees it.
 *
 * Shape parameters are optional on `CurveConfig` because each preset declares
 * only the ones it uses, but a preset's own `point()` always reads parameters
 * that preset defines, so they are surfaced as plain numbers here rather than
 * forcing a non-null assertion on every term of an equation.
 */
export type ResolvedCurveConfig = Omit<CurveConfig, keyof CurveParams> &
  Required<CurveParams>;

export interface CurveConfig extends CurveParams {
  /** Stable, URL- and CLI-safe identifier. Also the `cluster-loaders add <id>` argument. */
  id: string;
  name: string;
  tag: string;
  rotate: boolean;
  particleCount: number;
  trailSpan: number;
  durationMs: number;
  rotationDurationMs: number;
  pulseDurationMs: number;
  strokeWidth: number;
  point: (progress: number, detailScale: number, config: ResolvedCurveConfig) => Point;
  mathFormula?: string[];
  codeSnippet?: string;
  type?: CurveType;
  category?: CurveCategory;
}

/**
 * Drives the SVG parametric loader.
 *
 * The animation loop reads the *latest* config through a ref rather than
 * closing over it, so passing a fresh object literal (or dragging a slider)
 * updates the shape in place instead of tearing down and restarting the
 * requestAnimationFrame loop on every render.
 */
export function useCurveAnimation(config: CurveConfig, isActive: boolean = true) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    if (!isActive) return;

    const group = groupRef.current;
    const path = pathRef.current;
    if (!group || !path) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrameId = 0;
    const startTime = performance.now();
    const phaseOffset = Math.random();

    function normalizeProgress(progress: number) {
      return ((progress % 1) + 1) % 1;
    }

    function getRotation(cfg: CurveConfig, time: number) {
      if (!cfg.rotate || !cfg.rotationDurationMs) return 0;
      return -(
        ((time + phaseOffset * cfg.rotationDurationMs) % cfg.rotationDurationMs) /
        cfg.rotationDurationMs
      ) * 360;
    }

    function buildPath(cfg: CurveConfig, detailScale: number, steps = 480) {
      return Array.from({ length: steps + 1 }, (_, index) => {
        const point = cfg.point(index / steps, detailScale, cfg as ResolvedCurveConfig);
        return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      }).join(' ');
    }

    function getParticle(cfg: CurveConfig, index: number, progress: number, detailScale: number) {
      // A single-particle loader would divide by zero on the tail offset.
      const span = Math.max(1, cfg.particleCount - 1);
      const tailOffset = index / span;
      const point = cfg.point(
        normalizeProgress(progress - tailOffset * cfg.trailSpan),
        detailScale,
        cfg as ResolvedCurveConfig
      );
      const fade = Math.pow(1 - tailOffset, 0.56);
      return {
        x: point.x,
        y: point.y,
        radius: 0.9 + fade * 2.7,
        opacity: 0.04 + fade * 0.96,
      };
    }

    function draw(elapsed: number) {
      const cfg = configRef.current;
      const detailScale = 1;
      const progress =
        cfg.durationMs > 0
          ? ((elapsed + phaseOffset * cfg.durationMs) % cfg.durationMs) / cfg.durationMs
          : 0;

      group!.setAttribute('transform', `rotate(${getRotation(cfg, elapsed)} 50 50)`);
      path!.setAttribute('d', buildPath(cfg, detailScale));
      path!.setAttribute('stroke-width', String(cfg.strokeWidth));

      particlesRef.current.forEach((node, index) => {
        if (!node) return;
        if (index >= cfg.particleCount) {
          node.setAttribute('opacity', '0');
          return;
        }
        const particle = getParticle(cfg, index, progress, detailScale);
        node.setAttribute('cx', particle.x.toFixed(2));
        node.setAttribute('cy', particle.y.toFixed(2));
        node.setAttribute('r', particle.radius.toFixed(2));
        node.setAttribute('opacity', particle.opacity.toFixed(3));
      });
    }

    function tick(now: number) {
      draw(now - startTime);
      animationFrameId = requestAnimationFrame(tick);
    }

    function start() {
      cancelAnimationFrame(animationFrameId);
      if (motionQuery.matches) {
        // Reduced motion: render one static frame of the curve and stop.
        draw(0);
        return;
      }
      animationFrameId = requestAnimationFrame(tick);
    }

    start();
    motionQuery.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener('change', start);
    };
  }, [isActive]);

  return { groupRef, pathRef, particlesRef };
}
