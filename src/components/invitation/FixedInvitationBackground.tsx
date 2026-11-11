"use client";

import React from "react";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
}

function RonceMelatiFlora({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover overflow-visible"
        preserveAspectRatio="none"
      >
        <g className="animate-flora-sway" transform="translate(60, 0)">
          <path d="M 0,0 Q 25,80 15,160 Q 5,230 18,310" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75" />
          {[
            { y: 35, r: 8 },
            { y: 75, r: 9 },
            { y: 120, r: 10 },
            { y: 170, r: 11 },
            { y: 225, r: 10 },
            { y: 275, r: 9 },
          ].map((flower, idx) => (
            <g key={`tl-flower-${idx}`} transform={`translate(${15 + Math.sin(idx) * 6}, ${flower.y})`} className="animate-flora-petal">
              <circle cx="0" cy="0" r={flower.r} fill="#fffdfa" stroke="#c9a24b" strokeWidth="0.8" />
              <circle cx="-3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
              <circle cx="3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
              <circle cx="0" cy="3" r={flower.r * 0.6} fill="#f7e9e5" opacity="0.9" />
              <circle cx="0" cy="0" r="2.4" fill="#c9a24b" />
            </g>
          ))}
          <g transform="translate(18, 310)" className="animate-flora-leaf">
            <path d="M 0,0 C -8,15 -10,35 0,55 C 10,35 8,15 0,0 Z" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
            <line x1="0" y1="5" x2="0" y2="45" stroke="#c9a24b" strokeWidth="0.75" />
            <circle cx="0" cy="56" r="2.5" fill="#c9a24b" />
          </g>
        </g>
        <g transform="translate(1200, 0) scale(-1, 1)">
          <g className="animate-flora-sway" transform="translate(60, 0)">
            <path d="M 0,0 Q 25,80 15,160 Q 5,230 18,310" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75" />
            {[
              { y: 35, r: 8 },
              { y: 75, r: 9 },
              { y: 120, r: 10 },
              { y: 170, r: 11 },
              { y: 225, r: 10 },
              { y: 275, r: 9 },
            ].map((flower, idx) => (
              <g key={`tr-flower-${idx}`} transform={`translate(${15 + Math.sin(idx) * 6}, ${flower.y})`} className="animate-flora-petal">
                <circle cx="0" cy="0" r={flower.r} fill="#fffdfa" stroke="#c9a24b" strokeWidth="0.8" />
                <circle cx="-3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
                <circle cx="3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
                <circle cx="0" cy="3" r={flower.r * 0.6} fill="#f7e9e5" opacity="0.9" />
                <circle cx="0" cy="0" r="2.4" fill="#c9a24b" />
              </g>
            ))}
            <g transform="translate(18, 310)" className="animate-flora-leaf">
              <path d="M 0,0 C -8,15 -10,35 0,55 C 10,35 8,15 0,0 Z" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
              <line x1="0" y1="5" x2="0" y2="45" stroke="#c9a24b" strokeWidth="0.75" />
              <circle cx="0" cy="56" r="2.5" fill="#c9a24b" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function FixedInvitationBackground({ heroPhotoUrl: _heroPhotoUrl }: FixedInvitationBackgroundProps) {
  return (
    <aside
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#FCF9F4_0%,_#F5EDE0_55%,_#EAE0CE_100%)]" />

      <div
        className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:96px_96px] opacity-[0.055] pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at center, transparent 25%, black 90%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 25%, black 90%)",
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.23  0 0 0 0 0.25  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(197,160,89,0.14),_transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,_rgba(140,98,57,0.08),_transparent_60%)] pointer-events-none" />

      <div
        className="royal-seq-item absolute inset-2 sm:inset-4 md:inset-6 pointer-events-none opacity-80 z-[1] select-none"
        data-seq-dir="center-scale"
        style={{ "--seq-delay": "700ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg-royal-sanctuary.svg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-fill pointer-events-none"
          loading="eager"
        />
      </div>

      <div
        className="royal-seq-item absolute left-0 top-0 w-1/2 h-36 sm:h-48 pointer-events-none z-[2]"
        data-seq-dir="left"
        style={{ "--seq-delay": "820ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ornament-gebyok-arch-left.svg"
          alt=""
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
        />
      </div>

      <div
        className="royal-seq-item absolute right-0 top-0 w-1/2 h-36 sm:h-48 pointer-events-none z-[2]"
        data-seq-dir="right"
        style={{ "--seq-delay": "820ms" } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ornament-gebyok-arch-right.svg"
          alt=""
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
        />
      </div>

      <div
        className="royal-seq-item absolute inset-0 pointer-events-none z-[3]"
        data-seq-dir="top"
        style={{ "--seq-delay": "1040ms" } as React.CSSProperties}
      >
        <RonceMelatiFlora />
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
