"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../hooks/useCurveAnimation";

interface VoronoiPulseCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

interface Point2D {
  x: number;
  y: number;
}

export function VoronoiPulseCanvas({
  config,
  isActive = true,
  className = "",
}: VoronoiPulseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 128;
      height = rect.height || 128;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const startTime = performance.now();
    const seedCount = Math.max(4, Math.min(config.particleCount || 9, 20));

    // Initialize fixed phase & trajectory offsets for each seed point
    const seedMeta = Array.from({ length: seedCount }, (_, i) => {
      const angle = (i / seedCount) * Math.PI * 2;
      return {
        baseR: 22 + (i % 3) * 6,
        baseAngle: angle,
        phaseX: i * 1.37,
        phaseY: i * 2.19,
        freqX: 0.8 + (i % 4) * 0.3,
        freqY: 0.7 + ((i + 2) % 3) * 0.4,
        pulsePhase: (i / seedCount) * Math.PI * 2,
      };
    });

    // Sutherland-Hodgman convex polygon clipper against half-plane (X - M) · N <= 0
    function clipPolygonAgainstHalfPlane(poly: Point2D[], M: Point2D, N: Point2D): Point2D[] {
      if (poly.length === 0) return [];
      const output: Point2D[] = [];

      function isInside(p: Point2D): boolean {
        return (p.x - M.x) * N.x + (p.y - M.y) * N.y <= 0.00001;
      }

      function intersect(p1: Point2D, p2: Point2D): Point2D {
        const d1 = (p1.x - M.x) * N.x + (p1.y - M.y) * N.y;
        const d2 = (p2.x - M.x) * N.x + (p2.y - M.y) * N.y;
        const t = d1 / (d1 - d2);
        return {
          x: p1.x + t * (p2.x - p1.x),
          y: p1.y + t * (p2.y - p1.y),
        };
      }

      let s = poly[poly.length - 1];
      for (let i = 0; i < poly.length; i++) {
        const e = poly[i];
        if (isInside(e)) {
          if (isInside(s)) {
            output.push(e);
          } else {
            output.push(intersect(s, e));
            output.push(e);
          }
        } else if (isInside(s)) {
          output.push(intersect(s, e));
        }
        s = e;
      }
      return output;
    }

    function render(now: number) {
      if (!ctx || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const elapsed = (now - startTime) / 1000;
      const driftDuration = (config.durationMs || 6000) / 1000;
      const pulseDuration = (config.pulseDurationMs || 3500) / 1000;
      const driftTime = (elapsed / driftDuration) * Math.PI * 2;
      const pulseTime = (elapsed / pulseDuration) * Math.PI * 2;

      // Extract current text color or default to secondary violet (#CBA6F7)
      let themeColor = "#CBA6F7";
      if (canvas) {
        const style = window.getComputedStyle(canvas);
        if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
          themeColor = style.color;
        }
      }

      // Compute seed positions p_i and pulse weights w_i
      const seeds: { pos: Point2D; weight: number; pulseVal: number }[] = [];
      const pulseAmp = config.pulseAmp !== undefined ? config.pulseAmp : 0.45;

      for (let i = 0; i < seedCount; i++) {
        const meta = seedMeta[i];
        // Drift formula: p_i += v_i·dt represented smoothly as orbital + harmonic displacement
        const r = meta.baseR + 6 * Math.sin(driftTime * meta.freqX + meta.phaseX);
        const a = meta.baseAngle + 0.3 * Math.cos(driftTime * meta.freqY + meta.phaseY);

        const cx = 50 + r * Math.cos(a) + 5 * Math.sin(driftTime * 1.5 + meta.phaseX);
        const cy = 50 + r * Math.sin(a) + 5 * Math.cos(driftTime * 1.2 + meta.phaseY);

        // pulse: scale cell sizes by sin(t + i·φ)
        const pulseVal = Math.sin(pulseTime + meta.pulsePhase);
        const weight = pulseVal * pulseAmp * 120; // Weighted Voronoi power shift

        seeds.push({
          pos: { x: (cx / 100) * width, y: (cy / 100) * height },
          weight,
          pulseVal,
        });
      }

      // Compute Voronoi cells for each seed
      const cells: { poly: Point2D[]; seedIndex: number }[] = [];
      const edgeMap = new Map<string, { p1: Point2D; p2: Point2D; cell1: number; cell2: number }>();

      for (let i = 0; i < seedCount; i++) {
        // Initial bounding polygon for cell (view bounds with margin)
        let poly: Point2D[] = [
          { x: -10, y: -10 },
          { x: width + 10, y: -10 },
          { x: width + 10, y: height + 10 },
          { x: -10, y: height + 10 },
        ];

        const pi = seeds[i].pos;
        const wi = seeds[i].weight;

        for (let j = 0; j < seedCount; j++) {
          if (i === j) continue;
          const pj = seeds[j].pos;
          const wj = seeds[j].weight;

          const dx = pj.x - pi.x;
          const dy = pj.y - pi.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.001) continue;

          // Midpoint offset for weighted Voronoi bisector plane
          const midX = (pi.x + pj.x) / 2 + ((wi - wj) / (2 * distSq)) * dx;
          const midY = (pi.y + pj.y) / 2 + ((wi - wj) / (2 * distSq)) * dy;

          const M = { x: midX, y: midY };
          const N = { x: dx, y: dy }; // Normal points from i to j (half-plane (X-M)·N <= 0 keeps i)

          poly = clipPolygonAgainstHalfPlane(poly, M, N);
        }

        cells.push({ poly, seedIndex: i });

        // Collect edges to render boundary tessellation cleanly
        for (let k = 0; k < poly.length; k++) {
          const p1 = poly[k];
          const p2 = poly[(k + 1) % poly.length];
          // Standardize key for unique edge matching
          const key1 = `${Math.round(p1.x * 10)},${Math.round(p1.y * 10)}`;
          const key2 = `${Math.round(p2.x * 10)},${Math.round(p2.y * 10)}`;
          const edgeKey = key1 < key2 ? `${key1}_${key2}` : `${key2}_${key1}`;

          if (!edgeMap.has(edgeKey)) {
            edgeMap.set(edgeKey, { p1, p2, cell1: i, cell2: -1 });
          } else {
            const edge = edgeMap.get(edgeKey)!;
            edge.cell2 = i;
          }
        }
      }

      // ── Render Cell Inner Breathing Pulse Fills ───────────────────────
      cells.forEach(({ poly, seedIndex }) => {
        if (poly.length < 3) return;
        const seed = seeds[seedIndex];
        const innerScale = 0.4 + 0.45 * ((seed.pulseVal + 1) / 2); // Pulsing inner cell scale

        ctx.save();
        ctx.beginPath();
        poly.forEach((pt, k) => {
          // Shrink poly towards seed position
          const ix = seed.pos.x + (pt.x - seed.pos.x) * innerScale;
          const iy = seed.pos.y + (pt.y - seed.pos.y) * innerScale;
          if (k === 0) ctx.moveTo(ix, iy);
          else ctx.lineTo(ix, iy);
        });
        ctx.closePath();

        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.04 + 0.12 * ((seed.pulseVal + 1) / 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Render Voronoi Tessellation Edges & Nearest Boundary Highlight ──
      const strokeW = config.strokeWidth || 3.5;
      const highlightWave = (Math.sin(pulseTime * 1.5) + 1) / 2; // Moving highlight wave

      edgeMap.forEach(({ p1, p2, cell1, cell2 }) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        let pulseFactor = 0;
        if (cell1 >= 0) pulseFactor += (seeds[cell1].pulseVal + 1) / 2;
        if (cell2 >= 0) pulseFactor += (seeds[cell2].pulseVal + 1) / 2;
        pulseFactor = cell2 >= 0 ? pulseFactor / 2 : pulseFactor;

        // Determine if edge is near the active restructuring highlight wave
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const distFromCenter = Math.hypot(midX - width / 2, midY - height / 2) / (width / 2);
        const isHighlight = Math.abs(distFromCenter - highlightWave) < 0.25;

        ctx.strokeStyle = themeColor;
        if (isHighlight) {
          ctx.lineWidth = strokeW * 1.4;
          ctx.globalAlpha = 0.85 + 0.15 * pulseFactor;
          ctx.shadowColor = themeColor;
          ctx.shadowBlur = 8;
        } else {
          ctx.lineWidth = strokeW;
          ctx.globalAlpha = 0.25 + 0.45 * pulseFactor;
        }

        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      });

      // ── Render Seed Nodes & Drifting Nuclei ──────────────────────────
      seeds.forEach((seed) => {
        const pulseRatio = (seed.pulseVal + 1) / 2;

        ctx.save();
        // Outer aura ring
        ctx.beginPath();
        ctx.arc(seed.pos.x, seed.pos.y, 3 + pulseRatio * 4, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.15 + pulseRatio * 0.25;
        ctx.fill();

        // Core seed node dot
        ctx.beginPath();
        ctx.arc(seed.pos.x, seed.pos.y, 1.8 + pulseRatio * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [config, isActive]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
