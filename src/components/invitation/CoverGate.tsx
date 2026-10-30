"use client";

import { useEffect, useState } from "react";
import {
  RadiantStar,
  GoldenEmblemSeal,
  CardCornerOrnament,
  GununganWayang,
  MonogramFS,
  FloralCornerAccent,
} from "./Ornaments";
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
 * Royal Split-Arch & Gunungan Portal Gate (01-cover)
 *
 * TAHAP 1: Kunci Scroll 100% sebelum tombol "Buka Undangan" diklik (Strict Scroll Lock).
 * TAHAP 2: Koreografi 3 Tahap:
 *   1. Layar Awal Sampul (Cover State - Terkunci)
 *   2. Gunungan Wayang Iris/Portal Zoom (Durasi ~1.5s)
 *   3. Pintu Kembar Membuka Menuju Signature Tall Oval Arch Hero
 */
export function CoverGate({
  guestName,
  onOpen,
  coverPhotoUrl,
  weddingDateIso,
  eventDateLabel,
}: CoverGateProps) {
  // 0 = Idle (Locked), 1 = Text Fade & Gunungan Portal Rising (0-300ms), 2 = Portal Zoom & Doors Parting (280-1400ms), 3 = Gone
  const [animStage, setAnimStage] = useState<0 | 1 | 2 | 3>(0);
  const [gone, setGone] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const formattedDate = formatCoverDate(weddingDateIso, eventDateLabel);

  // =========================================================================
  // TAHAP 1: Strict Scroll Lock Sebelum "Buka Undangan" Ditekan
  // Kunci touchmove, wheel, dan keyboard arrows agar halaman tidak bisa di-scroll
  // =========================================================================
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

    // Strict Scroll Lock on HTML and Body
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

    // Tahap 1: Teks sampul & tombol memudar halus (0-300ms)
    setAnimStage(1);

    // Tahap 2: Gunungan Wayang Portal Zoom & Pintu Membuka (280ms)
    setTimeout(() => {
      setAnimStage(2);
      onOpen(); // Trigger musik latar & reveal hero
    }, 280);

    // Tahap 3: Portal selesai menembus layar -> Unmount cover & buka scroll penuh
    setTimeout(() => {
      setAnimStage(3);
      setGone(true);
    }, 1500);
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
      {/* 1. Underlying Real Pre-Wedding Photo with Soft Warm Cream Veil */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage >= 2 ? "scale-105 opacity-0" : "scale-100 opacity-100 animate-slow-zoom"
        }`}
        style={{ backgroundImage: `url(${coverPhotoUrl})` }}
        role="img"
        aria-label="Foto Sampul Fauzan Ma'ruf & Sinta Maria Utami"
      />

      {/* Atmospheric Soft Warm Veil & Ambient Radial Glow */}
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
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-[0.14] pointer-events-none" />
        <div className="absolute inset-2 sm:inset-3 border-l border-t border-b border-[#c9a24b]/35 rounded-l-[999px_999px] pointer-events-none" />
        <CardCornerOrnament />
      </div>

      {/* 4. Golden Emblem Seal in Center Door Seam (Idle State) */}
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

      {/* ===================================================================== */}
      {/* TAHAP 2: Gunungan Wayang Iris / Portal Zoom (~1.5s Duration)          */}
      {/* Siluet Gunungan Emas & Monogram FS membesar menembus layar             */}
      {/* ===================================================================== */}
      <div
        className={`fixed inset-0 z-40 grid place-items-center pointer-events-none transition-[transform,opacity] duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStage === 0
            ? "scale-[0.3] opacity-0"
            : animStage === 1
            ? "scale-100 opacity-100"
            : "scale-[11] opacity-0 blur-xs"
        }`}
        aria-hidden="true"
      >
        <div className="relative w-72 h-80 sm:w-88 sm:h-96 text-gold-500 drop-shadow-[0_0_40px_rgba(201,162,75,0.7)] flex flex-col items-center justify-center">
          <GununganWayang className="w-48 sm:w-56 text-[#c9a24b] opacity-95" />
          <div className="absolute inset-0 flex items-center justify-center">
            <MonogramFS className="w-24 h-24 sm:w-28 sm:h-28 text-[#5d3a41] drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* 5. Central Invitation Card & Guest Information */}
      <div
        className={`relative z-20 w-full h-full flex flex-col items-center justify-between py-6 sm:py-8 px-4 sm:px-6 max-w-[440px] mx-auto text-center transition-[opacity,transform,filter] duration-500 ease-out overflow-y-auto ${
          animStage >= 1
            ? "-translate-y-6 scale-95 opacity-0 blur-sm pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center pt-1 sm:pt-2">
          {/* Monogram FS & Star Accent */}
          <MonogramFS className="w-14 h-14 mb-1" />
          <p className="typo-eyebrow text-[#a9823a] tracking-[0.2em] mb-1">
            THE WEDDING OF
          </p>

          {/* Mihrab Arch Photo Frame */}
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

          {/* Tanggal Pelaksanaan dengan Flanking Golden Dividers */}
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

        {/* Guest Name Card with Pearl White & Champagne Gold Trim */}
        <div className="w-full max-w-[340px] flex flex-col items-center mt-3">
          <div className="bg-[#fffdfa]/92 backdrop-blur-md px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl w-full border border-[#e9d3a3] shadow-[0_16px_36px_-12px_rgba(93,58,65,0.16)] relative overflow-hidden group">
            {/* Shimmer light effect */}
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

          {/* Primary Action Button (Burgundy Rose with Gold Trim & Active Scale 0.96) */}
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
