"use client";

import React from "react";

export function BatikKawungTruntumBg({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover opacity-[0.16] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="kawungTruntumPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Parang diagonal guidelines */}
          <line x1="0" y1="0" x2="100" y2="100" stroke="#c9a24b" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#c9a24b" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />

          {/* Kawung 4-petal ellipses */}
          <g stroke="#c9a24b" strokeWidth="0.75" fill="#fdfaf5" fillOpacity="0.3">
            {/* Center petals */}
            <ellipse cx="50" cy="30" rx="12" ry="18" />
            <ellipse cx="50" cy="70" rx="12" ry="18" />
            <ellipse cx="30" cy="50" rx="18" ry="12" />
            <ellipse cx="70" cy="50" rx="18" ry="12" />

            {/* Corner petals */}
            <ellipse cx="0" cy="0" rx="14" ry="14" />
            <ellipse cx="100" cy="0" rx="14" ry="14" />
            <ellipse cx="0" cy="100" rx="14" ry="14" />
            <ellipse cx="100" cy="100" rx="14" ry="14" />
          </g>

          {/* Inner petal seeds */}
          <g fill="#9c5f66" opacity="0.6">
            <circle cx="50" cy="32" r="2.2" />
            <circle cx="50" cy="68" r="2.2" />
            <circle cx="32" cy="50" r="2.2" />
            <circle cx="68" cy="50" r="2.2" />
          </g>

          {/* Truntum 8-pointed star in center */}
          <g transform="translate(50, 50)" stroke="#c9a24b" strokeWidth="0.65" fill="#c9a24b" fillOpacity="0.7">
            <circle cx="0" cy="0" r="3" fill="#5d3a41" />
            <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
            <path d="M 0,-7 L 1.2,-2 L 5,-5 L 2,-1.2 L 7,0 L 2,1.2 L 5,5 L 1.2,2 L 0,7 L -1.2,2 L -5,5 L -2,1.2 L -7,0 L -2,-1.2 L -5,-5 L -1.2,-2 Z" />
          </g>

          {/* Corner Truntum stars */}
          <g transform="translate(0, 0)" stroke="#c9a24b" strokeWidth="0.65" fill="#c9a24b" fillOpacity="0.7">
            <circle cx="0" cy="0" r="2.5" fill="#5d3a41" />
          </g>
          <g transform="translate(100, 100)" stroke="#c9a24b" strokeWidth="0.65" fill="#c9a24b" fillOpacity="0.7">
            <circle cx="0" cy="0" r="2.5" fill="#5d3a41" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawungTruntumPattern)" />
    </svg>
  );
}

