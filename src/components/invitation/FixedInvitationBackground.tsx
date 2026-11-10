"use client";

import React from "react";
import {
  NusantaraEtchedWatermark,
  BatikKawungStamp,
  BotanicalHangingVines,
} from "./HeritageBotanicalAssets";

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
          className="absolute inset-0 bg-cover bg-center opacity-[0.14] saturate-[0.65] mix-blend-multiply filter blur-[0.5px]"
          style={{ backgroundImage: `url(${heroPhotoUrl})` }}
        />
      )}

      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.23  0 0 0 0 0.25  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>

      <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.09),transparent_70%)] blur-2xl" />
      <div className="absolute top-[35%] -left-[180px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(156,95,102,0.08),transparent_70%)] blur-2xl" />
      <div className="absolute top-[65%] -right-[180px] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <NusantaraEtchedWatermark />
      </div>

      <div className="absolute -top-4 -left-4 sm:top-2 sm:left-2 w-48 sm:w-64 h-48 sm:h-64 opacity-45 pointer-events-none">
        <BatikKawungStamp className="w-full h-full" />
      </div>
      <div className="absolute -top-4 -right-4 sm:top-2 sm:right-2 w-36 sm:w-48 h-36 sm:h-48 opacity-35 pointer-events-none">
        <BatikKawungStamp className="w-full h-full" mirror />
      </div>

      <BotanicalHangingVines className="absolute top-0 inset-x-0 h-28 sm:h-36 overflow-hidden pointer-events-none opacity-85" />

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
