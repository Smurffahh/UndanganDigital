"use client";

import { Divider } from "./Ornaments";
import { formatFooterSignatureDate } from "@/lib/dateFormat";
import { ScrollReveal } from "./ScrollReveal";

interface ClosingFooterProps {
  weddingDateIso?: string;
}

export function ClosingFooter({ weddingDateIso }: ClosingFooterProps) {
  const signatureDate = formatFooterSignatureDate(weddingDateIso);

  return (
    <footer
      className="relative mt-8 py-20 pb-32 text-center text-[#f3e4e0] bg-gradient-to-br from-[#5d3a41] via-[#7a4a52] to-[#8f5a62] overflow-hidden"
      aria-label="Penutup Undangan"
    >
      {/* Background motif Batik Kawung overlay */}
      <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-40 pointer-events-none" />

      <div className="relative w-[min(100%-2.75rem,560px)] mx-auto px-4 z-10">
        <ScrollReveal variant="fade-up" delay={0}>
          <p className="font-sans text-[15px] sm:text-base font-normal leading-[1.7] text-white/95 max-w-[480px] mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={90}>
          <p className="mt-7 typo-eyebrow text-gold-300">
            Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={180}>
          <p className="mt-4 typo-display text-white drop-shadow-md">
            Fauzan <span className="font-script text-gold-300 text-[0.85em] px-1 font-normal">&amp;</span> Sinta
          </p>

          <p className="mt-2 font-sans text-xs sm:text-sm tracking-[0.14em] uppercase text-white/85 tabular-nums font-medium">
            {signatureDate}
          </p>

          <p className="mt-3 font-sans text-xs sm:text-sm tracking-wide text-gold-300 font-semibold normal-case">
            #SINgkatceritaFAUZAN
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade" delay={270}>
          <div className="my-6">
            <Divider light />
          </div>

          <p className="typo-meta text-white/70">
            Dengan cinta, keluarga besar kedua mempelai
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
