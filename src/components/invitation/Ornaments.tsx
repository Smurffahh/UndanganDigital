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
        viewBox="0 0 64 76"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-auto"
      >
        <path d="M32 3 C39 12 49 20 49 33 C49 48 41 59 32 68 C23 59 15 48 15 33 C15 20 25 12 32 3 Z" />
        <path
          d="M32 14 C37 21 43 27 43 35 C43 45 37 54 32 61 C27 54 21 45 21 35 C21 27 27 21 32 14 Z"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.65"
        />
        <line x1="32" y1="3" x2="32" y2="72" strokeWidth="1" />
        <line x1="22" y1="35" x2="42" y2="35" strokeWidth="0.9" />
        <line x1="25" y1="46" x2="39" y2="46" strokeWidth="0.8" />
        <circle cx="32" cy="35" r="3.2" fill="currentColor" fillOpacity="0.2" strokeWidth="1" />
        <circle cx="32" cy="35" r="1.2" fill="currentColor" />
        <path d="M28 72 H36 M30 75 H34" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function Divider({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3.5 my-6 mx-auto max-w-[320px]" aria-hidden="true">
      <div className="flex items-center flex-1">
        <span
          className={`h-px flex-1 ${
            light
              ? "bg-gradient-to-r from-transparent to-gold-300"
              : "bg-gradient-to-r from-transparent to-gold-500"
          }`}
        />
        <span className="w-1.5 h-1.5 rotate-45 border border-gold-500/60 shrink-0 ml-1" />
      </div>
      <div className="relative flex items-center justify-center">
        <RadiantStar className={light ? "w-5 h-5 fill-gold-300" : "w-5 h-5 fill-gold-500"} />
        <span className="absolute w-7 h-7 rounded-full border border-gold-500/25 pointer-events-none" />
      </div>
      <div className="flex items-center flex-1">
        <span className="w-1.5 h-1.5 rotate-45 border border-gold-500/60 shrink-0 mr-1" />
        <span
          className={`h-px flex-1 ${
            light
              ? "bg-gradient-to-l from-transparent to-gold-300"
              : "bg-gradient-to-l from-transparent to-gold-500"
          }`}
        />
      </div>
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
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(169,130,58,0.55)]"
      >
        <circle cx="50" cy="50" r="47" stroke="#966d1e" strokeWidth="1" opacity="0.6" />
        <circle cx="50" cy="50" r="45" fill="url(#sealGradBg)" stroke="#d4af37" strokeWidth="1.6" />
        <circle cx="50" cy="50" r="40" stroke="#edd39b" strokeWidth="0.8" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="37" fill="url(#sealInnerGrad)" stroke="#b8913b" strokeWidth="1" />
        
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + 38 * Math.cos(rad);
          const y1 = 50 + 38 * Math.sin(rad);
          const x2 = 50 + 40 * Math.cos(rad);
          const y2 = 50 + 40 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#8c6a28"
              strokeWidth="0.75"
              opacity="0.85"
            />
          );
        })}

        <path
          d="M50 21 L52 26 L57 26 L53 29.5 L55 35 L50 31.5 L45 35 L47 29.5 L43 26 L48 26 Z"
          fill="#fff3d1"
          opacity="0.95"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#3d2208"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="21"
          fontWeight="700"
          letterSpacing="1"
        >
          F&amp;S
        </text>
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fill="#594314"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="6"
          fontWeight="700"
          letterSpacing="2.5"
        >
          03.01.2027
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

export function FloralCornerAccent({ className = "w-28 h-auto" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path d="M10 20 Q60 27 110 20" stroke="#c9a24b" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
        <path d="M30 20 C25 14 38 10 40 20 C38 24 25 24 30 20 Z" fill="#edd39b" opacity="0.75" />
        <path d="M90 20 C95 14 82 10 80 20 C82 24 95 24 90 20 Z" fill="#edd39b" opacity="0.75" />
        <circle cx="60" cy="21" r="6" fill="#f7e9e5" stroke="#9c5f66" strokeWidth="1" />
        <circle cx="56" cy="17" r="3.5" fill="#f4dbd4" opacity="0.8" />
        <circle cx="64" cy="17" r="3.5" fill="#f4dbd4" opacity="0.8" />
        <circle cx="60" cy="21" r="2" fill="#c9a24b" />
      </svg>
    </div>
  );
}

export function ScrollDownIndicator({ className = "w-7 h-12" }: { className?: string }) {
  return (
    <div
      className={`rounded-full border-2 border-[#5d3a41]/60 flex items-start justify-center pt-2 ${className}`}
      aria-hidden="true"
    >
      <span className="w-1.5 h-2.5 rounded-full bg-[#5d3a41] animate-mouse-wheel" />
    </div>
  );
}
