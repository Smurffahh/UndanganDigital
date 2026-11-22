"use client";

import React from "react";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
}

export function FixedInvitationBackground({ heroPhotoUrl: _heroPhotoUrl }: FixedInvitationBackgroundProps) {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
      aria-hidden="true"
    >
      {/* Full-bleed Javanese Classical Background with WCAG AA Contrast Veil */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/background.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#FBF7F2]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(67,10,20,0.14)_100%)] pointer-events-none" />
      </div>

      {/* Top Left Corner Ornament (Pojok Atas) with Ambient Sway */}
      <div className="absolute top-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none z-[2] origin-top-left animate-ambient-sway-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/pojok-atas.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Top Right Corner Ornament (Pojok Atas Mirrored) with Ambient Sway */}
      <div className="absolute top-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none z-[2] origin-top-right animate-ambient-sway-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/pojok-atas.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Bottom Left Corner Ornament (Pojok Bawah) */}
      <div className="absolute bottom-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none z-[2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/pojok-bawah.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Bottom Right Corner Ornament (Pojok Bawah Mirrored) */}
      <div className="absolute bottom-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] scale-x-[-1] pointer-events-none z-[2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/javanese/pojok-bawah.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none"
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  );
}
