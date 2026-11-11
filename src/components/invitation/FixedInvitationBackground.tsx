"use client";

import React from "react";
import {
  BatikKawungTruntumBg,
  GebyokUkirArchLeft,
  GebyokUkirArchRight,
  RonceMelatiFlora,
  RoyalSulurCornerSvg,
} from "./HeritageBotanicalAssets";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
}

export function FixedInvitationBackground({ heroPhotoUrl: _heroPhotoUrl }: FixedInvitationBackgroundProps) {
  return (
    <aside
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#F8F3EA] bg-[radial-gradient(ellipse_at_center,#FFFDF9_0%,#F8F3EA_50%,#EFE4D2_100%)]" />

      <div className="absolute inset-0 bg-[url('/images/bg-gunungan-pattern.svg')] bg-repeat bg-[length:400px_600px] opacity-30 pointer-events-none" />

      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.23  0 0 0 0 0.25  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>

      <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.09),transparent_70%)] blur-2xl" />
      <div className="absolute top-[40%] -left-[180px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(156,95,102,0.07),transparent_70%)] blur-2xl" />
      <div className="absolute top-[65%] -right-[180px] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />

      {/* Layer 2: Siluet Gunungan Puncak Tengah Atas */}
      <div
        className="royal-seq-item absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-[280px] sm:w-[360px] opacity-[0.09] pointer-events-none z-[1] select-none"
        data-seq-dir="top"
        style={{ "--seq-delay": "1000ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gunungan-bg-harmonized.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Layer 2: Gunungan Sisi Kiri */}
      <div
        className="royal-seq-item absolute top-[36%] -left-16 sm:-left-12 -translate-y-1/2 w-[240px] sm:w-[320px] md:w-[380px] opacity-[0.14] mix-blend-multiply pointer-events-none z-[1] select-none"
        data-seq-dir="left"
        style={{ "--seq-delay": "1200ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gunungan-bg-harmonized.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain -rotate-6"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Layer 2: Gunungan Sisi Kanan */}
      <div
        className="royal-seq-item absolute top-[36%] -right-16 sm:-right-12 -translate-y-1/2 w-[240px] sm:w-[320px] md:w-[380px] opacity-[0.14] mix-blend-multiply pointer-events-none z-[1] select-none"
        data-seq-dir="right"
        style={{ "--seq-delay": "1200ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gunungan-bg-harmonized.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain rotate-6 scale-x-[-1]"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Layer 3: Vignette Pelindung Keterbacaan Kolom Tengah */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F8F3EA]/75 to-transparent pointer-events-none z-[2]"
      />

      {/* Layer 1: Pola Dasar Batik Kawung & Truntum (Center Scale) */}
      <div
        className="royal-seq-item absolute inset-0 pointer-events-none"
        data-seq-dir="center-scale"
        style={{ "--seq-delay": "600ms" } as React.CSSProperties}
      >
        <BatikKawungTruntumBg />
      </div>

      {/* Layer 2: Gebyok Ukir Sisi Kiri (Left) */}
      <div
        className="royal-seq-item absolute left-0 top-0 w-1/2 h-40 sm:h-52 pointer-events-none z-[2]"
        data-seq-dir="left"
        style={{ "--seq-delay": "820ms" } as React.CSSProperties}
      >
        <GebyokUkirArchLeft />
      </div>

      {/* Layer 2: Gebyok Ukir Sisi Kanan (Right) */}
      <div
        className="royal-seq-item absolute right-0 top-0 w-1/2 h-40 sm:h-52 pointer-events-none z-[2]"
        data-seq-dir="right"
        style={{ "--seq-delay": "820ms" } as React.CSSProperties}
      >
        <GebyokUkirArchRight />
      </div>

      {/* Layer 3: Untaian Ronce Melati & Kantil Keraton (Top) */}
      <div
        className="royal-seq-item absolute inset-0 pointer-events-none z-[3]"
        data-seq-dir="top"
        style={{ "--seq-delay": "1040ms" } as React.CSSProperties}
      >
        <RonceMelatiFlora />
      </div>

      {/* Layer 4: Ornamen SVG Sulur Keraton Sudut Bawah (Left) */}
      <div
        className="royal-seq-item absolute bottom-1 left-1 pointer-events-none z-[2]"
        data-seq-dir="left"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <RoyalSulurCornerSvg className="w-28 sm:w-36 h-28 sm:h-36 opacity-25" />
      </div>

      {/* Layer 4: Ornamen SVG Sulur Keraton Sudut Bawah (Right) */}
      <div
        className="royal-seq-item absolute bottom-1 right-1 pointer-events-none z-[2]"
        data-seq-dir="right"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <RoyalSulurCornerSvg className="w-28 sm:w-36 h-28 sm:h-36 opacity-25" mirror />
      </div>

      <div
        className="absolute top-[28%] left-[22%] w-4 h-4 pointer-events-none animate-petal-drift z-[2]"
        style={{ willChange: "transform" }}
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M8 0 C12 4, 14 10, 8 16 C2 10, 4 4, 8 0 Z" fill="#c07b82" opacity="0.65" />
        </svg>
      </div>
      <div
        className="absolute top-[62%] right-[20%] w-3.5 h-3.5 pointer-events-none animate-petal-drift z-[2]"
        style={{ willChange: "transform", animationDelay: "-5s" }}
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M8 0 C12 4, 14 10, 8 16 C2 10, 4 4, 8 0 Z" fill="#c9a24b" opacity="0.6" />
        </svg>
      </div>
    </aside>
  );
}
