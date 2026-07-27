"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface TopographicContourCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function TopographicContourCanvas({
  config,
  isActive = true,
  className = "",
}: TopographicContourCanvasProps) {
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
      H = Math.max(80, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();
    const GRID_X = 32;
    const GRID_Y = 32;

    // Height function: sum of evolving 2D sine waves
    function getHeight(xNorm: number, yNorm: number, t: number): number {
      const h1 = Math.sin(xNorm * 3.5 + t * 0.8) * Math.cos(yNorm * 3.5 - t * 0.6);
      const h2 = Math.sin((xNorm + yNorm) * 2.2 + t * 1.2) * 0.5;
      const distCenter = Math.hypot(xNorm - 0.5, yNorm - 0.5);
      const Gaussian = Math.exp(-distCenter * distCenter * 4) * Math.sin(t * 1.5) * 0.8;
      return (h1 + h2 + Gaussian + 2) / 4; // normalized 0 to 1
    }

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
      const cellW = W / (GRID_X - 1);
      const cellH = H / (GRID_Y - 1);

      // Sample grid heights
      const grid = new Float32Array(GRID_X * GRID_Y);
      for (let gy = 0; gy < GRID_Y; gy++) {
        for (let gx = 0; gx < GRID_X; gx++) {
          grid[gy * GRID_X + gx] = getHeight(gx / (GRID_X - 1), gy / (GRID_Y - 1), elapsed);
        }
      }

      // Contour levels
      const levels = [0.25, 0.38, 0.50, 0.62, 0.75, 0.88];

      // Marching squares algorithm for each contour level
      levels.forEach((level, lIdx) => {
        ctx.save();
        ctx.beginPath();

        for (let gy = 0; gy < GRID_Y - 1; gy++) {
          for (let gx = 0; gx < GRID_X - 1; gx++) {
            const v0 = grid[gy * GRID_X + gx];
            const v1 = grid[gy * GRID_X + (gx + 1)];
            const v2 = grid[(gy + 1) * GRID_X + (gx + 1)];
            const v3 = grid[(gy + 1) * GRID_X + gx];

            // Binary state for marching squares
            const c0 = v0 >= level ? 1 : 0;
            const c1 = v1 >= level ? 2 : 0;
            const c2 = v2 >= level ? 4 : 0;
            const c3 = v3 >= level ? 8 : 0;
            const state = c0 | c1 | c2 | c3;

            if (state === 0 || state === 15) continue;

            const x = gx * cellW;
            const y = gy * cellH;

            // Interpolation helper
            const top    = { x: x + cellW * ((level - v0) / (v1 - v0 || 0.001)), y };
            const right  = { x: x + cellW, y: y + cellH * ((level - v1) / (v2 - v1 || 0.001)) };
            const bottom = { x: x + cellW * ((level - v3) / (v2 - v3 || 0.001)), y: y + cellH };
            const left   = { x, y: y + cellH * ((level - v0) / (v3 - v0 || 0.001)) };

            const line = (pA: { x: number; y: number }, pB: { x: number; y: number }) => {
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(pB.x, pB.y);
            };

            switch (state) {
              case 1: case 14: line(left, top); break;
              case 2: case 13: line(top, right); break;
              case 3: case 12: line(left, right); break;
              case 4: case 11: line(right, bottom); break;
              case 5: line(left, top); line(right, bottom); break;
              case 6: case 9:  line(top, bottom); break;
              case 7: case 8:  line(left, bottom); break;
              case 10: line(top, right); line(left, bottom); break;
            }
          }
        }

        const alpha = 0.35 + (lIdx / levels.length) * 0.55;
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = (config.strokeWidth || 3.5) * (0.6 + (lIdx / levels.length) * 0.5);
        ctx.globalAlpha = alpha;
        if (lIdx >= levels.length - 2) {
          ctx.shadowColor = themeColor;
          ctx.shadowBlur = 4;
        }
        ctx.stroke();
        ctx.restore();
      });

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
