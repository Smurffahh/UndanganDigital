"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider, GununganWayang } from "./Ornaments";
import { CoupleCharacterSvg } from "./CoupleCharacterSvg";
import type { CoupleVisualMode, SvgCharacterPreset } from "@/lib/db/seed-data";

interface CountdownHeroProps {
  weddingDateIso: string;
  heroPhotoUrl: string;
  isOpening?: boolean;
  isOpened?: boolean;
  isHeroReady?: boolean;
  eventDateLabel?: string;
  coupleVisualMode?: CoupleVisualMode;
  svgCharacterPreset?: SvgCharacterPreset;
}

export function CountdownHero({
  weddingDateIso,
  heroPhotoUrl,
  isOpening,
  isOpened,
  isHeroReady,
  coupleVisualMode = "photo",
  svgCharacterPreset = "javanese-royal",
}: CountdownHeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isDone: false,
  });
  const [isSequenceDone, setIsSequenceDone] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (!isOpened) return;
    const timer = setTimeout(() => {
      setIsSequenceDone(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isOpened]);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || !isSequenceDone) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "-40px 0px -40px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isSequenceDone]);

  const getItemStyle = (delay: string, dir: string) => {
    if (!isSequenceDone) {
      return { "--seq-delay": delay } as React.CSSProperties;
    }
    return {
      "--seq-delay": "0ms",
      opacity: isInView ? 1 : 0,
      transform: isInView
        ? "translate3d(0, 0, 0) scale(1)"
        : dir === "top"
        ? "translate3d(0, calc(-1 * var(--motion-distance)), 0) scale(0.96)"
        : dir === "center-scale"
        ? "translate3d(0, 0, 0) scale(0.90)"
        : "translate3d(0, var(--motion-distance), 0) scale(0.96)",
      transitionDuration: isInView ? "var(--motion-duration-reveal)" : "var(--motion-duration-exit)",
      transitionTimingFunction: "var(--motion-ease-royal)",
      transitionProperty: "opacity, transform",
      willChange: "transform, opacity",
    } as React.CSSProperties;
  };

  return (
    <section
      id="beranda"
      ref={heroRef}
      className="relative bg-transparent pt-16 sm:pt-24 pb-20"
      aria-label="Beranda dan Hitung Mundur"
    >
      <div className="w-[min(100%-2.75rem,560px)] mx-auto flex flex-col items-center text-center">
        <div
          className="w-full flex flex-col items-center mb-3 royal-seq-item"
          data-seq-dir="top"
          style={getItemStyle("2200ms", "top")}
        >
          <p className="typo-eyebrow text-[#a9823a] tracking-[0.25em]">
            THE WEDDING OF
          </p>
        </div>

        <div
          className="w-full flex justify-center mb-6 royal-seq-item"
          data-seq-dir="center-scale"
          style={getItemStyle("2420ms", "center-scale")}
        >
          <div className="arch w-[min(76%,310px)] aspect-[4/5] mx-auto overflow-hidden shadow-[0_20px_48px_-12px_rgba(93,58,65,0.28)] bg-[#fffdfa]/95 relative z-10 flex items-center justify-center">
            {coupleVisualMode === "svg" || !heroPhotoUrl ? (
              <CoupleCharacterSvg
                preset={svgCharacterPreset}
                variant="couple"
                className="w-full h-full"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroPhotoUrl}
                alt="Fauzan dan Sinta"
                className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                loading="eager"
              />
            )}
          </div>
        </div>

        <div
          className="mt-2 text-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("2640ms", "bottom")}
        >
          <p className="typo-eyebrow text-[#a9823a]">
            WITH LOVE
          </p>
          <p className="typo-arabic leading-loose text-rose-700 mt-2" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>

        <div
          className="mt-5 w-full royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("2860ms", "bottom")}
        >
          <figure className="card-ornament bg-surface-white/95 backdrop-blur-md border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-auto pointer-events-none opacity-[0.06] text-[#c9a24b]">
              <GununganWayang className="w-full h-auto" />
            </div>
            <p className="typo-arabic leading-loose text-rose-900 relative z-10" dir="rtl">
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعELَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <blockquote className="typo-body mt-4 mx-auto text-center font-normal leading-relaxed text-[#4b3a3e]">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
            </blockquote>
            <figcaption className="typo-meta mt-3 font-medium text-[#a9823a]">
              &mdash; QS. Ar-Rum : 21 &mdash;
            </figcaption>
          </figure>
        </div>

        <div
          className="my-8 w-full flex justify-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("3080ms", "bottom")}
        >
          <Divider />
        </div>

        <div
          className="text-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("3080ms", "bottom")}
        >
          <p className="typo-eyebrow text-[#a9823a] mb-2">
            SAVE THE DATE
          </p>
          <h2 className="typo-section-title">
            Hitung Mundur
          </h2>
          <p className="typo-body text-center mx-auto mt-2 text-[#4b3a3e]">
            Menuju Hari Bahagia &amp; Ikrar Suci Pernikahan
          </p>
        </div>

        <div
          className="mt-8 w-full flex justify-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("3080ms", "bottom")}
        >
          {!timeLeft.isDone ? (
            <div
              className="grid grid-cols-4 gap-2 sm:gap-3.5 w-full max-w-[480px] mx-auto px-1"
              aria-label="Hitung mundur pernikahan"
            >
              {[
                { label: "Hari", value: timeLeft.days, maxTick: 30 },
                { label: "Jam", value: timeLeft.hours, maxTick: 24 },
                { label: "Menit", value: timeLeft.minutes, maxTick: 60 },
                { label: "Detik", value: timeLeft.seconds, maxTick: 60 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative py-3 sm:py-4 px-1.5 sm:px-2 bg-surface-white/95 backdrop-blur-md border border-gold-500/40 rounded-xl sm:rounded-2xl shadow-[0_16px_30px_-16px_rgba(93,58,65,0.25)] flex flex-col items-center justify-center overflow-hidden min-w-0"
                >
                  <div className="w-full flex justify-between px-2 sm:px-3 mb-1 opacity-50" aria-hidden="true">
                    <span className="w-px h-1.5 bg-gold-600" />
                    <span className="w-px h-1 bg-gold-400" />
                    <span className="w-px h-1 bg-gold-400" />
                    <span className="w-px h-1 bg-gold-400" />
                    <span className="w-px h-1.5 bg-gold-600" />
                  </div>

                  <NumberFlow
                    value={item.value}
                    format={{ minimumIntegerDigits: 2 }}
                    className="font-serif text-2xl sm:text-4xl font-bold tabular-nums text-[#5d3a41] leading-none tracking-tight"
                    style={{ color: "#5d3a41" }}
                  />
                  
                  <span className="font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#9c5f66] mt-1.5">
                    {item.label}
                  </span>

                  <div className="w-6 h-px bg-gold-500/40 mt-1.5" aria-hidden="true" />
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
        </div>
      </div>
    </section>
  );
}
