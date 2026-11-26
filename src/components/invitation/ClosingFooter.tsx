"use client";

import { Divider } from "./Ornaments";
import { formatFooterSignatureDate } from "@/lib/dateFormat";
import { ScrollLinkedItem } from "./ScrollLinkedItem";
import { ScrollReveal } from "./ScrollReveal";
import { CoupleCharacterSvg } from "./CoupleCharacterSvg";
import type { CoupleVisualMode, SvgCharacterPreset } from "@/lib/db/seed-data";
import { JavaneseScriptAccent } from "./JavaneseScriptAccent";
import type { FontTheme } from "@/lib/fontThemes";

interface ClosingFooterProps {
  weddingDateIso?: string;
  coupleVisualMode?: CoupleVisualMode;
  svgCharacterPreset?: SvgCharacterPreset;
  fontTheme?: FontTheme;
}

export function ClosingFooter({
  weddingDateIso,
  coupleVisualMode = "svg",
  svgCharacterPreset = "javanese-royal",
  fontTheme = "classic",
}: ClosingFooterProps) {
  const signatureDate = formatFooterSignatureDate(weddingDateIso);

  return (
    <footer
      className="relative mt-8 py-20 pb-32 text-center text-[#3B1A20] bg-transparent overflow-hidden"
      aria-label="Penutup Undangan"
    >
      <div className="relative w-[min(100%-2.75rem,560px)] mx-auto px-4 z-10">
        <ScrollReveal direction="bottom">
          <div className="flex flex-col items-center justify-center mb-6">
            <JavaneseScriptAccent section="closing" fontTheme={fontTheme} className="mb-1.5 text-base sm:text-lg" />
            <span className="inline-block px-4 py-1 rounded-full border border-[#C59B6D]/45 bg-[#FBF7F2]/90 typo-eyebrow text-[#C59B6D] tracking-[0.22em] uppercase shadow-xs">
              Doa &amp; Restu
            </span>
          </div>
        </ScrollReveal>

        <ScrollLinkedItem offsetY={36}>
          <p className="font-sans text-[15px] sm:text-base font-normal leading-[1.7] text-[#3B1A20] max-w-[480px] mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <p className="mt-7 typo-eyebrow text-[#C59B6D]">
            Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          {coupleVisualMode === "svg" && (
            <div className="w-20 sm:w-24 aspect-[3/4] mx-auto mb-4 rounded-[990px_990px_12px_12px] overflow-hidden border border-[#C59B6D]/50 bg-[#FBF7F2]/90 shadow-sm p-1">
              <CoupleCharacterSvg preset={svgCharacterPreset} variant="couple" className="w-full h-full" />
            </div>
          )}

          <div className="w-14 sm:w-16 mx-auto my-3 opacity-60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/javanese/gunungan-kosong.webp"
              alt=""
              aria-hidden="true"
              width={800}
              height={1013}
              className="w-full h-auto aspect-[800/1013] object-contain pointer-events-none select-none"
              loading="lazy"
              draggable={false}
            />
          </div>

          <p className="mt-3 typo-display text-[#6B1222] drop-shadow-xs">
            Fauzan <span className="font-script text-[#C59B6D] text-[0.85em] px-1 font-normal animate-gold-sheen">&amp;</span> Sinta
          </p>

          <p className="mt-2 font-sans text-xs sm:text-sm tracking-[0.14em] uppercase text-[#6E4A50] tabular-nums font-medium">
            {signatureDate}
          </p>

          <p className="mt-3 inline-block px-3.5 py-1 rounded-full bg-[#6B1222]/10 text-[#6B1222] border border-[#6B1222]/25 font-sans text-xs sm:text-sm font-semibold normal-case tracking-wide shadow-xs">
            #SINgkatceritaFAUZAN
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <div className="my-6">
            <Divider />
          </div>

          <p className="typo-meta text-[#6E4A50]">
            Dengan cinta, keluarga besar kedua mempelai
          </p>
        </ScrollLinkedItem>
      </div>
    </footer>
  );
}
