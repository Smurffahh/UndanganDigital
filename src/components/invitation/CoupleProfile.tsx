"use client";

import { SongketRibbon } from "./Ornaments";
import { GununganWayang } from "./GununganWayang";
import { ScrollLinkedItem } from "./ScrollLinkedItem";
import { ScrollReveal } from "./ScrollReveal";
import { CoupleCharacterSvg } from "./CoupleCharacterSvg";
import type { CoupleVisualMode, SvgCharacterPreset } from "@/lib/db/seed-data";

interface CoupleProfileProps {
  brideName: string;
  brideBirth: string;
  brideBio: string;
  bridePhotoUrl: string;
  groomName: string;
  groomBirth: string;
  groomBio: string;
  groomPhotoUrl: string;
  coupleVisualMode?: CoupleVisualMode;
  svgCharacterPreset?: SvgCharacterPreset;
  groomChildOrder?: string;
  groomParents?: string;
  brideChildOrder?: string;
  brideParents?: string;
}

export function CoupleProfile({
  brideName,
  brideBirth,
  brideBio,
  bridePhotoUrl,
  groomName,
  groomBirth,
  groomBio,
  groomPhotoUrl,
  coupleVisualMode = "photo",
  svgCharacterPreset = "javanese-royal",
  groomChildOrder,
  groomParents,
  brideChildOrder,
  brideParents,
}: CoupleProfileProps) {
  const isSvgMode = coupleVisualMode === "svg";

  const groomOrderText = groomChildOrder
    ? (groomChildOrder.toLowerCase().includes("dari") ? groomChildOrder : `${groomChildOrder} dari Pasangan`)
    : "Putra dari Pasangan";

  const brideOrderText = brideChildOrder
    ? (brideChildOrder.toLowerCase().includes("dari") ? brideChildOrder : `${brideChildOrder} dari Pasangan`)
    : "Putri dari Pasangan";

  return (
    <section id="mempelai" className="py-20 relative bg-transparent" aria-label="Profil Mempelai">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        <header className="text-center mb-12">
          <ScrollLinkedItem offsetY={36}>
            <span className="inline-block px-4 py-1 rounded-full border border-gold-500/40 bg-surface-white/90 typo-eyebrow text-[#a9823a] tracking-[0.22em] uppercase shadow-xs mb-3">
              Bride &amp; Groom
            </span>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <p className="typo-body text-xs sm:text-sm text-[#7a5c61] mb-2">
              Dengan Memohon Rahmat &amp; Ridho Allah SWT
            </p>
            <h2 className="typo-section-title">
              Mempelai
            </h2>
            <SongketRibbon />
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <div className="mt-5 max-w-[540px] mx-auto px-5 py-4 rounded-2xl bg-surface-white/90 backdrop-blur-md border border-gold-500/30 shadow-[0_12px_24px_-10px_rgba(93,58,65,0.12)]">
              <p className="typo-body italic text-center mx-auto text-[#4b3a3e]">
                &ldquo;Berawal dari pertemuan singkat, tanpa rencana panjang yang rumit&mdash;satset langsung lamaran, dan kini insya Allah bersatu dalam ikatan suci pernikahan.&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <span className="w-6 h-px bg-gold-500/50" />
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#a9823a]">
                  #SINgkatceritaFAUZAN
                </span>
                <span className="w-6 h-px bg-gold-500/50" />
              </div>
            </div>
          </ScrollLinkedItem>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10 md:gap-6">
          <ScrollReveal direction="left">
            <article className="text-center p-4 sm:p-6 flex flex-col items-center">
              <ScrollLinkedItem offsetY={36} className="mb-5">
                <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white/95 typo-eyebrow text-[#a9823a] shadow-xs">
                  Mempelai Pria
                </span>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="w-[min(72%,250px)] aspect-[3/4] p-2 rounded-[999px] border-2 border-[#5d3a41]/60 outline outline-1 outline-offset-4 outline-[#c9a24b]/50 shadow-lg bg-[#fffdfa]/95 relative z-10 mb-6">
                <div className="w-full h-full rounded-[999px] overflow-hidden flex items-center justify-center bg-[#fdfaf5]">
                  {isSvgMode || !groomPhotoUrl ? (
                    <CoupleCharacterSvg
                      preset={svgCharacterPreset}
                      variant="groom"
                      className="w-full h-full"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={groomPhotoUrl}
                      alt={`${groomName} - Mempelai Pria`}
                      className="w-full h-full object-cover rounded-[999px] outline outline-1 -outline-offset-1 outline-black/10"
                      loading="lazy"
                    />
                  )}
                </div>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="text-center">
                <span className="font-script text-3xl sm:text-4xl text-[#5d3a41] block mt-2 mb-0.5 leading-none">
                  Fauzan
                </span>
                <h3 className="typo-card-title mt-1">
                  {groomName}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#7a5c61]">
                  {groomOrderText}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#5d3a41] mt-0.5">
                  {groomParents || "Bapak H. Ma'ruf & Ibu Hj. Siti Aminah"}
                </p>
                {groomBirth && (
                  <p className="mt-1.5 typo-eyebrow text-[#a9823a] text-[10px] sm:text-xs">
                    {groomBirth}
                  </p>
                )}
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="mt-4 w-full max-w-[340px]">
                <div className="p-4 rounded-2xl bg-[#fffdfa]/95 backdrop-blur-sm border border-[#c9a24b]/40 shadow-xs relative overflow-hidden">
                  <p className="typo-body text-center mx-auto text-[#4b3a3e] relative z-10">
                    {groomBio}
                  </p>
                </div>
              </ScrollLinkedItem>
            </article>
          </ScrollReveal>

          <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-4 md:my-0">
            <ScrollReveal direction="left">
              <ScrollLinkedItem offsetY={24}>
                <div className="-rotate-12 w-10 sm:w-12 h-14 sm:h-16 flex items-center justify-center opacity-85">
                  <GununganWayang variant="royal-solid" tone="gold-harmony" />
                </div>
              </ScrollLinkedItem>
            </ScrollReveal>

            <ScrollReveal direction="center-scale">
              <ScrollLinkedItem offsetY={36}>
                <span className="font-script text-5xl sm:text-6xl text-[#c9a24b] drop-shadow-sm select-none leading-none animate-gold-sheen">
                  &amp;
                </span>
              </ScrollLinkedItem>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <ScrollLinkedItem offsetY={24}>
                <div className="rotate-12 w-10 sm:w-12 h-14 sm:h-16 flex items-center justify-center opacity-85">
                  <GununganWayang variant="royal-solid" tone="gold-harmony" flipHorizontal />
                </div>
              </ScrollLinkedItem>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <article className="text-center p-4 sm:p-6 flex flex-col items-center">
              <ScrollLinkedItem offsetY={36} className="mb-5">
                <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white/95 typo-eyebrow text-[#a9823a] shadow-xs">
                  Mempelai Wanita
                </span>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="w-[min(72%,250px)] aspect-[3/4] p-2 rounded-[999px] border-2 border-[#5d3a41]/60 outline outline-1 outline-offset-4 outline-[#c9a24b]/50 shadow-lg bg-[#fffdfa]/95 relative z-10 mb-6">
                <div className="w-full h-full rounded-[999px] overflow-hidden flex items-center justify-center bg-[#fdfaf5]">
                  {isSvgMode || !bridePhotoUrl ? (
                    <CoupleCharacterSvg
                      preset={svgCharacterPreset}
                      variant="bride"
                      className="w-full h-full"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={bridePhotoUrl}
                      alt={`${brideName} - Mempelai Wanita`}
                      className="w-full h-full object-cover rounded-[999px] outline outline-1 -outline-offset-1 outline-black/10"
                      loading="lazy"
                    />
                  )}
                </div>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="text-center">
                <span className="font-script text-3xl sm:text-4xl text-[#5d3a41] block mt-2 mb-0.5 leading-none">
                  Sinta
                </span>
                <h3 className="typo-card-title mt-1">
                  {brideName}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#7a5c61]">
                  {brideOrderText}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#5d3a41] mt-0.5">
                  {brideParents || "Bapak H. Utami & Ibu Hj. Maria"}
                </p>
                {brideBirth && (
                  <p className="mt-1.5 typo-eyebrow text-[#a9823a] text-[10px] sm:text-xs">
                    {brideBirth}
                  </p>
                )}
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} className="mt-4 w-full max-w-[340px]">
                <div className="p-4 rounded-2xl bg-[#fffdfa]/95 backdrop-blur-sm border border-[#c9a24b]/40 shadow-xs relative overflow-hidden">
                  <p className="typo-body text-center mx-auto text-[#4b3a3e] relative z-10">
                    {brideBio}
                  </p>
                </div>
              </ScrollLinkedItem>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
