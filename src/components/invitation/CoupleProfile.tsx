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
        {/* Header Seksi (Staggered Chunk 1 & 2) */}
        <header className="text-center mb-9">
          <ScrollReveal delay={0} variant="fade-up">
            <p className="typo-eyebrow text-[#a9823a] mb-2">
              Dengan Memohon Rahmat &amp; Ridho Allah SWT
            </p>
          </ScrollReveal>

          <ScrollReveal delay={90} variant="fade-up">
            <h2 className="typo-section-title">
              Mempelai
            </h2>
            <SongketRibbon />
          </ScrollReveal>

          {/* Narasi Behind Story (Satset Story) */}
          <ScrollReveal delay={150} variant="fade-up">
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

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-9 md:gap-7">
          {/* 1. Mempelai Wanita */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <ScrollReveal delay={120} variant="fade-up">
              <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white typo-eyebrow text-[#a9823a] shadow-xs">
                Mempelai Wanita
              </span>
            </ScrollReveal>

            {/* Bingkai Mihrab dengan Frame Reveal & Subtle Micro-Parallax */}
            <div className="arch w-[min(72%,260px)] aspect-[3/4] mt-5 shadow-md">
              <ParallaxPhotoFrame delay={180} maxShiftPercent={8} className="w-full h-full rounded-[990px_990px_14px_14px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bridePhotoUrl}
                  alt={`${brideName} - Mempelai Wanita`}
                  className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                  loading="lazy"
                />
              </ParallaxPhotoFrame>
            </div>

            <ScrollReveal delay={270} variant="fade-up">
              <h3 className="mt-5 typo-card-title">
                {brideName}
              </h3>
              <p className="mt-2 typo-eyebrow text-[#a9823a]">
                {brideBirth}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={360} variant="fade-up">
              <p className="mt-3.5 typo-body text-center max-w-[320px] mx-auto text-[#4b3a3e]">
                {brideBio}
              </p>
            </ScrollReveal>
          </article>

          {/* 2. Gunungan Wayang Jawa (Gentle Float & Fade) */}
          <div className="hidden md:flex justify-center">
            <ScrollReveal delay={180} variant="float">
              <GununganWayang className="w-16 text-gold-500 opacity-80" />
            </ScrollReveal>
          </div>
          <div className="flex md:hidden justify-center my-2">
            <ScrollReveal delay={180} variant="float">
              <GununganWayang className="w-12 text-gold-500 opacity-80" />
            </ScrollReveal>
          </div>

          {/* 3. Mempelai Pria */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <ScrollReveal delay={120} variant="fade-up">
              <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white typo-eyebrow text-[#a9823a] shadow-xs">
                Mempelai Pria
              </span>
            </ScrollReveal>

            {/* Bingkai Mihrab dengan Frame Reveal & Subtle Micro-Parallax */}
            <div className="arch w-[min(72%,260px)] aspect-[3/4] mt-5 shadow-md">
              <ParallaxPhotoFrame delay={180} maxShiftPercent={8} className="w-full h-full rounded-[990px_990px_14px_14px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groomPhotoUrl}
                  alt={`${groomName} - Mempelai Pria`}
                  className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                  loading="lazy"
                />
              </ParallaxPhotoFrame>
            </div>

            <ScrollReveal delay={270} variant="fade-up">
              <h3 className="mt-5 typo-card-title">
                {groomName}
              </h3>
              <p className="mt-2 typo-eyebrow text-[#a9823a]">
                {groomBirth}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={360} variant="fade-up">
              <p className="mt-3.5 typo-body text-center max-w-[320px] mx-auto text-[#4b3a3e]">
                {groomBio}
              </p>
            </ScrollReveal>
          </article>
        </div>
      </div>
    </section>
  );
}
