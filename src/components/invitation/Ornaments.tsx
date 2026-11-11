import React from "react";
import { GununganWayang as RichGununganWayang } from "./GununganWayang";

export function SongketRibbon({ className = "my-3.5 mx-auto" }: { className?: string }) {
  return <div className={`songket ${className}`} aria-hidden="true" />;
}

export function GununganWayang({
  className = "w-14 mx-auto",
  variant = "royal-solid",
  tone = "luminous-crest",
}: {
  className?: string;
  variant?: "royal-solid" | "watermark";
  tone?: "gold-harmony" | "antique-bronze" | "luminous-crest";
}) {
  return <RichGununganWayang className={className} variant={variant} tone={tone} />;
}

export function WayangDivider({ className = "my-4", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 sm:gap-3 mx-auto max-w-[300px] ${className}`} aria-hidden="true">
      <div className="flex items-center flex-1">
        <span
          className={`h-px flex-1 ${
            light
              ? "bg-gradient-to-r from-transparent via-[#E5D1A6] to-[#C5A059]"
              : "bg-gradient-to-r from-transparent via-[#C5A059]/50 to-[#C5A059]"
          }`}
        />
        <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0 ml-1 opacity-80" viewBox="0 0 16 16" fill="none">
          <path d="M 2,14 C 4,10 8,6 14,2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="14" cy="2" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-6 sm:w-7 h-7 sm:h-8 flex items-center justify-center">
          <RichGununganWayang variant="royal-solid" tone="luminous-crest" />
        </div>
      </div>
      <div className="flex items-center flex-1">
        <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mr-1 opacity-80 scale-x-[-1]" viewBox="0 0 16 16" fill="none">
          <path d="M 2,14 C 4,10 8,6 14,2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="14" cy="2" r="1.5" fill="currentColor" />
        </svg>
        <span
          className={`h-px flex-1 ${
            light
              ? "bg-gradient-to-l from-transparent via-[#E5D1A6] to-[#C5A059]"
              : "bg-gradient-to-l from-transparent via-[#C5A059]/50 to-[#C5A059]"
          }`}
        />
      </div>
    </div>
  );
}

export function SectionOrnament({ className = "my-4" }: { className?: string }) {
  return <WayangDivider className={className} />;
}

export function Divider({ className = "my-4", light = false }: { className?: string; light?: boolean }) {
  return <WayangDivider className={className} light={light} />;
}

export function ChipMetallic({ className = "w-11 h-8" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/ornament-chip-metallic.svg"
      alt=""
      aria-hidden="true"
      className={`object-contain select-none pointer-events-none ${className}`}
      loading="lazy"
      draggable={false}
    />
  );
}

export function CardCornerOrnament() {
  return (
    <>
      <svg
        className="absolute top-2 left-2 w-6 h-6 pointer-events-none text-gold-500/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M2 14 V4 H14" />
        <path d="M4 4 L9 9" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <circle cx="4" cy="4" r="1.2" fill="currentColor" />
        <line x1="2" y1="9" x2="5" y2="9" strokeWidth="0.8" />
        <line x1="9" y1="2" x2="9" y2="5" strokeWidth="0.8" />
      </svg>
      <svg
        className="absolute bottom-2 right-2 w-6 h-6 pointer-events-none text-gold-500/70 rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M2 14 V4 H14" />
        <path d="M4 4 L9 9" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <circle cx="4" cy="4" r="1.2" fill="currentColor" />
        <line x1="2" y1="9" x2="5" y2="9" strokeWidth="0.8" />
        <line x1="9" y1="2" x2="9" y2="5" strokeWidth="0.8" />
      </svg>
    </>
  );
}

export function GoldenEmblemSeal({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/ornament-golden-seal.svg"
        alt="Segel Lambang Keraton F&S"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(169,130,58,0.55)] object-contain select-none pointer-events-none"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

export function MonogramFS({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full animate-[spin_36s_linear_infinite]"
      >
        <circle cx="40" cy="40" r="38" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
        <circle cx="40" cy="40" r="35" stroke="#c9a24b" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.5" />
      </svg>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="40" cy="40" r="32" stroke="#5d3a41" strokeWidth="1" opacity="0.65" />
        <text
          x="34"
          y="49"
          textAnchor="middle"
          fill="#5d3a41"
          fontFamily="'Great Vibes', cursive"
          fontSize="35"
        >
          F
        </text>
        <text
          x="46"
          y="53"
          textAnchor="middle"
          fill="#c9a24b"
          fontFamily="'Great Vibes', cursive"
          fontSize="35"
        >
          S
        </text>
        <circle cx="40" cy="21" r="1.6" fill="#c9a24b" />
        <circle cx="40" cy="59" r="1.6" fill="#c9a24b" />
      </svg>
    </div>
  );
}

export const MonogramCrest = MonogramFS;

export function FloralCornerAccent({ className = "w-28 h-auto" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xs">
        <g className="animate-flora-sway">
          <path
            d="M 12,24 Q 45,30 70,24 Q 95,18 128,24"
            stroke="#c9a24b"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path d="M 38,26 Q 24,14 16,16" stroke="#c9a24b" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <path d="M 102,23 Q 116,14 124,16" stroke="#c9a24b" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </g>

        <g className="animate-flora-leaf">
          <path
            d="M 38,26 C 30,16 18,18 16,24 C 18,29 32,32 38,26 Z"
            fill="#d8b488"
            stroke="#8c5835"
            strokeWidth="0.75"
            opacity="0.85"
          />
          <path d="M 38,26 L 19,23" stroke="#8c5835" strokeWidth="0.5" opacity="0.7" />
          <path d="M 28,24 L 25,20 M 32,25 L 30,22" stroke="#8c5835" strokeWidth="0.4" opacity="0.6" />
        </g>

        <g className="animate-flora-leaf-delayed">
          <path
            d="M 102,23 C 110,14 122,16 124,22 C 122,27 108,30 102,23 Z"
            fill="#d8b488"
            stroke="#8c5835"
            strokeWidth="0.75"
            opacity="0.85"
          />
          <path d="M 102,23 L 121,21" stroke="#8c5835" strokeWidth="0.5" opacity="0.7" />
          <path d="M 112,22 L 115,18 M 108,23 L 110,20" stroke="#8c5835" strokeWidth="0.4" opacity="0.6" />
        </g>

        <g className="animate-flora-petal">
          <circle cx="70" cy="24" r="10" fill="#fffdfa" stroke="#c9a24b" strokeWidth="1" />
          <path
            d="M 70,14 C 63,18 63,30 70,34 C 77,30 77,18 70,14 Z"
            fill="#fcedeb"
            stroke="#c08497"
            strokeWidth="0.75"
            opacity="0.9"
          />
          <path
            d="M 60,24 C 64,17 76,17 80,24 C 76,31 64,31 60,24 Z"
            fill="#fcedeb"
            stroke="#c08497"
            strokeWidth="0.75"
            opacity="0.9"
          />
          <circle cx="70" cy="24" r="4.5" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="0.8" />
          <circle cx="70" cy="24" r="2" fill="#c9a24b" />
          <circle cx="68" cy="22.5" r="0.6" fill="#8c5835" />
          <circle cx="72" cy="22.5" r="0.6" fill="#8c5835" />
          <circle cx="68" cy="25.5" r="0.6" fill="#8c5835" />
          <circle cx="72" cy="25.5" r="0.6" fill="#8c5835" />
        </g>
      </svg>
    </div>
  );
}
