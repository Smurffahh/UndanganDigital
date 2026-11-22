"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface ScrollLinkedItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  offsetY?: number;
  delay?: number;
  stage?: 1 | 2 | 3 | 4 | 5;
  direction?: "bottom" | "top" | "left" | "right" | "center-scale" | "up" | "down" | "none";
  trigger?: boolean;
}

const STAGE_DELAYS: Record<number, number> = {
  1: 0,
  2: 220,
  3: 440,
  4: 660,
  5: 880,
};

export function ScrollLinkedItem({
  children,
  className = "",
  as: Component = "div",
  style,
  offsetY = 24,
  delay = 0,
  stage,
  direction = "bottom",
  trigger,
}: ScrollLinkedItemProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isIntersectingRef = useRef(false);

  const effectiveDelay = delay || (stage ? STAGE_DELAYS[stage] : 0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isIntersectingRef.current = entry.isIntersecting;

        if (trigger === undefined || trigger === true) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "-40px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [trigger]);

  useEffect(() => {
    if (trigger === true && isIntersectingRef.current && !isVisible) {
      setIsVisible(true);
    }
  }, [trigger, isVisible]);

  const initialTransform =
    direction === "left"
      ? "translate3d(-22px, 0, 0) scale3d(0.97, 0.97, 1)"
      : direction === "right"
      ? "translate3d(22px, 0, 0) scale3d(0.97, 0.97, 1)"
      : direction === "top" || direction === "down"
      ? "translate3d(0, -22px, 0) scale3d(0.97, 0.97, 1)"
      : direction === "none"
      ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
      : direction === "center-scale"
      ? "translate3d(0, 0, 0) scale3d(0.90, 0.90, 1)"
      : `translate3d(0, ${offsetY || 22}px, 0) scale3d(0.97, 0.97, 1)`;

  const animatedStyle: CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
      : initialTransform,
    transitionProperty: "transform, opacity",
    transitionDuration: isVisible ? "900ms" : "var(--motion-duration-exit)",
    transitionTimingFunction: "var(--motion-ease-royal)",
    transitionDelay: isVisible ? `${effectiveDelay}ms` : "0ms",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
  };

  return (
    <Component
      ref={containerRef}
      className={className}
      style={animatedStyle}
    >
      {children}
    </Component>
  );
}
