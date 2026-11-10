"use client";

import React from "react";
import type { SvgCharacterPreset } from "@/lib/db/seed-data";

export interface CoupleCharacterSvgProps {
  preset?: SvgCharacterPreset;
  variant?: "groom" | "bride" | "couple";
  className?: string;
  aspectRatio?: string;
}

export function CoupleCharacterSvg({
  preset = "javanese-royal",
  variant = "couple",
  className = "w-full h-full",
  aspectRatio,
}: CoupleCharacterSvgProps) {
  const isCouple = variant === "couple";
  const isGroom = variant === "groom";
  const viewBox = isCouple ? "0 0 460 400" : "0 0 320 400";
  const width = isCouple ? 460 : 320;
  const height = 400;

  const titleText = isCouple
    ? "Ilustrasi Mempelai Berdua Fauzan & Sinta"
    : isGroom
    ? "Ilustrasi Mempelai Pria — Fauzan Ma'ruf"
    : "Ilustrasi Mempelai Wanita — Sinta Maria Utami";

  const renderBackdropArch = () => {
    if (isCouple) {
      return (
        <g opacity="0.95">
          <defs>
            <linearGradient id={`arch-bg-${preset}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf8f0" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f7eee1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eddcc7" stopOpacity="0.85" />
            </linearGradient>
            <pattern id={`kawung-subtle-${preset}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="7" fill="none" stroke="#c9a24b" strokeWidth="0.5" strokeOpacity="0.18" />
              <ellipse cx="6" cy="12" rx="4" ry="2" fill="none" stroke="#c9a24b" strokeWidth="0.4" strokeOpacity="0.15" />
              <ellipse cx="18" cy="12" rx="4" ry="2" fill="none" stroke="#c9a24b" strokeWidth="0.4" strokeOpacity="0.15" />
              <ellipse cx="12" cy="6" rx="2" ry="4" fill="none" stroke="#c9a24b" strokeWidth="0.4" strokeOpacity="0.15" />
              <ellipse cx="12" cy="18" rx="2" ry="4" fill="none" stroke="#c9a24b" strokeWidth="0.4" strokeOpacity="0.15" />
            </pattern>
          </defs>

          <path
            d="M 30,390 L 30,170 A 200,200 0 0 1 430,170 L 430,390 Z"
            fill={`url(#arch-bg-${preset})`}
          />
          <path
            d="M 30,390 L 30,170 A 200,200 0 0 1 430,170 L 430,390 Z"
            fill={`url(#kawung-subtle-${preset})`}
          />

          <path
            d="M 34,388 L 34,172 A 196,196 0 0 1 426,172 L 426,388"
            fill="none"
            stroke="#c9a24b"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />
          <path
            d="M 42,388 L 42,176 A 188,188 0 0 1 418,176 L 418,388"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.7"
            strokeDasharray="2 3"
            strokeOpacity="0.6"
          />

          <circle cx="230" cy="24" r="14" fill="#fdfbf7" stroke="#c9a24b" strokeWidth="1" strokeOpacity="0.8" />
          <path d="M 230,14 L 230,34 M 220,24 L 240,24" stroke="#c9a24b" strokeWidth="0.8" strokeOpacity="0.7" />
          <circle cx="230" cy="24" r="3.5" fill="#c9a24b" />
          <line x1="160" y1="24" x2="212" y2="24" stroke="#c9a24b" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="248" y1="24" x2="300" y2="24" stroke="#c9a24b" strokeWidth="0.8" strokeOpacity="0.5" />
        </g>
      );
    }

    return (
      <g opacity="0.95">
        <defs>
          <linearGradient id={`arch-bg-solo-${preset}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf9f3" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#f8f0e5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ecdcc8" stopOpacity="0.9" />
          </linearGradient>
          <pattern id={`kawung-solo-${preset}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="6" fill="none" stroke="#c9a24b" strokeWidth="0.4" strokeOpacity="0.18" />
            <ellipse cx="5" cy="10" rx="3.5" ry="1.8" fill="none" stroke="#c9a24b" strokeWidth="0.35" strokeOpacity="0.14" />
            <ellipse cx="15" cy="10" rx="3.5" ry="1.8" fill="none" stroke="#c9a24b" strokeWidth="0.35" strokeOpacity="0.14" />
            <ellipse cx="10" cy="5" rx="1.8" ry="3.5" fill="none" stroke="#c9a24b" strokeWidth="0.35" strokeOpacity="0.14" />
            <ellipse cx="10" cy="15" rx="1.8" ry="3.5" fill="none" stroke="#c9a24b" strokeWidth="0.35" strokeOpacity="0.14" />
          </pattern>
        </defs>

        <path
          d="M 25,390 L 25,150 A 135,135 0 0 1 295,150 L 295,390 Z"
          fill={`url(#arch-bg-solo-${preset})`}
        />
        <path
          d="M 25,390 L 25,150 A 135,135 0 0 1 295,150 L 295,390 Z"
          fill={`url(#kawung-solo-${preset})`}
        />

        <path
          d="M 28,388 L 28,152 A 132,132 0 0 1 292,152 L 292,388"
          fill="none"
          stroke="#c9a24b"
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />
        <path
          d="M 34,388 L 34,156 A 126,126 0 0 1 286,156 L 286,388"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          strokeOpacity="0.65"
        />

        <circle cx="160" cy="22" r="11" fill="#fdfbf7" stroke="#c9a24b" strokeWidth="0.9" strokeOpacity="0.8" />
        <path d="M 160,14 L 160,30 M 152,22 L 168,22" stroke="#c9a24b" strokeWidth="0.75" strokeOpacity="0.7" />
        <circle cx="160" cy="22" r="2.8" fill="#c9a24b" />
      </g>
    );
  };

  const renderJavaneseRoyal = () => {
    const groomX = isCouple ? 165 : 160;
    const brideX = isCouple ? 295 : 160;

    const renderJavaneseGroomHeadAndBody = (cx: number) => (
      <g id="javanese-groom">
        <path
          d={`M ${cx - 52},390 L ${cx - 50},265 C ${cx - 45},238 ${cx - 28},228 ${cx - 15},225 L ${cx + 15},225 C ${cx + 28},228 ${cx + 45},238 ${cx + 50},265 L ${cx + 52},390 Z`}
          fill="#1f2229"
          stroke="#121418"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 14},226 L ${cx - 8},265 L ${cx},275 L ${cx + 8},265 L ${cx + 14},226 Z`}
          fill="#fbf9f4"
          stroke="#c9a24b"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 48},260 Q ${cx - 20},240 ${cx},252 Q ${cx + 20},240 ${cx + 48},260`}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line x1={cx} y1={252} x2={cx} y2={390} stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 4" strokeOpacity="0.9" />
        <circle cx={cx} cy={268} r="2.2" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <circle cx={cx} cy={290} r="2.2" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <circle cx={cx} cy={312} r="2.2" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <circle cx={cx} cy={334} r="2.2" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />

        <circle cx={cx - 24} cy={262} r="4.5" fill="#d4af37" stroke="#1f2229" strokeWidth="0.6" />
        <path
          d={`M ${cx - 24},266 Q ${cx - 20},280 ${cx - 18},298 Q ${cx - 22},315 ${cx - 20},330`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
        <path
          d={`M ${cx - 24},266 Q ${cx - 20},280 ${cx - 18},298 Q ${cx - 22},315 ${cx - 20},330`}
          fill="none"
          stroke="#c9a24b"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />

        <path
          d={`M ${cx - 11},224 L ${cx - 11},200 L ${cx + 11},200 L ${cx + 11},224 Z`}
          fill="#f1d0b3"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 21},160 C ${cx - 21},140 ${cx + 21},140 ${cx + 21},160 C ${cx + 21},190 ${cx + 14},206 ${cx},208 C ${cx - 14},206 ${cx - 21},190 ${cx - 21},160 Z`}
          fill="#f6d9be"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 14},162 Q ${cx - 8},160 ${cx - 3},162`} fill="none" stroke="#2a1f18" strokeWidth="1.2" strokeLinecap="round" />
        <path d={`M ${cx + 3},162 Q ${cx + 8},160 ${cx + 14},162`} fill="none" stroke="#2a1f18" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx={cx - 8.5} cy={168} rx="2.5" ry="3.2" fill="#2b1a13" />
        <ellipse cx={cx + 8.5} cy={168} rx="2.5" ry="3.2" fill="#2b1a13" />
        <circle cx={cx - 7.5} cy={166.5} r="0.8" fill="#ffffff" />
        <circle cx={cx + 9.5} cy={166.5} r="0.8" fill="#ffffff" />
        <path d={`M ${cx - 1.5},169 L ${cx},178 L ${cx + 2},177`} fill="none" stroke="#c09477" strokeWidth="1" strokeLinecap="round" />
        <path d={`M ${cx - 6},188 Q ${cx},193 ${cx + 6},188`} fill="none" stroke="#b36d65" strokeWidth="1.6" strokeLinecap="round" />

        <path
          d={`M ${cx - 24},158 C ${cx - 26},128 ${cx + 26},128 ${cx + 24},158 C ${cx + 18},153 ${cx + 12},152 ${cx},153 C ${cx - 12},152 ${cx - 18},153 ${cx - 24},158 Z`}
          fill="#4a2e1e"
          stroke="#26150a"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 24},155 Q ${cx},147 ${cx + 24},155 Q ${cx},151 ${cx - 24},155 Z`}
          fill="#784221"
          stroke="#ffd700"
          strokeWidth="0.6"
        />
        <circle cx={cx + 21} cy={162} r="5.5" fill="#3d2214" stroke="#26150a" strokeWidth="0.8" />
        <path d={`M ${cx - 16},142 L ${cx + 16},142`} stroke="#c9a24b" strokeWidth="0.8" strokeDasharray="1.5 2" />
        <path d={`M ${cx - 12},148 L ${cx + 12},148`} stroke="#c9a24b" strokeWidth="0.8" strokeDasharray="1.5 2" />
      </g>
    );

    const renderJavaneseBrideHeadAndBody = (cx: number) => (
      <g id="javanese-bride">
        <path
          d={`M ${cx - 48},390 L ${cx - 45},272 C ${cx - 40},245 ${cx - 24},235 ${cx - 13},232 L ${cx + 13},232 C ${cx + 24},235 ${cx + 40},245 ${cx + 45},272 L ${cx + 48},390 Z`}
          fill="#4c1d29"
          stroke="#2e0f17"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 14},232 L ${cx - 10},270 L ${cx + 10},270 L ${cx + 14},232 Z`}
          fill="#8c5835"
          stroke="#c9a24b"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 10},244 L ${cx + 10},244 M ${cx - 10},252 L ${cx + 10},252 M ${cx - 10},260 L ${cx + 10},260`}
          stroke="#ffd700"
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
        />
        <path
          d={`M ${cx - 44},268 Q ${cx - 18},245 ${cx},254 Q ${cx + 18},245 ${cx + 44},268`}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <ellipse cx={cx} cy={246} rx="9" ry="3.5" fill="none" stroke="#ffd700" strokeWidth="1" />
        <ellipse cx={cx} cy={252} rx="14" ry="5.5" fill="none" stroke="#ffd700" strokeWidth="0.8" strokeDasharray="2 2" />
        <circle cx={cx} cy={258} r="2.8" fill="#ffd700" stroke="#8c5835" strokeWidth="0.6" />

        <circle cx={cx - 19} cy={172} r="2.2" fill="#ffd700" stroke="#c9a24b" strokeWidth="0.5" />
        <circle cx={cx + 19} cy={172} r="2.2" fill="#ffd700" stroke="#c9a24b" strokeWidth="0.5" />

        <path
          d={`M ${cx - 10},230 L ${cx - 10},205 L ${cx + 10},205 L ${cx + 10},230 Z`}
          fill="#f5d6bd"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 19},165 C ${cx - 19},145 ${cx + 19},145 ${cx + 19},165 C ${cx + 19},192 ${cx + 12},210 ${cx},212 C ${cx - 12},210 ${cx - 19},192 ${cx - 19},165 Z`}
          fill="#fbe0cb"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 13},167 Q ${cx - 7},164 ${cx - 2},166`} fill="none" stroke="#2a1f18" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${cx + 2},166 Q ${cx + 7},164 ${cx + 13},167`} fill="none" stroke="#2a1f18" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx={cx - 7.5} cy={172} rx="2.4" ry="3" fill="#2b1a13" />
        <ellipse cx={cx + 7.5} cy={172} rx="2.4" ry="3" fill="#2b1a13" />
        <circle cx={cx - 6.5} cy={170.5} r="0.75" fill="#ffffff" />
        <circle cx={cx + 8.5} cy={170.5} r="0.75" fill="#ffffff" />
        <ellipse cx={cx - 12} cy={180} rx="4" ry="2" fill="#f49b95" opacity="0.45" />
        <ellipse cx={cx + 12} cy={180} rx="4" ry="2" fill="#f49b95" opacity="0.45" />
        <path d={`M ${cx - 1},173 L ${cx},180 L ${cx + 1.8},179`} fill="none" stroke="#c09477" strokeWidth="0.9" strokeLinecap="round" />
        <path d={`M ${cx - 5.5},190 Q ${cx},195 ${cx + 5.5},190`} fill="none" stroke="#ba3f4e" strokeWidth="1.8" strokeLinecap="round" />

        <path
          d={`M ${cx - 19},162 C ${cx - 19},130 ${cx + 19},130 ${cx + 19},162 C ${cx + 12},154 ${cx + 6},154 ${cx},158 C ${cx - 6},154 ${cx - 12},154 ${cx - 19},162 Z`}
          fill="#181516"
          stroke="#000000"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 15},160 Q ${cx - 7},153 ${cx},156 Q ${cx + 7},153 ${cx + 15},160 Q ${cx + 8},156 ${cx},158 Q ${cx - 8},156 ${cx - 15},160 Z`}
          fill="#241a1c"
          stroke="#ffd700"
          strokeWidth="0.8"
        />
        <ellipse cx={cx} cy={155} rx="3" ry="4.5" fill="#181516" stroke="#ffd700" strokeWidth="0.8" />
        <ellipse cx={cx - 8} cy={157} rx="2.5" ry="3.5" fill="#181516" stroke="#ffd700" strokeWidth="0.7" />
        <ellipse cx={cx + 8} cy={157} rx="2.5" ry="3.5" fill="#181516" stroke="#ffd700" strokeWidth="0.7" />

        <circle cx={cx - 23} cy={168} r="6.5" fill="#181516" stroke="#c9a24b" strokeWidth="0.7" />
        <circle cx={cx + 23} cy={168} r="6.5" fill="#181516" stroke="#c9a24b" strokeWidth="0.7" />
        <circle cx={cx} cy={138} r="3" fill="#ffd700" stroke="#8c5835" strokeWidth="0.6" />
        <line x1={cx} y1={138} x2={cx} y2={148} stroke="#ffd700" strokeWidth="1" />
        <circle cx={cx - 9} cy={141} r="2.5" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <line x1={cx - 9} y1={141} x2={cx - 5} y2={149} stroke="#ffd700" strokeWidth="0.8" />
        <circle cx={cx + 9} cy={141} r="2.5" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <line x1={cx + 9} y1={141} x2={cx + 5} y2={149} stroke="#ffd700" strokeWidth="0.8" />

        <path
          d={`M ${cx + 21},175 Q ${cx + 27},220 ${cx + 24},265 Q ${cx + 20},300 ${cx + 22},340`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeOpacity="0.95"
        />
        <path
          d={`M ${cx + 21},175 Q ${cx + 27},220 ${cx + 24},265 Q ${cx + 20},300 ${cx + 22},340`}
          fill="none"
          stroke="#c9a24b"
          strokeWidth="0.9"
          strokeDasharray="2 3"
        />
      </g>
    );

    if (isCouple) {
      return (
        <g id="javanese-royal-couple">
          {renderJavaneseGroomHeadAndBody(groomX)}
          {renderJavaneseBrideHeadAndBody(brideX)}
          <g id="couple-center-garland" opacity="0.95">
            <ellipse cx="230" cy="305" rx="16" ry="11" fill="#fdfcf9" stroke="#c9a24b" strokeWidth="1" />
            <circle cx="224" cy="304" r="4.5" fill="#e8bb80" opacity="0.9" />
            <circle cx="236" cy="304" r="4.5" fill="#f59ba2" opacity="0.9" />
            <circle cx="230" cy="300" r="3.8" fill="#ffffff" />
            <path d="M 226,312 Q 230,328 232,342 M 234,312 Q 232,328 230,342" stroke="#c9a24b" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>
      );
    }

    return isGroom ? renderJavaneseGroomHeadAndBody(160) : renderJavaneseBrideHeadAndBody(160);
  };

  const renderModernEditorial = () => {
    const groomX = isCouple ? 165 : 160;
    const brideX = isCouple ? 295 : 160;

    const renderModernGroom = (cx: number) => (
      <g id="modern-groom">
        <path
          d={`M ${cx - 54},390 L ${cx - 50},265 C ${cx - 45},238 ${cx - 28},228 ${cx - 15},225 L ${cx + 15},225 C ${cx + 28},228 ${cx + 45},238 ${cx + 50},265 L ${cx + 54},390 Z`}
          fill="#1c222b"
          stroke="#0f1318"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 16},225 L ${cx},280 L ${cx + 16},225 Z`}
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 36},225 L ${cx - 14},295 L ${cx - 38},390 L ${cx - 52},390 L ${cx - 50},265 Z`}
          fill="#252e3a"
          stroke="#10141a"
          strokeWidth="1"
        />
        <path
          d={`M ${cx + 36},225 L ${cx + 14},295 L ${cx + 38},390 L ${cx + 52},390 L ${cx + 50},265 Z`}
          fill="#252e3a"
          stroke="#10141a"
          strokeWidth="1"
        />
        <path
          d={`M ${cx - 8},238 L ${cx - 1},243 L ${cx - 8},248 Z M ${cx + 8},238 L ${cx + 1},243 L ${cx + 8},248 Z`}
          fill="#111827"
        />
        <circle cx={cx} cy={243} r="2" fill="#111827" />
        <circle cx={cx - 24} cy={262} r="3.2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.7" />
        <path d={`M ${cx - 24},265 L ${cx - 23},272`} stroke="#2d6a4f" strokeWidth="1.2" strokeLinecap="round" />

        <path
          d={`M ${cx - 11},224 L ${cx - 11},198 L ${cx + 11},198 L ${cx + 11},224 Z`}
          fill="#f3d4bc"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 21},160 C ${cx - 21},138 ${cx + 21},138 ${cx + 21},160 C ${cx + 21},188 ${cx + 14},206 ${cx},208 C ${cx - 14},206 ${cx - 21},188 ${cx - 21},160 Z`}
          fill="#f8deca"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 14},162 Q ${cx - 8},160 ${cx - 3},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <path d={`M ${cx + 3},162 Q ${cx + 8},160 ${cx + 14},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx={cx - 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <ellipse cx={cx + 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <circle cx={cx - 7.5} cy={166.5} r="0.8" fill="#ffffff" />
        <circle cx={cx + 9.5} cy={166.5} r="0.8" fill="#ffffff" />
        <path d={`M ${cx - 1.5},169 L ${cx},178 L ${cx + 2},177`} fill="none" stroke="#c09477" strokeWidth="1" strokeLinecap="round" />
        <path d={`M ${cx - 6},188 Q ${cx},193 ${cx + 6},188`} fill="none" stroke="#ba6f66" strokeWidth="1.6" strokeLinecap="round" />

        <path
          d={`M ${cx - 24},162 C ${cx - 26},125 ${cx + 24},128 ${cx + 24},162 C ${cx + 18},150 ${cx + 8},146 ${cx},148 C ${cx - 10},148 ${cx - 18},152 ${cx - 24},162 Z`}
          fill="#2b201a"
          stroke="#17100b"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 18},146 Q ${cx - 6},140 ${cx + 14},143`}
          fill="none"
          stroke="#47352b"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );

    const renderModernBride = (cx: number) => (
      <g id="modern-bride">
        <path
          d={`M ${cx - 56},390 L ${cx - 40},270 C ${cx - 36},245 ${cx - 22},235 ${cx - 12},232 L ${cx + 12},232 C ${cx + 22},235 ${cx + 36},245 ${cx + 40},270 L ${cx + 56},390 Z`}
          fill="#fbf9f5"
          stroke="#e2d9cc"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 16},248 Q ${cx},260 ${cx + 16},248 L ${cx + 14},290 Q ${cx},296 ${cx - 14},290 Z`}
          fill="#f4ece2"
          stroke="#d4af37"
          strokeWidth="0.8"
          strokeOpacity="0.8"
        />
        <path
          d={`M ${cx - 12},258 Q ${cx},266 ${cx + 12},258 M ${cx - 12},268 Q ${cx},276 ${cx + 12},268`}
          stroke="#c9a24b"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />

        <ellipse cx={cx} cy={232} rx="12" ry="4" fill="none" stroke="#d4af37" strokeWidth="0.8" />
        <circle cx={cx} cy={236} r="2.2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.6" />

        <path
          d={`M ${cx - 10},230 L ${cx - 10},205 L ${cx + 10},205 L ${cx + 10},230 Z`}
          fill="#f7dac4"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 19},165 C ${cx - 19},145 ${cx + 19},145 ${cx + 19},165 C ${cx + 19},192 ${cx + 12},210 ${cx},212 C ${cx - 12},210 ${cx - 19},192 ${cx - 19},165 Z`}
          fill="#fce4d2"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 13},167 Q ${cx - 7},164 ${cx - 2},166`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${cx + 2},166 Q ${cx + 7},164 ${cx + 13},167`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx={cx - 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <ellipse cx={cx + 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <circle cx={cx - 6.5} cy={170.5} r="0.75" fill="#ffffff" />
        <circle cx={cx + 8.5} cy={170.5} r="0.75" fill="#ffffff" />
        <ellipse cx={cx - 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <ellipse cx={cx + 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <path d={`M ${cx - 1},173 L ${cx},180 L ${cx + 1.8},179`} fill="none" stroke="#c09477" strokeWidth="0.9" strokeLinecap="round" />
        <path d={`M ${cx - 5.5},190 Q ${cx},195 ${cx + 5.5},190`} fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" />

        <path
          d={`M ${cx - 22},166 C ${cx - 24},132 ${cx + 24},132 ${cx + 22},166 C ${cx + 16},152 ${cx + 6},150 ${cx},152 C ${cx - 6},150 ${cx - 16},152 ${cx - 22},166 Z`}
          fill="#33241c"
          stroke="#1c120c"
          strokeWidth="1.2"
        />
        <circle cx={cx} cy={138} r="8.5" fill="#33241c" stroke="#1c120c" strokeWidth="1" />

        <path
          d={`M ${cx - 12},148 Q ${cx},143 ${cx + 12},148`}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={144} r="2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
        <circle cx={cx - 6} cy={146} r="1.6" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
        <circle cx={cx + 6} cy={146} r="1.6" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />

        <path
          d={`M ${cx - 18},146 C ${cx - 36},200 ${cx - 48},320 ${cx - 42},390 L ${cx + 42},390 C ${cx + 48},320 ${cx + 36},200 ${cx + 18},146 Z`}
          fill="#ffffff"
          fillOpacity="0.4"
          stroke="#d4af37"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />
      </g>
    );

    if (isCouple) {
      return (
        <g id="modern-editorial-couple">
          {renderModernGroom(groomX)}
          {renderModernBride(brideX)}
          <g id="modern-center-bouquet" opacity="0.95">
            <ellipse cx="230" cy="305" rx="18" ry="14" fill="#ffffff" stroke="#d4af37" strokeWidth="0.8" />
            <circle cx="222" cy="302" r="5" fill="#fecdd3" />
            <circle cx="232" cy="300" r="5.5" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
            <circle cx="238" cy="306" r="4.5" fill="#fed7aa" />
            <circle cx="226" cy="308" r="4" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
            <path d="M 228,319 L 230,338 M 232,319 L 230,338" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 230,338 Q 224,354 220,365 M 230,338 Q 236,354 240,365" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>
      );
    }

    return isGroom ? renderModernGroom(160) : renderModernBride(160);
  };

  const renderIslamicGrace = () => {
    const groomX = isCouple ? 165 : 160;
    const brideX = isCouple ? 295 : 160;

    const renderIslamicGroom = (cx: number) => (
      <g id="islamic-groom">
        <path
          d={`M ${cx - 52},390 L ${cx - 48},265 C ${cx - 44},238 ${cx - 28},228 ${cx - 15},225 L ${cx + 15},225 C ${cx + 28},228 ${cx + 44},238 ${cx + 48},265 L ${cx + 52},390 Z`}
          fill="#374151"
          stroke="#1f2937"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 14},225 L ${cx - 12},272 L ${cx + 12},272 L ${cx + 14},225 Z`}
          fill="#f3f4f6"
          stroke="#c9a24b"
          strokeWidth="0.8"
        />
        <line x1={cx} y1={225} x2={cx} y2={390} stroke="#c9a24b" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.9" />
        <circle cx={cx} cy={242} r="2" fill="#ffd700" />
        <circle cx={cx} cy={258} r="2" fill="#ffd700" />
        <circle cx={cx} cy={274} r="2" fill="#ffd700" />
        <circle cx={cx} cy={290} r="2" fill="#ffd700" />
        <path
          d={`M ${cx - 46},260 Q ${cx},246 ${cx + 46},260`}
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          d={`M ${cx - 11},224 L ${cx - 11},198 L ${cx + 11},198 L ${cx + 11},224 Z`}
          fill="#f3d4bc"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 20},160 C ${cx - 20},138 ${cx + 20},138 ${cx + 20},160 C ${cx + 20},188 ${cx + 14},206 ${cx},208 C ${cx - 14},206 ${cx - 20},188 ${cx - 20},160 Z`}
          fill="#f8deca"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 14},162 Q ${cx - 8},160 ${cx - 3},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <path d={`M ${cx + 3},162 Q ${cx + 8},160 ${cx + 14},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx={cx - 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <ellipse cx={cx + 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <circle cx={cx - 7.5} cy={166.5} r="0.8" fill="#ffffff" />
        <circle cx={cx + 9.5} cy={166.5} r="0.8" fill="#ffffff" />
        <path d={`M ${cx - 1.5},169 L ${cx},178 L ${cx + 2},177`} fill="none" stroke="#c09477" strokeWidth="1" strokeLinecap="round" />
        <path d={`M ${cx - 6},188 Q ${cx},193 ${cx + 6},188`} fill="none" stroke="#ba6f66" strokeWidth="1.6" strokeLinecap="round" />

        <path
          d={`M ${cx - 22},154 L ${cx - 20},132 L ${cx + 20},132 L ${cx + 22},154 Z`}
          fill="#111827"
          stroke="#000000"
          strokeWidth="1.2"
        />
        <line x1={cx - 22} y1={152} x2={cx + 22} y2={152} stroke="#c9a24b" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={cx} cy={138} r="2.5" fill="#d4af37" stroke="#111827" strokeWidth="0.5" />
      </g>
    );

    const renderIslamicBride = (cx: number) => (
      <g id="islamic-bride">
        <path
          d={`M ${cx - 56},390 L ${cx - 40},270 C ${cx - 36},245 ${cx - 22},235 ${cx - 12},232 L ${cx + 12},232 C ${cx + 22},235 ${cx + 36},245 ${cx + 40},270 L ${cx + 56},390 Z`}
          fill="#fbf5ee"
          stroke="#e2d4c3"
          strokeWidth="1.2"
        />

        <path
          d={`M ${cx - 26},168 C ${cx - 28},132 ${cx + 28},132 ${cx + 26},168 C ${cx + 28},210 ${cx + 38},270 ${cx + 36},320 C ${cx + 20},340 ${cx - 20},340 ${cx - 36},320 C ${cx - 38},270 ${cx - 28},210 ${cx - 26},168 Z`}
          fill="#d4a373"
          fillOpacity="0.85"
          stroke="#b88354"
          strokeWidth="1.2"
        />

        <path
          d={`M ${cx - 18},165 C ${cx - 18},150 ${cx + 18},150 ${cx + 18},165 C ${cx + 18},190 ${cx + 12},205 ${cx},207 C ${cx - 12},205 ${cx - 18},190 ${cx - 18},165 Z`}
          fill="#fae1cf"
          stroke="#caa080"
          strokeWidth="0.9"
        />

        <path d={`M ${cx - 13},167 Q ${cx - 7},164 ${cx - 2},166`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${cx + 2},166 Q ${cx + 7},164 ${cx + 13},167`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx={cx - 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <ellipse cx={cx + 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <circle cx={cx - 6.5} cy={170.5} r="0.75" fill="#ffffff" />
        <circle cx={cx + 8.5} cy={170.5} r="0.75" fill="#ffffff" />
        <ellipse cx={cx - 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <ellipse cx={cx + 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <path d={`M ${cx - 1},173 L ${cx},180 L ${cx + 1.8},179`} fill="none" stroke="#c09477" strokeWidth="0.9" strokeLinecap="round" />
        <path d={`M ${cx - 5.5},190 Q ${cx},195 ${cx + 5.5},190`} fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" />

        <path
          d={`M ${cx - 14},145 Q ${cx},140 ${cx + 14},145`}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={140} r="2.2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.6" />
        <circle cx={cx - 8} cy={142} r="1.8" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />
        <circle cx={cx + 8} cy={142} r="1.8" fill="#ffd700" stroke="#8c5835" strokeWidth="0.5" />

        <path
          d={`M ${cx - 20},208 Q ${cx},228 ${cx + 20},208`}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </g>
    );

    if (isCouple) {
      return (
        <g id="islamic-grace-couple">
          {renderIslamicGroom(groomX)}
          {renderIslamicBride(brideX)}
          <g id="islamic-center-bouquet" opacity="0.95">
            <ellipse cx="230" cy="305" rx="17" ry="13" fill="#ffffff" stroke="#c9a24b" strokeWidth="1" />
            <circle cx="223" cy="303" r="5" fill="#fbb6ce" />
            <circle cx="231" cy="300" r="5.2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
            <circle cx="237" cy="305" r="4.5" fill="#fed7aa" />
            <path d="M 228,318 L 230,336 M 232,318 L 230,336" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      );
    }

    return isGroom ? renderIslamicGroom(160) : renderIslamicBride(160);
  };

  const renderCasualBotanical = () => {
    const groomX = isCouple ? 165 : 160;
    const brideX = isCouple ? 295 : 160;

    const renderCasualGroom = (cx: number) => (
      <g id="casual-groom">
        <path
          d={`M ${cx - 52},390 L ${cx - 48},265 C ${cx - 44},238 ${cx - 28},228 ${cx - 15},225 L ${cx + 15},225 C ${cx + 28},228 ${cx + 44},238 ${cx + 48},265 L ${cx + 52},390 Z`}
          fill="#8c5835"
          stroke="#5a341a"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 40},255 L ${cx - 30},285 L ${cx - 20},255 L ${cx - 10},285 L ${cx},255 L ${cx + 10},285 L ${cx + 20},255 L ${cx + 30},285 L ${cx + 40},255`}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1"
          strokeOpacity="0.8"
        />
        <path
          d={`M ${cx - 42},310 L ${cx - 32},340 L ${cx - 22},310 L ${cx - 12},340 L ${cx - 2},310 L ${cx + 8},340 L ${cx + 18},310 L ${cx + 28},340 L ${cx + 38},310`}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1"
          strokeOpacity="0.8"
        />
        <line x1={cx} y1={225} x2={cx} y2={390} stroke="#2e170a" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx={cx} cy={242} r="2" fill="#ffd700" />
        <circle cx={cx} cy={260} r="2" fill="#ffd700" />
        <circle cx={cx} cy={278} r="2" fill="#ffd700" />

        <path
          d={`M ${cx - 11},224 L ${cx - 11},198 L ${cx + 11},198 L ${cx + 11},224 Z`}
          fill="#f3d4bc"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 20},160 C ${cx - 20},138 ${cx + 20},138 ${cx + 20},160 C ${cx + 20},188 ${cx + 14},206 ${cx},208 C ${cx - 14},206 ${cx - 20},188 ${cx - 20},160 Z`}
          fill="#f8deca"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 14},162 Q ${cx - 8},160 ${cx - 3},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <path d={`M ${cx + 3},162 Q ${cx + 8},160 ${cx + 14},162`} fill="none" stroke="#221815" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx={cx - 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <ellipse cx={cx + 8.5} cy={168} rx="2.5" ry="3.2" fill="#201511" />
        <circle cx={cx - 7.5} cy={166.5} r="0.8" fill="#ffffff" />
        <circle cx={cx + 9.5} cy={166.5} r="0.8" fill="#ffffff" />
        <path d={`M ${cx - 1.5},169 L ${cx},178 L ${cx + 2},177`} fill="none" stroke="#c09477" strokeWidth="1" strokeLinecap="round" />
        <path d={`M ${cx - 6},188 Q ${cx},193 ${cx + 6},188`} fill="none" stroke="#ba6f66" strokeWidth="1.6" strokeLinecap="round" />

        <path
          d={`M ${cx - 23},160 C ${cx - 25},126 ${cx + 24},128 ${cx + 23},160 C ${cx + 18},149 ${cx + 8},146 ${cx},148 C ${cx - 10},148 ${cx - 18},152 ${cx - 23},160 Z`}
          fill="#2b201a"
          stroke="#17100b"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 18},146 Q ${cx - 6},140 ${cx + 14},143`}
          fill="none"
          stroke="#543e32"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );

    const renderCasualBride = (cx: number) => (
      <g id="casual-bride">
        <path
          d={`M ${cx - 52},390 L ${cx - 42},270 C ${cx - 38},245 ${cx - 22},235 ${cx - 12},232 L ${cx + 12},232 C ${cx + 22},235 ${cx + 38},245 ${cx + 42},270 L ${cx + 52},390 Z`}
          fill="#d48c96"
          stroke="#9f5460"
          strokeWidth="1.2"
        />
        <path
          d={`M ${cx - 22},240 L ${cx + 14},390 L ${cx + 26},390 L ${cx - 10},240 Z`}
          fill="#8c5835"
          stroke="#ffd700"
          strokeWidth="0.8"
        />

        <ellipse cx={cx} cy={238} rx="10" ry="3.5" fill="none" stroke="#ffd700" strokeWidth="0.8" />
        <circle cx={cx} cy={242} r="2" fill="#ffd700" />

        <path
          d={`M ${cx - 10},230 L ${cx - 10},205 L ${cx + 10},205 L ${cx + 10},230 Z`}
          fill="#f7dac4"
          stroke="#caa080"
          strokeWidth="0.8"
        />
        <path
          d={`M ${cx - 19},165 C ${cx - 19},145 ${cx + 19},145 ${cx + 19},165 C ${cx + 19},192 ${cx + 12},210 ${cx},212 C ${cx - 12},210 ${cx - 19},192 ${cx - 19},165 Z`}
          fill="#fce4d2"
          stroke="#caa080"
          strokeWidth="1"
        />

        <path d={`M ${cx - 13},167 Q ${cx - 7},164 ${cx - 2},166`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M ${cx + 2},166 Q ${cx + 7},164 ${cx + 13},167`} fill="none" stroke="#221815" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx={cx - 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <ellipse cx={cx + 7.5} cy={172} rx="2.4" ry="3" fill="#201511" />
        <circle cx={cx - 6.5} cy={170.5} r="0.75" fill="#ffffff" />
        <circle cx={cx + 8.5} cy={170.5} r="0.75" fill="#ffffff" />
        <ellipse cx={cx - 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <ellipse cx={cx + 12} cy={180} rx="4" ry="2" fill="#fca5a5" opacity="0.45" />
        <path d={`M ${cx - 1},173 L ${cx},180 L ${cx + 1.8},179`} fill="none" stroke="#c09477" strokeWidth="0.9" strokeLinecap="round" />
        <path d={`M ${cx - 5.5},190 Q ${cx},195 ${cx + 5.5},190`} fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" />

        <path
          d={`M ${cx - 22},166 C ${cx - 24},132 ${cx + 24},132 ${cx + 22},166 C ${cx + 16},152 ${cx + 6},150 ${cx},152 C ${cx - 6},150 ${cx - 16},152 ${cx - 22},166 Z`}
          fill="#33241c"
          stroke="#1c120c"
          strokeWidth="1.2"
        />
        <circle cx={cx + 18} cy={176} r="7.5" fill="#33241c" stroke="#1c120c" strokeWidth="0.8" />
        <circle cx={cx + 22} cy={172} r="3.2" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.6" />
      </g>
    );

    if (isCouple) {
      return (
        <g id="casual-botanical-couple">
          {renderCasualGroom(groomX)}
          {renderCasualBride(brideX)}
          <g id="casual-center-bouquet" opacity="0.95">
            <ellipse cx="230" cy="305" rx="17" ry="13" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.8" />
            <circle cx="223" cy="302" r="5" fill="#fecdd3" />
            <circle cx="232" cy="300" r="5.5" fill="#ffffff" stroke="#c9a24b" strokeWidth="0.5" />
            <circle cx="237" cy="306" r="4.5" fill="#fed7aa" />
            <path d="M 228,318 L 230,336 M 232,318 L 230,336" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      );
    }

    return isGroom ? renderCasualGroom(160) : renderCasualBride(160);
  };

  const renderPreset = () => {
    switch (preset) {
      case "modern-editorial":
        return renderModernEditorial();
      case "islamic-grace":
        return renderIslamicGrace();
      case "casual-botanical":
        return renderCasualBotanical();
      case "javanese-royal":
      default:
        return renderJavaneseRoyal();
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={titleText}
        className="w-full h-full drop-shadow-sm transition-transform duration-300"
      >
        <title>{titleText}</title>
        <desc>Ilustrasi vektor presisi karakter pengantin dengan sentuhan arsitektural.</desc>

        {renderBackdropArch()}
        {renderPreset()}
      </svg>
    </div>
  );
}
