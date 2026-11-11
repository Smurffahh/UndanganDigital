"use client";

import React from "react";
import {
  BatikKawungTruntumBg,
  GebyokUkirArchLeft,
  GebyokUkirArchRight,
  RonceMelatiFlora,
  HeritageCornerFloraLeft,
  HeritageCornerFloraRight,
} from "./HeritageBotanicalAssets";
import { GununganWayang } from "./GununganWayang";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
}

export function FixedInvitationBackground({ heroPhotoUrl }: FixedInvitationBackgroundProps) {
  return (
    <aside
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#fdf8f3] bg-[radial-gradient(ellipse_at_center,#fffdfa_0%,#fbf4ed_50%,#f3e3dc_100%)]" />

      {heroPhotoUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.11] saturate-[0.6] mix-blend-multiply filter blur-[0.5px]"
          style={{ backgroundImage: `url(${heroPhotoUrl})` }}
        />
      )}

      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.23  0 0 0 0 0.25  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>

      <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.09),transparent_70%)] blur-2xl" />
      <div className="absolute top-[40%] -left-[180px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(156,95,102,0.07),transparent_70%)] blur-2xl" />
      <div className="absolute top-[65%] -right-[180px] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />

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

      {/* Layer 4: Kayon Agung Tengah (Center Scale) */}
      <div
        className="royal-seq-item bg-layer-gunungan absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
        data-seq-dir="center-scale"
        style={{ "--seq-delay": "1260ms" } as React.CSSProperties}
      >
        <div className="animate-gunungan-breathe-slow w-[280px] sm:w-[360px] md:w-[420px] opacity-[0.11]">
          <GununganWayang variant="watermark" tone="antique-bronze" priority />
        </div>
      </div>

      {/* Sepasang Gunungan Penjaga Sudut Bawah (Twin Corner Kayon) */}
      <div
        className="royal-seq-item absolute -bottom-8 -left-10 sm:-bottom-6 sm:-left-6 pointer-events-none z-[1] w-44 sm:w-56 md:w-64 opacity-[0.08] -rotate-12"
        data-seq-dir="left"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <GununganWayang variant="watermark" tone="antique-bronze" />
      </div>

      <div
        className="royal-seq-item absolute -bottom-8 -right-10 sm:-bottom-6 sm:-right-6 pointer-events-none z-[1] w-44 sm:w-56 md:w-64 opacity-[0.08] rotate-12"
        data-seq-dir="right"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <GununganWayang variant="watermark" tone="antique-bronze" flipHorizontal />
      </div>

      {/* Layer 5: Bunga Sudut Kiri Bawah (Left) */}
      <div
        className="royal-seq-item absolute bottom-0 left-0 pointer-events-none z-[2]"
        data-seq-dir="left"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <HeritageCornerFloraLeft />
      </div>

      {/* Layer 6: Bunga Sudut Kanan Bawah (Right) */}
      <div
        className="royal-seq-item absolute bottom-0 right-0 pointer-events-none z-[2]"
        data-seq-dir="right"
        style={{ "--seq-delay": "1480ms" } as React.CSSProperties}
      >
        <HeritageCornerFloraRight />
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
