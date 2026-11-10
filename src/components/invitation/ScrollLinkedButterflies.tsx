"use client";

import { useEffect, useRef } from "react";
import { ButterflyAnatomySvg } from "./ButterflyAnatomySvg";

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function lerpAngle(current: number, target: number, factor: number): number {
  let diff = (target - current) % 360;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  return current + diff * factor;
}

interface ButterflyMotionState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  angle: number;
  targetAngle: number;
  isFlappingFast: boolean;
}

export function ScrollLinkedButterflies() {
  const b1Ref = useRef<HTMLDivElement>(null);
  const b2Ref = useRef<HTMLDivElement>(null);
  const b3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      if (b1Ref.current) {
        b1Ref.current.style.transform = "translate3d(calc(100vw - 48px), 16vh, 0) rotate(15deg)";
      }
      if (b2Ref.current) {
        b2Ref.current.style.transform = "translate3d(18px, 48vh, 0) rotate(-20deg)";
      }
      return;
    }

    let rafId: number;
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const b1: ButterflyMotionState = {
      x: window.innerWidth - 42,
      y: window.innerHeight * 0.28,
      prevX: window.innerWidth - 42,
      prevY: window.innerHeight * 0.28,
      angle: 15,
      targetAngle: 15,
      isFlappingFast: false,
    };

    const b2: ButterflyMotionState = {
      x: 26,
      y: window.innerHeight * 0.52,
      prevX: 26,
      prevY: window.innerHeight * 0.52,
      angle: -25,
      targetAngle: -25,
      isFlappingFast: false,
    };

    const b3: ButterflyMotionState = {
      x: window.innerWidth - 30,
      y: window.innerHeight * 0.72,
      prevX: window.innerWidth - 30,
      prevY: window.innerHeight * 0.72,
      angle: -10,
      targetAngle: -10,
      isFlappingFast: false,
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
      lastScrollTime = performance.now();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const updateButterflies = (now: number) => {
      smoothScrollY = lerp(smoothScrollY, targetScrollY, 0.08);
      const scrollDiff = Math.abs(targetScrollY - smoothScrollY);
      const isActivelyScrolling = scrollDiff > 0.4 || now - lastScrollTime < 160;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 640;
      const cardWidth = Math.min(w, 540);
      const cardLeft = (w - cardWidth) / 2;
      const cardRight = cardLeft + cardWidth;

      const tSec = now * 0.001;

      // Primary Swallowtail: Right flank / margin
      const b1TargetX = isMobile
        ? Math.max(12, Math.min(w - 50, w - 46 + Math.sin(smoothScrollY * 0.0022 + tSec * 1.5) * 12))
        : cardRight + 20 + Math.sin(smoothScrollY * 0.0018 + tSec * 1.2) * 26;

      const b1TargetY = Math.max(
        40,
        Math.min(
          h - 60,
          h * (0.34 + 0.22 * Math.cos(smoothScrollY * 0.002 + tSec * 0.6)) +
            Math.sin(tSec * 2.8) * 12
        )
      );

      b1.x = lerp(b1.x, b1TargetX, 0.1);
      b1.y = lerp(b1.y, b1TargetY, 0.1);

      const dx1 = b1.x - b1.prevX;
      const dy1 = b1.y - b1.prevY;
      if (dx1 * dx1 + dy1 * dy1 > 0.08) {
        b1.targetAngle = (Math.atan2(dy1, dx1) * 180) / Math.PI + 90;
      } else {
        b1.targetAngle += Math.sin(tSec * 1.5) * 0.25;
      }
      b1.angle = lerpAngle(b1.angle, b1.targetAngle, 0.12);
      b1.prevX = b1.x;
      b1.prevY = b1.y;

      if (b1Ref.current) {
        b1Ref.current.style.transform = `translate3d(${b1.x.toFixed(1)}px, ${b1.y.toFixed(1)}px, 0) rotate(${b1.angle.toFixed(1)}deg)`;
        if (b1.isFlappingFast !== isActivelyScrolling) {
          b1.isFlappingFast = isActivelyScrolling;
          b1Ref.current.style.setProperty("--wing-speed", isActivelyScrolling ? "0.14s" : "0.45s");
        }
      }

      // Companion Morpho: Left flank / margin
      const b2TargetX = isMobile
        ? Math.max(8, Math.min(w - 50, 24 + Math.sin(smoothScrollY * 0.0025 + 1.8 + tSec * 1.4) * 12))
        : Math.max(12, cardLeft - 50 + Math.sin(smoothScrollY * 0.0022 + 1.8 + tSec * 1.1) * 24);

      const b2TargetY = Math.max(
        50,
        Math.min(
          h - 70,
          h * (0.56 + 0.2 * Math.sin(smoothScrollY * 0.0024 + 1.4 + tSec * 0.7)) +
            Math.cos(tSec * 2.5) * 10
        )
      );

      b2.x = lerp(b2.x, b2TargetX, 0.09);
      b2.y = lerp(b2.y, b2TargetY, 0.09);

      const dx2 = b2.x - b2.prevX;
      const dy2 = b2.y - b2.prevY;
      if (dx2 * dx2 + dy2 * dy2 > 0.08) {
        b2.targetAngle = (Math.atan2(dy2, dx2) * 180) / Math.PI + 90;
      } else {
        b2.targetAngle += Math.sin(tSec * 1.8 + 1) * 0.3;
      }
      b2.angle = lerpAngle(b2.angle, b2.targetAngle, 0.11);
      b2.prevX = b2.x;
      b2.prevY = b2.y;

      if (b2Ref.current) {
        b2Ref.current.style.transform = `translate3d(${b2.x.toFixed(1)}px, ${b2.y.toFixed(1)}px, 0) rotate(${b2.angle.toFixed(1)}deg)`;
        if (b2.isFlappingFast !== isActivelyScrolling) {
          b2.isFlappingFast = isActivelyScrolling;
          b2Ref.current.style.setProperty("--wing-speed", isActivelyScrolling ? "0.14s" : "0.45s");
        }
      }

      // Micro Swallowtail: Peripheral flutter
      const b3TargetX = isMobile
        ? Math.max(10, Math.min(w - 40, w - 28 + Math.sin(smoothScrollY * 0.003 + 2.8 + tSec * 2) * 8))
        : cardRight + 55 + Math.sin(smoothScrollY * 0.0026 + 2.8 + tSec * 1.6) * 18;

      const b3TargetY = Math.max(
        60,
        Math.min(
          h - 80,
          h * (0.74 + 0.14 * Math.sin(smoothScrollY * 0.0016 + 2.2)) +
            Math.sin(tSec * 3.2) * 8
        )
      );

      b3.x = lerp(b3.x, b3TargetX, 0.08);
      b3.y = lerp(b3.y, b3TargetY, 0.08);

      const dx3 = b3.x - b3.prevX;
      const dy3 = b3.y - b3.prevY;
      if (dx3 * dx3 + dy3 * dy3 > 0.08) {
        b3.targetAngle = (Math.atan2(dy3, dx3) * 180) / Math.PI + 90;
      }
      b3.angle = lerpAngle(b3.angle, b3.targetAngle, 0.1);
      b3.prevX = b3.x;
      b3.prevY = b3.y;

      if (b3Ref.current) {
        b3Ref.current.style.transform = `translate3d(${b3.x.toFixed(1)}px, ${b3.y.toFixed(1)}px, 0) rotate(${b3.angle.toFixed(1)}deg)`;
        if (b3.isFlappingFast !== isActivelyScrolling) {
          b3.isFlappingFast = isActivelyScrolling;
          b3Ref.current.style.setProperty("--wing-speed", isActivelyScrolling ? "0.14s" : "0.45s");
        }
      }

      rafId = requestAnimationFrame(updateButterflies);
    };

    rafId = requestAnimationFrame(updateButterflies);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={b1Ref}
        data-butterfly-guide="primary"
        className="absolute top-0 left-0"
        style={{ willChange: "transform", transform: "translate3d(-100px, -100px, 0)" }}
      >
        <ButterflyAnatomySvg variant="swallowtail" className="w-11 h-10" />
      </div>

      <div
        ref={b2Ref}
        data-butterfly-guide="companion"
        className="absolute top-0 left-0 opacity-90"
        style={{ willChange: "transform", transform: "translate3d(-100px, -100px, 0)" }}
      >
        <ButterflyAnatomySvg variant="morpho" className="w-8 h-8" />
      </div>

      <div
        ref={b3Ref}
        data-butterfly-guide="micro"
        className="absolute top-0 left-0 opacity-75 hidden sm:block"
        style={{ willChange: "transform", transform: "translate3d(-100px, -100px, 0)" }}
      >
        <ButterflyAnatomySvg variant="swallowtail" className="w-6 h-6" />
      </div>
    </div>
  );
}
