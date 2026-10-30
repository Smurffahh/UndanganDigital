"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface ScrollLinkedItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  offsetY?: number;
  delay?: number;
  trigger?: boolean;
}

export function ScrollLinkedItem({
  children,
  className = "",
  as: Component = "div",
  style,
  offsetY = 32,
  delay = 0,
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

  const animatedStyle: CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
      : `translate3d(0, ${offsetY}px, 0) scale3d(0.98, 0.98, 1)`,
    transitionProperty: "transform, opacity",
    transitionDuration: "700ms",
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
