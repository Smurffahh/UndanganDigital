"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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

export function useWindowedParallax(maxPercent: number = 8): {
  ref: React.RefObject<HTMLDivElement | null>;
  imageTransform: { transform: string; willChange: string };
  isReducedMotion: boolean;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shiftPercent, setShiftPercent] = useState(0);
  const isReducedMotion = usePrefersReducedMotion();
  const rafId = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!ref.current || isReducedMotion || typeof window === "undefined") return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
      const center = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const normalized = (center - viewportCenter) / (windowHeight / 2);
      const clamped = Math.max(-1.2, Math.min(1.2, normalized));
      const calculatedShift = -clamped * maxPercent;
      setShiftPercent(calculatedShift);
    }
  }, [maxPercent, isReducedMotion]);

  useEffect(() => {
    if (isReducedMotion || typeof window === "undefined") {
      setShiftPercent(0);
      return;
    }

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        updatePosition();
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [updatePosition, isReducedMotion]);

  const imageTransform = {
    transform: isReducedMotion
      ? "none"
      : `translate3d(0, ${shiftPercent.toFixed(2)}%, 0) scale(1.10)`,
    willChange: isReducedMotion ? "auto" : "transform",
  };

  return { ref, imageTransform, isReducedMotion };
}