export function GebyokUkirArch({ className = "w-full h-44 sm:h-56" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gebyokGoldGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a24b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#edd9b3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c9a24b" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="gebyokFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf8f3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f7e9e5" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Top Arch Lintel */}
        <path
          d="M 0,0 L 1200,0 L 1200,32 Q 900,38 600,32 Q 300,38 0,32 Z"
          fill="url(#gebyokFillGrad)"
          stroke="#c9a24b"
          strokeWidth="1.2"
        />

        {/* Carved Frieze Lines */}
        <g stroke="#c9a24b" strokeWidth="0.8" opacity="0.8">
          <line x1="0" y1="12" x2="1200" y2="12" strokeDasharray="3 3" />
          <line x1="0" y1="22" x2="1200" y2="22" />
        </g>

        {/* Central Crown Crest (Kala / Ceplok Keraton) */}
        <g transform="translate(600, 32)">
          <path
            d="M -45,-15 C -25,-28 25,-28 45,-15 C 32,5 0,16 -45,-15 Z"
            fill="#fffdfa"
            stroke="#c9a24b"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="-6" r="6" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="0" cy="-6" r="2.5" fill="#5d3a41" />
          <path d="M -18,-5 Q 0,8 18,-5" stroke="#9c5f66" strokeWidth="1" fill="none" />
          <path d="M 0,-25 L 0,-14" stroke="#c9a24b" strokeWidth="1.4" />
        </g>

        {/* Left Spandrel / Lung-lungan Ukir */}
        <g stroke="#c9a24b" strokeWidth="1" opacity="0.85">
          <path d="M 0,32 C 120,34 240,70 320,135 Q 350,160 360,200" fill="none" />
          <path d="M 0,42 C 100,45 200,78 270,135" fill="none" strokeWidth="0.7" strokeDasharray="2 3" />

          {/* Left Floral curls (Lung-lungan) */}
          <g fill="#9c5f66" fillOpacity="0.4" stroke="#c9a24b" strokeWidth="0.8">
            <circle cx="140" cy="54" r="9" />
            <circle cx="210" cy="78" r="11" />
            <circle cx="280" cy="118" r="10" />
            <circle cx="340" cy="170" r="8" />
          </g>
          {/* Inner floral centres */}
          <circle cx="140" cy="54" r="3" fill="#fdf0cd" />
          <circle cx="210" cy="78" r="3.5" fill="#fdf0cd" />
          <circle cx="280" cy="118" r="3" fill="#fdf0cd" />
          <circle cx="340" cy="170" r="2.5" fill="#fdf0cd" />
        </g>

        {/* Right Spandrel (Mirrored) */}
        <g transform="translate(1200, 0) scale(-1, 1)" stroke="#c9a24b" strokeWidth="1" opacity="0.85">
          <path d="M 0,32 C 120,34 240,70 320,135 Q 350,160 360,200" fill="none" />
          <path d="M 0,42 C 100,45 200,78 270,135" fill="none" strokeWidth="0.7" strokeDasharray="2 3" />

          <g fill="#9c5f66" fillOpacity="0.4" stroke="#c9a24b" strokeWidth="0.8">
            <circle cx="140" cy="54" r="9" />
            <circle cx="210" cy="78" r="11" />
            <circle cx="280" cy="118" r="10" />
            <circle cx="340" cy="170" r="8" />
          </g>
          <circle cx="140" cy="54" r="3" fill="#fdf0cd" />
          <circle cx="210" cy="78" r="3.5" fill="#fdf0cd" />
          <circle cx="280" cy="118" r="3" fill="#fdf0cd" />
          <circle cx="340" cy="170" r="2.5" fill="#fdf0cd" />
        </g>
      </svg>
    </div>
  );
}

