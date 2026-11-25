import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FBF7F2] text-[#2E181B] relative overflow-hidden selection:bg-[#6B1222]/15 selection:text-[#6B1222]">
      {/* Subtle Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat"
        style={{ backgroundImage: "url('/images/bg-truntum-damask.svg')", backgroundSize: "160px" }}
        aria-hidden="true"
      />

      {/* Decorative Javanese Arch Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#FBF7F2]/95 backdrop-blur-md rounded-t-full rounded-b-2xl border border-[#C59B6D]/45 p-6 sm:p-8 shadow-[0_16px_40px_-12px_rgba(107,18,34,0.15)] flex flex-col items-center text-center">
        {/* Inner Concentric Hairline */}
        <div className="absolute inset-2 rounded-t-full rounded-b-xl border border-[#6B1222]/15 pointer-events-none" />

        {/* Gunungan Silhouette */}
        <div className="w-14 sm:w-16 h-auto my-2 opacity-75">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/gunungan-kosong.webp"
            alt=""
            width={800}
            height={1013}
            className="w-full h-auto object-contain select-none pointer-events-none"
            loading="eager"
            aria-hidden="true"
          />
        </div>

        {/* Small Eyebrow Label */}
        <p className="mt-4 font-sans text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#C59B6D]">
          HALAMAN TIDAK DITEMUKAN
        </p>

        {/* Big Decorative 404 */}
        <p className="font-serif text-5xl sm:text-6xl font-normal text-[#6B1222] tracking-wider my-1 drop-shadow-xs">
          404
        </p>

        {/* Main Heading */}
        <h1 className="font-serif text-lg sm:text-xl font-medium text-[#2E181B] tracking-wide mt-1">
          Tautan undangan tidak ditemukan
        </h1>

        {/* Description */}
        <p className="mt-2.5 font-sans text-xs sm:text-sm text-[#6E4A50] leading-relaxed max-w-xs text-balance">
          Periksa kembali tautan yang Anda buka atau kembali ke halaman utama undangan Fauzan &amp; Sinta.
        </p>

        {/* Action Button */}
        <div className="mt-6 w-full max-w-xs">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6B1222] via-[#8C2D3E] to-[#6B1222] hover:from-[#520D1A] hover:to-[#520D1A] text-[#FBF7F2] font-sans text-xs sm:text-sm font-medium tracking-wider uppercase border border-[#C59B6D]/50 shadow-[0_10px_24px_-6px_rgba(107,18,34,0.4)] transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B6D]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 stroke-[#FBF7F2]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Wedding Tag */}
        <p className="mt-5 font-serif text-[11px] tracking-widest uppercase text-[#C59B6D]/80">
          #SINgkatceritaFAUZAN
        </p>
      </div>
    </main>
  );
}
