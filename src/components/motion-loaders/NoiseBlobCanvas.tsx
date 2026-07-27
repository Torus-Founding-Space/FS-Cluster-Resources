"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface NoiseBlobCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function NoiseBlobCanvas({
  config,
  isActive = true,
  className = "",
}: NoiseBlobCanvasProps) {
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

    // ── Value noise 3D (smooth, continuous) ──────────────────────────────
    function hash3(xi: number, yi: number, zi: number): number {
      // Each call is deterministic, returns [0,1]
      const n = xi * 127.1 + yi * 311.7 + zi * 74.7;
      return Math.abs(Math.sin(n) * 43758.5453) % 1;
    }

    function smoothstep(t: number): number {
      return t * t * (3 - 2 * t);
    }

    function noise3(x: number, y: number, z: number): number {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const xf = x - xi, yf = y - yi, zf = z - zi;
      const u = smoothstep(xf), v = smoothstep(yf), w = smoothstep(zf);

      const n000 = hash3(xi, yi, zi);
      const n100 = hash3(xi + 1, yi, zi);
      const n010 = hash3(xi, yi + 1, zi);
      const n110 = hash3(xi + 1, yi + 1, zi);
      const n001 = hash3(xi, yi, zi + 1);
      const n101 = hash3(xi + 1, yi, zi + 1);
      const n011 = hash3(xi, yi + 1, zi + 1);
      const n111 = hash3(xi + 1, yi + 1, zi + 1);

      return (
        n000 * (1 - u) * (1 - v) * (1 - w) +
        n100 * u * (1 - v) * (1 - w) +
        n010 * (1 - u) * v * (1 - w) +
        n110 * u * v * (1 - w) +
        n001 * (1 - u) * (1 - v) * w +
        n101 * u * (1 - v) * w +
        n011 * (1 - u) * v * w +
        n111 * u * v * w
      );
    }

    const STEPS = 96; // angular resolution
    const F = 2.0;    // spatial frequency
    const S = 0.4;    // time speed

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
      const R = Math.min(W, H) * 0.34;
      const A = R * 0.18; // amplitude of noise
      const t = (now - startTime) / 1000;

      // Compute blob outline points: r(θ,t) = R + A * domainWarpedNoise
      const pts: { x: number; y: number }[] = [];

      for (let i = 0; i < STEPS; i++) {
        const theta = (i / STEPS) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        // Domain warp: sample noise at warped coordinate
        const warpX = cosT * F + noise3(cosT * 1.5, sinT * 1.5, t * S + 0) * 1.2;
        const warpY = sinT * F + noise3(cosT * 1.5, sinT * 1.5, t * S + 5.3) * 1.2;

        // Map noise from [0,1] → [-1, 1]
        const n = noise3(warpX, warpY, t * S * 0.7) * 2 - 1;
        const r = R + A * n;

        pts.push({ x: cx + r * cosT, y: cy + r * sinT });
      }

      // ── Smooth rolling average over points ───────────────────────────
      const SMOOTH = 5;
      const smoothed: { x: number; y: number }[] = pts.map((_, i) => {
        let sx = 0, sy = 0;
        for (let k = -SMOOTH; k <= SMOOTH; k++) {
          const j = ((i + k) % STEPS + STEPS) % STEPS;
          sx += pts[j].x;
          sy += pts[j].y;
        }
        return { x: sx / (SMOOTH * 2 + 1), y: sy / (SMOOTH * 2 + 1) };
      });

      // Outer glow fill
      ctx.save();
      ctx.beginPath();
      smoothed.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.07;
      ctx.fill();
      ctx.restore();

      // Inner fill
      ctx.save();
      const innerPts = smoothed.map(p => ({
        x: cx + (p.x - cx) * 0.7,
        y: cy + (p.y - cy) * 0.7,
      }));
      ctx.beginPath();
      innerPts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.10;
      ctx.fill();
      ctx.restore();

      // Main blob outline
      ctx.save();
      ctx.beginPath();
      smoothed.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = config.strokeWidth || 3.5;
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 8;
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
