"use client";

import Image from "next/image";
import { type CSSProperties } from "react";

export type GununganVariant = "royal-solid" | "watermark";
export type GununganTone = "gold-harmony" | "antique-bronze" | "luminous-crest";

interface GununganWayangProps {
  variant?: GununganVariant;
  tone?: GununganTone;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  flipHorizontal?: boolean;
  alt?: string;
}

const TONE_FILTERS: Record<GununganTone, string> = {
  "gold-harmony":
    "sepia(0.18) saturate(1.08) hue-rotate(-8deg) contrast(1.03) drop-shadow(0 4px 14px rgba(197, 160, 89, 0.22))",
  "antique-bronze":
    "sepia(0.35) saturate(0.95) hue-rotate(-14deg) contrast(1.05) brightness(0.92)",
  "luminous-crest":
    "sepia(0.15) saturate(1.15) contrast(1.05) drop-shadow(0 0 24px rgba(197, 160, 89, 0.45)) drop-shadow(0 8px 24px rgba(184, 134, 11, 0.25))",
};

export function GununganWayang({
  variant = "royal-solid",
  tone = "gold-harmony",
  className = "",
  style,
  priority = false,
  flipHorizontal = false,
  alt = "Gunungan Wayang Kulit Jawa",
}: GununganWayangProps) {
  const src =
    variant === "watermark"
      ? "/images/gunungan-wayang-watermark.webp"
      : "/images/gunungan-wayang.webp";

  const filterStyle = TONE_FILTERS[tone];
  const transformStyle = flipHorizontal ? "scaleX(-1)" : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={style}
    >
      {tone === "luminous-crest" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -inset-x-4 -top-6 rounded-full bg-radial from-amber-400/25 via-gold-500/10 to-transparent blur-xl pointer-events-none"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={2014}
        priority={priority}
        decoding="async"
        draggable={false}
        className="w-full h-full max-h-full max-w-full object-contain select-none"
        style={{
          filter: filterStyle,
          transform: transformStyle,
        }}
      />
    </div>
  );
}
