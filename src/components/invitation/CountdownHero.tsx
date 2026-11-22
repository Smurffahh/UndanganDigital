"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Divider } from "./Ornaments";
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
  const [activeMode, setActiveMode] = useState<CoupleVisualMode>(coupleVisualMode);
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
    setActiveMode(coupleVisualMode);
  }, [coupleVisualMode]);

  const toggleVisualMode = () => {
    setActiveMode((prev) => (prev === "photo" ? "svg" : "photo"));
  };

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
    }, 2000);
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
        <h1 className="sr-only">The Wedding of Fauzan &amp; Sinta</h1>
        <div
          className="w-full flex flex-col items-center mb-3 royal-seq-item"
          data-seq-dir="top"
          style={getItemStyle("400ms", "top")}
        >
          <p className="typo-eyebrow text-[#C59B6D] tracking-[0.25em]">
            THE WEDDING OF
          </p>
        </div>

        <div
          className="w-full flex justify-center mb-6 royal-seq-item"
          data-seq-dir="center-scale"
          style={getItemStyle("550ms", "center-scale")}
        >
          <div className="relative flex justify-center items-center w-full">
            <div
              onClick={toggleVisualMode}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleVisualMode();
                }
              }}
              title="Klik untuk beralih antara foto dan ilustrasi karakter"
              className="arch w-[min(76%,300px)] sm:w-[min(76%,320px)] aspect-[4/5] mx-auto overflow-hidden shadow-[0_20px_48px_-12px_rgba(67,10,20,0.22)] bg-[#FBF7F2]/90 p-1.5 rounded-t-full rounded-b-2xl border border-[#C59B6D]/45 relative z-10 flex items-center justify-center cursor-pointer group active:scale-[0.98] transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B6D]"
            >
              <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden border border-[#C59B6D]/30 relative flex items-end justify-center bg-gradient-to-b from-[#FBF7F2] via-[#F8EFE4] to-[#F1E0CE]">
                {activeMode === "svg" || !heroPhotoUrl ? (
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
                    className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                )}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#6B1222]/85 backdrop-blur-md text-[#FBF7F2] text-[10px] font-sans font-medium tracking-wide flex items-center gap-1 shadow-sm opacity-85 group-hover:opacity-100 transition-opacity">
                  <span>{activeMode === "photo" ? "Ilustrasi ⇄" : "Foto ⇄"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-2 text-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("720ms", "bottom")}
        >
          <p className="typo-eyebrow text-[#C59B6D]">
            WITH LOVE
          </p>
          <p className="typo-arabic leading-[2] text-[#6B1222] mt-2" dir="rtl" lang="ar">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>

        <div
          className="mt-5 w-full royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("900ms", "bottom")}
        >
          <figure className="card-ornament bg-[#FBF7F2]/92 backdrop-blur-md border border-[#6B1222]/16 rounded-2xl shadow-[0_24px_50px_-18px_rgba(67,10,20,0.18)] p-7 sm:p-8 text-center relative overflow-hidden">
            <p className="typo-arabic leading-[2] text-[#6B1222] relative z-10" dir="rtl" lang="ar">
              وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            </p>
            <blockquote className="typo-body mt-4 mx-auto text-center font-normal leading-relaxed text-[#3B1A20]">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
            </blockquote>
            <figcaption className="typo-meta mt-3 font-medium text-[#C59B6D]">
              &mdash; QS. Ar-Rum : 21 &mdash;
            </figcaption>
          </figure>
        </div>

        <div
          className="my-8 w-full flex justify-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("1050ms", "bottom")}
        >
          <Divider />
        </div>

        <div
          className="text-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("1200ms", "bottom")}
        >
          <p className="typo-eyebrow text-[#C59B6D] mb-2">
            SAVE THE DATE
          </p>
          <h2 className="typo-section-title">
            Hitung Mundur
          </h2>
          <p className="typo-body text-center mx-auto mt-2 text-[#3B1A20]">
            Menuju Hari Bahagia &amp; Ikrar Suci Pernikahan
          </p>
        </div>

        <div
          className="mt-8 w-full flex justify-center royal-seq-item"
          data-seq-dir="bottom"
          style={getItemStyle("1350ms", "bottom")}
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
                  className="relative py-3 sm:py-4 px-1.5 sm:px-2 bg-[#FBF7F2]/95 backdrop-blur-md border border-[#C59B6D]/45 rounded-xl sm:rounded-2xl shadow-[0_16px_30px_-16px_rgba(67,10,20,0.15)] flex flex-col items-center justify-center overflow-hidden min-w-0"
                >
                  <div className="w-full flex justify-between px-2 sm:px-3 mb-1 opacity-50" aria-hidden="true">
                    <span className="w-px h-1.5 bg-[#C59B6D]" />
                    <span className="w-px h-1 bg-[#C59B6D]/60" />
                    <span className="w-px h-1 bg-[#C59B6D]/60" />
                    <span className="w-px h-1 bg-[#C59B6D]/60" />
                    <span className="w-px h-1.5 bg-[#C59B6D]" />
                  </div>

                  <NumberFlow
                    value={item.value}
                    format={{ minimumIntegerDigits: 2 }}
                    className="font-serif text-2xl sm:text-4xl font-bold tabular-nums text-[#6B1222] leading-none tracking-tight"
                    style={{ color: "#6B1222" }}
                  />
                  
                  <span className="font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#6E4A50] mt-1.5">
                    {item.label}
                  </span>

                  <div className="w-6 h-px bg-[#C59B6D]/40 mt-1.5" aria-hidden="true" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FBF7F2]/90 backdrop-blur-md border border-[#C59B6D]/30 max-w-md mx-auto text-center">
              <p className="typo-body italic text-center mx-auto text-[#6B1222]">
                Alhamdulillah, rangkaian acara pernikahan Fauzan &amp; Sinta telah berlangsung 🤍
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
