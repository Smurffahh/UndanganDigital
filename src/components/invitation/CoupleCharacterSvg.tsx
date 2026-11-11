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
  const fileName = isCouple ? `couple-${preset}.svg` : `couple-${preset}-${variant}.svg`;
  const src = `/images/${fileName}`;
  const titleText = isCouple
    ? "Ilustrasi Mempelai Berdua Fauzan & Sinta"
    : variant === "groom"
    ? "Ilustrasi Mempelai Pria — Fauzan Ma'ruf"
    : "Ilustrasi Mempelai Wanita — Sinta Maria Utami";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={titleText}
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 pointer-events-none"
        style={aspectRatio ? { aspectRatio } : undefined}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
