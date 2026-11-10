"use client";

import React from "react";

export interface ButterflyAnatomySvgProps {
  variant?: "swallowtail" | "morpho";
  className?: string;
  isFlappingFast?: boolean;
  animationDelay?: string;
  style?: React.CSSProperties;
}

export function ButterflyAnatomySvg({
  variant = "swallowtail",
  className = "w-10 h-10",
  isFlappingFast,
  animationDelay,
  style,
}: ButterflyAnatomySvgProps) {
  const isSwallowtail = variant === "swallowtail";
  const wingSpeedStyle = {
    ...(isFlappingFast !== undefined
      ? { "--wing-speed": isFlappingFast ? "1.15s" : "1.85s" }
      : {}),
    ...(animationDelay ? { "--wing-delay": animationDelay } : {}),
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={wingSpeedStyle}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(93,58,65,0.22)] overflow-visible"
      >
        <defs>
          <linearGradient id={`wing-grad-${variant}`} x1="0" y1="0" x2="1" y2="1">
            {isSwallowtail ? (
              <>
                <stop offset="0%" stopColor="#fdf3d6" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#c9a24b" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#8c5835" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#452718" stopOpacity="0.95" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fffdfa" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#edd9b3" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#c08497" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#5d3a41" stopOpacity="0.92" />
              </>
            )}
          </linearGradient>

          <linearGradient id={`hind-grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
            {isSwallowtail ? (
              <>
                <stop offset="0%" stopColor="#c9a24b" stopOpacity="0.92" />
                <stop offset="65%" stopColor="#7a4623" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3d2214" stopOpacity="0.95" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ecd4ba" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#9c5f66" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4a242c" stopOpacity="0.95" />
              </>
            )}
          </linearGradient>
        </defs>

        <g className="butterfly-wing-left">
          <path
            d="M 50,42 C 45,30 24,6 4,14 C -3,20 1,35 12,46 C 24,57 42,54 50,48 Z"
            fill={`url(#wing-grad-${variant})`}
            stroke={isSwallowtail ? "#6b4324" : "#4a242c"}
            strokeWidth="0.85"
          />

          <g stroke={isSwallowtail ? "#784a28" : "#5d3a41"} strokeWidth="0.75" opacity="0.8">
            <path d="M 48,42 C 36,32 20,20 8,17" />
            <path d="M 46,43 C 32,36 18,30 11,28" />
            <path d="M 44,45 C 30,44 18,42 14,39" />
            <path d="M 45,46 C 34,50 24,52 18,49" />
          </g>

          {isSwallowtail ? (
            <path
              d="M 49,46 C 44,52 28,54 18,65 C 10,72 14,84 26,81 C 32,79 31,88 34,89 C 36,89 36,80 44,68 C 48,62 49,54 49,46 Z"
              fill={`url(#hind-grad-${variant})`}
              stroke="#54301a"
              strokeWidth="0.85"
            />
          ) : (
            <path
              d="M 49,46 C 42,52 26,56 20,68 C 16,77 24,84 34,80 C 42,76 46,65 49,46 Z"
              fill={`url(#hind-grad-${variant})`}
              stroke="#4a242c"
              strokeWidth="0.85"
            />
          )}

          <g stroke={isSwallowtail ? "#63391d" : "#5d3a41"} strokeWidth="0.65" opacity="0.75">
            <path d="M 48,50 C 36,58 24,66 20,74" />
            <path d="M 46,52 C 38,64 32,72 28,78" />
          </g>

          <circle cx="8" cy="18" r="1.3" fill="#ffffff" opacity="0.9" />
          <circle cx="14" cy="27" r="1.2" fill="#ffffff" opacity="0.85" />
          <circle cx="17" cy="39" r="1.1" fill="#ffffff" opacity="0.85" />
          <circle cx="21" cy="74" r="1.2" fill={isSwallowtail ? "#ffd700" : "#fbcfe8"} opacity="0.9" />
        </g>

        <g className="butterfly-wing-right">
          <path
            d="M 50,42 C 55,30 76,6 96,14 C 103,20 99,35 88,46 C 76,57 58,54 50,48 Z"
            fill={`url(#wing-grad-${variant})`}
            stroke={isSwallowtail ? "#6b4324" : "#4a242c"}
            strokeWidth="0.85"
          />

          <g stroke={isSwallowtail ? "#784a28" : "#5d3a41"} strokeWidth="0.75" opacity="0.8">
            <path d="M 52,42 C 64,32 80,20 92,17" />
            <path d="M 54,43 C 68,36 82,30 89,28" />
            <path d="M 56,45 C 70,44 82,42 86,39" />
            <path d="M 55,46 C 66,50 76,52 82,49" />
          </g>

          {isSwallowtail ? (
            <path
              d="M 51,46 C 56,52 72,54 82,65 C 90,72 86,84 74,81 C 68,79 69,88 66,89 C 64,89 64,80 56,68 C 52,62 51,54 51,46 Z"
              fill={`url(#hind-grad-${variant})`}
              stroke="#54301a"
              strokeWidth="0.85"
            />
          ) : (
            <path
              d="M 51,46 C 58,52 74,56 80,68 C 84,77 76,84 66,80 C 58,76 54,65 51,46 Z"
              fill={`url(#hind-grad-${variant})`}
              stroke="#4a242c"
              strokeWidth="0.85"
            />
          )}

          <g stroke={isSwallowtail ? "#63391d" : "#5d3a41"} strokeWidth="0.65" opacity="0.75">
            <path d="M 52,50 C 64,58 76,66 80,74" />
            <path d="M 54,52 C 62,64 68,72 72,78" />
          </g>

          <circle cx="92" cy="18" r="1.3" fill="#ffffff" opacity="0.9" />
          <circle cx="86" cy="27" r="1.2" fill="#ffffff" opacity="0.85" />
          <circle cx="83" cy="39" r="1.1" fill="#ffffff" opacity="0.85" />
          <circle cx="79" cy="74" r="1.2" fill={isSwallowtail ? "#ffd700" : "#fbcfe8"} opacity="0.9" />
        </g>

        <g id="butterfly-body" className="butterfly-body-bob">
          <path
            d="M 49,36 Q 44,22 36,15 M 51,36 Q 56,22 64,15"
            stroke="#2b1a13"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <circle cx="35" cy="14" r="1.4" fill="#c9a24b" />
          <circle cx="65" cy="14" r="1.4" fill="#c9a24b" />

          <circle cx="50" cy="37" r="2.8" fill="#2d1b11" />
          <circle cx="48.5" cy="36.5" r="0.7" fill="#ffffff" opacity="0.8" />
          <circle cx="51.5" cy="36.5" r="0.7" fill="#ffffff" opacity="0.8" />

          <ellipse cx="50" cy="44" rx="3.2" ry="5.5" fill="#3a2316" stroke="#24140c" strokeWidth="0.6" />
          <line x1="48" y1="42" x2="52" y2="42" stroke="#c9a24b" strokeWidth="0.6" />
          <line x1="47.5" y1="45" x2="52.5" y2="45" stroke="#c9a24b" strokeWidth="0.6" />

          <path
            d="M 47.5,49 C 47.5,49 46.5,58 48,66 C 49,70 50,73 50,73 C 50,73 51,70 52,66 C 53.5,58 52.5,49 52.5,49 Z"
            fill="#2d1b11"
            stroke="#1c0f08"
            strokeWidth="0.6"
          />
          <line x1="48.5" y1="53" x2="51.5" y2="53" stroke="#8c5835" strokeWidth="0.5" />
          <line x1="48" y1="57" x2="52" y2="57" stroke="#8c5835" strokeWidth="0.5" />
          <line x1="48.2" y1="61" x2="51.8" y2="61" stroke="#8c5835" strokeWidth="0.5" />
          <line x1="48.8" y1="65" x2="51.2" y2="65" stroke="#8c5835" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}
