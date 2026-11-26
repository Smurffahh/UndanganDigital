"use client";

import { useEffect, useState, useRef } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

export function useParallax(speed: number = 0.2, reverse: boolean = false): {
  offset: number;
  transformStyle: { transform: string; willChange: string };
  isReducedMotion: boolean;
} {
  const [offset, setOffset] = useState(0);
  const isReducedMotion = usePrefersReducedMotion();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (isReducedMotion || typeof window === "undefined") {
      setOffset(0);
      return;
    }

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const calculatedOffset = (reverse ? -1 : 1) * scrollY * speed;
        setOffset(calculatedOffset);
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [speed, reverse, isReducedMotion]);

  const transformStyle = {
    transform: isReducedMotion
      ? "none"
      : `translate3d(0, ${offset.toFixed(2)}px, 0)`,
    willChange: isReducedMotion ? "auto" : "transform",
  };

  return { offset, transformStyle, isReducedMotion };
}
