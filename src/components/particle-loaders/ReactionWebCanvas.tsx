"use client";

import React, { useEffect, useRef } from "react";
import type { CurveConfig } from "../../hooks/useCurveAnimation";

interface ReactionWebCanvasProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

interface WebNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  restX: number;
  restY: number;
  neighbors: number[];
  restLengths: number[];
}

export function ReactionWebCanvas({
  config,
  isActive = true,
  className = "",
}: ReactionWebCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Initialize Network Graph Nodes (concentric ring web)
    const nodeCount = Math.max(12, Math.min(config.particleCount || 18, 30));
    const nodes: WebNode[] = [];

    // Central hub
    nodes.push({
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      restX: 50,
      restY: 50,
      neighbors: [],
      restLengths: [],
    });

    // Outer ring nodes
    const ringCount = nodeCount - 1;
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const r = 28 + (i % 2 === 0 ? 6 : -4);
      const rx = 50 + r * Math.cos(angle);
      const ry = 50 + r * Math.sin(angle);
      nodes.push({
        x: rx,
        y: ry,
        vx: 0,
        vy: 0,
        restX: rx,
        restY: ry,
        neighbors: [0], // Connect to central hub
        restLengths: [r],
      });
    }

    // Connect adjacent nodes on the ring
    for (let i = 1; i <= ringCount; i++) {
      const nextIdx = i === ringCount ? 1 : i + 1;
      const n1 = nodes[i];
      const n2 = nodes[nextIdx];
      const dx = n2.restX - n1.restX;
      const dy = n2.restY - n1.restY;
      const len = Math.hypot(dx, dy);

      n1.neighbors.push(nextIdx);
      n1.restLengths.push(len);
    }

    let lastPulseTime = performance.now();
    let pulseRadius = 0;
    let pulseActive = false;

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

      // Trigger pulse wave every 2.0s
      if (now - lastPulseTime > 2000) {
        pulseActive = true;
        pulseRadius = 0;
        lastPulseTime = now;
      }

      if (pulseActive) {
        pulseRadius += 1.8;
        if (pulseRadius > 60) pulseActive = false;
      }

      const mouse = mouseRef.current;
      const kSpring = 0.08;
      const kRest = 0.05;
      const damping = 0.92;

      // ── Physics Integration ───────────────────────────────────────────
      nodes.forEach((n, i) => {
        const px = (n.x / 100) * width;
        const py = (n.y / 100) * height;
        const restPx = (n.restX / 100) * width;
        const restPy = (n.restY / 100) * height;

        // 1. Spring force to neighbors
        n.neighbors.forEach((nbIdx, k) => {
          const nb = nodes[nbIdx];
          const nbPx = (nb.x / 100) * width;
          const nbPy = (nb.y / 100) * height;

          const dx = nbPx - px;
          const dy = nbPy - py;
          const dist = Math.hypot(dx, dy) || 0.001;
          const restL = (n.restLengths[k] / 100) * Math.min(width, height);
          const delta = dist - restL;

          const fx = (dx / dist) * delta * kSpring;
          const fy = (dy / dist) * delta * kSpring;

          n.vx += fx;
          n.vy += fy;
        });

        // 2. Restoring force to rest position
        n.vx += (restPx - px) * kRest;
        n.vy += (restPy - py) * kRest;

        // 3. Radial Pulse Wave force propagation: F_i = I·e^(-|p_i - pulse_origin|^2 / sigma^2)
        if (pulseActive) {
          const distFromCenter = Math.hypot(n.x - 50, n.y - 50);
          const waveDelta = Math.abs(distFromCenter - pulseRadius);
          if (waveDelta < 6) {
            const impulse = (1 - waveDelta / 6) * 1.6;
            const angle = Math.atan2(n.y - 50, n.x - 50);
            n.vx += Math.cos(angle) * impulse;
            n.vy += Math.sin(angle) * impulse;
          }
        }

        // 4. Interactive Mouse repulsion
        if (mouse.active) {
          const mDist = Math.hypot(mouse.x - px, mouse.y - py);
          if (mDist < 45 && mDist > 0.1) {
            const mForce = (1 - mDist / 45) * 3.5;
            n.vx -= ((mouse.x - px) / mDist) * mForce;
            n.vy -= ((mouse.y - py) / mDist) * mForce;
          }
        }

        // Apply velocity & damping
        n.vx *= damping;
        n.vy *= damping;
        n.x += (n.vx / width) * 100;
        n.y += (n.vy / height) * 100;
      });

      // ── Render Spring Connections ──────────────────────────────────────
      nodes.forEach((n, i) => {
        const px = (n.x / 100) * width;
        const py = (n.y / 100) * height;

        n.neighbors.forEach((nbIdx) => {
          const nb = nodes[nbIdx];
          const nbPx = (nb.x / 100) * width;
          const nbPy = (nb.y / 100) * height;

          const stretch = Math.hypot(nbPx - px, nbPy - py);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(nbPx, nbPy);

          ctx.strokeStyle = themeColor;
          ctx.lineWidth = Math.max(1, (config.strokeWidth || 3.5) * (1 - stretch / 200));
          ctx.globalAlpha = 0.35 + 0.35 * Math.min(1, stretch / 60);
          ctx.stroke();
          ctx.restore();
        });
      });

      // ── Render Radial Pulse Ring ──────────────────────────────────────
      if (pulseActive) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          width / 2,
          height / 2,
          (pulseRadius / 100) * Math.min(width, height),
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 * (1 - pulseRadius / 60);
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();
      }

      // ── Render Network Nodes ──────────────────────────────────────────
      nodes.forEach((n, i) => {
        const px = (n.x / 100) * width;
        const py = (n.y / 100) * height;
        const vel = Math.hypot(n.vx, n.vy);

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, i === 0 ? 3.5 : 2.5 + vel * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.85 + Math.min(0.15, vel * 0.1);
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 6 + vel * 2;
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [config, isActive]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
