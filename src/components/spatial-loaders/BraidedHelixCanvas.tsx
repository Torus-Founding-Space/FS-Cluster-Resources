"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface BraidedHelixCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function BraidedHelixCanvas({
  config,
  isActive = true,
  className = "",
}: BraidedHelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const setup = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(80, rect.width);
      H = Math.max(40, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();
    const STRANDS = 3;
    const SAMPLES = 80;

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const elapsed = (now - startTime) / 1000;
      const speed = (Math.PI * 2) / ((config.durationMs || 4000) / 1000);
      const cy = H / 2;
      const marginX = W * 0.08;
      const usableW = W - marginX * 2;
      const amp = Math.min(H * 0.35, 24);
      const freq = 2.5;

      // Sample 3D helix coordinates for each strand: x, y, z (depth)
      type Segment = {
        strandIdx: number;
        x: number;
        y: number;
        z: number; // depth for z-sorting
      };

      const segments: Segment[][] = [];
      for (let k = 0; k < STRANDS; k++) {
        const phaseOffset = (k / STRANDS) * Math.PI * 2;
        const strandPts: Segment[] = [];
        for (let i = 0; i <= SAMPLES; i++) {
          const normX = i / SAMPLES;
          const x = marginX + normX * usableW;
          const angle = normX * Math.PI * 2 * freq - elapsed * speed + phaseOffset;
          const y = cy + Math.sin(angle) * amp;
          const z = Math.cos(angle); // depth range -1 (back) to +1 (front)
          strandPts.push({ strandIdx: k, x, y, z });
        }
        segments.push(strandPts);
      }

      // Draw horizontal rung connectors between strands (DNA/braid rungs)
      for (let i = 0; i <= SAMPLES; i += 4) {
        const p0 = segments[0][i];
        const p1 = segments[1][i];
        const p2 = segments[2][i];
        const avgZ = (p0.z + p1.z + p2.z) / 3;
        const alpha = 0.15 + (avgZ + 1) * 0.15;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.restore();
      }

      // Render each strand in small segments z-sorted for real occlusion
      for (let i = 0; i < SAMPLES; i++) {
        // Collect segment pieces at position i
        const stepPieces = [];
        for (let k = 0; k < STRANDS; k++) {
          const ptA = segments[k][i];
          const ptB = segments[k][i + 1];
          const avgZ = (ptA.z + ptB.z) / 2;
          stepPieces.push({ ptA, ptB, avgZ });
        }

        // Sort back to front (lowest z first)
        stepPieces.sort((a, b) => a.avgZ - b.avgZ);

        // Draw sorted segments
        stepPieces.forEach(({ ptA, ptB, avgZ }) => {
          const depthNorm = (avgZ + 1) / 2; // 0 to 1
          const strokeW = (config.strokeWidth || 3.5) * (0.6 + depthNorm * 0.6);
          const alpha = 0.35 + depthNorm * 0.6;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ptA.x, ptA.y);
          ctx.lineTo(ptB.x, ptB.y);
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = strokeW;
          ctx.lineCap = "round";
          ctx.globalAlpha = alpha;
          if (depthNorm > 0.8) {
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          ctx.restore();
        });
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [config, isActive]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
