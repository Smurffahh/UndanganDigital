"use client";

import React from "react";

export function NusantaraEtchedWatermark({ className = "w-full h-full max-w-[900px] object-cover opacity-[0.13]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#c9a24b" strokeWidth="0.8" opacity="0.65">
        <line x1="450" y1="420" x2="450" y2="120" strokeDasharray="3 4" />
        <line x1="450" y1="420" x2="680" y2="200" strokeDasharray="3 4" />
        <line x1="450" y1="420" x2="220" y2="200" strokeDasharray="3 4" />
        <line x1="450" y1="420" x2="740" y2="340" strokeDasharray="3 4" />
        <line x1="450" y1="420" x2="160" y2="340" strokeDasharray="3 4" />
        <circle cx="450" cy="420" r="160" strokeDasharray="4 4" />
        <circle cx="450" cy="420" r="240" strokeDasharray="4 5" />
      </g>

      <g stroke="#9c5f66" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
        <path d="M120 280 Q 180 250, 240 280 T 360 280 T 480 270" fill="none" />
        <path d="M160 295 Q 220 270, 280 295 T 400 295" fill="none" opacity="0.6" />
        <path d="M540 270 Q 620 250, 700 280 T 820 280" fill="none" />
        <path d="M580 290 Q 660 270, 740 295" fill="none" opacity="0.6" />
      </g>

      <g stroke="#5d3a41" strokeWidth="1.2" opacity="0.8">
        <path d="M0 720 Q 220 680, 450 710 T 900 690 L 900 1200 L 0 1200 Z" fill="url(#hillsGradHeritage)" opacity="0.4" />
        <path d="M0 780 Q 260 740, 520 770 T 900 750" fill="none" strokeWidth="1" strokeDasharray="2 3" />
        <path d="M0 830 Q 200 800, 420 820 T 900 800" fill="none" strokeWidth="1" strokeDasharray="3 4" />
        <path d="M0 890 Q 300 860, 600 880 T 900 870" fill="none" strokeWidth="1.2" />
      </g>

      <g transform="translate(325, 480)" stroke="#c9a24b" strokeWidth="1.6" fill="url(#gununganBgHeritage)">
        <path
          d="M125 15 C155 55 190 85 190 145 C190 205 160 255 125 295 C90 255 60 205 60 145 C60 85 95 55 125 15 Z"
          stroke="#c9a24b"
          strokeWidth="2"
        />
        <path
          d="M125 45 C148 78 172 105 172 152 C172 198 148 238 125 272 C102 238 78 198 78 152 C78 105 102 78 125 45 Z"
          stroke="#5d3a41"
          strokeWidth="1.2"
          fill="none"
          opacity="0.8"
        />
        <path d="M125 80 L125 260 M85 175 L165 175 M95 135 L155 135 M95 215 L155 215" stroke="#9c5f66" strokeWidth="1" />
        <circle cx="125" cy="175" r="14" stroke="#c9a24b" strokeWidth="1.4" fill="#fdf8f3" />
        <circle cx="125" cy="175" r="5" fill="#5d3a41" />
        <path d="M125 15 L125 0 M120 0 L130 0" stroke="#c9a24b" strokeWidth="2" />
      </g>

      <defs>
        <linearGradient id="hillsGradHeritage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e3dc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e9d3a3" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="gununganBgHeritage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf0cd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f7e9e5" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
          <path
            d="M0 0 L200 0 L200 60 Q 140 60, 100 100 Q 60 140, 60 200 L0 200 Z"
            stroke="#c9a24b"
            strokeWidth="1.2"
            fill="none"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
}

export function BotanicalHangingVines({ className = "w-full h-28 sm:h-36" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <g stroke="#c9a24b" strokeWidth="1.2" strokeLinecap="round">
          <path d="M0 0 Q 150 40, 280 15 Q 380 -5, 450 35" fill="none" />
          <path d="M60 15 Q 120 70, 160 110" fill="none" />
          <path d="M190 25 Q 240 75, 260 125" fill="none" />
          <path d="M300 10 Q 330 55, 335 90" fill="none" />
        </g>
        <g fill="#9c5f66" opacity="0.8">
          <ellipse cx="160" cy="110" rx="8" ry="14" transform="rotate(25 160 110)" />
          <ellipse cx="260" cy="125" rx="8" ry="13" transform="rotate(-15 260 125)" />
          <circle cx="335" cy="90" r="7" fill="#5d3a41" />
          <circle cx="120" cy="70" r="5" fill="#c9a24b" />
          <circle cx="240" cy="75" r="5" fill="#c9a24b" />
        </g>
        <g fill="#f7e9e5" stroke="#5d3a41" strokeWidth="0.8">
          <path d="M160 110 C 150 95, 170 95, 160 110 Z" />
          <circle cx="160" cy="106" r="2.5" fill="#c9a24b" />
        </g>

        <g transform="translate(1200, 0) scale(-1, 1)">
          <g stroke="#c9a24b" strokeWidth="1.2" strokeLinecap="round">
            <path d="M0 0 Q 150 40, 280 15 Q 380 -5, 450 35" fill="none" />
            <path d="M60 15 Q 120 70, 160 110" fill="none" />
            <path d="M190 25 Q 240 75, 260 125" fill="none" />
          </g>
          <g fill="#9c5f66" opacity="0.8">
            <ellipse cx="160" cy="110" rx="8" ry="14" transform="rotate(25 160 110)" />
            <ellipse cx="260" cy="125" rx="8" ry="13" transform="rotate(-15 260 125)" />
            <circle cx="120" cy="70" r="5" fill="#c9a24b" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function BotanicalFloralFooter({ className = "w-full h-36 sm:h-48" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <g opacity="0.85">
          <path d="M480 240 Q 510 140, 560 100 Q 590 140, 600 240 Z" fill="#9c5f66" />
          <path d="M600 240 Q 610 135, 650 95 Q 685 140, 710 240 Z" fill="#a9823a" opacity="0.75" />
          <path d="M380 240 Q 420 155, 470 120 Q 490 170, 510 240 Z" fill="#5d3a41" opacity="0.7" />
          <path d="M690 240 Q 720 160, 770 125 Q 800 175, 830 240 Z" fill="#5d3a41" opacity="0.7" />
          <path d="M220 240 Q 280 160, 360 140 Q 370 195, 400 240 Z" fill="#9c5f66" opacity="0.65" />
          <path d="M800 240 Q 840 180, 920 150 Q 940 195, 980 240 Z" fill="#9c5f66" opacity="0.65" />
        </g>

        <g stroke="#c9a24b" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
          <path d="M350 240 Q 450 170, 520 145" fill="none" />
          <path d="M850 240 Q 750 170, 680 145" fill="none" />
          <path d="M540 240 Q 570 180, 600 160 Q 630 180, 660 240" fill="none" />
        </g>

        <g transform="translate(600, 165)">
          <circle cx="0" cy="0" r="46" fill="#fffdfa" stroke="#c9a24b" strokeWidth="1.2" />
          <circle cx="-16" cy="-8" r="28" fill="#fcf6ec" stroke="#e9d3a3" strokeWidth="0.8" opacity="0.9" />
          <circle cx="16" cy="-8" r="28" fill="#fcf6ec" stroke="#e9d3a3" strokeWidth="0.8" opacity="0.9" />
          <circle cx="0" cy="14" r="28" fill="#f7e9e5" stroke="#c07b82" strokeWidth="0.8" opacity="0.85" />
          <circle cx="-6" cy="4" r="16" fill="#5d3a41" opacity="0.85" />
          <circle cx="6" cy="4" r="16" fill="#5d3a41" opacity="0.85" />
          <circle cx="0" cy="-4" r="12" fill="#7a4a52" />
          <circle cx="0" cy="0" r="6" fill="#c9a24b" />
        </g>

        <g transform="translate(420, 180)">
          <ellipse cx="0" cy="-20" rx="16" ry="24" fill="#5d3a41" opacity="0.9" />
          <ellipse cx="-20" cy="6" rx="22" ry="15" fill="#7a4a52" opacity="0.85" />
          <ellipse cx="20" cy="6" rx="22" ry="15" fill="#7a4a52" opacity="0.85" />
          <ellipse cx="-12" cy="22" rx="14" ry="20" fill="#9c5f66" opacity="0.85" />
          <ellipse cx="12" cy="22" rx="14" ry="20" fill="#9c5f66" opacity="0.85" />
          <circle cx="0" cy="4" r="9" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="0" cy="4" r="3.5" fill="#5d3a41" />
        </g>

        <g transform="translate(780, 180) scale(-1, 1)">
          <ellipse cx="0" cy="-20" rx="16" ry="24" fill="#5d3a41" opacity="0.9" />
          <ellipse cx="-20" cy="6" rx="22" ry="15" fill="#7a4a52" opacity="0.85" />
          <ellipse cx="20" cy="6" rx="22" ry="15" fill="#7a4a52" opacity="0.85" />
          <ellipse cx="-12" cy="22" rx="14" ry="20" fill="#9c5f66" opacity="0.85" />
          <ellipse cx="12" cy="22" rx="14" ry="20" fill="#9c5f66" opacity="0.85" />
          <circle cx="0" cy="4" r="9" fill="#fdf0cd" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="0" cy="4" r="3.5" fill="#5d3a41" />
        </g>

        <g transform="translate(240, 205)">
          <circle cx="0" cy="0" r="22" fill="#fffdfa" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="0" cy="0" r="12" fill="#9c5f66" opacity="0.75" />
          <circle cx="0" cy="0" r="4" fill="#c9a24b" />
        </g>
        <g transform="translate(960, 205)">
          <circle cx="0" cy="0" r="22" fill="#fffdfa" stroke="#c9a24b" strokeWidth="1" />
          <circle cx="0" cy="0" r="12" fill="#9c5f66" opacity="0.75" />
          <circle cx="0" cy="0" r="4" fill="#c9a24b" />
        </g>
      </svg>
    </div>
  );
}
