"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface GearTrainCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function GearTrainCanvas({
  config,
  isActive = true,
  className = "",
}: GearTrainCanvasProps) {
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

    // ── Gear definitions (module-based geometry) ─────────────────────────
    // Tooth counts: N1=10 (driver), N2=15 (idler), N3=22 (driven)
    // Module m scales with canvas
    // Pitch radius: R = N*m/2
    // Addendum: Ra = R + m
    // Dedendum: Rd = R - 1.25*m

    // Gear layout: driver (left), idler (center-right), driven (right)
    // Positioned in a gentle arc for visual interest

    function getGearParams(W: number) {
      // Scale module with canvas size
      const m = W * 0.027; // tooth height ≈ 2*m per tooth
      const N1 = 10, N2 = 15, N3 = 22;
      const R1 = N1 * m / 2, R2 = N2 * m / 2, R3 = N3 * m / 2;
      const d12 = R1 + R2; // center distance 1-2
      const d23 = R2 + R3; // center distance 2-3

      // Layout: center gear 2 at W/2, H*0.52
      const g2x = W * 0.50, g2y = H * 0.52;
      // Gear 1 left of gear 2, slightly above
      const g1x = g2x - d12 * 0.88, g1y = g2y - d12 * 0.48;
      // Gear 3 right of gear 2, slightly above
      const g3x = g2x + d23 * 0.88, g3y = g2y - d23 * 0.30;

      return { m, N1, N2, N3, R1, R2, R3, g1x, g1y, g2x, g2y, g3x, g3y };
    }

    /**
     * Draw a single gear using epicycloid + hypocycloid tooth profile.
     * Each tooth is approximated by 4 bezier control points.
     */
    function drawGear(
      gctx: CanvasRenderingContext2D,
      cx: number, cy: number,
      N: number, m: number,
      angle: number,
      themeColor: string,
      alpha: number
    ) {
      const Rp = N * m / 2;
      const Ra = Rp + m;
      const Rd = Rp - 1.25 * m;
      const angPitch = (Math.PI * 2) / N;
      const halfTooth = angPitch * 0.38;
      const halfSpace = angPitch * 0.12;

      gctx.save();
      gctx.translate(cx, cy);
      gctx.rotate(angle);

      gctx.beginPath();
      for (let i = 0; i < N; i++) {
        const base = i * angPitch;

        if (i === 0) {
          gctx.moveTo(Rd * Math.cos(base - halfTooth - halfSpace),
                     Rd * Math.sin(base - halfTooth - halfSpace));
        } else {
          gctx.arc(0, 0, Rd, base - halfTooth - halfSpace + angPitch * (i === 0 ? 0 : -1), base - halfTooth - halfSpace, false);
        }

        const leftRoot  = base - halfTooth - halfSpace;
        const leftTip   = base - halfTooth * 0.5;
        const rightTip  = base + halfTooth * 0.5;
        const rightRoot = base + halfTooth + halfSpace;

        const rxL = Rd * Math.cos(leftRoot), ryL = Rd * Math.sin(leftRoot);
        const txL = Ra * Math.cos(leftTip), tyL = Ra * Math.sin(leftTip);
        const txR = Ra * Math.cos(rightTip), tyR = Ra * Math.sin(rightTip);
        const rxR = Rd * Math.cos(rightRoot), ryR = Rd * Math.sin(rightRoot);

        const flanks = 0.88;
        const cpLx = (Rp * flanks) * Math.cos(leftRoot * 0.3 + leftTip * 0.7);
        const cpLy = (Rp * flanks) * Math.sin(leftRoot * 0.3 + leftTip * 0.7);
        const cpRx = (Rp * flanks) * Math.cos(rightTip * 0.7 + rightRoot * 0.3);
        const cpRy = (Rp * flanks) * Math.sin(rightTip * 0.7 + rightRoot * 0.3);

        gctx.lineTo(rxL, ryL);
        gctx.quadraticCurveTo(cpLx, cpLy, txL, tyL);
        gctx.arc(0, 0, Ra, leftTip, rightTip);
        gctx.quadraticCurveTo(cpRx, cpRy, rxR, ryR);
      }
      gctx.closePath();

      gctx.fillStyle = "rgba(255,255,255,0.04)";
      gctx.fill();
      gctx.strokeStyle = themeColor;
      gctx.lineWidth = config.strokeWidth || 2.5;
      gctx.lineJoin = "round";
      gctx.globalAlpha = alpha;
      gctx.shadowColor = themeColor;
      gctx.shadowBlur = 5;
      gctx.stroke();

      gctx.beginPath();
      gctx.arc(0, 0, Rd * 0.35, 0, Math.PI * 2);
      gctx.strokeStyle = themeColor;
      gctx.globalAlpha = alpha * 0.6;
      gctx.shadowBlur = 0;
      gctx.lineWidth = 1.5;
      gctx.stroke();

      for (let s = 0; s < 3; s++) {
        const sa = (s / 3) * Math.PI * 2;
        gctx.beginPath();
        gctx.moveTo(Rd * 0.35 * Math.cos(sa), Rd * 0.35 * Math.sin(sa));
        gctx.lineTo(Rd * 0.75 * Math.cos(sa), Rd * 0.75 * Math.sin(sa));
        gctx.stroke();
      }

      gctx.restore();
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

      const { m, N1, N2, N3, R1, R2, R3, g1x, g1y, g2x, g2y, g3x, g3y } = getGearParams(W);

      // Gear 1 (driver): angular velocity ω₁ (base)
      const elapsed = (now - startTime) / 1000;
      const omega1 = (2 * Math.PI) / ((config.durationMs || 4000) / 1000);

      // Gear ratio law: ω₁·N₁ = ω₂·N₂ = ...
      // External gears: adjacent gears rotate in opposite directions
      // θ₂ = -θ₁ · N₁/N₂,  θ₃ = -θ₂ · N₂/N₃ = +θ₁ · N₁/N₃
      const theta1 = omega1 * elapsed;
      const theta2 = -theta1 * (N1 / N2);
      // Mesh offset: gear 2 tooth must align with space between gear 1 teeth at contact point
      const meshOffset2 = Math.PI / N2; // half-tooth offset so teeth interlock
      const theta3 = -theta2 * (N2 / N3) + Math.PI / N3;

      // Draw mesh connection lines (very subtle)
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(g1x, g1y); ctx.lineTo(g2x, g2y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(g2x, g2y); ctx.lineTo(g3x, g3y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Axle dots
      [[g1x, g1y], [g2x, g2y], [g3x, g3y]].forEach(([ax, ay]) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      // Draw gears (back-to-front: largest first)
      drawGear(ctx, g3x, g3y, N3, m, theta3, themeColor, 0.75);
      drawGear(ctx, g2x, g2y, N2, m, theta2 + meshOffset2, themeColor, 0.85);
      drawGear(ctx, g1x, g1y, N1, m, theta1, themeColor, 1.0);

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
