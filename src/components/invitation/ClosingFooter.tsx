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
          <p className="font-serif italic text-base sm:text-lg leading-relaxed text-white/90 max-w-[440px] mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={90}>
          <p className="mt-7 text-xs tracking-[0.3em] uppercase text-gold-300 font-medium">
            Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={180}>
          <p className="mt-4 font-script text-4xl sm:text-5xl text-gold-300 leading-tight drop-shadow-md">
            Fauzan &amp; Sinta
          </p>

          <p className="mt-2 text-xs tracking-[0.42em] text-white/80 tabular-nums">
            {signatureDate}
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade" delay={270}>
          <div className="my-6">
            <Divider light />
          </div>

          <p className="text-xs tracking-[0.12em] text-white/65">
            Dengan cinta, keluarga besar kedua mempelai
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
