import React from "react";

export function RadiantStar({ className = "w-6 h-6 fill-gold-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 2c1.7 14.5 9.5 22.3 22 22-12.5-.3-20.3 7.5-22 22-1.7-14.5-9.5-22.3-22-22 12.5.3 20.3-7.5 22-22z" />
    </svg>
  );
}

export function SongketRibbon({ className = "my-3.5 mx-auto" }: { className?: string }) {
  return <div className={`songket ${className}`} aria-hidden="true" />;
}

export function GununganWayang({ className = "w-14 mx-auto text-gold-500 opacity-85" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 64 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="w-full h-auto"
      >
        <path d="M32 4c7 9.5 15.5 17.5 15.5 30C47.5 48.5 40 60 32 68c-8-8-15.5-19.5-15.5-34C16.5 21.5 25 13.5 32 4z" />
        <path
          d="M32 16c4.4 6.2 9.7 11.3 9.7 19.3 0 8.9-4.9 17.4-9.7 22.7-4.8-5.3-9.7-13.8-9.7-22.7 0-8 5.3-13.1 9.7-19.3z"
          opacity="0.55"
        />
        <circle cx="32" cy="36" r="3.2" />
      </svg>
    </div>
  );
}

export function Divider({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3.5 my-6 mx-auto max-w-[300px]" aria-hidden="true">
      <span
        className={`h-px flex-1 ${
          light
            ? "bg-gradient-to-r from-transparent to-gold-300"
            : "bg-gradient-to-r from-transparent to-gold-500"
        }`}
      />
      <RadiantStar className={light ? "w-5 h-5 fill-gold-300" : "w-5 h-5 fill-gold-500"} />
      <span
        className={`h-px flex-1 ${
          light
            ? "bg-gradient-to-l from-transparent to-gold-300"
            : "bg-gradient-to-l from-transparent to-gold-500"
        }`}
      />
    </div>
  );
}

export function ChipMetallic({ className = "w-11 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="44" height="32" rx="5" fill="url(#chipGrad)" />
      <rect x="1" y="1" width="42" height="30" rx="4" stroke="#8c6a28" strokeWidth="0.8" />
      <path
        d="M0 11H13C15 11 16 12 16 14V18C16 20 15 21 13 21H0M44 11H31C29 11 28 12 28 14V18C28 20 29 21 31 21H44M16 16H28M22 0V11M22 21V32"
        stroke="#594314"
        strokeWidth="1.1"
      />
      <circle cx="22" cy="16" r="3.5" fill="#e9d3a3" stroke="#594314" strokeWidth="0.8" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="44" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9d3a3" />
          <stop offset="0.5" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#a9823a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CardCornerOrnament() {
  return (
    <>
      <span
        className="absolute top-2.5 left-2.5 w-[26px] h-[26px] border-t border-l border-gold-500 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-2.5 right-2.5 w-[26px] h-[26px] border-b border-r border-gold-500 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}

export function GoldenEmblemSeal({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(169,130,58,0.55)]"
      >
        <circle cx="50" cy="50" r="46" fill="url(#sealGradBg)" stroke="#d4af37" strokeWidth="1.8" />
        <circle cx="50" cy="50" r="41" stroke="#edd39b" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
        <circle cx="50" cy="50" r="38" fill="url(#sealInnerGrad)" stroke="#b8913b" strokeWidth="1" />
        {/* Ornate Star */}
        <path
          d="M50 20 L52 26 L58 26 L53 30 L55 36 L50 32 L45 36 L47 30 L42 26 L48 26 Z"
          fill="#fff3d1"
          opacity="0.95"
        />
        {/* Monogram F & S */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#3d2208"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="1"
        >
          F&amp;S
        </text>
        <text
          x="50"
          y="74"
          textAnchor="middle"
          fill="#594314"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="6"
          fontWeight="bold"
          letterSpacing="2.5"
        >
          2027
        </text>
        <defs>
          <radialGradient id="sealGradBg" cx="30%" cy="30%" r="70%">
            <stop stopColor="#fdf0cd" />
            <stop offset="0.4" stopColor="#d8ae43" />
            <stop offset="0.85" stopColor="#966d1e" />
            <stop offset="1" stopColor="#69480e" />
          </radialGradient>
          <radialGradient id="sealInnerGrad" cx="35%" cy="35%" r="65%">
            <stop stopColor="#f7e6b5" />
            <stop offset="0.5" stopColor="#cfa53e" />
            <stop offset="1" stopColor="#a37920" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
