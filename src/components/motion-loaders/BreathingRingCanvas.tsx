"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface BreathingRingCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function BreathingRingCanvas({
  config,
  isActive = true,
  className = "",
}: BreathingRingCanvasProps) {
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
      W = Math.max(32, rect.width);
      H = Math.max(32, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();

    // Breathing cycle: 4s inhale + 1s hold + 6s exhale = 11s
    const INHALE = 4000, HOLD = 1000, EXHALE = 6000;
    const CYCLE = INHALE + HOLD + EXHALE;

    // Smoothstep ease (approximates cubic-bezier(0.45,0,0.55,1))
    function smoothstep(t: number) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }

    function getBreathValue(now: number): number {
      const phase = (now - startTime) % CYCLE;
      if (phase < INHALE) return smoothstep(phase / INHALE);
      if (phase < INHALE + HOLD) return 1.0;
      return smoothstep(1 - (phase - INHALE - HOLD) / EXHALE);
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

      const cx = W / 2, cy = H / 2;
      const breath = getBreathValue(now);

      // Ring parameters
      const rMin = Math.min(W, H) * 0.22;
      const rMax = Math.min(W, H) * 0.38;
      const strokeMin = 2;
      const strokeMax = 7;

      const r = rMin + breath * (rMax - rMin);
      const sw = strokeMin + breath * (strokeMax - strokeMin);

      // Outer ambient glow ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + sw * 2, 0, Math.PI * 2);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = sw * 0.5;
      ctx.globalAlpha = 0.12 * breath;
      ctx.stroke();
      ctx.restore();

      // Secondary inner echo ring (180° out of phase - always present)
      const breathInner = 1 - breath;
      const rInner = rMin + breathInner * (rMax - rMin) * 0.5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25 + breathInner * 0.3;
      ctx.stroke();
      ctx.restore();

      // Main breathing ring with dashed arc
      const circumference = 2 * Math.PI * r;
      // dashArray breathes: full when exhaling, gap when inhaling
      const dashLen = circumference * (0.6 + breath * 0.4);
      const gapLen = circumference - dashLen;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (0.8 + breath * 0.2));
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = sw;
      ctx.lineCap = "round";
      ctx.setLineDash([dashLen, gapLen]);
      ctx.globalAlpha = 0.6 + breath * 0.4;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 6 + breath * 10;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Central core dot - expands with breath
      const dotR = 2 + breath * 4;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.7 + breath * 0.3;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 8 + breath * 6;
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
