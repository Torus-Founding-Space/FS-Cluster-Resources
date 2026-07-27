import { useEffect, useRef } from 'react';

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

    function getDetailScale() {
      return 1;
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
        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
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
      const detailScale = getDetailScale();
      const rotation = getRotation(time);

      group!.setAttribute("transform", `rotate(${rotation} 50 50)`);
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
