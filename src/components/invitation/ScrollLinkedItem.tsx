"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface ScrollLinkedItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  offsetY?: number;
  delay?: number;
  direction?: "bottom" | "top" | "left" | "right" | "center-scale";
  trigger?: boolean;
}

export function ScrollLinkedItem({
  children,
  className = "",
  as: Component = "div",
  style,
  offsetY = 24,
  delay = 0,
  direction = "bottom",
  trigger,
}: ScrollLinkedItemProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isIntersectingRef = useRef(false);

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

        if (entry.isIntersecting) {
          if (trigger === undefined || trigger === true) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
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
      ? "translate3d(-28px, 0, 0) scale3d(0.96, 0.96, 1)"
      : direction === "right"
      ? "translate3d(28px, 0, 0) scale3d(0.96, 0.96, 1)"
      : direction === "top"
      ? "translate3d(0, -24px, 0) scale3d(0.96, 0.96, 1)"
      : direction === "center-scale"
      ? "translate3d(0, 6px, 0) scale3d(0.90, 0.90, 1)"
      : `translate3d(0, ${offsetY}px, 0) scale3d(0.96, 0.96, 1)`;

  const animatedStyle: CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
      : initialTransform,
    transitionProperty: "transform, opacity",
    transitionDuration: "750ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
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
