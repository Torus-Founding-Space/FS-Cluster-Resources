"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface StochasticStaticCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function StochasticStaticCanvas({
  config,
  isActive = true,
  className = "",
}: StochasticStaticCanvasProps) {
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
    const cols = 48;
    const rows = 48;

    // Simple pseudo-random value noise
    function pseudoNoise(x: number, y: number, t: number): number {
      const n = Math.sin(x * 12.9898 + y * 78.233 + t * 43758.5453) * 43758.5453;
      return n - Math.floor(n);
    }

    // Target SDF shape: Concentric Ring + Core Dot
    function getTargetSDF(x: number, y: number): number {
      const nx = (x / cols) * 2 - 1;
      const ny = (y / rows) * 2 - 1;
      const r = Math.hypot(nx, ny);

      // Ring SDF at r=0.55 + central dot at r < 0.15
      const ring = Math.abs(r - 0.55) < 0.08 ? 1 : 0;
      const dot = r < 0.15 ? 1 : 0;
      return Math.max(ring, dot);
    }

    function render(now: number) {
      if (!ctx || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      if (canvas) {
        const style = window.getComputedStyle(canvas);
        if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
          themeColor = style.color;
        }
      }

      const elapsed = (now - startTime) / 1000;
      const duration = (config.durationMs || 3600) / 1000;
      const cycleTime = (elapsed % duration) / duration; // 0 to 1 progress

      // Progress curve alpha: 0 (chaos) -> 1 (resolved order) -> 0
      const alpha = 0.5 - 0.5 * Math.cos(cycleTime * Math.PI * 2);

      const cellW = width / cols;
      const cellH = height / rows;

      // ── Render Noise-to-Signal Pixels ──────────────────────────────────
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const noise = pseudoNoise(c, r, elapsed * 0.5);
          const target = getTargetSDF(c, r);

          // Blend: pixel = (1 - alpha)*noise + alpha*target
          const val = (1 - alpha) * noise + alpha * target;

          if (val > 0.15) {
            ctx.fillStyle = themeColor;
            ctx.globalAlpha = val * (0.3 + 0.7 * alpha);
            ctx.fillRect(c * cellW, r * cellH, cellW * 0.85, cellH * 0.85);
          }
        }
      }

      // ── Scanning Line Effect ─────────────────────────────────────────
      const scanY = (elapsed % 1.8) / 1.8;
      const sy = scanY * height;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

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
