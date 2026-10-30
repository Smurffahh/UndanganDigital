"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface ScrollLinkedItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  offsetY?: number;
}

export function ScrollLinkedItem({
  children,
  className = "",
  as: Component = "div",
  style,
  offsetY = 64,
}: ScrollLinkedItemProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        node.style.opacity = "1";
        node.style.transform = "none";
        return;
      }
    }

    let currentP = 0;
    let targetP = 0;
    let rAFId: number | null = null;
    let isRunning = false;

    const calculateTarget = () => {
      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const entryBottom = windowHeight * 0.98;
      const entryTop = windowHeight * 0.62;
      const range = entryBottom - entryTop;

      if (rect.top >= entryBottom) {
        targetP = 0;
      } else if (rect.top <= entryTop) {
        targetP = 1;
      } else {
        targetP = Math.max(0, Math.min(1, (entryBottom - rect.top) / range));
      }
    };

    calculateTarget();
    currentP = targetP;
    node.style.opacity = currentP.toFixed(3);
    node.style.transform = `translate3d(0, ${((1 - currentP) * offsetY).toFixed(1)}px, 0) scale(${(0.95 + currentP * 0.05).toFixed(3)})`;

    const tick = () => {
      calculateTarget();
      currentP = currentP + (targetP - currentP) * 0.12;

      if (Math.abs(currentP - targetP) < 0.002) {
        currentP = targetP;
      }

      node.style.opacity = currentP.toFixed(3);
      node.style.transform = `translate3d(0, ${((1 - currentP) * offsetY).toFixed(1)}px, 0) scale(${(0.95 + currentP * 0.05).toFixed(3)})`;

      if (Math.abs(currentP - targetP) >= 0.002) {
        rAFId = requestAnimationFrame(tick);
      } else {
        isRunning = false;
        rAFId = null;
      }
    };

    const requestTick = () => {
      if (!isRunning) {
        isRunning = true;
        rAFId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (rAFId !== null) cancelAnimationFrame(rAFId);
    };
  }, [offsetY]);

  return (
    <Component
      ref={containerRef}
      className={`will-change-[transform,opacity] ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}
