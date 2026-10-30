"use client";

import { GununganWayang, SongketRibbon } from "./Ornaments";
import { ScrollReveal, ParallaxPhotoFrame } from "./ScrollReveal";

interface CoupleProfileProps {
  brideName: string;
  brideBirth: string;
  brideBio: string;
  bridePhotoUrl: string;
  groomName: string;
  groomBirth: string;
  groomBio: string;
  groomPhotoUrl: string;
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
}: CoupleProfileProps) {
  return (
    <section id="mempelai" className="py-20 relative" aria-label="Profil Mempelai">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        {/* Header Seksi: BRIDE & GROOM + Salam Pembuka */}
        <header className="text-center mb-10">
          <ScrollReveal delay={0} variant="bottom-up">
            <span className="inline-block px-4 py-1 rounded-full border border-gold-500/40 bg-surface-white/90 typo-eyebrow text-[#a9823a] tracking-[0.22em] uppercase shadow-xs mb-3">
              Bride &amp; Groom
            </span>
          </ScrollReveal>

          <ScrollReveal delay={110} variant="bottom-up">
            <p className="typo-body text-xs sm:text-sm text-[#7a5c61] mb-2">
              Dengan Memohon Rahmat &amp; Ridho Allah SWT
            </p>
            <h2 className="typo-section-title">
              Mempelai
            </h2>
            <SongketRibbon />
          </ScrollReveal>

          {/* Narasi Behind Story (Satset Story) */}
          <ScrollReveal delay={220} variant="bottom-up">
            <div className="mt-5 max-w-[540px] mx-auto px-5 py-4 rounded-2xl bg-surface-white/85 border border-gold-500/30 shadow-[0_12px_24px_-10px_rgba(93,58,65,0.12)]">
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
          </ScrollReveal>
        </header>

        {/* Profil Mempelai: Groom (Fauzan) First -> Center & -> Bride (Sinta) Second */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-6">
          {/* 1. Mempelai Pria: Fauzan Ma'ruf */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <ScrollReveal delay={110} variant="bottom-up">
              <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white typo-eyebrow text-[#a9823a] shadow-xs">
                Mempelai Pria
              </span>
            </ScrollReveal>

            {/* Bingkai Oval dengan Border & Outline Emas */}
            <div className="w-[min(72%,250px)] aspect-[3/4] mt-5 p-2 rounded-[999px] border-2 border-[#5d3a41]/60 outline outline-1 outline-offset-4 outline-[#c9a24b]/50 shadow-lg bg-[#fffdfa]/90">
              <ParallaxPhotoFrame delay={180} maxShiftPercent={8} className="w-full h-full rounded-[999px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groomPhotoUrl}
                  alt={`${groomName} - Mempelai Pria`}
                  className="w-full h-full object-cover rounded-[999px] outline outline-1 -outline-offset-1 outline-black/10"
                  loading="lazy"
                />
              </ParallaxPhotoFrame>
            </div>

            {/* Script Name Calligraphy + Full Name */}
            <ScrollReveal delay={220} variant="bottom-up">
              <span className="font-script text-4xl sm:text-5xl text-[#5d3a41] block mt-5 mb-0.5 leading-none">
                Fauzan
              </span>
              <h3 className="typo-card-title">
                {groomName}
              </h3>
              <p className="mt-2 typo-eyebrow text-[#a9823a]">
                {groomBirth}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={330} variant="bottom-up">
              <p className="mt-3.5 typo-body text-center max-w-[320px] mx-auto text-[#4b3a3e]">
                {groomBio}
              </p>
            </ScrollReveal>
          </article>

          {/* 2. Centerpiece: Simbol "&" Emas & Gunungan Wayang */}
          <div className="flex flex-col items-center justify-center my-3 md:my-0">
            <ScrollReveal delay={180} variant="bottom-up">
              <div className="flex flex-col items-center">
                <span className="font-script text-5xl sm:text-6xl text-[#c9a24b] drop-shadow-sm select-none leading-none">
                  &amp;
                </span>
                <GununganWayang className="w-12 sm:w-14 text-gold-500 opacity-75 mt-2" />
              </div>
            </ScrollReveal>
          </div>

          {/* 3. Mempelai Wanita: Sinta Maria Utami */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <ScrollReveal delay={110} variant="bottom-up">
              <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white typo-eyebrow text-[#a9823a] shadow-xs">
                Mempelai Wanita
              </span>
            </ScrollReveal>

            {/* Bingkai Oval dengan Border & Outline Emas */}
            <div className="w-[min(72%,250px)] aspect-[3/4] mt-5 p-2 rounded-[999px] border-2 border-[#5d3a41]/60 outline outline-1 outline-offset-4 outline-[#c9a24b]/50 shadow-lg bg-[#fffdfa]/90">
              <ParallaxPhotoFrame delay={180} maxShiftPercent={8} className="w-full h-full rounded-[999px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bridePhotoUrl}
                  alt={`${brideName} - Mempelai Wanita`}
                  className="w-full h-full object-cover rounded-[999px] outline outline-1 -outline-offset-1 outline-black/10"
                  loading="lazy"
                />
              </ParallaxPhotoFrame>
            </div>

            {/* Script Name Calligraphy + Full Name */}
            <ScrollReveal delay={220} variant="bottom-up">
              <span className="font-script text-4xl sm:text-5xl text-[#5d3a41] block mt-5 mb-0.5 leading-none">
                Sinta
              </span>
              <h3 className="typo-card-title">
                {brideName}
              </h3>
              <p className="mt-2 typo-eyebrow text-[#a9823a]">
                {brideBirth}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={330} variant="bottom-up">
              <p className="mt-3.5 typo-body text-center max-w-[320px] mx-auto text-[#4b3a3e]">
                {brideBio}
              </p>
            </ScrollReveal>
          </article>
        </div>
      </div>
    </section>
  );
}
