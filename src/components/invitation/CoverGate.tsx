"use client";

import { useEffect, useState } from "react";
import {
  GoldenEmblemSeal,
  CardCornerOrnament,
  MonogramCrest,
} from "./Ornaments";
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
      {/* Daun Pintu Kiri (Kori Agung Left Door) */}
      <div
        className={`gate-wing-left absolute inset-y-0 left-0 w-[calc(50%+1px)] z-10 bg-gradient-to-b from-[#F1E7D6] via-[#E7D9C1] to-[#DBC8AA] border-r border-[#C5A059]/70 shadow-[18px_0_40px_-6px_rgba(74,50,34,0.32)] transition-transform ${
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
        <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:96px_96px] opacity-[0.07] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/images/door-kori-panel.svg')] bg-cover bg-right-center opacity-95 pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-[#4A3222]/15 rounded-sm pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-[#C5A059]/30 via-[#C5A059] to-[#C5A059]/30 shadow-[0_0_20px_rgba(197,160,89,0.45)] pointer-events-none" />
      </div>

      {/* Daun Pintu Kanan (Kori Agung Right Door - Mirrored) */}
      <div
        className={`gate-wing-right absolute inset-y-0 right-0 w-[calc(50%+1px)] z-10 bg-gradient-to-b from-[#F1E7D6] via-[#E7D9C1] to-[#DBC8AA] border-l border-[#C5A059]/70 shadow-[-18px_0_40px_-6px_rgba(74,50,34,0.32)] transition-transform ${
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
        <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:96px_96px] opacity-[0.07] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/images/door-kori-panel.svg')] bg-cover bg-left-center scale-x-[-1] opacity-95 pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-[#4A3222]/15 rounded-sm pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#C5A059]/30 via-[#C5A059] to-[#C5A059]/30 shadow-[0_0_20px_rgba(197,160,89,0.45)] pointer-events-none" />
      </div>

      {/* Ronce Melati & Hanging Vines */}
      <div className="absolute top-0 inset-x-0 h-24 sm:h-32 overflow-hidden pointer-events-none z-15 opacity-80" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ornament-gebyok-arch.svg"
          alt=""
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Main Center Overlay Content */}
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
        {/* Royal Arch Sanctuary Plaque (Center Top) */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] p-1.5 bg-[#FBF7F2]/90 backdrop-blur-md border border-[#6B1222]/20 shadow-[0_12px_36px_-8px_rgba(67,10,20,0.18)] rounded-t-full rounded-b-2xl flex flex-col items-center shrink-0 my-auto">
          <div className="w-full rounded-t-full rounded-b-[10px] border border-[#C59B6D]/35 px-5 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:72px_72px] opacity-[0.04] pointer-events-none" />

            <div className="flex flex-col items-center justify-center mb-3 sm:mb-3.5 relative z-10">
              <MonogramCrest className="size-10 sm:size-11" />
              <div className="mt-2.5 flex items-center justify-center gap-2.5">
                <span className="h-px w-5 bg-[#C59B6D]/45" aria-hidden="true" />
                <p className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C59B6D]">
                  THE WEDDING OF
                </p>
                <span className="h-px w-5 bg-[#C59B6D]/45" aria-hidden="true" />
              </div>
            </div>

            <div className="w-28 sm:w-36 aspect-[4/5] mx-auto rounded-t-full rounded-b-xl p-1 bg-[#FBF7F2] shadow-sm border border-[#C59B6D]/35 shrink-0 mb-3 relative z-10">
              <div className="w-full h-full rounded-t-full rounded-b-lg overflow-hidden outline outline-1 -outline-offset-1 outline-black/10 bg-gradient-to-b from-[#FBF7F2] to-[#F1E7D6] flex items-center justify-center">
                {coupleVisualMode === "photo" && coverPhotoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={coverPhotoUrl}
                    alt="Fauzan Ma'ruf & Sinta Maria Utami"
                    className="w-full h-full object-cover object-center"
                    fetchPriority="high"
                    loading="eager"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/javanese/pengantin-pria.webp"
                      alt="Mempelai Pria"
                      className="h-[96%] w-auto object-contain object-bottom -mr-3.5 drop-shadow-sm select-none pointer-events-none"
                      loading="eager"
                      draggable={false}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/javanese/pengantin-wanita.webp"
                      alt="Mempelai Wanita"
                      className="h-[93%] w-auto object-contain object-bottom -ml-3.5 drop-shadow-sm select-none pointer-events-none"
                      loading="eager"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight drop-shadow-xs font-bold text-[#6B1222] relative z-10">
              Fauzan <span className="font-script text-[#C59B6D] text-[0.88em] px-0.5 font-normal">&amp;</span> Sinta
            </h2>

            <div className="mt-1.5 flex items-center justify-center gap-2 relative z-10">
              <span className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent to-[#C59B6D]" />
              <p className="font-sans text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#6E4A50] tabular-nums">
                {formattedDate.toUpperCase().replace(/,/g, " ·")}
              </p>
              <span className="w-4 sm:w-6 h-px bg-gradient-to-l from-transparent to-[#C59B6D]" />
            </div>

            <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#6B1222]/10 text-[#6B1222] border border-[#6B1222]/25 font-sans text-[11px] font-semibold normal-case tracking-wide shadow-2xs relative z-10">
              #SINgkatceritaFAUZAN
            </span>
          </div>
        </div>

        {/* Golden Latch Medallion (F&S Seal) */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          title="Buka Undangan"
          aria-label="Buka Undangan Pernikahan Fauzan dan Sinta"
          className={`relative my-2 sm:my-3 cursor-pointer select-none transition-[transform,opacity] duration-[550ms] ${
            isOpening
              ? "scale-[1.14] rotate-45 opacity-0"
              : "scale-100 rotate-0 opacity-100 hover:scale-105 active:scale-95"
          }`}
          style={{
            willChange: "transform, opacity",
            transitionTimingFunction: "var(--motion-ease-royal)",
          }}
        >
          <GoldenEmblemSeal className="size-13 sm:size-15" />
          {isOpening && (
            <div className="absolute inset-0 rounded-full border-2 border-[#C59B6D] animate-ping opacity-75 pointer-events-none" />
          )}
        </div>

        {/* Guest Card & Open Button (Bottom) */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center shrink-0">
          <div className="w-full bg-[#FBF7F2]/90 backdrop-blur-md border border-[#6B1222]/18 rounded-2xl p-3 sm:p-4 shadow-[0_10px_24px_-8px_rgba(67,10,20,0.12)] relative overflow-hidden group text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C59B6D]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <CardCornerOrnament />
            <p className="typo-eyebrow text-[#C59B6D] tracking-[0.2em] text-[10px]">
              KEPADA YTH.
            </p>
            <p className="typo-meta text-[11px] mt-0.5 text-[#6E4A50]">
              Bapak / Ibu / Saudara/i
            </p>
            <p className="typo-card-title mt-1 font-semibold text-[#6B1222] text-sm sm:text-base text-balance break-words line-clamp-2 max-w-[280px] sm:max-w-[320px] mx-auto">
              {guestName || "Tamu Undangan"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="typo-button mt-3 inline-flex items-center justify-center gap-2.5 ps-6 pe-7 min-h-11 w-full max-w-xs rounded-full bg-gradient-to-r from-[#6B1222] via-[#8C2D3E] to-[#6B1222] hover:from-[#520D1A] hover:to-[#520D1A] text-[#FBF7F2] uppercase border border-[#C59B6D]/50 shadow-[0_12px_28px_-6px_rgba(107,18,34,0.45)] transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B6D]"
          >
            <Mail className="w-4 h-4 shrink-0 stroke-[#FBF7F2] stroke-[2]" />
            <span className="whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider uppercase">
              Buka Undangan
            </span>
          </button>

          <p className="text-[10px] sm:text-xs text-[#6E4A50] mt-2 text-center tracking-tight">
            *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
          </p>
        </div>
      </div>
    </section>
  );
}
