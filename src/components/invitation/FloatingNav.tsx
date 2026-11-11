"use client";

import { useEffect, useState } from "react";
import { Users, Sparkles, Calendar, Image as ImageIcon, Gift, MessageSquare } from "lucide-react";

interface FloatingNavProps {
  isOpened: boolean;
  isGalleryEnabled?: boolean;
}

const NAV_ITEMS = [
  { id: "mempelai", label: "Mempelai", icon: Users },
  { id: "cerita", label: "Cerita", icon: Sparkles },
  { id: "acara", label: "Acara", icon: Calendar },
  { id: "galeri", label: "Galeri", icon: ImageIcon },
  { id: "amplop", label: "Amplop", icon: Gift },
  { id: "rsvp", label: "RSVP", icon: MessageSquare },
];

export function FloatingNav({ isOpened, isGalleryEnabled = true }: FloatingNavProps) {
  const [activeSection, setActiveSection] = useState<string>("mempelai");

  const effectiveItems = NAV_ITEMS.filter((item) => {
    if (item.id === "galeri" && isGalleryEnabled === false) return false;
    return true;
  });

  useEffect(() => {
    if (!isOpened) return;

    const sectionElements = effectiveItems.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px" }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isOpened]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div
      className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-none ${
        isOpened ? "pointer-events-auto" : ""
      }`}
    >
      <nav
        aria-label="Navigasi cepat undangan"
        className="royal-seq-item pointer-events-auto"
        data-seq-dir="bottom"
        style={{ "--seq-delay": "3300ms" } as React.CSSProperties}
      >
        <div className="bg-[#fffdfa]/90 backdrop-blur-md border border-[#e9d3a3] shadow-[0_16px_36px_-12px_rgba(93,58,65,0.28)] rounded-full px-1.5 sm:px-3 py-1 flex items-center gap-0.5 sm:gap-1">
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
                className={`min-w-[44px] min-h-[44px] px-2.5 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-200 active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5d3a41] ${
                  isActive
                    ? "bg-[#5d3a41] text-[#fffdfa] shadow-xs"
                    : "text-[#8d757c] hover:text-[#5d3a41] hover:bg-[#f7e9e5]/60"
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.8]" />
                <span className="hidden md:inline text-[11px] tracking-wide font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
