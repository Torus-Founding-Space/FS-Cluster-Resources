"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface CymaticsRippleCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function CymaticsRippleCanvas({
  config,
  isActive = true,
  className = "",
}: CymaticsRippleCanvasProps) {
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
      W = Math.max(48, rect.width);
      H = Math.max(48, rect.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    setup();
    const ro = new ResizeObserver(setup);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const startTime = performance.now();

    // Bessel zeros of J₀(x): roots where J₀(α_n) = 0
    // Precomputed: 2.4048, 5.5201, 8.6537, 11.7915, 14.9309, 18.0711, 21.2116
    const BESSEL_ZEROS = [2.4048, 5.5201, 8.6537, 11.7915, 14.9309, 18.0711, 21.2116];

    // Wave speed (arbitrary units, we use to map radii to screen)
    // k = 2πf/c, r_n = α_n / k = α_n * c / (2πf)
    // Sweep f from f0 to f1: as f increases, k increases, rings shrink inward
    const F0 = 0.8;  // start frequency
    const F1 = 3.2;  // end frequency
    const C = 1.0;   // wave speed

    function render(now: number) {
      if (!ctx || !canvas || W === 0) return;

      const elapsed = (now - startTime) / 1000;
      const cycleDur = (config.durationMs || 5000) / 1000;
      // Ping-pong sweep
      const raw = elapsed % (cycleDur * 2);
      const t = raw < cycleDur ? raw / cycleDur : 1 - (raw - cycleDur) / cycleDur;
      // ease
      const easedT = t * t * (3 - 2 * t);
      const f = F0 + easedT * (F1 - F0);
      const k = (2 * Math.PI * f) / C;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let themeColor = "#CBA6F7";
      const cs = window.getComputedStyle(canvas);
      if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") themeColor = cs.color;

      const cx = W / 2, cy = H / 2;
      const maxR = Math.min(W, H) * 0.46;
      const N = BESSEL_ZEROS.length;

      // Outer boundary circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.10;
      ctx.stroke();
      ctx.restore();

      // Cymatics rings at nodal radii r_n = α_n / k
      // Scale so that r_1 (innermost) maps to maxR when f = F0 (first ring visible at outer boundary)
      // scaleFactor: maps α_n/k to pixels
      // At f=F0: k0 = 2π*F0/C, r_1 = BESSEL_ZEROS[0]/k0 (in units)
      // We want r_1 (at f=F0) to be at maxR:
      // scaleFactor = maxR / (BESSEL_ZEROS[0] / k0) = maxR * k0 / BESSEL_ZEROS[0]
      // But as f changes, we want the scaling to stay consistent
      // Use fixed scaleFactor based on F0 reference
      const k0 = (2 * Math.PI * F0) / C;
      const scaleFactor = (maxR * k0) / BESSEL_ZEROS[0];

      for (let n = 0; n < N; n++) {
        // Nodal radius in screen pixels
        const rPx = (BESSEL_ZEROS[n] / k) * scaleFactor;
        if (rPx > maxR * 1.05 || rPx < 1) continue; // outside visible area

        // Ring brightness: inner rings (higher n = outer zero = further out = larger rPx)
        // Actually inner rings are lower n → smaller rPx → brighter
        const alpha = (1 - n / N) * 0.9 + 0.1;
        const lineWidth = (config.strokeWidth || 2) * (1 - n / N * 0.5);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = Math.max(0.5, lineWidth);
        ctx.globalAlpha = alpha * 0.85;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = n === 0 ? 10 : 4;
        ctx.stroke();
        ctx.restore();

        // Ripple fill (very faint) for inner rings
        if (n < 3) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
          ctx.fillStyle = themeColor;
          ctx.globalAlpha = 0.015 * (3 - n);
          ctx.fill();
          ctx.restore();
        }
      }

      // Center node (pressure antinode)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.9;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Frequency label
      ctx.save();
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = 0.4;
      ctx.textAlign = "center";
      ctx.fillText(`f = ${f.toFixed(2)}`, cx, H - 6);
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
