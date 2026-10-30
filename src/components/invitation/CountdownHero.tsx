"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider, MonogramFS, FloralCornerAccent, ScrollDownIndicator } from "./Ornaments";
import { formatCoverDate } from "@/lib/dateFormat";
import { ParallaxPhotoFrame, ScrollReveal } from "./ScrollReveal";

interface CountdownHeroProps {
  weddingDateIso: string;
  heroPhotoUrl: string;
  isRevealed: boolean;
  eventDateLabel?: string;
}

export function CountdownHero({
  weddingDateIso,
  heroPhotoUrl,
  isRevealed,
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

  const getRevealClass = () => {
    if (!isRevealed) {
      return "opacity-0 translate-y-6 scale-[0.98] blur-xs";
    }
    return `opacity-100 translate-y-0 scale-100 blur-none transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`;
  };

  return (
    <section
      id="beranda"
      className="pt-6 sm:pt-10 pb-20 relative"
      aria-label="Beranda dan Hitung Mundur"
    >
      <div className="w-[min(92%,420px)] mx-auto mb-20">
        <div
          className={`min-h-[78dvh] sm:min-h-[82dvh] max-h-[740px] flex flex-col items-center justify-between p-6 sm:p-8 rounded-[999px] border-2 border-[#5d3a41]/70 outline outline-1 outline-offset-4 outline-[#c9a24b]/60 bg-[#fffdfa]/92 backdrop-blur-sm shadow-[0_24px_50px_-16px_rgba(93,58,65,0.22)] relative overflow-hidden text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isRevealed ? "scale-100 opacity-100" : "scale-[0.94] opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.12),transparent_70%)] pointer-events-none" />

          <div
            className={`pt-3 sm:pt-5 flex flex-col items-center ${getRevealClass()}`}
            style={{ transitionDelay: isRevealed ? "150ms" : "0ms" }}
          >
            <MonogramFS className="w-16 h-16 sm:w-20 sm:h-20" />
            <p className="typo-eyebrow text-[#a9823a] tracking-[0.22em] mt-3">
              THE WEDDING OF
            </p>
          </div>

          <div
            className={`my-auto flex flex-col items-center px-2 ${getRevealClass()}`}
            style={{ transitionDelay: isRevealed ? "300ms" : "0ms" }}
          >
            <h1 className="typo-display drop-shadow-xs text-center">
              Fauzan{" "}
              <span className="font-script text-[#c9a24b] text-[0.85em] px-1 font-normal">
                &amp;
              </span>{" "}
              Sinta
            </h1>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#e9d3a3]" />
              <p className="font-sans text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#4b3a3e]">
                {displayDate}
              </p>
              <span className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#e9d3a3]" />
            </div>

            <span className="mt-3 inline-block px-3.5 py-1 rounded-full bg-[#f7e9e5] text-[#9c5f66] border border-[#e9d3a3] font-sans text-xs sm:text-sm font-semibold normal-case tracking-wide shadow-xs">
              #SINgkatceritaFAUZAN
            </span>
          </div>

          <div
            className={`pb-3 sm:pb-5 flex flex-col items-center ${getRevealClass()}`}
            style={{ transitionDelay: isRevealed ? "450ms" : "0ms" }}
          >
            <FloralCornerAccent className="w-32 sm:w-36 mx-auto mb-2 opacity-80" />
            <ScrollDownIndicator className="w-7 h-12 mx-auto" />
            <p className="typo-meta text-[11px] uppercase tracking-[0.2em] mt-2 text-[#8d757c]">
              Scroll Ke Bawah
            </p>
          </div>
        </div>
      </div>

      <div className="w-[min(100%-2.75rem,560px)] mx-auto text-center">
        <ScrollReveal delay={0} variant="bottom-up">
          <div className="arch w-[min(76%,320px)] aspect-[4/5] mx-auto overflow-hidden shadow-lg">
            <ParallaxPhotoFrame maxShiftPercent={8} className="w-full h-full rounded-[990px_990px_14px_14px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPhotoUrl}
                alt="Fauzan dan Sinta berbaring di padang rumput berbingkai bunga"
                className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                loading="eager"
              />
            </ParallaxPhotoFrame>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={110} variant="bottom-up">
          <p className="typo-eyebrow text-[#a9823a] mt-8 mb-2">
            WITH LOVE
          </p>
        </ScrollReveal>

        <ScrollReveal delay={220} variant="bottom-up">
          <p className="typo-arabic leading-loose text-rose-700" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰnِ الرَّحِيْمِ
          </p>
        </ScrollReveal>

        <ScrollReveal delay={330} variant="bottom-up">
          <figure className="card-ornament mt-5 bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 sm:p-8 text-center">
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
        </ScrollReveal>

        <ScrollReveal delay={440} variant="bottom-up">
          <Divider />
        </ScrollReveal>

        <ScrollReveal delay={110} variant="bottom-up">
          <p className="typo-eyebrow text-[#a9823a] mt-6 mb-2">
            SAVE THE DATE
          </p>
          <h2 className="typo-section-title">
            Hitung Mundur
          </h2>
          <p className="typo-body text-center mx-auto mt-2 text-[#4b3a3e]">
            Menuju Hari Bahagia &amp; Ikrar Suci Pernikahan
          </p>
        </ScrollReveal>

        <ScrollReveal delay={220} variant="bottom-up" className="mt-8">
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
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="min-w-[72px] sm:min-w-[84px] py-3.5 px-2.5 bg-surface-white border border-gold-500/40 rounded-2xl shadow-[0_16px_30px_-16px_rgba(93,58,65,0.25)] flex flex-col items-center"
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
            <div className="p-4 rounded-2xl bg-cream/70 border border-gold-500/30 max-w-md mx-auto">
              <p className="typo-body italic text-center mx-auto text-rose-900">
                Alhamdulillah, rangkaian acara pernikahan Fauzan &amp; Sinta telah berlangsung 🤍
              </p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
