"use client";

import React from "react";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
}

export function FixedInvitationBackground({ heroPhotoUrl: _heroPhotoUrl }: FixedInvitationBackgroundProps) {
  return (
    <>
      {/* Base Background Image Layer (z-0) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
        aria-hidden="true"
      >
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
          <div className="absolute inset-0 bg-[#FBF7F2]/35 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(107,18,34,0.12)_100%)] pointer-events-none" />
        </div>
      </div>

      {/* Persistent 4-Corner Decorative Frame Layer (z-[1]) */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none overflow-hidden select-none w-screen h-dvh"
        aria-hidden="true"
      >
        {/* Top Left Corner Ornament (Pojok Atas) */}
        <div className="absolute top-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none origin-top-left animate-wind-sway-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/pojok-atas.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* Top Right Corner Ornament (Pojok Atas Mirrored) */}
        <div className="absolute top-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none origin-top-right animate-wind-sway-right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/pojok-atas.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* Bottom Left Corner Ornament (Pojok Bawah Mirrored) */}
        <div className="absolute bottom-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none origin-bottom-left animate-wind-sway-bottom-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/pojok-bawah.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Bottom Right Corner Ornament (Pojok Bawah Normal) */}
        <div className="absolute bottom-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none origin-bottom-right animate-wind-sway-bottom-right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/pojok-bawah.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
    </>
  );
}
