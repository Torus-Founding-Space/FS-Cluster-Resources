"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface PhaseTransitionCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function PhaseTransitionCanvas({
  config,
  isActive = true,
  className = "",
}: PhaseTransitionCanvasProps) {
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

    const N = 12; // 12x12 spin lattice
    let spins = new Int8Array(N * N);

    const initSpins = () => {
      for (let i = 0; i < N * N; i++) {
        spins[i] = Math.random() < 0.5 ? 1 : -1;
      }
    };
    initSpins();

    let cycleStart = performance.now();
    const cycleDuration = config.durationMs || 5000;

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const elapsed = now - cycleStart;
      if (elapsed > cycleDuration) {
        cycleStart = now;
        initSpins();
      }
      const progress = Math.min(1.0, elapsed / cycleDuration);
      // Temperature decreases over time (thermal annealing T: 4.0 -> 0.1)
      const T = 4.0 * Math.pow(1 - progress, 2) + 0.1;

      // Metropolis Ising Monte Carlo simulation steps
      const steps = 150;
      for (let s = 0; s < steps; s++) {
        const x = Math.floor(Math.random() * N);
        const y = Math.floor(Math.random() * N);
        const idx = y * N + x;
        const currentSpin = spins[idx];

        // Sum neighbor spins (periodic boundary conditions)
        const left  = spins[y * N + ((x - 1 + N) % N)];
        const right = spins[y * N + ((x + 1) % N)];
        const up    = spins[((y - 1 + N) % N) * N + x];
        const down  = spins[((y + 1) % N) * N + x];
        const neighborSum = left + right + up + down;

        // Energy change if flipped: dE = 2 * s_i * sum(neighbors)
        const dE = 2 * currentSpin * neighborSum;
        if (dE <= 0 || Math.random() < Math.exp(-dE / T)) {
          spins[idx] = -currentSpin as any;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const cellW = W / N;
      const cellH = H / N;

      // Render spin grid
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const s = spins[y * N + x];
          const px = (x + 0.5) * cellW;
          const py = (y + 0.5) * cellH;

          ctx.save();
          ctx.translate(px, py);

          if (s === 1) {
            // Spin UP vector arrow
            ctx.beginPath();
            ctx.moveTo(0, cellH * 0.28);
            ctx.lineTo(0, -cellH * 0.28);
            ctx.lineTo(-cellW * 0.12, -cellH * 0.12);
            ctx.moveTo(0, -cellH * 0.28);
            ctx.lineTo(cellW * 0.12, -cellH * 0.12);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = (config.strokeWidth || 3.5) * 0.7;
            ctx.lineCap = "round";
            ctx.globalAlpha = 0.85;
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 4;
            ctx.stroke();
          } else {
            // Spin DOWN vector arrow
            ctx.beginPath();
            ctx.moveTo(0, -cellH * 0.28);
            ctx.lineTo(0, cellH * 0.28);
            ctx.lineTo(-cellW * 0.12, cellH * 0.12);
            ctx.moveTo(0, cellH * 0.28);
            ctx.lineTo(cellW * 0.12, cellH * 0.12);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = (config.strokeWidth || 3.5) * 0.7;
            ctx.lineCap = "round";
            ctx.globalAlpha = 0.4;
            ctx.stroke();
          }

          ctx.restore();
        }
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
