"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured by boundary:", error);
  }, [error]);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FBF7F2] text-[#2E181B] relative overflow-hidden selection:bg-[#6B1222]/15 selection:text-[#6B1222]">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat"
        style={{ backgroundImage: "url('/images/bg-truntum-damask.svg')", backgroundSize: "160px" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#FBF7F2]/95 backdrop-blur-md rounded-t-full rounded-b-2xl border border-[#C59B6D]/45 p-6 sm:p-8 shadow-[0_16px_40px_-12px_rgba(107,18,34,0.15)] flex flex-col items-center text-center">
        <div className="absolute inset-2 rounded-t-full rounded-b-xl border border-[#6B1222]/15 pointer-events-none" />

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

        <p className="mt-4 font-sans text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#C59B6D]">
          TERJADI KENDALA SISTEM
        </p>

        <h1 className="font-serif text-lg sm:text-xl font-medium text-[#2E181B] tracking-wide mt-2">
          Halaman Sementara Tidak Dapat Dimuat
        </h1>

        <p className="mt-2.5 font-sans text-xs sm:text-sm text-[#6E4A50] leading-relaxed max-w-xs text-balance">
          Terjadi kesalahan saat memproses permintaan Anda. Silakan coba muat ulang halaman atau kembali ke beranda undangan.
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-[10px] text-[#A6888D] select-all">
            Kode Tiket: {error.digest}
          </p>
        )}

        <div className="mt-6 w-full max-w-xs flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6B1222] via-[#8C2D3E] to-[#6B1222] hover:from-[#520D1A] hover:to-[#520D1A] text-[#FBF7F2] font-sans text-xs sm:text-sm font-medium tracking-wider uppercase border border-[#C59B6D]/50 shadow-[0_10px_24px_-6px_rgba(107,18,34,0.4)] transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B6D] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 shrink-0 stroke-[#FBF7F2]" />
            <span>Muat Ulang Halaman</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-5 py-2.5 rounded-full bg-[#FBF7F2] hover:bg-[#F3ECE4] text-[#6B1222] font-sans text-xs sm:text-sm font-medium tracking-wider uppercase border border-[#C59B6D]/40 transition-[transform,background-color] duration-200 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59B6D]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 stroke-[#6B1222]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <p className="mt-5 font-serif text-[11px] tracking-widest uppercase text-[#C59B6D]/80">
          #SINgkatceritaFAUZAN
        </p>
      </div>
    </main>
  );
}
