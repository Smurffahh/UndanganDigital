"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider } from "./Ornaments";
import { formatCoverDate } from "@/lib/dateFormat";
import { ParallaxPhotoFrame } from "./ScrollReveal";

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

  // Format date label fallback to Bahasa Indonesia dari Single Source of Truth
  const displayDate = formatCoverDate(weddingDateIso, eventDateLabel);

  // Staggered Blur Reveal helper classes
  const getRevealClass = () => {
    if (!isRevealed) {
      return "opacity-0 translate-y-3 blur-sm";
    }
    return `opacity-100 translate-y-0 blur-none transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`;
  };

  return (
    <section
      id="beranda"
      className={`py-20 relative transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isRevealed ? "scale-100" : "scale-[1.08]"
      }`}
      aria-label="Beranda dan Hitung Mundur"
    >
      <div className="w-[min(100%-2.75rem,560px)] mx-auto text-center">
        {/* 1. Bismillah */}
        <p
          className={`typo-arabic leading-loose ${getRevealClass()}`}
          dir="rtl"
          style={{ transitionDelay: isRevealed ? "0ms" : "0ms" }}
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        {/* 2. Quote Card QS Ar-Rum: 21 */}
        <figure
          className={`card-ornament mt-5 bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 sm:p-8 text-center ${getRevealClass()}`}
          style={{ transitionDelay: isRevealed ? "100ms" : "0ms" }}
        >
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

        {/* 3. Divider */}
        <div
          className={`${getRevealClass()}`}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          <Divider />
        </div>

        {/* 4. Hero Photo in Mihrab Arch with Windowed Editorial Parallax */}
        <div
          className={`arch w-[min(76%,320px)] aspect-[4/5] mx-auto mt-2 overflow-hidden shadow-lg ${getRevealClass()}`}
          style={{ transitionDelay: isRevealed ? "300ms" : "0ms" }}
        >
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

        {/* 5. Names and Date */}
        <div
          className={`${getRevealClass()} mt-6`}
          style={{ transitionDelay: isRevealed ? "400ms" : "0ms" }}
        >
          <h2 className="typo-display drop-shadow-xs">
            Fauzan <span className="font-script text-[#c9a24b] text-[0.85em] px-1 font-normal">&amp;</span> Sinta
          </h2>
          <p className="typo-eyebrow mt-2 text-[#a9823a]">
            {displayDate}
          </p>
        </div>

        {/* 6. Countdown Timer with NumberFlow & Tabular Numbers */}
        <div
          className={`mt-6 ${getRevealClass()}`}
          style={{ transitionDelay: isRevealed ? "500ms" : "0ms" }}
        >
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
        </div>
      </div>
    </section>
  );
}