export function GununganKayonSilhouette({ className = "w-full h-full max-w-[850px] object-contain opacity-[0.15]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 1100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kayonBgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf0cd" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#edd9b3" stopOpacity="0.6" />
          <stop offset="85%" stopColor="#f7e9e5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f3e3dc" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Central Majestic Gunungan (Kayon Blumbangan) */}
      <g transform="translate(400, 520)">
        {/* Outer Leaf Silhouette */}
        <path
          d="M 0,-420 C 65,-330 160,-240 190,-120 C 220,10 200,140 150,260 C 110,350 40,420 0,460 C -40,420 -110,350 -150,260 C -200,140 -220,10 -190,-120 C -160,-240 -65,-330 0,-420 Z"
          fill="url(#kayonBgGrad)"
          stroke="#c9a24b"
          strokeWidth="2.5"
        />

        {/* Inner concentric leaf border */}
        <path
          d="M 0,-385 C 55,-305 140,-220 168,-110 C 195,10 178,125 132,235 C 95,315 35,380 0,415 C -35,380 -95,315 -132,235 C -178,125 -195,10 -168,-110 C -140,-220 -55,-305 0,-385 Z"
          stroke="#5d3a41"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
        />

        {/* Central Spire (Mustaka) */}
        <path d="M 0,-420 L 0,-470 M -12,-445 L 12,-445" stroke="#c9a24b" strokeWidth="2.5" />
        <circle cx="0" cy="-455" r="4.5" fill="#c9a24b" />

        {/* Sacred Kalpataru (Tree of Life) Trunk & Branches */}
        <g stroke="#9c5f66" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
          <line x1="0" y1="360" x2="0" y2="-120" strokeWidth="3" stroke="#5d3a41" />
          {/* Main Branches */}
          <path d="M 0,60 C 40,40 90,50 120,20 C 140,-5 130,-45 95,-60" fill="none" />
          <path d="M 0,60 C -40,40 -90,50 -120,20 C -140,-5 -130,-45 -95,-60" fill="none" />
          <path d="M 0,-20 C 35,-45 75,-40 100,-75 C 115,-100 100,-130 75,-145" fill="none" />
          <path d="M 0,-20 C -35,-45 -75,-40 -100,-75 C -115,-100 -100,-130 -75,-145" fill="none" />
          <path d="M 0,-90 C 25,-120 55,-130 65,-170 C 70,-200 45,-230 25,-245" fill="none" />
          <path d="M 0,-90 C -25,-120 -55,-130 -65,-170 C -70,-200 -45,-230 -25,-245" fill="none" />
        </g>

        {/* Kalpataru Foliage Medallions */}
        <g fill="#fdfaf5" stroke="#c9a24b" strokeWidth="1" opacity="0.9">
          <circle cx="0" cy="-280" r="28" />
          <circle cx="75" cy="-145" r="22" />
          <circle cx="-75" cy="-145" r="22" />
          <circle cx="110" cy="-20" r="24" />
          <circle cx="-110" cy="-20" r="24" />
        </g>
        <g fill="#9c5f66" opacity="0.75">
          <circle cx="0" cy="-280" r="8" />
          <circle cx="75" cy="-145" r="6" />
          <circle cx="-75" cy="-145" r="6" />
          <circle cx="110" cy="-20" r="7" />
          <circle cx="-110" cy="-20" r="7" />
        </g>

        {/* Sacred Gate (Gapura Paduraksa) at Bottom */}
        <g transform="translate(0, 260)" stroke="#5d3a41" strokeWidth="1.6" fill="#fffdfa">
          <rect x="-45" y="0" width="90" height="90" rx="3" stroke="#c9a24b" strokeWidth="1.8" />
          {/* Arched portal door */}
          <path d="M -30,90 L -30,40 Q 0,15 30,40 L 30,90 Z" fill="#f7e9e5" stroke="#5d3a41" strokeWidth="1.4" />
          <line x1="0" y1="28" x2="0" y2="90" stroke="#c9a24b" strokeWidth="1.2" />
          <circle cx="-10" cy="65" r="2.5" fill="#c9a24b" />
          <circle cx="10" cy="65" r="2.5" fill="#c9a24b" />
          {/* Roof tiers */}
          <path d="M -55,0 L 55,0 L 45,-18 L -45,-18 Z" fill="#edd9b3" stroke="#c9a24b" strokeWidth="1.2" />
          <path d="M -40,-18 L 40,-18 L 30,-32 L -30,-32 Z" fill="#edd9b3" stroke="#c9a24b" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}

