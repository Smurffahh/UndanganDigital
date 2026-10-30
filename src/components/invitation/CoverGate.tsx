"use client";

import { useState } from "react";
import { RadiantStar, GoldenEmblemSeal, CardCornerOrnament } from "./Ornaments";
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

/**
 * Royal Split-Arch Envelope Gate (01-cover)
 * Features 2 Pintu Lengkung Kembar (Left & Right Ornate Arch Doors),
 * Golden Emblem Seal, and 3-Stage Smooth Opening Choreography.
 *
 * Harmonized with the main invitation palette:
 * Warm Cream (#fdf8f3), Pearl White (#fffdfa), Soft Dusty Rose (#f7e9e5),
 * Champagne Gold (#c9a24b / #e9d3a3), and Deep Burgundy Rose (#5d3a41).
 */
export function CoverGate({
  guestName,
  onOpen,
  coverPhotoUrl,
  weddingDateIso,
  eventDateLabel,
}: CoverGateProps) {
  // 0 = Idle, 1 = Seal Pulse & Card Lift (0-300ms), 2 = Doors Parting (250-1150ms), 3 = Gone
  const [animStage, setAnimStage] = useState<0 | 1 | 2 | 3>(0);
  const [gone, setGone] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const formattedDate = formatCoverDate(weddingDateIso, eventDateLabel);

  const handleOpen = () => {
    if (isReducedMotion) {
      onOpen();
      setGone(true);
      return;
    }

    // Stage 1: Seal Pulse & Guest Card Lift
    setAnimStage(1);

    // Stage 2: Parting Doors & Backdrop Veil Lift
    setTimeout(() => {
      setAnimStage(2);
      onOpen();
    }, 280);

    // Stage 3: Unmount Cover
    setTimeout(() => {
      setAnimStage(3);
      setGone(true);
    }, 1250);
  };

  if (gone) return null;

  return (
    <section
      id="cover-gate"
      className={`fixed inset-0 z-50 overflow-hidden select-none bg-[#fdf8f3] ${
        animStage === 2 ? "pointer-events-none" : ""
      }`}
      aria-label="Sampul Undangan Fauzan Ma'ruf & Sinta Maria Utami"
    >
      {/* 1. Underlying Photo with Soft Warm Cream & Dusty Rose Veil */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "scale-105 opacity-0" : "scale-100 opacity-100 animate-slow-zoom"
        }`}
        style={{ backgroundImage: `url(${coverPhotoUrl})` }}
        role="img"
        aria-label="Foto Sampul Fauzan Ma'ruf & Sinta Maria Utami"
      />

      {/* Atmospheric Soft Warm Veil & Ambient Radial Glow (Zero Color Shock) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#fdf8f3]/85 via-[#fdf8f3]/80 to-[#f7e9e5]/92 backdrop-blur-[2px] transition-opacity duration-1000 ${
          animStage >= 2 ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.14),transparent_70%)] pointer-events-none" />

      {/* 2. Left Arch Door (Pintu Lengkung Kiri - Warm Cream to Dusty Rose) */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 z-10 bg-gradient-to-r from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-r border-[#c9a24b]/40 shadow-[10px_0_35px_-8px_rgba(93,58,65,0.18)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Batik Kawung Overlay & Champagne Gold Arch Border */}
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 border-r border-t border-b border-[#c9a24b]/35 rounded-r-[999px_999px] pointer-events-none" />
        <CardCornerOrnament />
      </div>

      {/* 3. Right Arch Door (Pintu Lengkung Kanan - Warm Cream to Dusty Rose) */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 z-10 bg-gradient-to-l from-[#fdf8f3] via-[#faf1ec] to-[#f7e9e5] border-l border-[#c9a24b]/40 shadow-[-10px_0_35px_-8px_rgba(93,58,65,0.18)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Batik Kawung Overlay & Champagne Gold Arch Border */}
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 border-l border-t border-b border-[#c9a24b]/35 rounded-l-[999px_999px] pointer-events-none" />
        <CardCornerOrnament />
      </div>

      {/* 4. Golden Emblem Seal in Center Door Seam */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none ${
          animStage === 1
            ? "scale-110 drop-shadow-[0_0_30px_rgba(201,162,75,0.85)] opacity-100"
            : animStage >= 2
            ? "scale-125 opacity-0 blur-sm"
            : "scale-100 opacity-95 drop-shadow-[0_12px_28px_rgba(93,58,65,0.25)]"
        }`}
      >
        <GoldenEmblemSeal className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      {/* 5. Central Invitation Card & Guest Information */}
      <div
        className={`relative z-20 w-full h-full flex flex-col items-center justify-between py-6 sm:py-8 px-4 sm:px-6 max-w-[440px] mx-auto text-center transition-[opacity,transform,filter] duration-500 ease-out overflow-y-auto ${
          animStage >= 1 ? "-translate-y-6 scale-95 opacity-0 blur-sm pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center pt-1 sm:pt-2">
          <RadiantStar className="w-7 h-7 sm:w-8 sm:h-8 fill-[#c9a24b] drop-shadow-xs mb-1 animate-pulse" />
          <p className="font-script text-3xl sm:text-4xl text-[#a9823a] leading-tight drop-shadow-xs">
            The Wedding Of
          </p>

          {/* Mihrab Arch Photo Frame (Anggun & Senada dengan Seksi Hero) */}
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

          <h1 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight text-[#5d3a41] drop-shadow-xs">
            Fauzan <span className="font-script text-[#c9a24b] text-[0.85em] px-1 font-normal">&amp;</span> Sinta
          </h1>

          {/* Tanggal Pelaksanaan dengan Flanking Golden Dividers */}
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="w-5 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#e9d3a3]" />
            <p className="text-xs tracking-[0.25em] uppercase text-[#4b3a3e] font-medium">
              {formattedDate}
            </p>
            <span className="w-5 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#e9d3a3]" />
          </div>

          <span className="mt-2 inline-block px-3.5 py-1 rounded-full bg-[#f7e9e5] text-[#9c5f66] border border-[#e9d3a3] text-[11px] tracking-[0.14em] normal-case font-mono font-semibold shadow-xs">
            #SINgkatceritaFAUZAN
          </span>
        </div>

        {/* Guest Name Card with Pearl White & Champagne Gold Trim */}
        <div className="w-full max-w-[340px] flex flex-col items-center mt-4">
          <div className="bg-[#fffdfa]/92 backdrop-blur-md px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl w-full border border-[#e9d3a3] shadow-[0_16px_36px_-12px_rgba(93,58,65,0.16)] relative overflow-hidden group">
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a24b]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <CardCornerOrnament />

            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8d757c] font-medium">
              Kepada Yth.
            </p>
            <p className="text-[11px] text-[#8d757c]/90 mt-0.5 font-light">
              Bapak / Ibu / Saudara/i
            </p>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-[#5d3a41] mt-1 break-words leading-tight">
              {guestName || "Tamu Undangan"}
            </p>
          </div>

          {/* Primary Action Button (Burgundy Rose with Gold Trim & Active Scale 0.96) */}
          <button
            type="button"
            onClick={handleOpen}
            className="mt-4 sm:mt-5 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#5d3a41] hover:bg-[#4b3a3e] text-[#fffdfa] text-xs font-bold tracking-[0.22em] uppercase border border-[#c9a24b]/55 shadow-[0_14px_32px_-8px_rgba(93,58,65,0.38)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] min-h-12 w-full max-w-[280px]"
          >
            <Mail className="w-4 h-4 stroke-[#edd39b] stroke-[2]" />
            <span>Buka Undangan</span>
          </button>

          <p className="mt-2.5 sm:mt-3 text-[10px] tracking-wide text-[#8d757c] font-light">
            *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
          </p>
        </div>
      </div>
    </section>
  );
}
