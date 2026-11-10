"use client";

import { SongketRibbon } from "./Ornaments";
import { ScrollLinkedItem } from "./ScrollLinkedItem";
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
      index: "01",
      phase: "Cerita Awal",
      badge: "LANGKAH PERTAMA",
      title: "Pertemuan Singkat",
      subtitle: "TAKDIR YANG TAK TERDUGA",
      desc: "Takdir mempertemukan tanpa skenario panjang yang rumit. Di antara langkah keseharian, dua hati disapa rasa tenang dan keyakinan yang saling melengkapi.",
      icon: Compass,
    },
    {
      index: "02",
      phase: "Komitmen Suci",
      badge: "NIAT & RESTU",
      title: "Satset Langsung Lamaran",
      subtitle: "KEYAKINAN HATI & RESTU KELUARGA",
      desc: "Ketika hati sudah menemukan tempat pulang, tak perlu menunggu waktu yang lama. Dengan niat tulus dan restu kedua keluarga, langkah lamaran terucap dengan mantap.",
      icon: Heart,
    },
    {
      index: "03",
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
      className="py-20 relative w-full overflow-hidden box-border bg-transparent"
      aria-label="Kisah Cinta Fauzan dan Sinta"
    >
      <div className="w-full max-w-[920px] mx-auto px-4 sm:px-6 box-border">
        <header className="text-center mb-14">
          <ScrollLinkedItem offsetY={36}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-white/90 border border-gold-500/40 typo-eyebrow text-[#a9823a] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Behind The Story</span>
            </span>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title mt-3">
              Perjalanan Dua Jiwa
            </h2>
            <SongketRibbon />
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <p className="mt-3.5 typo-body text-center max-w-[580px] mx-auto leading-relaxed text-[#4b3a3e]">
              &ldquo;{loveStoryText}&rdquo;
            </p>
            <p className="mt-2.5 font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#a9823a]">
              {storyHashtag}
            </p>
          </ScrollLinkedItem>
        </header>

        <div className="relative mt-10">
          <div
            className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-8 pointer-events-none"
            aria-hidden="true"
          >
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 32 600">
              <line x1="16" y1="0" x2="16" y2="600" stroke="#c9a24b" strokeWidth="1" strokeDasharray="4 4" />
              {Array.from({ length: 25 }).map((_, i) => (
                <line
                  key={i}
                  x1={i % 5 === 0 ? "8" : "12"}
                  y1={i * 24}
                  x2={i % 5 === 0 ? "24" : "20"}
                  y2={i * 24}
                  stroke="#c9a24b"
                  strokeWidth={i % 5 === 0 ? "1" : "0.5"}
                  opacity={i % 5 === 0 ? "0.8" : "0.4"}
                />
              ))}
            </svg>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {chapters.map((ch, idx) => {
              const IconComp = ch.icon;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={ch.phase}
                  className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0"
                >
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${
                      isEven ? "md:order-2 md:pl-6" : "md:order-1 md:pr-6 md:text-right"
                    }`}
                  >
                    <ScrollLinkedItem offsetY={36}>
                      <article className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-surface-white/95 backdrop-blur-md border border-gold-500/35 shadow-[0_16px_36px_-12px_rgba(93,58,65,0.18)] hover:shadow-[0_22px_44px_-10px_rgba(93,58,65,0.24)] transition-[box-shadow,transform] duration-200 relative overflow-hidden group">
                        <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-gold-500/50 pointer-events-none" />
                        <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-gold-500/50 pointer-events-none" />

                        <div className={`flex items-center gap-2 mb-2 ${isEven ? "" : "md:justify-end"}`}>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#f7e9e5] text-rose-900 border border-gold-500/30 text-[10px] font-bold tracking-widest uppercase tabular-nums">
                            {ch.badge}
                          </span>
                          <span className="text-[11px] font-mono tabular-nums text-gold-600 font-bold">
                            STEP {ch.index}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#5d3a41] leading-snug">
                          {ch.title}
                        </h3>

                        <p className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold mt-1">
                          {ch.subtitle}
                        </p>

                        <p className="typo-body text-xs sm:text-sm text-[#4b3a3e] mt-3 leading-relaxed">
                          {ch.desc}
                        </p>

                        {ch.hasHashtag && (
                          <div className={`mt-4 pt-3 border-t border-gold-500/20 flex items-center gap-2 ${isEven ? "" : "md:justify-end"}`}>
                            <span className="font-sans text-xs font-semibold text-rose-900 normal-case">
                              #SINgkatceritaFAUZAN
                            </span>
                          </div>
                        )}
                      </article>
                    </ScrollLinkedItem>
                  </div>

                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10 w-12 h-12 rounded-full bg-surface-white border-2 border-gold-500 shadow-md items-center justify-center text-rose-900 group">
                    <IconComp className="w-5 h-5 text-gold-600" />
                    <span className="absolute -bottom-5 font-mono text-[9px] font-bold text-gold-700 tabular-nums">
                      {ch.index}
                    </span>
                  </div>

                  <div
                    className={`hidden md:block w-full md:w-[calc(50%-2rem)] ${
                      isEven ? "md:order-1" : "md:order-2"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
