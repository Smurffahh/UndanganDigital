"use client";

import { SongketRibbon } from "./Ornaments";
import { ScrollReveal } from "./ScrollReveal";
import { Sparkles, Heart, Compass } from "lucide-react";

interface LoveStoryTimelineProps {
  loveStoryText?: string;
  storyHashtag?: string;
}

export function LoveStoryTimeline({
  loveStoryText = "Berawal dari pertemuan singkat, tanpa rencana panjang yang rumit—satset langsung lamaran, dan kini insya Allah bersatu dalam ikatan suci pernikahan.",
  storyHashtag = "#SINgkatceritaFAUZAN",
}: LoveStoryTimelineProps) {
  const chapters = [
    {
      phase: "Cerita Awal",
      badge: "LANGKAH PERTAMA",
      title: "Pertemuan Singkat",
      subtitle: "TAKDIR YANG TAK TERDUGA",
      desc: "Takdir mempertemukan tanpa skenario panjang yang rumit. Di antara langkah keseharian, dua hati disapa rasa tenang dan keyakinan yang saling melengkapi.",
      icon: Compass,
    },
    {
      phase: "Komitmen Suci",
      badge: "NIAT & RESTU",
      title: "Satset Langsung Lamaran",
      subtitle: "KEYAKINAN HATI & RESTU KELUARGA",
      desc: "Ketika hati sudah menemukan tempat pulang, tak perlu menunggu waktu yang lama. Dengan niat tulus dan restu kedua keluarga, langkah lamaran terucap dengan mantap.",
      icon: Heart,
    },
    {
      phase: "Pelabuhan Terakhir",
      badge: "03 JANUARI 2027",
      title: "Menuju Akad Suci",
      subtitle: "AWAL KEHIDUPAN BARU",
      desc: "Kini, perjalanan singkat yang penuh berkah ini berlabuh pada janji suci pernikahan. Bersama merajut ibadah terpanjang dalam ridha Allah SWT.",
      hasHashtag: true,
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="cerita"
      className="py-20 relative w-full overflow-hidden box-border"
      aria-label="Kisah Cinta Fauzan dan Sinta"
    >
      <div className="w-full max-w-[780px] mx-auto px-4 sm:px-6 box-border">
        <header className="text-center mb-12">
          <ScrollReveal delay={0} variant="fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/35 typo-eyebrow text-[#a9823a] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#a9823a]" />
              <span>Behind The Story</span>
            </span>
          </ScrollReveal>

          <ScrollReveal delay={90} variant="fade-up">
            <h2 className="typo-section-title mt-3">
              Perjalanan Dua Jiwa
            </h2>
            <SongketRibbon />
          </ScrollReveal>

          <ScrollReveal delay={160} variant="fade-up">
            <p className="mt-3.5 typo-body italic text-center max-w-[560px] mx-auto leading-relaxed text-[#4b3a3e]">
              &ldquo;{loveStoryText}&rdquo;
            </p>
            <p className="mt-2 font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#a9823a]">
              {storyHashtag}
            </p>
          </ScrollReveal>
        </header>

        <div className="relative mt-8 space-y-6 sm:space-y-8 w-full max-w-full box-border">
          {chapters.map((ch, idx) => {
            const IconComp = ch.icon;

            return (
              <div
                key={ch.phase}
                className="flex items-start gap-3 sm:gap-5 w-full max-w-full box-border"
              >
                <div className="shrink-0 w-10 sm:w-12 flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-white border-2 border-gold-500 shadow-md grid place-items-center text-rose-900 shrink-0 z-10 group-hover:scale-105 transition-transform duration-300">
                    <IconComp className="w-5 h-5 text-gold-600" />
                  </div>
                  {idx < chapters.length - 1 && (
                    <div
                      className="w-0.5 flex-1 min-h-[70px] bg-gradient-to-b from-gold-400 via-rose-500/50 to-gold-400 shadow-[0_0_8px_rgba(201,162,75,0.3)] my-1"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 max-w-full pb-4">
                  <ScrollReveal delay={idx * 130} variant="fade-up">
                    <article className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-surface-white via-[#fffaf7] to-[#fbf1ed] border border-gold-500/35 shadow-[0_12px_28px_-12px_rgba(93,58,65,0.16)] hover:shadow-[0_18px_38px_-10px_rgba(93,58,65,0.22)] transition-[box-shadow,transform] duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,75,0.15),transparent_70%)] pointer-events-none" />

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-gold-500/15">
                        <span className="typo-eyebrow text-[#a9823a]">
                          {ch.phase}
                        </span>
                        <span className="inline-block px-2.5 py-1 rounded-full bg-rose-100 typo-eyebrow text-[#9c5f66] shrink-0">
                          {ch.badge}
                        </span>
                      </div>

                      <h3 className="typo-card-title">
                        {ch.title}
                      </h3>
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[#a9823a] mt-1 mb-2">
                        {ch.subtitle}
                      </p>

                      <p className="typo-body leading-relaxed break-words">
                        {ch.desc}{" "}
                        {ch.hasHashtag && (
                          <span className="font-semibold text-rose-900 normal-case font-sans tracking-wide whitespace-nowrap">
                            #SINgkatceritaFAUZAN
                          </span>
                        )}
                      </p>
                    </article>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
