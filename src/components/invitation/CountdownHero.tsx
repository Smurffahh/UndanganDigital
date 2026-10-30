"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider, MonogramFS, FloralCornerAccent, ScrollDownIndicator } from "./Ornaments";
import { formatCoverDate } from "@/lib/dateFormat";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

interface CountdownHeroProps {
  weddingDateIso: string;
  heroPhotoUrl: string;
  isHeroReady: boolean;
  eventDateLabel?: string;
}

export function CountdownHero({
  weddingDateIso,
  heroPhotoUrl,
  isHeroReady,
  eventDateLabel,
}: CountdownHeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isDone: false,
  });

  useEffect(() => {
    const target = new Date(weddingDateIso).getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds, isDone: false });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [weddingDateIso]);

  const displayDate = formatCoverDate(weddingDateIso, eventDateLabel);

  return (
    <section
      id="beranda"
      className="relative bg-transparent pb-20"
      aria-label="Beranda dan Hitung Mundur"
    >
      <div className="min-h-dvh w-full flex flex-col items-center justify-center py-6 sm:py-10 relative">
        <div className="w-[min(92%,420px)] mx-auto relative flex flex-col items-center justify-center">
          <div
            className={`absolute -top-3 -left-3 sm:-left-4 pointer-events-none transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${
              isHeroReady ? "opacity-90 translate-x-0 translate-y-0" : "opacity-0 -translate-x-6 -translate-y-6"
            }`}
            style={{ transitionDelay: isHeroReady ? "150ms" : "0ms" }}
          >
            <div className="animate-sway">
              <FloralCornerAccent className="w-16 sm:w-20 opacity-80 -rotate-45" />
            </div>
          </div>
          <div
            className={`absolute -top-3 -right-3 sm:-right-4 pointer-events-none transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${
              isHeroReady ? "opacity-90 translate-x-0 translate-y-0" : "opacity-0 translate-x-6 -translate-y-6"
            }`}
            style={{ transitionDelay: isHeroReady ? "150ms" : "0ms" }}
          >
            <div className="animate-sway" style={{ animationDelay: "-2.5s" }}>
              <FloralCornerAccent className="w-16 sm:w-20 opacity-80 rotate-45 scale-x-[-1]" />
            </div>
          </div>

          <div
            className={`min-h-[78dvh] sm:min-h-[82dvh] max-h-[740px] w-full flex flex-col items-center justify-between p-6 sm:p-8 rounded-[999px] border-2 border-[#5d3a41]/70 outline outline-1 outline-offset-4 outline-[#c9a24b]/60 bg-[#fffdfa]/92 backdrop-blur-sm shadow-[0_24px_50px_-16px_rgba(93,58,65,0.22)] relative overflow-hidden text-center transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isHeroReady ? "scale-100 opacity-100" : "scale-[0.95] opacity-0 pointer-events-none"
            }`}
            style={{ transitionDelay: isHeroReady ? "100ms" : "0ms" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.12),transparent_70%)] pointer-events-none" />

            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[85%] h-px bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-px bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent pointer-events-none" />

            <div className="pt-3 sm:pt-5 flex flex-col items-center">
              <div
                className={`transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHeroReady ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-90 opacity-0"
                }`}
                style={{ transitionDelay: isHeroReady ? "280ms" : "0ms" }}
              >
                <MonogramFS className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>

              <p
                className={`typo-eyebrow text-[#a9823a] tracking-[0.22em] mt-3 transition-[transform,opacity,filter] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHeroReady ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-[3px]"
                }`}
                style={{ transitionDelay: isHeroReady ? "450ms" : "0ms" }}
              >
                THE WEDDING OF
              </p>
            </div>

            <div className="my-auto flex flex-col items-center px-2">
              <h1 className="typo-display drop-shadow-xs text-center flex items-center justify-center flex-wrap gap-x-2">
                <span
                  className={`inline-block transition-[transform,opacity,filter] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[3px]"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "620ms" : "0ms" }}
                >
                  Fauzan
                </span>
                <span
                  className={`font-script text-[#c9a24b] text-[0.85em] px-1 font-normal animate-gold-sheen inline-block transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 -rotate-6"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "740ms" : "0ms" }}
                >
                  &amp;
                </span>
                <span
                  className={`inline-block transition-[transform,opacity,filter] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[3px]"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "860ms" : "0ms" }}
                >
                  Sinta
                </span>
              </h1>

              <div className="mt-3 flex items-center justify-center gap-2 w-full">
                <span
                  className={`w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#e9d3a3] origin-right transition-transform duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "1020ms" : "0ms" }}
                />
                <p
                  className={`font-sans text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#4b3a3e] transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "1020ms" : "0ms" }}
                >
                  {displayDate}
                </p>
                <span
                  className={`w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#e9d3a3] origin-left transition-transform duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isHeroReady ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transitionDelay: isHeroReady ? "1020ms" : "0ms" }}
                />
              </div>

              <span
                className={`mt-3 inline-block px-3.5 py-1 rounded-full bg-[#f7e9e5] text-[#9c5f66] border border-[#e9d3a3] font-sans text-xs sm:text-sm font-semibold normal-case tracking-wide shadow-xs transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHeroReady ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
                }`}
                style={{ transitionDelay: isHeroReady ? "1180ms" : "0ms" }}
              >
                #SINgkatceritaFAUZAN
              </span>
            </div>

            <div
              className={`pb-3 sm:pb-5 flex flex-col items-center transition-[transform,opacity] duration-750 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHeroReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isHeroReady ? "1340ms" : "0ms" }}
            >
              <FloralCornerAccent className="w-32 sm:w-36 mx-auto mb-2 opacity-80" />
              <ScrollDownIndicator className="w-7 h-12 mx-auto" />
              <p className="typo-meta text-[11px] uppercase tracking-[0.2em] mt-2 text-[#8d757c]">
                Scroll Ke Bawah
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[min(100%-2.75rem,560px)] mx-auto flex flex-col items-center text-center">
        <ScrollLinkedItem offsetY={36} className="w-full flex justify-center mb-6">
          <div className="arch w-[min(76%,310px)] aspect-[4/5] mx-auto overflow-hidden shadow-[0_20px_48px_-12px_rgba(93,58,65,0.28)] bg-[#fffdfa]/95 relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhotoUrl}
              alt="Fauzan dan Sinta berbaring di padang rumput berbingkai bunga"
              className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
              loading="eager"
            />
          </div>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="mt-2 text-center">
          <p className="typo-eyebrow text-[#a9823a]">
            WITH LOVE
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="mt-3 text-center">
          <p className="typo-arabic leading-loose text-rose-700" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="mt-5 w-full">
          <figure className="card-ornament bg-surface-white/95 backdrop-blur-md border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 sm:p-8 text-center">
            <p className="typo-arabic leading-loose text-rose-900" dir="rtl">
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <blockquote className="typo-body mt-4 mx-auto text-center font-normal leading-relaxed text-[#4b3a3e]">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
            </blockquote>
            <figcaption className="typo-meta mt-3 font-medium text-[#a9823a]">
              &mdash; QS. Ar-Rum : 21 &mdash;
            </figcaption>
          </figure>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="my-8 w-full flex justify-center">
          <Divider />
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="text-center">
          <p className="typo-eyebrow text-[#a9823a] mb-2">
            SAVE THE DATE
          </p>
          <h2 className="typo-section-title">
            Hitung Mundur
          </h2>
          <p className="typo-body text-center mx-auto mt-2 text-[#4b3a3e]">
            Menuju Hari Bahagia &amp; Ikrar Suci Pernikahan
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="mt-8 w-full flex justify-center">
          {!timeLeft.isDone ? (
            <div
              className="flex justify-center items-center gap-2.5 sm:gap-3"
              aria-label="Hitung mundur pernikahan"
            >
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[72px] sm:min-w-[84px] py-3.5 px-2.5 bg-surface-white/95 backdrop-blur-md border border-gold-500/40 rounded-2xl shadow-[0_16px_30px_-16px_rgba(93,58,65,0.25)] flex flex-col items-center"
                >
                  <NumberFlow
                    value={item.value}
                    format={{ minimumIntegerDigits: 2 }}
                    className="font-serif text-3xl sm:text-4xl font-bold tabular-nums text-[#5d3a41] leading-none"
                    style={{ color: "#5d3a41" }}
                  />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#9c5f66] mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-cream/90 backdrop-blur-md border border-gold-500/30 max-w-md mx-auto text-center">
              <p className="typo-body italic text-center mx-auto text-rose-900">
                Alhamdulillah, rangkaian acara pernikahan Fauzan &amp; Sinta telah berlangsung 🤍
              </p>
            </div>
          )}
        </ScrollLinkedItem>
      </div>
    </section>
  );
}
