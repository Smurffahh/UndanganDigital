"use client";

import { useEffect, useState } from "react";
import {
  GoldenEmblemSeal,
  CardCornerOrnament,
  MonogramFS,
} from "./Ornaments";
import {
  BatikKawungStamp,
  BotanicalHangingVines,
} from "./HeritageBotanicalAssets";
import { Mail } from "lucide-react";
import { formatCoverDate } from "@/lib/dateFormat";
import { usePrefersReducedMotion } from "@/hooks/useParallax";
import { CoupleCharacterSvg } from "./CoupleCharacterSvg";
import type { CoupleVisualMode, SvgCharacterPreset } from "@/lib/db/seed-data";

interface CoverGateProps {
  guestName: string;
  onOpen: () => void;
  coverPhotoUrl: string;
  weddingDateIso?: string;
  eventDateLabel?: string;
  coupleVisualMode?: CoupleVisualMode;
  svgCharacterPreset?: SvgCharacterPreset;
}

export function CoverGate({
  guestName,
  onOpen,
  coverPhotoUrl,
  weddingDateIso,
  eventDateLabel,
  coupleVisualMode = "photo",
  svgCharacterPreset = "javanese-royal",
}: CoverGateProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const formattedDate = formatCoverDate(weddingDateIso, eventDateLabel);

  useEffect(() => {
    if (gone) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Space",
          "Home",
          "End",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    document.documentElement.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("height", "100dvh", "important");
    document.documentElement.style.setProperty("position", "fixed", "important");
    document.documentElement.style.setProperty("width", "100%", "important");
    document.documentElement.style.setProperty("touch-action", "none", "important");

    document.body.style.setProperty("overflow", "hidden", "important");
    document.body.style.setProperty("height", "100dvh", "important");
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.setProperty("width", "100%", "important");
    document.body.style.setProperty("touch-action", "none", "important");

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      document.documentElement.style.removeProperty("position");
      document.documentElement.style.removeProperty("width");
      document.documentElement.style.removeProperty("touch-action");

      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("touch-action");

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [gone]);

  const handleOpen = () => {
    if (isReducedMotion) {
      onOpen();
      setGone(true);
      return;
    }

    setIsOpening(true);
    onOpen();

    setTimeout(() => {
      setGone(true);
    }, 1950);
  };

  if (gone) return null;

  return (
    <section
      id="cover-gate"
      className={`fixed inset-0 z-50 overflow-hidden select-none bg-transparent ${
        isOpening ? "pointer-events-none" : ""
      }`}
      aria-label="Sampul Undangan Fauzan Ma'ruf & Sinta Maria Utami"
    >
      <div
        className={`absolute inset-y-0 left-0 w-[calc(50%+1px)] z-10 bg-gradient-to-r from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-r border-[#c9a24b]/60 shadow-[14px_0_36px_-6px_rgba(93,58,65,0.28)] transition-transform ${
          isOpening ? "-translate-x-[102%]" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDuration: "var(--motion-duration-gate)",
          transitionTimingFunction: "var(--motion-ease-royal)",
          transitionDelay: isOpening ? "350ms" : "0ms",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 border-r border-t border-b border-[#c9a24b]/40 rounded-r-[999px_999px] pointer-events-none" />
        <div className="absolute top-2 left-2 w-32 sm:w-44 h-32 sm:h-44 opacity-45 pointer-events-none">
          <BatikKawungStamp className="w-full h-full" />
        </div>
        <CardCornerOrnament />
      </div>

      <div
        className={`absolute inset-y-0 right-0 w-[calc(50%+1px)] z-10 bg-gradient-to-l from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-l border-[#c9a24b]/60 shadow-[-14px_0_36px_-6px_rgba(93,58,65,0.28)] transition-transform ${
          isOpening ? "translate-x-[102%]" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDuration: "var(--motion-duration-gate)",
          transitionTimingFunction: "var(--motion-ease-royal)",
          transitionDelay: isOpening ? "350ms" : "0ms",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 border-l border-t border-b border-[#c9a24b]/40 rounded-l-[999px_999px] pointer-events-none" />
        <div className="absolute top-2 right-2 w-32 sm:w-44 h-32 sm:h-44 opacity-35 pointer-events-none">
          <BatikKawungStamp className="w-full h-full" mirror />
        </div>
        <CardCornerOrnament />
      </div>

      <BotanicalHangingVines className="absolute top-0 inset-x-0 h-24 sm:h-32 overflow-hidden pointer-events-none z-15 opacity-80" />

      <div
        className={`relative z-20 w-full h-dvh min-h-dvh max-w-[440px] mx-auto flex flex-col justify-between items-center px-4 sm:px-6 py-4 sm:py-6 overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-[550ms] ${
          isOpening
            ? "opacity-0 scale-[0.98] -translate-y-3.5 pointer-events-none"
            : "opacity-100 scale-100 translate-y-0"
        }`}
        style={{
          willChange: "transform, opacity",
          transitionTimingFunction: "var(--motion-ease-royal)",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="flex flex-col items-center shrink-0 w-full">
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-1.5">
            <MonogramFS className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="w-3.5 h-px bg-[#c9a24b]/60" />
            <p className="typo-eyebrow text-[#a9823a] tracking-[0.22em] text-[10px] sm:text-xs">
              THE WEDDING OF
            </p>
          </div>

          <div className="w-44 sm:w-52 md:w-60 aspect-[4/5] mx-auto rounded-t-full rounded-b-2xl p-2 bg-white/80 shadow-xs border border-amber-900/15 backdrop-blur-[2px] shrink-0">
            <div className="w-full h-full rounded-t-full rounded-b-lg overflow-hidden outline outline-1 -outline-offset-1 outline-black/10 bg-[#fdfaf5] flex items-center justify-center">
              {coupleVisualMode === "svg" || !coverPhotoUrl ? (
                <CoupleCharacterSvg
                  preset={svgCharacterPreset}
                  variant="couple"
                  className="w-full h-full"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverPhotoUrl}
                  alt="Fauzan Ma'ruf & Sinta Maria Utami"
                  className="w-full h-full object-cover object-center"
                  fetchPriority="high"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center shrink-0 w-full my-auto">
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight drop-shadow-xs font-bold text-ink">
            Fauzan <span className="font-script text-[#c9a24b] text-[0.85em] px-0.5 font-normal">&amp;</span> Sinta
          </h1>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="w-5 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#e9d3a3]" />
            <p className="font-sans text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-[#4b3a3e] tabular-nums">
              {formattedDate}
            </p>
            <span className="w-5 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#e9d3a3]" />
          </div>

          <span className="mt-1.5 inline-block px-3 py-0.5 rounded-full bg-[#f7e9e5]/90 text-[#9c5f66] border border-[#e9d3a3] font-sans text-[11px] sm:text-xs font-semibold normal-case tracking-wide shadow-2xs">
            #SINgkatceritaFAUZAN
          </span>

          <div
            className={`relative my-2 sm:my-2.5 transition-[transform,opacity] duration-[550ms] ${
              isOpening
                ? "scale-[1.08] rotate-12 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
            style={{
              willChange: "transform, opacity",
              transitionTimingFunction: "var(--motion-ease-royal)",
            }}
          >
            <GoldenEmblemSeal className="size-14 sm:size-16" />
            {isOpening && (
              <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] animate-ping opacity-75 pointer-events-none" />
            )}
          </div>
        </div>

        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center shrink-0">
          <div className="w-full bg-[#fffdfa]/95 py-2.5 px-4 sm:py-3.5 sm:px-5 rounded-xl sm:rounded-2xl border border-[#e9d3a3] shadow-[0_10px_24px_-8px_rgba(93,58,65,0.14)] relative overflow-hidden group text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a24b]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <CardCornerOrnament />
            <p className="typo-eyebrow text-[#8d757c] tracking-[0.2em] text-[10px]">
              KEPADA YTH.
            </p>
            <p className="typo-meta text-[11px] mt-0.5">
              Bapak / Ibu / Saudara/i
            </p>
            <p className="typo-card-title mt-1 font-semibold text-rose-900 text-sm sm:text-base truncate">
              {guestName || "Tamu Undangan"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="typo-button mt-3 sm:mt-3.5 inline-flex items-center justify-center gap-2.5 ps-5 pe-6 min-h-12 w-full max-w-xs rounded-full bg-[#5d3a41] hover:bg-[#4b3a3e] text-[#fffdfa] uppercase border border-[#c9a24b]/60 shadow-[0_12px_28px_-6px_rgba(93,58,65,0.35)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
          >
            <Mail className="w-4 h-4 shrink-0 stroke-[#edd39b] stroke-[2]" />
            <span className="whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider uppercase">
              Buka Undangan
            </span>
          </button>

          <p className="text-[10px] sm:text-xs text-[#8d757c] mt-2 text-center tracking-tight">
            *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
          </p>
        </div>
      </div>
    </section>
  );
}
