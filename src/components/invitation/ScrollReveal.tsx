"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  variant?:
    | "fade-up"
    | "fade"
    | "scale-up"
    | "float"
    | "frame-reveal"
    | "bottom-up"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "center-scale";
  direction?: "bottom" | "top" | "left" | "right" | "center-scale";
  className?: string;
  as?: ElementType;
  threshold?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  variant = "bottom-up",
  direction,
  className = "",
  as: Component = "div",
  threshold = 0.12,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "-40px 0px -40px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const getVariantStyles = () => {
    const effectiveDir =
      direction ||
      (variant === "left"
        ? "left"
        : variant === "right"
        ? "right"
        : variant === "top"
        ? "top"
        : variant === "center-scale" || variant === "scale-up"
        ? "center-scale"
        : "bottom");

    if (!isVisible) {
      switch (effectiveDir) {
        case "left":
          return "opacity-0 -translate-x-7 scale-[0.96]";
        case "right":
          return "opacity-0 translate-x-7 scale-[0.96]";
        case "top":
          return "opacity-0 -translate-y-7 scale-[0.96]";
        case "center-scale":
          return "opacity-0 translate-y-0 scale-[0.90]";
        case "bottom":
        default:
          return "opacity-0 translate-y-7 scale-[0.96]";
      }
    }

    return "opacity-100 translate-x-0 translate-y-0 scale-100";
  };

  return (
    <Component
      ref={elementRef}
      className={`transition-[opacity,transform] ${getVariantStyles()} ${className}`}
      style={{
        transitionDuration: isVisible ? "var(--motion-duration-reveal)" : "var(--motion-duration-exit)",
        transitionTimingFunction: "var(--motion-ease-royal)",
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </Component>
  );
}

export function ScrollRevealBottom(props: ScrollRevealProps) {
  return <ScrollReveal {...props} variant="bottom-up" />;
}

interface ParallaxPhotoFrameProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  maxShiftPercent?: number;
}

export function ParallaxPhotoFrame({
  children,
  className = "",
  delay = 180,
  maxShiftPercent = 8,
}: ParallaxPhotoFrameProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shiftPercent, setShiftPercent] = useState(0);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const node = frameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.08,
        rootMargin: "-40px 0px -40px 0px",
      }
    );

    observer.observe(node);

    let rAFId: number | null = null;
    const handleScroll = () => {
      if (rAFId !== null) return;
      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        if (!frameRef.current) return;
        const rect = frameRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight + 100 && rect.bottom > -100) {
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const normalized = (elementCenter - viewportCenter) / (windowHeight / 2);
          const clamped = Math.max(-1.2, Math.min(1.2, normalized));
          const shift = -clamped * maxShiftPercent;
          setShiftPercent(shift);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rAFId !== null) cancelAnimationFrame(rAFId);
    };
  }, [maxShiftPercent]);

  return (
    <div
      ref={frameRef}
      className={`overflow-hidden transition-[opacity,transform] ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97]"
      } ${className}`}
      style={{
        transitionDuration: isVisible ? "var(--motion-duration-reveal)" : "var(--motion-duration-exit)",
        transitionTimingFunction: "var(--motion-ease-royal)",
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      <div
        className="w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${shiftPercent.toFixed(2)}%, 0) scale(1.10)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
