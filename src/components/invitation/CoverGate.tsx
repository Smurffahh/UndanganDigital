"use client";

import { useState } from "react";
import { RadiantStar } from "./Ornaments";
import { Mail } from "lucide-react";

interface CoverGateProps {
  guestName: string;
  onOpen: () => void;
  coverPhotoUrl: string;
  eventDateLabel?: string;
}

export function CoverGate({
  guestName,
  onOpen,
  coverPhotoUrl,
  eventDateLabel = "Minggu · 03 · Januari · 2027",
}: CoverGateProps) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const handleOpen = () => {
    setLeaving(true);
    onOpen();
    setTimeout(() => {
      setGone(true);
    }, 1000);
  };

  if (gone) return null;

  return (
    <section
      id="cover-gate"
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        leaving ? "-translate-y-full opacity-60 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      aria-label="Sampul Undangan"
    >
      {/* Background Image with Ken Burns effect */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
        style={{ backgroundImage: `url(${coverPhotoUrl})` }}
        role="img"
        aria-label="Foto Fauzan dan Sinta"
      />

      {/* Veil Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#381b22]/70 via-[#381b22]/40 to-[#381b22]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,rgba(156,95,102,0.35),transparent_60%)]" />

      {/* Content */}
      <div className="relative text-center text-white px-6 w-full max-w-[420px] flex flex-col items-center z-10">
        <RadiantStar className="w-8 h-8 fill-gold-300 mb-3.5 drop-shadow-md" />

        <p className="font-script text-3xl sm:text-4xl text-gold-300 leading-tight">
          The Wedding Of
        </p>

        <h1 className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl leading-tight mt-1 text-white drop-shadow-lg">
          Fauzan <span className="font-script text-gold-300 text-[0.85em] px-1">&amp;</span> Sinta
        </h1>

        <p className="mt-3.5 text-xs tracking-[0.4em] uppercase text-white/90 font-medium">
          {eventDateLabel}
        </p>

        {/* Guest Name Glass Card */}
        <div className="glass my-7 px-8 py-4 rounded-2xl w-full max-w-[340px] border border-gold-300/40">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300">
            Kepada Yth.
          </p>
          <p className="text-xs text-white/85 mt-1 font-light">
            Bapak / Ibu / Saudara/i
          </p>
          <p className="font-script text-2xl sm:text-3xl text-white mt-1 break-words">
            {guestName || "Tamu Undangan"}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#e9d3a3] to-[#c9a24b] text-[#443114] text-xs font-bold tracking-[0.2em] uppercase shadow-[0_14px_30px_-10px_rgba(169,130,58,0.55)] transition-transform duration-150 ease-out active:scale-[0.96] hover:brightness-105 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          <Mail className="w-4 h-4 stroke-[#443114] stroke-[1.8]" />
          <span>Buka Undangan</span>
        </button>

        <p className="mt-4 text-[10px] tracking-wide text-white/60">
          *Mohon maaf apabila terdapat kekeliruan penulisan nama &amp; gelar
        </p>
      </div>
    </section>
  );
}
