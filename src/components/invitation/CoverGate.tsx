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
import type { CoupleVisualMode, SvgCharacterPreset } from "@/lib/db/seed-data";
import { JavaneseScriptAccent } from "./JavaneseScriptAccent";
import type { FontTheme } from "@/lib/fontThemes";

interface CoverGateProps {
  guestName: string;
  onOpen?: () => void;
  onStartOpening?: () => void;
  onOpenComplete?: () => void;
  coverPhotoUrl: string;
  weddingDateIso?: string;
  eventDateLabel?: string;
  coupleVisualMode?: CoupleVisualMode;
  svgCharacterPreset?: SvgCharacterPreset;
  fontTheme?: FontTheme;
}

export function CoverGate({
  guestName,
  onOpen,
  onStartOpening,
  onOpenComplete,
  coverPhotoUrl,
  weddingDateIso,
  eventDateLabel,
  coupleVisualMode = "svg",
  svgCharacterPreset: _svgCharacterPreset = "javanese-royal",
  fontTheme = "classic",
}: CoverGateProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const formattedDate = formatCoverDate(weddingDateIso, eventDateLabel);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (isReducedMotion) {
      onStartOpening?.();
      onOpen?.();
      onOpenComplete?.();
      setGone(true);
      return;
    }

    setIsOpening(true);
    onStartOpening?.();
    onOpen?.();

    setTimeout(() => {
      onOpenComplete?.();
      setGone(true);
    }, 1550);
  };

  if (gone) return null;

  return (
    <section
      id="cover-gate"
      data-font-theme={fontTheme}
      className={`fixed inset-0 z-50 overflow-hidden select-none bg-transparent ${
        isOpening ? "pointer-events-none" : ""
      }`}
      aria-label="Sampul Undangan Fauzan Ma'ruf & Sinta Maria Utami"
    >
      <h1 className="sr-only">The Wedding of Fauzan &amp; Sinta (#SINgkatceritaFAUZAN)</h1>

      {/* Background Forest Silhouette Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/background.webp"
          alt=""
          aria-hidden="true"
          width={1000}
          height={1778}
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#FBF7F2]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(107,18,34,0.12)_100%)] pointer-events-none" />
      </div>

      {/* Parting Royal Silk Veil (Left Panel) */}
      <div
        data-testid="gate-veil-left"
        className={`gate-veil-left absolute inset-y-0 left-0 w-[calc(50%+1px)] z-10 bg-gradient-to-r from-[#FBF7F2]/95 via-[#F7EFE4]/90 to-[#ECE0CE]/95 backdrop-blur-md border-r border-[#C59B6D]/50 shadow-[10px_0_30px_-6px_rgba(107,18,34,0.18)] transition-transform ${
          isOpening ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDuration: "1450ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: isOpening ? "150ms" : "0ms",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:96px_96px] opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-[#C59B6D] to-transparent shadow-[0_0_12px_rgba(197,155,109,0.5)] pointer-events-none" />
      </div>

      {/* Parting Royal Silk Veil (Right Panel) */}
      <div
        data-testid="gate-veil-right"
        className={`gate-veil-right absolute inset-y-0 right-0 w-[calc(50%+1px)] z-10 bg-gradient-to-l from-[#FBF7F2]/95 via-[#F7EFE4]/90 to-[#ECE0CE]/95 backdrop-blur-md border-l border-[#C59B6D]/50 shadow-[-10px_0_30px_-6px_rgba(107,18,34,0.18)] transition-transform ${
          isOpening ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          willChange: "transform",
          transitionDuration: "1450ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: isOpening ? "150ms" : "0ms",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:96px_96px] opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#C59B6D] to-transparent shadow-[0_0_12px_rgba(197,155,109,0.5)] pointer-events-none" />
      </div>

      {/* Four Corner Framing Ornaments on CoverGate */}
      <div
        className={`absolute inset-0 z-15 pointer-events-none overflow-hidden select-none transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Top Left */}
        <div
          className="absolute top-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none animate-asset-enter-down"
          style={{ animationDelay: "200ms" }}
        >
          <div className="w-full h-full leaf-sway-top-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/javanese/pojok-atas.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain pointer-events-none select-none"
              loading="eager"
              draggable={false}
            />
          </div>
        </div>

        {/* Top Right */}
        <div
          className="absolute top-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none animate-asset-enter-down"
          style={{ animationDelay: "200ms" }}
        >
          <div className="w-full h-full leaf-sway-top-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/javanese/pojok-atas.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
              loading="eager"
              draggable={false}
            />
          </div>
        </div>

        {/* Bottom Left */}
        <div
          className="absolute bottom-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none animate-asset-enter-up"
          style={{ animationDelay: "350ms" }}
        >
          <div className="w-full h-full leaf-sway-bottom-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/javanese/pojok-bawah.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
              loading="eager"
              draggable={false}
            />
          </div>
        </div>

        {/* Bottom Right */}
        <div
          className="absolute bottom-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none animate-asset-enter-up"
          style={{ animationDelay: "350ms" }}
        >
          <div className="w-full h-full leaf-sway-bottom-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/javanese/pojok-bawah.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain pointer-events-none select-none"
              loading="eager"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Main Center Overlay Content */}
      <div
        className={`relative z-20 w-full h-dvh min-h-dvh max-w-[440px] mx-auto flex flex-col justify-between items-center px-4 sm:px-6 py-4 sm:py-6 overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-[650ms] ${
          isOpening
            ? "opacity-0 scale-[0.96] -translate-y-2 pointer-events-none"
            : "opacity-100 scale-100 translate-y-0"
        }`}
        style={{
          willChange: "transform, opacity",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Royal Arch Sanctuary Plaque (Center Top) */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] p-1.5 bg-[#FBF7F2]/92 backdrop-blur-md border border-[#6B1222]/20 shadow-[0_12px_36px_-8px_rgba(67,10,20,0.18)] rounded-t-full rounded-b-2xl flex flex-col items-center shrink-0 my-auto">
          <div className="w-full rounded-t-full rounded-b-[10px] border border-[#C59B6D]/35 px-5 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:72px_72px] opacity-[0.04] pointer-events-none" />

            {/* Eyebrow & Crest */}
            <div className="flex flex-col items-center justify-center mb-3 sm:mb-3.5 relative z-10 opacity-100 translate-y-0">
              <MonogramCrest className="size-10 sm:size-11" />
              <JavaneseScriptAccent
                section="cover"
                fontTheme={fontTheme}
                className="mt-1.5 -mb-1 text-sm sm:text-base"
              />
              <div className="mt-2.5 flex items-center justify-center gap-2.5">
                <span className="h-px w-5 bg-[#C59B6D]/45" aria-hidden="true" />
                <p className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C59B6D]">
                  THE WEDDING OF
                </p>
                <span className="h-px w-5 bg-[#C59B6D]/45" aria-hidden="true" />
              </div>
            </div>

            {/* Arch Frame & Dua Pengantin Character */}
            <div className="w-44 h-56 sm:w-52 sm:h-64 mx-auto rounded-t-full rounded-b-2xl p-1.5 bg-[#FBF7F2] shadow-sm border border-[#C59B6D]/45 shrink-0 mb-3 relative z-10 opacity-100 scale-100 translate-y-0">
              <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden outline outline-1 -outline-offset-1 outline-black/10 bg-gradient-to-b from-[#FBF7F2] via-[#F8EFE4] to-[#F1E0CE] flex items-end justify-center pt-6 pb-2 px-4">
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
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/assets/javanese/dua-pengantin.webp"
                    width={700}
                    height={891}
                    alt="Dua Pengantin Fauzan dan Sinta"
                    className="h-[82%] w-auto max-w-[82%] object-contain object-bottom drop-shadow-sm select-none pointer-events-none mx-auto"
                    loading="eager"
                    fetchPriority="high"
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {/* Couple Names & Date */}
            <div className="relative z-10 opacity-100 translate-y-0">
              <h2 className="cover-couple-title text-2xl sm:text-3xl font-invitation-display tracking-tight drop-shadow-xs font-bold text-[#6B1222]">
                Fauzan <span className="font-script text-[#C59B6D] text-[0.88em] px-0.5 font-normal">&amp;</span> Sinta
              </h2>

              <div className="mt-1.5 flex items-center justify-center gap-2">
                <span className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent to-[#C59B6D]" />
                <p className="font-sans text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[#6E4A50] tabular-nums">
                  {formattedDate.toUpperCase().replace(/,/g, " ·")}
                </p>
                <span className="w-4 sm:w-6 h-px bg-gradient-to-l from-transparent to-[#C59B6D]" />
              </div>

              <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#6B1222]/10 text-[#6B1222] border border-[#6B1222]/25 font-sans text-[11px] font-semibold normal-case tracking-wide shadow-2xs">
                #SINgkatceritaFAUZAN
              </span>
            </div>
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
          className={`relative my-2 sm:my-3 cursor-pointer select-none opacity-100 scale-100 transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpening
              ? "scale-[1.14] rotate-45 opacity-0"
              : "hover:scale-105 active:scale-95"
          }`}
          style={{
            willChange: "transform, opacity",
          }}
        >
          <GoldenEmblemSeal className="size-13 sm:size-15" />
          {isOpening && (
            <div className="absolute inset-0 rounded-full border-2 border-[#C59B6D] animate-ping opacity-75 pointer-events-none" />
          )}
        </div>

        {/* Guest Card & Open Button (Bottom) */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center shrink-0">
          <div className="w-full bg-[#FBF7F2]/92 backdrop-blur-md border border-[#6B1222]/18 rounded-2xl p-3 sm:p-4 shadow-[0_10px_24px_-8px_rgba(67,10,20,0.12)] relative overflow-hidden group text-center opacity-100 translate-y-0">
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

          <div className="w-full flex flex-col items-center opacity-100 translate-y-0">
            <button
              type="button"
              data-testid="btn-buka-undangan"
              aria-label="Buka Undangan"
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
      </div>
    </section>
  );
}
