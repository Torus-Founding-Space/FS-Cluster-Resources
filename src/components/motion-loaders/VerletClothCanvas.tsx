"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface VerletClothCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

interface VParticle {
  x: number; y: number;     // current position (px)
  ox: number; oy: number;   // old position (px)
  pinned: boolean;
}

interface VConstraint {
  a: number; b: number;     // particle indices
  len: number;              // rest length (px)
}

export function VerletClothCanvas({
  config,
  isActive = true,
  className = "",
}: VerletClothCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    const COLS = 7, ROWS = 7;
    const ITERS = 8; // constraint iterations per frame
    const GRAVITY = 0.25; // px/frame²
    const DAMP = 0.99;
    const DT = 1;

    let particles: VParticle[] = [];
    let constraints: VConstraint[] = [];

    const buildCloth = () => {
      particles = [];
      constraints = [];

      const marginX = W * 0.1;
      const marginY = H * 0.08;
      const cw = (W - marginX * 2) / (COLS - 1);
      const ch = (H - marginY * 2) * 0.6 / (ROWS - 1);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = marginX + c * cw;
          const y = marginY + r * ch;
          const pinned = r === 0 && (c === 0 || c === COLS - 1);
          particles.push({ x, y, ox: x, oy: y, pinned });
        }
      }

      const idx = (r: number, c: number) => r * COLS + c;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (c < COLS - 1) {
            const a = idx(r, c), b = idx(r, c + 1);
            const dx = particles[b].x - particles[a].x;
            const dy = particles[b].y - particles[a].y;
            constraints.push({ a, b, len: Math.hypot(dx, dy) });
          }
          if (r < ROWS - 1) {
            const a = idx(r, c), b = idx(r + 1, c);
            const dx = particles[b].x - particles[a].x;
            const dy = particles[b].y - particles[a].y;
            constraints.push({ a, b, len: Math.hypot(dx, dy) });
          }
        }
      }
    };

    const setup = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(60, rect.width);
      H = Math.max(60, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      buildCloth();
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();

    function stepCloth(now: number) {
      const t = (now - startTime) / 1000;
      // Wind: ax = W_amp * sin(ω*t), varies slowly
      const windX = Math.sin(t * 0.8) * 0.18 + Math.sin(t * 1.7) * 0.08;

      // Verlet integration: p_new = 2p - p_old + a*dt²
      for (const p of particles) {
        if (p.pinned) continue;
        const vx = (p.x - p.ox) * DAMP;
        const vy = (p.y - p.oy) * DAMP;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx + windX * DT * DT;
        p.y += vy + GRAVITY * DT * DT;
      }

      // Constraint satisfaction (Jakobsen)
      for (let iter = 0; iter < ITERS; iter++) {
        for (const c of constraints) {
          const a = particles[c.a], b = particles[c.b];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const delta = (dist - c.len) / dist;
          const fx = dx * delta * 0.5;
          const fy = dy * delta * 0.5;
          if (!a.pinned) { a.x += fx; a.y += fy; }
          if (!b.pinned) { b.x -= fx; b.y -= fy; }
        }
      }
    }

    function render(now: number) {
      if (!ctx || !canvas || W === 0 || particles.length === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      stepCloth(now);

      const idx = (r: number, c: number) => r * COLS + c;

      // Draw structural (horizontal) segments
      ctx.save();
      for (let r = 0; r < ROWS; r++) {
        const rowFrac = r / (ROWS - 1);
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = particles[idx(r, c)];
          if (c === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = (config.strokeWidth || 3) * (0.4 + 0.6 * (1 - rowFrac));
        ctx.globalAlpha = 0.55 + 0.35 * (1 - rowFrac);
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 3;
        ctx.stroke();
      }
      ctx.restore();

      // Draw vertical warp threads
      ctx.save();
      for (let c = 0; c < COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const p = particles[idx(r, c)];
          if (r === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.25;
        ctx.stroke();
      }
      ctx.restore();

      // Pin anchors (top-left and top-right)
      [idx(0, 0), idx(0, COLS - 1)].forEach(i => {
        const p = particles[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 8;
        ctx.fill();
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
