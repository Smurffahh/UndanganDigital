import { GununganWayang, SongketRibbon } from "./Ornaments";

interface CoupleProfileProps {
  brideName: string;
  brideBirth: string;
  brideBio: string;
  bridePhotoUrl: string;
  groomName: string;
  groomBirth: string;
  groomBio: string;
  groomPhotoUrl: string;
}

export function CoupleProfile({
  brideName,
  brideBirth,
  brideBio,
  bridePhotoUrl,
  groomName,
  groomBirth,
  groomBio,
  groomPhotoUrl,
}: CoupleProfileProps) {
  return (
    <section id="mempelai" className="py-20 relative" aria-label="Profil Mempelai">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        <header className="text-center mb-9">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
            Dengan Memohon Rahmat &amp; Ridho Allah SWT
          </p>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
            Mempelai
          </h2>
          <SongketRibbon />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-9 md:gap-7">
          {/* Mempelai Wanita */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white text-[10px] font-semibold tracking-[0.25em] uppercase text-gold-600 shadow-xs">
              Mempelai Wanita
            </span>

            <div className="arch w-[min(72%,260px)] aspect-[3/4] mt-5 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bridePhotoUrl}
                alt={`${brideName} - Mempelai Wanita`}
                className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                loading="lazy"
              />
            </div>

            <h3 className="mt-5 font-serif font-semibold text-2xl sm:text-3xl text-rose-900">
              {brideName}
            </h3>
            <p className="mt-2 text-xs tracking-[0.25em] uppercase text-gold-600 font-medium">
              {brideBirth}
            </p>
            <p className="mt-3.5 text-xs sm:text-sm font-light text-muted max-w-[320px] leading-relaxed">
              {brideBio}
            </p>
          </article>

          {/* Gunungan Wayang Divider */}
          <div className="hidden md:flex justify-center">
            <GununganWayang className="w-16 text-gold-500 opacity-80" />
          </div>
          <div className="flex md:hidden justify-center my-2">
            <GununganWayang className="w-12 text-gold-500 opacity-80" />
          </div>

          {/* Mempelai Pria */}
          <article className="text-center p-4 sm:p-6 flex flex-col items-center">
            <span className="inline-block px-5 py-1.5 border border-gold-500/55 rounded-full bg-surface-white text-[10px] font-semibold tracking-[0.25em] uppercase text-gold-600 shadow-xs">
              Mempelai Pria
            </span>

            <div className="arch w-[min(72%,260px)] aspect-[3/4] mt-5 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={groomPhotoUrl}
                alt={`${groomName} - Mempelai Pria`}
                className="w-full h-full object-cover rounded-[990px_990px_14px_14px] outline outline-1 -outline-offset-1 outline-black/10"
                loading="lazy"
              />
            </div>

            <h3 className="mt-5 font-serif font-semibold text-2xl sm:text-3xl text-rose-900">
              {groomName}
            </h3>
            <p className="mt-2 text-xs tracking-[0.25em] uppercase text-gold-600 font-medium">
              {groomBirth}
            </p>
            <p className="mt-3.5 text-xs sm:text-sm font-light text-muted max-w-[320px] leading-relaxed">
              {groomBio}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
