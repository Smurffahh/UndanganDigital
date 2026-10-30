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
      className={`fixed inset-0 z-50 overflow-hidden select-none ${
        animStage === 2 ? "pointer-events-none" : ""
      }`}
      aria-label="Sampul Undangan Kerajaan Fauzan & Sinta"
    >
      {/* 1. Underlying Ken Burns Image with Depth Veil */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "scale-105 opacity-0" : "scale-100 opacity-100 animate-slow-zoom"
        }`}
        style={{ backgroundImage: `url(${coverPhotoUrl})` }}
        role="img"
        aria-label="Foto Sampul Fauzan Ma'ruf & Sinta Maria Utami"
      />

      {/* Atmospheric Radial Vignette */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#2b151b]/80 via-[#3a1d24]/50 to-[#220e14]/90 transition-opacity duration-1000 ${
          animStage >= 2 ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />

      {/* 2. Left Arch Door (Pintu Lengkung Kiri) */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 z-10 bg-gradient-to-r from-[#2e161c]/95 to-[#3b1c24]/90 backdrop-blur-sm border-r border-gold-500/50 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Batik Kawung Overlay & Gold Arch Border */}
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-25 pointer-events-none" />
        <div className="absolute inset-3 border-r border-t border-b border-gold-500/35 rounded-r-[999px_999px] pointer-events-none" />
        <CardCornerOrnament />
      </div>

      {/* 3. Right Arch Door (Pintu Lengkung Kanan) */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 z-10 bg-gradient-to-l from-[#2e161c]/95 to-[#3b1c24]/90 backdrop-blur-sm border-l border-gold-500/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Batik Kawung Overlay & Gold Arch Border */}
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-25 pointer-events-none" />
        <div className="absolute inset-3 border-l border-t border-b border-gold-500/35 rounded-l-[999px_999px] pointer-events-none" />
        <CardCornerOrnament />
      </div>

      {/* 4. Golden Emblem Seal in Center Door Seam */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none ${
          animStage === 1
            ? "scale-110 drop-shadow-[0_0_28px_rgba(233,211,163,0.9)] opacity-100"
            : animStage >= 2
            ? "scale-125 opacity-0 blur-sm"
            : "scale-100 opacity-90"
        }`}
      >
        <GoldenEmblemSeal className="w-24 h-24 sm:w-28 sm:h-28" />
      </div>

      {/* 5. Central Invitation Card & Guest Information */}
      <div
        className={`relative z-20 w-full h-full flex flex-col items-center justify-between py-10 px-6 max-w-[440px] mx-auto text-center text-white transition-[opacity,transform,filter] duration-500 ease-out ${
          animStage >= 1 ? "-translate-y-6 scale-95 opacity-0 blur-sm pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center pt-2">
          <RadiantStar className="w-8 h-8 fill-gold-300 drop-shadow-md mb-2 animate-pulse" />
          <p className="font-script text-3xl sm:text-4xl text-gold-300 leading-tight">
            The Wedding Of
          </p>
          <h1 className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl leading-tight mt-1 text-white drop-shadow-xl">
            Fauzan <span className="font-script text-gold-300 text-[0.85em] px-1">&amp;</span> Sinta
          </h1>
          <p className="mt-2.5 text-xs tracking-[0.38em] uppercase text-white/90 font-medium">
            {formattedDate}
          </p>
          <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-[10px] tracking-[0.25em] uppercase text-gold-300 font-semibold drop-shadow-sm">
            #SINgkatceritaFAUZAN
          </span>
        </div>

        {/* Guest Name Glass Card with Metallic Golden Trim */}
        <div className="w-full max-w-[340px] flex flex-col items-center">
          <div className="glass px-7 py-4 rounded-3xl w-full border border-gold-300/45 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden group">
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300 font-medium">
              Kepada Yth.
            </p>
            <p className="text-[11px] text-white/80 mt-0.5 font-light">
              Bapak / Ibu / Saudara/i
            </p>
            <p className="font-serif font-semibold text-2xl sm:text-3xl text-white mt-1 break-words leading-tight drop-shadow-sm">
              {guestName || "Tamu Undangan"}
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleOpen}
            className="mt-6 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#edd39b] to-[#c9a24b] text-[#3d2208] text-xs font-bold tracking-[0.22em] uppercase shadow-[0_16px_35px_-8px_rgba(169,130,58,0.7)] transition-transform duration-150 ease-out active:scale-[0.96] hover:brightness-110 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 min-h-12 w-full max-w-[280px]"
          >
            <Mail className="w-4 h-4 stroke-[#3d2208] stroke-[2]" />
            <span>Buka Undangan</span>
          </button>

          <p className="mt-3.5 text-[10px] tracking-wide text-white/60 font-light">
            *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
          </p>
        </div>
      </div>
    </section>
  );
}
