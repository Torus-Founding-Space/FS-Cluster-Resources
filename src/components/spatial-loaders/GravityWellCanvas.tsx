"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface GravityWellCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function GravityWellCanvas({
  config,
  isActive = true,
  className = "",
}: GravityWellCanvasProps) {
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
      W = Math.max(64, rect.width);
      H = Math.max(64, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();
    const COLS = 12;
    const ROWS = 12;

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const cx = W / 2, cy = H / 2;
      const orbitR = Math.min(W, H) * 0.28;
      const elapsed = (now - startTime) / 1000;
      const speed = (Math.PI * 2) / ((config.durationMs || 5000) / 1000);

      // Orbiting attractor position
      const attX = cx + Math.cos(elapsed * speed) * orbitR;
      const attY = cy + Math.sin(elapsed * speed) * orbitR;

      const stepX = W / (COLS + 1);
      const stepY = H / (ROWS + 1);

      // Render gravitational grid lines & dots
      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const origX = c * stepX;
          const origY = r * stepY;

          const dx = attX - origX;
          const dy = attY - origY;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq) || 0.001;

          // Inverse-square gravitational pull: F = GM / r^2
          const pull = Math.min(dist * 0.45, 1800 / (distSq + 400));
          const px = origX + (dx / dist) * pull;
          const py = origY + (dy / dist) * pull;

          // Connect horizontal & vertical grid lines
          if (c < COLS) {
            const nextOrigX = (c + 1) * stepX;
            const nextOrigY = r * stepY;
            const ndx = attX - nextOrigX;
            const ndy = attY - nextOrigY;
            const nDistSq = ndx * ndx + ndy * ndy;
            const nDist = Math.sqrt(nDistSq) || 0.001;
            const nPull = Math.min(nDist * 0.45, 1800 / (nDistSq + 400));
            const npx = nextOrigX + (ndx / nDist) * nPull;
            const npy = nextOrigY + (ndy / nDist) * nPull;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(npx, npy);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.18 + (pull / 25) * 0.4;
            ctx.stroke();
            ctx.restore();
          }

          if (r < ROWS) {
            const nextOrigX = c * stepX;
            const nextOrigY = (r + 1) * stepY;
            const ndx = attX - nextOrigX;
            const ndy = attY - nextOrigY;
            const nDistSq = ndx * ndx + ndy * ndy;
            const nDist = Math.sqrt(nDistSq) || 0.001;
            const nPull = Math.min(nDist * 0.45, 1800 / (nDistSq + 400));
            const npx = nextOrigX + (ndx / nDist) * nPull;
            const npy = nextOrigY + (ndy / nDist) * nPull;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(npx, npy);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.18 + (pull / 25) * 0.4;
            ctx.stroke();
            ctx.restore();
          }

          // Grid node dot
          const dotRadius = 1.6 + (pull / 20) * 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = themeColor;
          ctx.globalAlpha = 0.4 + (pull / 20) * 0.5;
          if (pull > 8) {
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 6;
          }
          ctx.fill();
          ctx.restore();
        }
      }

      // Render Attractor Mass Core
      ctx.save();
      ctx.beginPath();
      ctx.arc(attX, attY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.95;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();

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
