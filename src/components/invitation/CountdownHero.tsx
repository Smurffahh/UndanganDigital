"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider, GununganWayang } from "./Ornaments";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

interface CountdownHeroProps {
  weddingDateIso: string;
  heroPhotoUrl: string;
  isHeroReady?: boolean;
  eventDateLabel?: string;
}

export function CountdownHero({
  weddingDateIso,
  heroPhotoUrl,
  isHeroReady,
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

  return (
    <section
      id="beranda"
      className="relative bg-transparent pt-16 sm:pt-24 pb-20"
      aria-label="Beranda dan Hitung Mundur"
    >
      <div className="w-[min(100%-2.75rem,560px)] mx-auto flex flex-col items-center text-center">
        <ScrollLinkedItem trigger={isHeroReady} delay={50} offsetY={32} className="w-full flex justify-center mb-6">
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

        <ScrollLinkedItem trigger={isHeroReady} delay={120} offsetY={32} className="mt-2 text-center">
          <p className="typo-eyebrow text-[#a9823a]">
            WITH LOVE
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem trigger={isHeroReady} delay={180} offsetY={32} className="mt-3 text-center">
          <p className="typo-arabic leading-loose text-rose-700" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem trigger={isHeroReady} delay={240} offsetY={32} className="mt-5 w-full">
          <figure className="card-ornament bg-surface-white/95 backdrop-blur-md border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-auto pointer-events-none opacity-[0.06] text-[#c9a24b]">
              <GununganWayang className="w-full h-auto" />
            </div>
            <p className="typo-arabic leading-loose text-rose-900 relative z-10" dir="rtl">
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

        <ScrollLinkedItem trigger={isHeroReady} delay={300} offsetY={32} className="my-8 w-full flex justify-center">
          <Divider />
        </ScrollLinkedItem>

        <ScrollLinkedItem trigger={isHeroReady} delay={360} offsetY={32} className="text-center">
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

        <ScrollLinkedItem trigger={isHeroReady} delay={420} offsetY={32} className="mt-8 w-full flex justify-center">
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
