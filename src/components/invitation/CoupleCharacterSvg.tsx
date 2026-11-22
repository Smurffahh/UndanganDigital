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

  if (preset === "javanese-royal") {
    if (isCouple) {
      return (
        <div
          className={`relative flex items-end justify-center overflow-hidden select-none ${className}`}
          style={aspectRatio ? { aspectRatio } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/dua-pengantin.webp"
            alt="Ilustrasi Dua Pengantin Fauzan dan Sinta"
            className="h-[84%] w-auto max-w-[84%] object-contain object-bottom drop-shadow-xs pointer-events-none select-none mx-auto"
            loading="eager"
            draggable={false}
          />
        </div>
      );
    }

    const webpSrc =
      variant === "groom"
        ? "/assets/javanese/pengantin-pria.webp"
        : "/assets/javanese/pengantin-wanita.webp";
    const altText =
      variant === "groom"
        ? "Ilustrasi Mempelai Pria — Fauzan Ma'ruf"
        : "Ilustrasi Mempelai Wanita — Sinta Maria Utami";

    return (
      <div
        className={`relative flex items-end justify-center overflow-hidden select-none ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={webpSrc}
          alt={altText}
          className="h-[84%] w-auto max-w-[84%] object-contain object-bottom drop-shadow-xs pointer-events-none select-none mx-auto"
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }

  const fileName = isCouple ? `couple-${preset}.svg` : `couple-${preset}-${variant}.svg`;
  const src = `/images/${fileName}`;
  const titleText = isCouple
    ? "Ilustrasi Mempelai Berdua Fauzan & Sinta"
    : variant === "groom"
    ? "Ilustrasi Mempelai Pria — Fauzan Ma'ruf"
    : "Ilustrasi Mempelai Wanita — Sinta Maria Utami";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={titleText}
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 pointer-events-none"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
