"use client";

import { Divider } from "./Ornaments";
import { formatFooterSignatureDate } from "@/lib/dateFormat";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

interface ClosingFooterProps {
  weddingDateIso?: string;
}

export function ClosingFooter({ weddingDateIso }: ClosingFooterProps) {
  const signatureDate = formatFooterSignatureDate(weddingDateIso);

  return (
    <footer
      className="relative mt-8 py-20 pb-32 text-center text-[#4b3a3e] bg-transparent overflow-hidden"
      aria-label="Penutup Undangan"
    >
      <div className="relative w-[min(100%-2.75rem,560px)] mx-auto px-4 z-10">
        <ScrollLinkedItem offsetY={36}>
          <p className="font-sans text-[15px] sm:text-base font-normal leading-[1.7] text-[#4b3a3e] max-w-[480px] mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <p className="mt-7 typo-eyebrow text-[#a9823a]">
            Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <p className="mt-4 typo-display text-[#5d3a41] drop-shadow-xs">
            Fauzan <span className="font-script text-[#c9a24b] text-[0.85em] px-1 font-normal animate-gold-sheen">&amp;</span> Sinta
          </p>

          <p className="mt-2 font-sans text-xs sm:text-sm tracking-[0.14em] uppercase text-[#4b3a3e] tabular-nums font-medium">
            {signatureDate}
          </p>

          <p className="mt-3 inline-block px-3.5 py-1 rounded-full bg-[#f7e9e5] text-[#9c5f66] border border-[#e9d3a3] font-sans text-xs sm:text-sm font-semibold normal-case tracking-wide shadow-xs">
            #SINgkatceritaFAUZAN
          </p>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <div className="my-6">
            <Divider />
          </div>

          <p className="typo-meta text-[#8d757c]">
            Dengan cinta, keluarga besar kedua mempelai
          </p>
        </ScrollLinkedItem>
      </div>
    </footer>
  );
}
