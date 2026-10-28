"use client";

import { useEffect, useRef } from "react";

export function PetalsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = [
      "rgba(192, 131, 135, 0.45)",
      "rgba(226, 189, 188, 0.50)",
      "rgba(233, 211, 163, 0.50)",
      "rgba(255, 250, 246, 0.35)",
    ];

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rafId: number | null = null;
    let running = true;

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      sway: number;
      angle: number;
      spin: number;
      color: string;
      phase: number;
    }

    function spawnPetal(anywhere: boolean): Petal {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -20,
        size: 5 + Math.random() * 7,
        speedY: 0.35 + Math.random() * 0.75,
        sway: 0.6 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      };
    }

    const count = Math.min(26, Math.max(12, Math.floor(width / 55)));
    let petals: Petal[] = Array.from({ length: count }, () => spawnPetal(true));

    function drawPetal(p: Petal) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.55, p.size * 0.75, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.6, -p.size * 0.9, -p.size * 0.55, 0, -p.size);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      petals.forEach((p, i) => {
        p.phase += 0.012;
        p.y += p.speedY;
        p.x += Math.sin(p.phase) * p.sway * 0.4;
        p.angle += p.spin;
        if (p.y > height + 24) {
          petals[i] = spawnPetal(false);
        }
        drawPetal(p);
      });
      rafId = requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        running = true;
        rafId = requestAnimationFrame(animate);
      }
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
