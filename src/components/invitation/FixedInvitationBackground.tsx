"use client";

import React from "react";

interface FixedInvitationBackgroundProps {
  heroPhotoUrl?: string;
  showCornerAssets?: boolean;
}

export function FixedInvitationBackground({
  heroPhotoUrl: _heroPhotoUrl,
  showCornerAssets = false,
}: FixedInvitationBackgroundProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none w-screen h-dvh"
        aria-hidden="true"
      >
        <div className="absolute inset-0">
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

      {showCornerAssets && (
        <div
          className="fixed inset-0 z-[1] pointer-events-none overflow-hidden select-none w-screen h-dvh"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none animate-asset-enter-down"
            style={{ animationDelay: "180ms" }}
          >
            <div className="w-full h-full leaf-sway-top-left">
              <img
                src="/assets/javanese/pojok-atas.webp"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain pointer-events-none select-none"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>

          <div
            className="absolute top-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/3022] pointer-events-none animate-asset-enter-down"
            style={{ animationDelay: "180ms" }}
          >
            <div className="w-full h-full leaf-sway-top-right">
              <img
                src="/assets/javanese/pojok-atas.webp"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none animate-asset-enter-up"
            style={{ animationDelay: "320ms" }}
          >
            <div className="w-full h-full leaf-sway-bottom-left">
              <img
                src="/assets/javanese/pojok-bawah.webp"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain pointer-events-none select-none scale-x-[-1]"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>

          <div
            className="absolute bottom-0 right-0 w-28 sm:w-36 md:w-44 aspect-[3375/4219] pointer-events-none animate-asset-enter-up"
            style={{ animationDelay: "320ms" }}
          >
            <div className="w-full h-full leaf-sway-bottom-right">
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
        </div>
      )}
    </>
  );
}
