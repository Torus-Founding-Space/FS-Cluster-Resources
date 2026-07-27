"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface SandTimerCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function SandTimerCanvas({
  config,
  isActive = true,
  className = "",
}: SandTimerCanvasProps) {
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

    const startTime = performance.now();
    const cycleDuration = config.durationMs || 4000;

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const elapsed = (now - startTime) % cycleDuration;
      // progress 0→1: sand empties from top, fills bottom
      const progress = elapsed / cycleDuration;
      // Smooth ease
      const smooth = progress * progress * (3 - 2 * progress);

      // Flip rotation at end of each cycle
      const cycleIdx = Math.floor((now - startTime) / cycleDuration);
      const flipAngle = cycleIdx % 2 === 0 ? 0 : Math.PI;

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(flipAngle);
      ctx.translate(-W / 2, -H / 2);

      // ── Hourglass Vessel Path (reused for clip & stroke) ─────────────
      const vesselPath = () => {
        ctx.beginPath();
        ctx.moveTo(0.24 * W, 0.10 * H);
        ctx.lineTo(0.76 * W, 0.10 * H);
        ctx.bezierCurveTo(0.76 * W, 0.30 * H, 0.55 * W, 0.43 * H, 0.535 * W, 0.47 * H);
        ctx.lineTo(0.535 * W, 0.53 * H);
        ctx.bezierCurveTo(0.55 * W, 0.57 * H, 0.76 * W, 0.70 * H, 0.76 * W, 0.90 * H);
        ctx.lineTo(0.24 * W, 0.90 * H);
        ctx.bezierCurveTo(0.24 * W, 0.70 * H, 0.45 * W, 0.57 * H, 0.465 * W, 0.53 * H);
        ctx.lineTo(0.465 * W, 0.47 * H);
        ctx.bezierCurveTo(0.45 * W, 0.43 * H, 0.24 * W, 0.30 * H, 0.24 * W, 0.10 * H);
        ctx.closePath();
      };

      // Glass ambient fill
      ctx.save();
      vesselPath();
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.restore();

      // ── Top Bulb Sand Fill (drains down) ─────────────────────────────
      // Top bulb region: y ∈ [0.10H, 0.47H]
      // At progress=0: filled (fill top→47%), At progress=1: empty
      {
        const topBottom = 0.47 * H;
        const topTop = 0.10 * H;
        const topHeight = topBottom - topTop;
        // Sand level: starts full at topTop, drains to topBottom
        const sandTopY = topTop + smooth * topHeight;

        ctx.save();
        vesselPath();
        ctx.clip();

        // Draw sand as a gradient rectangle from sandTopY to topBottom
        const grad = ctx.createLinearGradient(0, sandTopY, 0, topBottom);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.15, themeColor);
        grad.addColorStop(1, themeColor);

        ctx.globalAlpha = 0.55 - smooth * 0.25;
        ctx.fillStyle = grad;
        ctx.fillRect(0, sandTopY, W, topBottom - sandTopY + 2);
        ctx.restore();
      }

      // ── Bottom Bulb Sand Fill (fills up) ─────────────────────────────
      // Bottom bulb region: y ∈ [0.53H, 0.90H]
      {
        const botTop = 0.53 * H;
        const botBottom = 0.90 * H;
        const botHeight = botBottom - botTop;
        // Sand fills from bottom: level rises from botBottom to botBottom - smooth*botHeight
        const sandTopY = botBottom - smooth * botHeight;

        ctx.save();
        vesselPath();
        ctx.clip();

        const grad = ctx.createLinearGradient(0, sandTopY, 0, botBottom);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.2, themeColor);
        grad.addColorStop(1, themeColor);

        ctx.globalAlpha = 0.3 + smooth * 0.3;
        ctx.fillStyle = grad;
        ctx.fillRect(0, sandTopY, W, botBottom - sandTopY + 2);
        ctx.restore();
      }

      // ── Neck stream (animated drip line) ──────────────────────────────
      if (smooth < 0.98) {
        const streamAlpha = (1 - smooth) * 0.9;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(W * 0.50, H * 0.47);
        ctx.lineTo(W * 0.50, H * 0.53);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = streamAlpha;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 6;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      }

      // ── Glass Vessel Stroke ─────────────────────────────────────────
      ctx.save();
      vesselPath();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = config.strokeWidth || 3;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 8;
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();

      // End caps
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = (config.strokeWidth || 3) * 1.2;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0.20 * W, 0.10 * H); ctx.lineTo(0.80 * W, 0.10 * H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.20 * W, 0.90 * H); ctx.lineTo(0.80 * W, 0.90 * H); ctx.stroke();
      ctx.restore();

      // Specular highlights
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.50)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0.27 * W, 0.13 * H);
      ctx.bezierCurveTo(0.29 * W, 0.27 * H, 0.42 * W, 0.39 * H, 0.465 * W, 0.44 * H);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.moveTo(0.73 * W, 0.87 * H);
      ctx.bezierCurveTo(0.71 * W, 0.73 * H, 0.58 * W, 0.61 * H, 0.535 * W, 0.56 * H);
      ctx.stroke();
      ctx.restore();

      // Waist accent
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0.44 * W, 0.50 * H);
      ctx.lineTo(0.56 * W, 0.50 * H);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // restore flip rotation

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
