"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface WindingSpiralCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function WindingSpiralCanvas({
  config,
  isActive = true,
  className = "",
}: WindingSpiralCanvasProps) {
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
      W = Math.max(40, rect.width);
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
    const TURNS = 6;    // number of complete windings
    const TRAIL = 0.18; // fraction of total arc shown as fading trail

    // Precompute static spiral path for background rendering
    // x(t) = R*(1-t)*cos(TURNS*2π*t), y same with sin
    const SPIRAL_STEPS = 240;
    const spiralPts: [number, number][] = [];
    for (let i = 0; i <= SPIRAL_STEPS; i++) {
      const t = i / SPIRAL_STEPS;
      spiralPts.push([t, t]); // we'll compute in render using current R
    }

    function getPoint(t: number, R: number): [number, number] {
      const r = R * (1 - t);
      const angle = TURNS * 2 * Math.PI * t;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    }

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const elapsed = (now - startTime) / 1000;
      const cycleDur = (config.durationMs || 4000) / 1000;
      // Ping-pong: 0→1 (inward) then 1→0 (rewind)
      const raw = (elapsed % (cycleDur * 2));
      const progress = raw < cycleDur
        ? raw / cycleDur
        : 1 - (raw - cycleDur) / cycleDur;
      // Ease the progress
      const p = progress * progress * (3 - 2 * progress);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.46;

      // ── Background dim spiral (full arc) ──────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      for (let i = 0; i <= SPIRAL_STEPS; i++) {
        const t = i / SPIRAL_STEPS;
        const [px, py] = getPoint(t, R);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.12;
      ctx.stroke();
      ctx.restore();

      // ── Bright swept arc from 0 to current progress ────────────────────
      const trailStart = Math.max(0, p - TRAIL);
      const SWEEP_STEPS = 120;

      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < SWEEP_STEPS; i++) {
        const t0 = trailStart + (p - trailStart) * (i / SWEEP_STEPS);
        const t1 = trailStart + (p - trailStart) * ((i + 1) / SWEEP_STEPS);
        if (t0 > p || t1 > p) break;

        const frac = i / SWEEP_STEPS; // 0 = tail, 1 = head
        const alpha = 0.15 + frac * 0.85;
        const [x0, y0] = getPoint(t0, R);
        const [x1, y1] = getPoint(t1, R);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1.5 + frac * (config.strokeWidth || 3.5) * 0.5;
        ctx.globalAlpha = alpha;
        if (frac > 0.8) {
          ctx.shadowColor = themeColor;
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
      }
      ctx.restore();

      // ── Bright dot at current position ────────────────────────────────
      const [headX, headY] = getPoint(p, R);
      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow
      ctx.beginPath();
      ctx.arc(headX, headY, 7, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.15;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 12;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10;
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