export function RonceMelatiFlora({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Top-Left Jasmine Garland (Ronce Melati Bawang Sebungkul) */}
        <g className="animate-flora-sway" transform="translate(60, 0)">
          {/* Main Garland Cord */}
          <path d="M 0,0 Q 25,80 15,160 Q 5,230 18,310" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75" />

          {/* Jasmine Blossom Clusters (Melati Ronce) */}
          {[
            { y: 35, r: 8 },
            { y: 75, r: 9 },
            { y: 120, r: 10 },
            { y: 170, r: 11 },
            { y: 225, r: 10 },
            { y: 275, r: 9 },
          ].map((flower, idx) => (
            <g key={`tl-flower-${idx}`} transform={`translate(${15 + Math.sin(idx) * 6}, ${flower.y})`} className="animate-flora-petal">
              {/* Petals */}
              <circle cx="0" cy="0" r={flower.r} fill="#fffdfa" stroke="#c9a24b" strokeWidth="0.8" />
              <circle cx="-3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
              <circle cx="3" cy="-2" r={flower.r * 0.6} fill="#fcf6ec" opacity="0.9" />
              <circle cx="0" cy="3" r={flower.r * 0.6} fill="#f7e9e5" opacity="0.9" />
              <circle cx="0" cy="0" r="2.4" fill="#c9a24b" />
            </g>
          ))}

          {/* Golden Kantil / Kenanga Bud Tassel at bottom */}
          <g transform="translate(18, 310)" className="animate-flora-leaf">
            <path
              d="M 0,0 C -8,15 -10,35 0,55 C 10,35 8,15 0,0 Z"
              fill="#fdf0cd"
              stroke="#c9a24b"
              strokeWidth="1"
            />
            <line x1="0" y1="5" x2="0" y2="45" stroke="#c9a24b" strokeWidth="0.75" />
            <circle cx="0" cy="56" r="2.5" fill="#c9a24b" />
          </g>
        </g>

        {/* Top-Right Jasmine Garland (Mirrored) */}
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
              <path
                d="M 0,0 C -8,15 -10,35 0,55 C 10,35 8,15 0,0 Z"
                fill="#fdf0cd"
                stroke="#c9a24b"
                strokeWidth="1"
              />
              <line x1="0" y1="5" x2="0" y2="45" stroke="#c9a24b" strokeWidth="0.75" />
              <circle cx="0" cy="56" r="2.5" fill="#c9a24b" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

// Keep legacy exports for CoverGate backwards compatibility
export function BatikKawungStamp({ className = "w-48 h-48", mirror = false }: { className?: string; mirror?: boolean }) {
  return (
    <div className={`${className} ${mirror ? "scale-x-[-1]" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g transform="translate(20, 20)">
          {[
            { cx: 35, cy: 35 },
            { cx: 95, cy: 35 },
            { cx: 155, cy: 35 },
            { cx: 35, cy: 95 },
            { cx: 95, cy: 95 },
            { cx: 35, cy: 155 },
          ].map((pos, idx) => (
            <g key={idx} transform={`translate(${pos.cx}, ${pos.cy})`}>
              <circle cx="0" cy="0" r="26" stroke="#c9a24b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
              <ellipse cx="0" cy="-12" rx="7" ry="12" fill="#9c5f66" opacity="0.5" />
              <ellipse cx="0" cy="12" rx="7" ry="12" fill="#9c5f66" opacity="0.5" />
              <ellipse cx="-12" cy="0" rx="12" ry="7" fill="#5d3a41" opacity="0.55" />
              <ellipse cx="12" cy="0" rx="12" ry="7" fill="#5d3a41" opacity="0.55" />
              <circle cx="0" cy="0" r="4.5" fill="#c9a24b" />
              <circle cx="0" cy="0" r="2" fill="#fffdfa" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function GebyokUkirArchLeft({ className = "w-full h-44 sm:h-56" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gebyokFillGradL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf8f3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f7e9e5" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <path
          d="M 0,0 L 600,0 L 600,32 Q 300,38 0,32 Z"
          fill="url(#gebyokFillGradL)"
          stroke="#c9a24b"
          strokeWidth="1.2"
        />

        <g stroke="#c9a24b" strokeWidth="0.8" opacity="0.8">
          <line x1="0" y1="12" x2="600" y2="12" strokeDasharray="3 3" />
          <line x1="0" y1="22" x2="600" y2="22" />
        </g>

        {/* Left Spandrel / Lung-lungan Ukir */}
        <g stroke="#c9a24b" strokeWidth="1" opacity="0.85">
          <path d="M 0,32 C 120,34 240,70 320,135 Q 350,160 360,200" fill="none" />
          <path d="M 0,42 C 100,45 200,78 270,135" fill="none" strokeWidth="0.7" strokeDasharray="2 3" />

          <g fill="#9c5f66" fillOpacity="0.4" stroke="#c9a24b" strokeWidth="0.8">
            <circle cx="140" cy="54" r="9" />
            <circle cx="210" cy="78" r="11" />
            <circle cx="280" cy="118" r="10" />
            <circle cx="340" cy="170" r="8" />
          </g>
          <circle cx="140" cy="54" r="3" fill="#fdf0cd" />
          <circle cx="210" cy="78" r="3.5" fill="#fdf0cd" />
          <circle cx="280" cy="118" r="3" fill="#fdf0cd" />
          <circle cx="340" cy="170" r="2.5" fill="#fdf0cd" />
        </g>

        {/* Half Crown Crest on right edge of left half */}
        <g transform="translate(600, 32)">
          <path
            d="M -45,-15 C -25,-28 0,-28 0,-20 C 0,5 0,16 -45,-15 Z"
            fill="#fffdfa"
            stroke="#c9a24b"
            strokeWidth="1.2"
          />
          <circle cx="-6" cy="-6" r="6" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="-6" cy="-6" r="2.5" fill="#5d3a41" />
        </g>
      </svg>
    </div>
  );
}

export function GebyokUkirArchRight({ className = "w-full h-44 sm:h-56" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 600 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gebyokFillGradR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf8f3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f7e9e5" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <path
          d="M 600,0 L 0,0 L 0,32 Q 300,38 600,32 Z"
          fill="url(#gebyokFillGradR)"
          stroke="#c9a24b"
          strokeWidth="1.2"
        />

        <g stroke="#c9a24b" strokeWidth="0.8" opacity="0.8">
          <line x1="0" y1="12" x2="600" y2="12" strokeDasharray="3 3" />
          <line x1="0" y1="22" x2="600" y2="22" />
        </g>

        {/* Right Spandrel (Mirrored) */}
        <g transform="translate(600, 0) scale(-1, 1)" stroke="#c9a24b" strokeWidth="1" opacity="0.85">
          <path d="M 0,32 C 120,34 240,70 320,135 Q 350,160 360,200" fill="none" />
          <path d="M 0,42 C 100,45 200,78 270,135" fill="none" strokeWidth="0.7" strokeDasharray="2 3" />

          <g fill="#9c5f66" fillOpacity="0.4" stroke="#c9a24b" strokeWidth="0.8">
            <circle cx="140" cy="54" r="9" />
            <circle cx="210" cy="78" r="11" />
            <circle cx="280" cy="118" r="10" />
            <circle cx="340" cy="170" r="8" />
          </g>
          <circle cx="140" cy="54" r="3" fill="#fdf0cd" />
          <circle cx="210" cy="78" r="3.5" fill="#fdf0cd" />
          <circle cx="280" cy="118" r="3" fill="#fdf0cd" />
          <circle cx="340" cy="170" r="2.5" fill="#fdf0cd" />
        </g>

        {/* Half Crown Crest on left edge of right half */}
        <g transform="translate(0, 32)">
          <path
            d="M 45,-15 C 25,-28 0,-28 0,-20 C 0,5 0,16 45,-15 Z"
            fill="#fffdfa"
            stroke="#c9a24b"
            strokeWidth="1.2"
          />
          <circle cx="6" cy="-6" r="6" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="6" cy="-6" r="2.5" fill="#5d3a41" />
        </g>
      </svg>
    </div>
  );
}

export function HeritageCornerFloraLeft({ className = "w-36 sm:w-48 h-36 sm:h-48" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="w-full h-full animate-flora-sway origin-bottom-left">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Corner Floral Swirls */}
          <path
            d="M 0,160 C 25,120 40,80 85,55 C 110,40 135,42 150,25"
            stroke="#c9a24b"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />
          <path
            d="M 0,140 C 35,115 65,95 105,75"
            stroke="#9c5f66"
            strokeWidth="0.8"
            opacity="0.7"
          />

          {/* Leaves */}
          <g fill="#fdf0cd" stroke="#c9a24b" strokeWidth="0.75" opacity="0.85">
            <path d="M 30,120 C 45,100 65,110 50,130 Z" />
            <path d="M 65,85 C 80,68 100,75 85,95 Z" />
            <path d="M 105,55 C 120,40 135,45 125,62 Z" />
          </g>

          {/* Jasmine blossoms */}
          {[
            { cx: 45, cy: 110, r: 8 },
            { cx: 80, cy: 75, r: 9.5 },
            { cx: 125, cy: 45, r: 8 },
            { cx: 148, cy: 22, r: 6.5 },
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.cx}, ${f.cy})`} className="animate-flora-petal">
              <circle cx="0" cy="0" r={f.r} fill="#fffdfa" stroke="#c9a24b" strokeWidth="0.8" />
              <circle cx="-2" cy="-2" r={f.r * 0.55} fill="#fcf6ec" opacity="0.9" />
              <circle cx="2" cy="-2" r={f.r * 0.55} fill="#fcf6ec" opacity="0.9" />
              <circle cx="0" cy="2" r={f.r * 0.55} fill="#f7e9e5" opacity="0.9" />
              <circle cx="0" cy="0" r="2.2" fill="#c9a24b" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function HeritageCornerFloraRight({ className = "w-36 sm:w-48 h-36 sm:h-48" }: { className?: string }) {
  return (
    <div className={`overflow-visible pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="w-full h-full animate-flora-sway origin-bottom-right scale-x-[-1]">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M 0,160 C 25,120 40,80 85,55 C 110,40 135,42 150,25"
            stroke="#c9a24b"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />
          <path
            d="M 0,140 C 35,115 65,95 105,75"
            stroke="#9c5f66"
            strokeWidth="0.8"
            opacity="0.7"
          />

          <g fill="#fdf0cd" stroke="#c9a24b" strokeWidth="0.75" opacity="0.85">
            <path d="M 30,120 C 45,100 65,110 50,130 Z" />
            <path d="M 65,85 C 80,68 100,75 85,95 Z" />
            <path d="M 105,55 C 120,40 135,45 125,62 Z" />
          </g>

          {[
            { cx: 45, cy: 110, r: 8 },
            { cx: 80, cy: 75, r: 9.5 },
            { cx: 125, cy: 45, r: 8 },
            { cx: 148, cy: 22, r: 6.5 },
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.cx}, ${f.cy})`} className="animate-flora-petal">
              <circle cx="0" cy="0" r={f.r} fill="#fffdfa" stroke="#c9a24b" strokeWidth="0.8" />
              <circle cx="-2" cy="-2" r={f.r * 0.55} fill="#fcf6ec" opacity="0.9" />
              <circle cx="2" cy="-2" r={f.r * 0.55} fill="#fcf6ec" opacity="0.9" />
              <circle cx="0" cy="2" r={f.r * 0.55} fill="#f7e9e5" opacity="0.9" />
              <circle cx="0" cy="0" r="2.2" fill="#c9a24b" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function BotanicalHangingVines({ className = "w-full h-28 sm:h-36" }: { className?: string }) {
  return <GebyokUkirArch className={className} />;
}

export function RoyalSulurCornerSvg({
  className = "w-28 sm:w-36 h-28 sm:h-36",
  mirror = false,
}: {
  className?: string;
  mirror?: boolean;
}) {
  return (
    <div
      className={`overflow-visible pointer-events-none select-none ${className} ${
        mirror ? "scale-x-[-1]" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <path
          d="M 6,134 C 18,105 32,78 68,58 C 96,42 122,46 134,22"
          stroke="#C5A059"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 6,118 C 24,94 48,76 86,62 C 108,54 122,38 126,14"
          stroke="#C5A059"
          strokeWidth="0.85"
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
        <path
          d="M 22,134 C 38,102 64,84 104,74"
          stroke="#C5A059"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M 68,58 C 76,50 86,46 94,52 C 100,58 98,68 90,70 C 82,72 76,64 80,58"
          stroke="#C5A059"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M 42,90 C 48,82 56,80 62,85 C 66,90 64,98 58,100 C 52,102 48,96 50,90"
          stroke="#C5A059"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M 98,34 C 104,26 112,24 118,28 C 122,32 120,40 114,42 C 108,44 104,38 106,34"
          stroke="#C5A059"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <g fill="#C5A059" fillOpacity="0.12" stroke="#C5A059" strokeWidth="0.85">
          <path d="M 28,108 C 36,92 52,100 42,116 Z" />
          <path d="M 52,78 C 62,64 78,72 68,88 Z" />
          <path d="M 86,48 C 96,36 110,42 102,56 Z" />
          <path d="M 112,22 C 120,12 132,16 126,28 Z" />
          <path d="M 74,86 C 88,80 94,94 82,102 Z" />
          <path d="M 102,60 C 114,56 120,68 110,76 Z" />
        </g>
        <circle cx="134" cy="22" r="3" fill="#C5A059" fillOpacity="0.3" stroke="#C5A059" strokeWidth="1" />
        <circle cx="126" cy="14" r="2" fill="#C5A059" />
        <circle cx="8" cy="132" r="3.5" fill="#C5A059" fillOpacity="0.2" stroke="#C5A059" strokeWidth="1" />
      </svg>
    </div>
  );
}
