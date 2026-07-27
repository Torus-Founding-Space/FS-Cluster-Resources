"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface LorenzCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function LorenzCanvas({
  config,
  isActive = true,
  className = "",
}: LorenzCanvasProps) {
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
      W = Math.max(60, rect.width);
      H = Math.max(60, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Lorenz parameters
    const SIGMA = 10, RHO = 28, BETA = 8 / 3;
    const DT = 0.006; // RK4 time step

    // Initial conditions near attractor
    let lx = 0.1, ly = 0.0, lz = 0.0;

    // Lorenz derivatives
    function deriv(x: number, y: number, z: number) {
      return {
        dx: SIGMA * (y - x),
        dy: x * (RHO - z) - y,
        dz: x * y - BETA * z,
      };
    }

    // RK4 step
    function rk4Step() {
      const k1 = deriv(lx, ly, lz);
      const k2 = deriv(lx + k1.dx * DT / 2, ly + k1.dy * DT / 2, lz + k1.dz * DT / 2);
      const k3 = deriv(lx + k2.dx * DT / 2, ly + k2.dy * DT / 2, lz + k2.dz * DT / 2);
      const k4 = deriv(lx + k3.dx * DT, ly + k3.dy * DT, lz + k3.dz * DT);

      lx += (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * DT / 6;
      ly += (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy) * DT / 6;
      lz += (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz) * DT / 6;
    }

    // Burn-in: run 2000 steps to reach attractor
    for (let i = 0; i < 2000; i++) rk4Step();

    // Tail: circular buffer of screen positions
    const TAIL_LEN = 180;
    type Pt2D = { sx: number; sy: number };
    const tail: Pt2D[] = [];

    // Lorenz attractor projected onto (x,z) plane
    // Approximate bounds: x ∈ [-25, 25], z ∈ [0, 50]
    const X_MIN = -25, X_MAX = 25;
    const Z_MIN = 2, Z_MAX = 48;

    const STEPS_PER_FRAME = 4; // sub-steps per rAF for smooth motion

    function toScreen(lxv: number, lzv: number): Pt2D {
      const margin = 0.08;
      const sx = (margin + (lxv - X_MIN) / (X_MAX - X_MIN) * (1 - 2 * margin)) * W;
      const sy = ((1 - margin) - (lzv - Z_MIN) / (Z_MAX - Z_MIN) * (1 - 2 * margin)) * H;
      return { sx, sy };
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

      // Advance particle
      for (let s = 0; s < STEPS_PER_FRAME; s++) {
        rk4Step();
      }
      const cur = toScreen(lx, lz);
      tail.push(cur);
      if (tail.length > TAIL_LEN) tail.shift();

      // Draw tail with fading opacity
      if (tail.length > 1) {
        for (let i = 1; i < tail.length; i++) {
          const frac = i / tail.length;
          const alpha = frac * frac * 0.85;
          const width = 1.2 + frac * (config.strokeWidth || 3) * 0.5;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tail[i - 1].sx, tail[i - 1].sy);
          ctx.lineTo(tail[i].sx, tail[i].sy);
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.globalAlpha = alpha;
          if (frac > 0.85) {
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      // Head particle
      if (cur) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cur.sx, cur.sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
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
