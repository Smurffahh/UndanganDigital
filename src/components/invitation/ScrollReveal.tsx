"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  variant?: "fade-up" | "fade" | "scale-up" | "float" | "frame-reveal";
  className?: string;
  as?: ElementType;
  threshold?: number;
}

/**
 * Komponen pembungkus animasi scroll editorial yang tenang & elegan
 * Mematuhi prinsip Motion Restraint (Better-UI & WCAG Accessibility):
 * - Translasi vertikal halus (maksimal 14px–16px)
 * - Kurva timing cubic-bezier(0.22, 1, 0.36, 1) dengan durasi 650ms–750ms
 * - Zero transition: all (eksplisit transition-transform, transition-opacity)
 * - Otomatis nonaktif pada prefers-reduced-motion: reduce
 */
export function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up",
  className = "",
  as: Component = "div",
  threshold = 0.12,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Cek preferensi aksesibilitas pengguna
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
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const getVariantStyles = () => {
    if (!isVisible) {
      switch (variant) {
        case "fade":
          return "opacity-0";
        case "scale-up":
          return "opacity-0 translate-y-3.5 scale-[0.97] blur-[2px]";
        case "float":
          return "opacity-0 translate-y-2.5 scale-[0.94]";
        case "frame-reveal":
          return "opacity-0 translate-y-4 scale-[0.97]";
        case "fade-up":
        default:
          return "opacity-0 translate-y-3.5";
      }
    }

    return "opacity-100 translate-y-0 scale-100 blur-none";
  };

  return (
    <Component
      ref={elementRef}
      className={`transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getVariantStyles()} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </Component>
  );
}

interface ParallaxPhotoFrameProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  maxOffset?: number;
}

/**
 * Bingkai Foto Mewah dengan Frame Reveal & Micro-Parallax Halus
 * Digunakan pada Bingkai Mihrab (.arch) dan Kartu Galeri Foto
 */
export function ParallaxPhotoFrame({
  children,
  className = "",
  delay = 180,
  maxOffset = 8,
}: ParallaxPhotoFrameProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
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
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(node);

    // Micro-parallax on passive scroll throttled via requestAnimationFrame
    let rAFId: number | null = null;
    const handleScroll = () => {
      if (rAFId !== null) return;
      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        if (!frameRef.current) return;
        const rect = frameRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Hitung jarak elemen terhadap pusat layar
        if (rect.top < windowHeight && rect.bottom > 0) {
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const normalizedDiff = (elementCenter - viewportCenter) / (windowHeight / 2);
          // Batasi translasi vertikal mikro maksimal ±maxOffset (maksimal 8px-10px)
          const offset = Math.max(-maxOffset, Math.min(maxOffset, -normalizedDiff * maxOffset));
          setParallaxY(offset);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rAFId !== null) cancelAnimationFrame(rAFId);
    };
  }, [maxOffset]);

  return (
    <div
      ref={frameRef}
      className={`overflow-hidden transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97]"
      } ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      <div
        className="w-full h-full transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0) scale(${isVisible ? 1 : 1.04})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
