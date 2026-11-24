"use client";

import Image from "next/image";

export interface DashboardSplashScreenProps {
  variant: "access" | "welcome";
  groomFirstName?: string;
  brideFirstName?: string;
  displayName?: string;
  role?: "admin" | "parent" | string;
  className?: string;
  isExiting?: boolean;
}

export function DashboardSplashScreen({
  variant,
  groomFirstName = "Fauzan",
  brideFirstName = "Sinta",
  displayName,
  role = "admin",
  className = "",
  isExiting = false,
}: DashboardSplashScreenProps) {
  const groomInit = (groomFirstName.trim()[0] || "F").toUpperCase();
  const brideInit = (brideFirstName.trim()[0] || "S").toUpperCase();
  const cleanName = displayName?.trim();
  const isParent = role === "parent";

  const greetingTitle = isParent
    ? cleanName
      ? `Sugeng rawuh, ${cleanName}`
      : "Sugeng rawuh"
    : cleanName
      ? `Selamat datang kembali, ${cleanName}`
      : "Selamat datang kembali";

  const greetingSubtitle = isParent
    ? "Menyiapkan daftar tamu keluarga..."
    : "Membuka ruang pengelolaan undangan...";

  const exitStyles = isExiting
    ? "opacity-0 scale-[1.015] pointer-events-none"
    : "opacity-100 scale-100";

  if (variant === "access") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FBF7F2] text-[#3B1A20] select-none overflow-hidden transition-opacity transition-transform duration-300 ease-out ${exitStyles} ${className}`}
      >
        <div
          className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:180px_180px] opacity-[0.06] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(107,18,34,0.05)_100%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-center rounded-3xl border border-[#C59B6D]/35 bg-white/50 p-7 sm:p-9 shadow-[0_12px_40px_rgba(107,18,34,0.06)] backdrop-blur-xs">
          <div
            className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#C59B6D]/60 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#C59B6D]/60 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#C59B6D]/60 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#C59B6D]/60 pointer-events-none"
            aria-hidden="true"
          />

          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-[#C59B6D]/45 bg-[#FBF7F2] flex items-center justify-center shadow-xs mb-4.5 animate-splash-glow">
            <span className="font-serif text-2xl sm:text-[26px] font-bold text-[#6B1222] tracking-tight">
              {groomInit}
            </span>
            <span className="font-script text-xl sm:text-2xl text-[#C59B6D] -mx-0.5 relative -top-0.5">
              &
            </span>
            <span className="font-serif text-2xl sm:text-[26px] font-bold text-[#6B1222] tracking-tight">
              {brideInit}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-[28px] font-semibold tracking-wide text-[#6B1222] text-center leading-snug">
            {groomFirstName} &amp; {brideFirstName}
          </h1>

          <div
            className="w-12 h-px bg-[#C59B6D]/50 my-2.5"
            aria-hidden="true"
          />

          <p className="text-xs sm:text-[13px] font-sans tracking-wide text-[#6E4A50] text-center font-medium">
            Menyiapkan ruang pengelolaan...
          </p>

          <div
            className="w-36 h-1 mt-5 rounded-full bg-[#6B1222]/10 overflow-hidden relative"
            role="progressbar"
            aria-label="Memuat dashboard"
          >
            <div className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-[#6B1222] via-[#C59B6D] to-[#6B1222] animate-splash-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#5C0F1E] via-[#4A0C18] to-[#340912] text-[#FDFBF7] select-none overflow-hidden transition-opacity transition-transform duration-300 ease-out ${exitStyles} ${className}`}
    >
      <div
        className="absolute inset-0 bg-[url('/images/bg-truntum-damask.svg')] bg-repeat bg-[length:180px_180px] opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/assets/javanese/gunungan-kosong.webp"
          alt=""
          width={400}
          height={600}
          priority
          className="h-[60vh] max-h-[500px] w-auto object-contain opacity-[0.10] filter brightness-125"
        />
      </div>

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,180,130,0.08)_0%,transparent_65%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center rounded-3xl border border-[#D9B482]/25 bg-black/25 p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xs">
        <div
          className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-[#D9B482]/60 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-[#D9B482]/60 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#D9B482]/60 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-[#D9B482]/60 pointer-events-none"
          aria-hidden="true"
        />

        <div className="animate-splash-fade-up [animation-delay:60ms] inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D9B482]/35 bg-[#5C0F1E]/60 mb-5 sm:mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#E2C290] animate-pulse"
            aria-hidden="true"
          />
          <span className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#E2C290]">
            Sugeng Rawuh
          </span>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 text-center">
          <span className="animate-splash-fade-up [animation-delay:140ms] font-serif text-3xl sm:text-4xl text-[#FDFBF7] tracking-wide font-normal">
            {groomFirstName}
          </span>
          <span className="animate-splash-fade-up [animation-delay:220ms] font-script text-3xl sm:text-4xl text-[#E6C894] px-1 animate-splash-glow">
            &amp;
          </span>
          <span className="animate-splash-fade-up [animation-delay:300ms] font-serif text-3xl sm:text-4xl text-[#FDFBF7] tracking-wide font-normal">
            {brideFirstName}
          </span>
        </div>

        <div
          className="animate-splash-line [animation-delay:380ms] w-28 h-px bg-gradient-to-r from-transparent via-[#E2C290] to-transparent my-3.5 sm:my-4"
          aria-hidden="true"
        />

        <div className="animate-splash-fade-up [animation-delay:460ms] text-center space-y-1">
          <h2 className="font-serif text-lg sm:text-xl font-medium text-[#FDFBF7] text-balance">
            {greetingTitle}
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-[#E2C290]/85 tracking-wide font-normal">
            {greetingSubtitle}
          </p>
        </div>

        <div
          className="animate-splash-fade-up [animation-delay:520ms] w-28 h-0.5 rounded-full bg-white/10 overflow-hidden relative mt-6"
          role="progressbar"
          aria-label="Memuat dashboard"
        >
          <div className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#E2C290] to-transparent animate-splash-indeterminate" />
        </div>
      </div>
    </div>
  );
}
