"use client";

import { useEffect, useState } from "react";
import {
  GoldenEmblemSeal,
  CardCornerOrnament,
  MonogramFS,
  FloralCornerAccent,
} from "./Ornaments";
import {
  BatikKawungStamp,
  BotanicalHangingVines,
} from "./HeritageBotanicalAssets";
import { Mail } from "lucide-react";
import { formatCoverDate } from "@/lib/dateFormat";
import { usePrefersReducedMotion } from "@/hooks/useParallax";

interface CoverGateProps {
  guestName: string;
  onOpen: () => void;
  coverPhotoUrl: string;
  weddingDateIso?: string;
  eventDateLabel?: string;
}

export function CoverGate({
  guestName,
  onOpen,
  coverPhotoUrl,
  weddingDateIso,
  eventDateLabel,
}: CoverGateProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const formattedDate = formatCoverDate(weddingDateIso, eventDateLabel);

  // Strict mobile viewport lock; blocks touchmove and wheel gestures until invitation opens
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
    // Synchronous trigger activates audio on iOS Safari without gesture loss
    onOpen();

    setTimeout(() => {
      setGone(true);
    }, 1050);
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
        className={`absolute inset-y-0 left-0 w-[calc(50%+1px)] z-10 bg-gradient-to-r from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-r border-[#c9a24b]/60 shadow-[12px_0_35px_-8px_rgba(93,58,65,0.22)] transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpening ? "-translate-x-[102%]" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDelay: isOpening ? "150ms" : "0ms",
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
        className={`absolute inset-y-0 right-0 w-[calc(50%+1px)] z-10 bg-gradient-to-l from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-l border-[#c9a24b]/60 shadow-[-12px_0_35px_-8px_rgba(93,58,65,0.22)] transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpening ? "translate-x-[102%]" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDelay: isOpening ? "150ms" : "0ms",
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
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-[transform,opacity] duration-350 ease-out pointer-events-none ${
          isOpening
            ? "scale-90 opacity-0"
            : "scale-100 opacity-95 drop-shadow-[0_12px_28px_rgba(93,58,65,0.25)]"
        }`}
        style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
      >
        <GoldenEmblemSeal className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      <div
        className={`relative z-20 w-full h-full flex flex-col items-center justify-between py-6 sm:py-8 px-4 sm:px-6 max-w-[440px] mx-auto text-center transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto ${
          isOpening
            ? "scale-95 opacity-0 pointer-events-none"
            : "scale-100 opacity-100"
        }`}
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="flex flex-col items-center pt-1 sm:pt-2">
          <MonogramFS className="w-14 h-14 mb-1" />
          <p className="typo-eyebrow text-[#a9823a] tracking-[0.2em] mb-1">
            THE WEDDING OF
          </p>

          <div className="arch w-20 sm:w-24 aspect-[3/4] my-2 shadow-[0_10px_24px_-6px_rgba(93,58,65,0.18)] shrink-0">
            <div className="w-full h-full rounded-[990px_990px_14px_14px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPhotoUrl}
                alt="Fauzan Ma'ruf & Sinta Maria Utami"
                className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                loading="eager"
              />
            </div>
          </div>

          <h1 className="typo-display drop-shadow-xs">
            Fauzan <span className="font-script text-[#c9a24b] text-[0.85em] px-1 font-normal">&amp;</span> Sinta
          </h1>

          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="w-5 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#e9d3a3]" />
            <p className="font-sans text-sm font-medium tracking-[0.12em] uppercase text-[#4b3a3e]">
              {formattedDate}
            </p>
            <span className="w-5 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#e9d3a3]" />
          </div>

          <span className="mt-2 inline-block px-3.5 py-1 rounded-full bg-[#f7e9e5] text-[#9c5f66] border border-[#e9d3a3] font-sans text-xs sm:text-sm font-semibold normal-case tracking-wide shadow-xs">
            #SINgkatceritaFAUZAN
          </span>
        </div>

        <div className="w-full max-w-[340px] flex flex-col items-center mt-3">
          <div className="bg-[#fffdfa] px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl w-full border border-[#e9d3a3] shadow-[0_16px_36px_-12px_rgba(93,58,65,0.16)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a24b]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <CardCornerOrnament />

            <p className="typo-eyebrow text-[#8d757c]">
              Kepada Yth.
            </p>
            <p className="typo-meta mt-0.5">
              Bapak / Ibu / Saudara/i
            </p>
            <p className="typo-card-title mt-1.5 break-words">
              {guestName || "Tamu Undangan"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="typo-button mt-4 sm:mt-5 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#5d3a41] hover:bg-[#4b3a3e] text-[#fffdfa] uppercase border border-[#c9a24b]/55 shadow-[0_14px_32px_-8px_rgba(93,58,65,0.38)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] min-h-12 w-full max-w-[280px]"
          >
            <Mail className="w-4 h-4 stroke-[#edd39b] stroke-[2]" />
            <span>Buka Undangan</span>
          </button>

          <p className="typo-meta mt-2 text-center">
            *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
          </p>

          <FloralCornerAccent className="w-28 mx-auto mt-1 opacity-70" />
        </div>
      </div>
    </section>
  );
}
