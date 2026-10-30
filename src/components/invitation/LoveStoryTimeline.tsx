"use client";

import { RadiantStar, SongketRibbon } from "./Ornaments";
import { ScrollReveal } from "./ScrollReveal";
import { Sparkles, Heart, Compass, CheckCircle } from "lucide-react";

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
      step: "01",
      title: "Pertemuan Singkat",
      subtitle: "Takdir yang Tak Terduga",
      desc: "Takdir mempertemukan tanpa skenario panjang yang rumit. Di antara langkah keseharian, dua hati disapa rasa tenang dan keyakinan yang saling melengkapi.",
      icon: Compass,
      tag: "Awal Cerita",
    },
    {
      step: "02",
      title: "Satset Langsung Lamaran",
      subtitle: "Niat Tulus & Restu Keluarga",
      desc: "Keyakinan hati yang membulatkan niat tanpa ragu. Dengan restu penuh kedua orang tua, ikhtiar suci dilangkah tegak dan mantap menuju pelaminan.",
      icon: Heart,
      tag: "Komitmen Suci",
    },
    {
      step: "03",
      title: "Menuju Akad Suci",
      subtitle: "Minggu, 3 Januari 2027",
      desc: "Kini, bersatu dalam ikatan pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Bersyukur atas perjalanan indah ini dan memohon doa restu untuk selamanya.",
      icon: Sparkles,
      tag: "Ikatan Abadi",
    },
  ];

  return (
    <section id="cerita" className="py-20 relative" aria-label="Kisah Cinta Fauzan dan Sinta">
      <div className="w-[min(100%-2.75rem,860px)] mx-auto">
        {/* Section Header */}
        <header className="text-center mb-12">
          <ScrollReveal delay={0} variant="fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/35 text-[11px] font-bold tracking-[0.22em] uppercase text-gold-600 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Behind The Story</span>
            </span>
          </ScrollReveal>

          <ScrollReveal delay={90} variant="fade-up">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight mt-3">
              Perjalanan Dua Jiwa
            </h2>
            <SongketRibbon />
          </ScrollReveal>

          <ScrollReveal delay={160} variant="fade-up">
            <p className="mt-3.5 font-serif italic text-base sm:text-lg text-rose-950/85 max-w-[560px] mx-auto leading-relaxed">
              &ldquo;{loveStoryText}&rdquo;
            </p>
            <p className="mt-2 text-xs font-bold tracking-[0.25em] uppercase text-gold-600">
              {storyHashtag}
            </p>
          </ScrollReveal>
        </header>

        {/* Vertical Timeline with Scroll-Linked Glow */}
        <div className="relative mt-10">
          {/* Central Progress Line */}
          <div
            className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold-400 via-rose-500/50 to-gold-400 shadow-[0_0_12px_rgba(201,162,75,0.4)]"
            aria-hidden="true"
          />

          <div className="space-y-10 sm:space-y-14">
            {chapters.map((ch, idx) => {
              const isEven = idx % 2 === 0;
              const IconComp = ch.icon;

              return (
                <div
                  key={ch.step}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? "sm:flex-row-reverse" : ""
                  } gap-6 sm:gap-10`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-surface-white border-2 border-gold-500 shadow-md grid place-items-center text-rose-900 group">
                    <IconComp className="w-5 h-5 text-gold-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Content Card (Left or Right on desktop, indented on mobile) */}
                  <div className="ml-14 sm:ml-0 w-full sm:w-[calc(50%-2rem)]">
                    <ScrollReveal
                      delay={idx * 140}
                      variant={isEven ? "fade-up" : "fade-up"}
                      className="h-full"
                    >
                      <article className="p-6 rounded-3xl bg-gradient-to-br from-surface-white via-[#fffaf7] to-[#fbf1ed] border border-gold-500/35 shadow-[0_16px_36px_-14px_rgba(93,58,65,0.18)] hover:shadow-[0_20px_42px_-12px_rgba(93,58,65,0.24)] transition-[box-shadow,transform] duration-300 relative overflow-hidden group">
                        {/* Shimmer Ambient Accent */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,75,0.15),transparent_70%)] pointer-events-none" />

                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <span className="font-serif font-bold text-2xl text-gold-600/70 tracking-wider">
                            Babak {ch.step}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-[10px] font-bold tracking-[0.18em] uppercase text-rose-900">
                            {ch.tag}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-xl text-rose-900 leading-snug">
                          {ch.title}
                        </h3>
                        <p className="text-xs font-semibold tracking-wider uppercase text-gold-600 mt-0.5">
                          {ch.subtitle}
                        </p>

                        <p className="mt-3 text-xs sm:text-sm text-ink/80 leading-relaxed font-light">
                          {ch.desc}
                        </p>
                      </article>
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
