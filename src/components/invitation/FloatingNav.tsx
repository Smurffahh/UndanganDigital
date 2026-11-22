"use client";

import { useEffect, useState, useRef } from "react";
import {
  Home,
  Users,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Gift,
  MessageSquare,
} from "lucide-react";

interface FloatingNavProps {
  isOpened: boolean;
  isGalleryEnabled?: boolean;
  isLoveStoryEnabled?: boolean;
}

const NAV_ITEMS = [
  { id: "beranda", label: "Sampul", icon: Home },
  { id: "mempelai", label: "Mempelai", icon: Users },
  { id: "cerita", label: "Cerita", icon: Sparkles },
  { id: "acara", label: "Acara", icon: Calendar },
  { id: "galeri", label: "Galeri", icon: ImageIcon },
  { id: "amplop", label: "Hadiah", icon: Gift },
  { id: "rsvp", label: "Ucapan", icon: MessageSquare },
];

export function FloatingNav({
  isOpened,
  isGalleryEnabled = true,
  isLoveStoryEnabled = true,
}: FloatingNavProps) {
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveItems = NAV_ITEMS.filter((item) => {
    if (item.id === "galeri" && isGalleryEnabled === false) return false;
    if (item.id === "cerita" && isLoveStoryEnabled === false) return false;
    return true;
  });

  useEffect(() => {
    if (!isOpened) return;

    const handleScroll = () => {
      if (isClickingRef.current) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY < 160) {
        setActiveSection("beranda");
        return;
      }

      if (windowHeight + scrollY >= docHeight - 90) {
        const lastItem = effectiveItems[effectiveItems.length - 1];
        if (lastItem) setActiveSection(lastItem.id);
        return;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const sectionElements = effectiveItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -40% 0px" }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [isOpened, effectiveItems]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    isClickingRef.current = true;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth" });

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const onScrollEnd = () => {
      isClickingRef.current = false;
      window.removeEventListener("scrollend", onScrollEnd);
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", onScrollEnd, { once: true });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
      window.removeEventListener("scrollend", onScrollEnd);
    }, 850);
  };

  return (
    <div
      className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 max-w-[96vw] pointer-events-none transition-opacity duration-300 ${
        isOpened ? "pointer-events-auto opacity-100" : "opacity-0"
      }`}
    >
      <nav
        aria-label="Navigasi cepat undangan"
        className="royal-seq-item pointer-events-auto"
        data-seq-dir="bottom"
        style={{ "--seq-delay": "3300ms" } as React.CSSProperties}
      >
        <div className="bg-[#FBF7F2]/92 backdrop-blur-md border border-[#6B1222]/18 shadow-[0_14px_36px_-10px_rgba(67,10,20,0.22)] rounded-full p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1">
          {effectiveItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
                className={`min-h-[44px] min-w-[36px] sm:min-w-[44px] rounded-full text-xs font-medium flex items-center justify-center motion-safe:transition-[background-color,color,box-shadow,transform,padding] motion-safe:duration-350 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B6D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF7F2] ${
                  isActive
                    ? "bg-[#6B1222] text-[#FBF7F2] shadow-xs ps-3 pe-3.5 sm:ps-3.5 sm:pe-4 py-2"
                    : "text-[#6E4A50] hover:text-[#6B1222] hover:bg-[#6B1222]/10 px-1.5 sm:px-2.5 py-2"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 stroke-[1.8] motion-safe:transition-transform motion-safe:duration-350 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                <span
                  className={`grid overflow-hidden motion-safe:transition-[grid-template-columns,width,opacity,margin] motion-safe:duration-350 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "grid-cols-[1fr] w-[max-content] opacity-100 ms-1.5 sm:ms-2"
                      : "grid-cols-[0fr] w-0 opacity-0 ms-0 pointer-events-none"
                  }`}
                >
                  <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium tracking-wide">
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
