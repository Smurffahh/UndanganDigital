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
  loveStoryText?: string;
  storyHashtag?: string;
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
  coupleVisualMode = "svg",
  svgCharacterPreset = "javanese-royal",
  groomChildOrder,
  groomParents,
  brideChildOrder,
  brideParents,
  loveStoryText,
  storyHashtag,
}: CoupleProfileProps) {
  const isSvgMode = coupleVisualMode === "svg";

  const groomOrderText = groomChildOrder
    ? groomChildOrder.toLowerCase().includes("dari")
      ? groomChildOrder
      : `${groomChildOrder} dari Pasangan`
    : "Putra dari Pasangan";

  const brideOrderText = brideChildOrder
    ? brideChildOrder.toLowerCase().includes("dari")
      ? brideChildOrder
      : `${brideChildOrder} dari Pasangan`
    : "Putri dari Pasangan";

  return (
    <section id="mempelai" className="py-20 relative bg-transparent" aria-label="Profil Mempelai">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        <header className="text-center mb-12">
          <ScrollLinkedItem offsetY={36}>
            <span className="inline-block px-4 py-1 rounded-full border border-[#C59B6D]/45 bg-[#FBF7F2]/90 typo-eyebrow text-[#C59B6D] tracking-[0.22em] uppercase shadow-xs mb-3">
              Bride &amp; Groom
            </span>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <p className="typo-body text-xs sm:text-sm text-[#6E4A50] mb-2">
              Dengan Memohon Rahmat &amp; Ridho Allah SWT
            </p>
            <h2 className="typo-section-title">
              Mempelai
            </h2>
            <SongketRibbon />
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <div className="mt-5 max-w-[540px] mx-auto px-5 py-4 rounded-2xl bg-[#FBF7F2]/90 backdrop-blur-md border border-[#6B1222]/16 shadow-[0_12px_24px_-10px_rgba(67,10,20,0.12)]">
              <p className="typo-body italic text-center mx-auto text-[#3B1A20]">
                &ldquo;{loveStoryText || "Berawal dari pertemuan singkat, tanpa rencana panjang yang rumit—satset langsung lamaran, dan kini insya Allah bersatu dalam ikatan suci pernikahan."}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <span className="w-6 h-px bg-[#C59B6D]/50" />
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#6B1222]">
                  {storyHashtag || "#SINgkatceritaFAUZAN"}
                </span>
                <span className="w-6 h-px bg-[#C59B6D]/50" />
              </div>
            </div>
          </ScrollLinkedItem>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10 md:gap-6">
          <ScrollReveal direction="left" stage={1}>
            <article className="text-center p-4 sm:p-6 flex flex-col items-center">
              <ScrollLinkedItem offsetY={36} stage={2} className="mb-5">
                <span className="inline-block px-5 py-1.5 border border-[#C59B6D]/50 rounded-full bg-[#FBF7F2]/95 typo-eyebrow text-[#C59B6D] shadow-xs">
                  Mempelai Pria
                </span>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} stage={3} className="w-[min(72%,250px)] aspect-[3/4] p-2 rounded-[999px] border-2 border-[#6B1222]/50 outline outline-1 outline-offset-4 outline-[#C59B6D]/50 shadow-lg bg-[#FBF7F2]/95 relative z-10 mb-6">
                <div className="w-full h-full rounded-[999px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#FBF7F2] to-[#F1E7D6]">
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

              <ScrollLinkedItem offsetY={36} stage={4} className="text-center">
                <span className="font-script text-3xl sm:text-4xl text-[#6B1222] block mt-2 mb-0.5 leading-none">
                  Fauzan
                </span>
                <h3 className="typo-card-title mt-1 text-[#6B1222]">
                  {groomName}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#6E4A50]">
                  {groomOrderText}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#3B1A20] mt-0.5">
                  {groomParents || "Bapak H. Ma'ruf & Ibu Hj. Siti Aminah"}
                </p>
                {groomBirth && (
                  <p className="mt-1.5 typo-eyebrow text-[#C59B6D] text-[10px] sm:text-xs">
                    {groomBirth}
                  </p>
                )}
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} stage={5} className="mt-4 w-full max-w-[340px]">
                <div className="p-4 rounded-2xl bg-[#FBF7F2]/90 backdrop-blur-sm border border-[#6B1222]/16 shadow-xs relative overflow-hidden">
                  <p className="typo-body text-center mx-auto text-[#3B1A20] relative z-10">
                    {groomBio}
                  </p>
                </div>
              </ScrollLinkedItem>
            </article>
          </ScrollReveal>

          {/* Center Divider Gunungan & Ampersand */}
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-4 md:my-0">
            <ScrollReveal direction="left" stage={2}>
              <ScrollLinkedItem offsetY={24} stage={2}>
                <div className="-rotate-12 w-10 sm:w-12 h-14 sm:h-16 flex items-center justify-center opacity-85">
                  <GununganWayang variant="royal-solid" tone="gold-harmony" />
                </div>
              </ScrollLinkedItem>
            </ScrollReveal>

            <ScrollReveal direction="center-scale" stage={2}>
              <ScrollLinkedItem offsetY={36} stage={2}>
                <span className="font-script text-5xl sm:text-6xl text-[#C59B6D] drop-shadow-sm select-none leading-none animate-gold-sheen">
                  &amp;
                </span>
              </ScrollLinkedItem>
            </ScrollReveal>

            <ScrollReveal direction="right" stage={2}>
              <ScrollLinkedItem offsetY={24} stage={2}>
                <div className="rotate-12 w-10 sm:w-12 h-14 sm:h-16 flex items-center justify-center opacity-85">
                  <GununganWayang variant="royal-solid" tone="gold-harmony" flipHorizontal />
                </div>
              </ScrollLinkedItem>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" stage={1}>
            <article className="text-center p-4 sm:p-6 flex flex-col items-center">
              <ScrollLinkedItem offsetY={36} stage={2} className="mb-5">
                <span className="inline-block px-5 py-1.5 border border-[#C59B6D]/50 rounded-full bg-[#FBF7F2]/95 typo-eyebrow text-[#C59B6D] shadow-xs">
                  Mempelai Wanita
                </span>
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} stage={3} className="w-[min(72%,250px)] aspect-[3/4] p-2 rounded-[999px] border-2 border-[#6B1222]/50 outline outline-1 outline-offset-4 outline-[#C59B6D]/50 shadow-lg bg-[#FBF7F2]/95 relative z-10 mb-6">
                <div className="w-full h-full rounded-[999px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#FBF7F2] to-[#F1E7D6]">
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

              <ScrollLinkedItem offsetY={36} stage={4} className="text-center">
                <span className="font-script text-3xl sm:text-4xl text-[#6B1222] block mt-2 mb-0.5 leading-none">
                  Sinta
                </span>
                <h3 className="typo-card-title mt-1 text-[#6B1222]">
                  {brideName}
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#6E4A50]">
                  {brideOrderText}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#3B1A20] mt-0.5">
                  {brideParents || "Bapak H. Utami & Ibu Hj. Maria"}
                </p>
                {brideBirth && (
                  <p className="mt-1.5 typo-eyebrow text-[#C59B6D] text-[10px] sm:text-xs">
                    {brideBirth}
                  </p>
                )}
              </ScrollLinkedItem>

              <ScrollLinkedItem offsetY={36} stage={5} className="mt-4 w-full max-w-[340px]">
                <div className="p-4 rounded-2xl bg-[#FBF7F2]/90 backdrop-blur-sm border border-[#6B1222]/16 shadow-xs relative overflow-hidden">
                  <p className="typo-body text-center mx-auto text-[#3B1A20] relative z-10">
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
