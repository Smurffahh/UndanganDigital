"use client";

import { SongketRibbon } from "./Ornaments";
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Download } from "lucide-react";
import { formatEventCardDate, formatGoogleCalendarUrl, generateIcsContent } from "@/lib/dateFormat";
import { ScrollReveal } from "./ScrollReveal";

interface EventDetailsProps {
  akadTime: string;
  resepsiTime: string;
  venueName: string;
  venueAddress: string;
  venuePlusCode: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  weddingDateIso?: string;
  eventDateLabel?: string;
}

export function EventDetails({
  akadTime,
  resepsiTime,
  venueName,
  venueAddress,
  venuePlusCode,
  googleMapsUrl,
  googleMapsEmbed,
  weddingDateIso = "2027-01-03T08:00:00+07:00",
  eventDateLabel,
}: EventDetailsProps) {
  // Tanggal terformat resmi dari Single Source of Truth
  const displayDate = formatEventCardDate(weddingDateIso, eventDateLabel);

  // Link Google Calendar otomatis
  const googleCalendarUrl = formatGoogleCalendarUrl({
    weddingDateIso,
    venueName,
    venueAddress,
    akadTime,
    resepsiTime,
    coupleNames: "Fauzan & Sinta",
  });

  // Download berkas ICS
  const handleDownloadIcs = () => {
    const icsContent = generateIcsContent({
      weddingDateIso,
      venueName,
      venueAddress,
      akadTime,
      resepsiTime,
      coupleNames: "Fauzan & Sinta",
    });

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pernikahan-fauzan-sinta.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="acara" className="py-20 relative bg-gradient-to-b from-rose-100/0 via-rose-100/50 to-rose-100/0" aria-label="Detail Acara dan Lokasi">
      <div className="w-[min(100%-2.75rem,560px)] mx-auto">
        {/* Header Seksi (Staggered Chunk 1 & 2) */}
        <header className="text-center mb-9">
          <ScrollReveal delay={0} variant="fade-up">
            <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
              Save The Date
            </p>
          </ScrollReveal>

          <ScrollReveal delay={90} variant="fade-up">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
              Waktu &amp; Tempat
            </h2>
            <SongketRibbon />
          </ScrollReveal>
        </header>

        {/* Card 1: Akad Nikah (Staggered Chunk 3) */}
        <ScrollReveal delay={180} variant="scale-up" className="mb-6">
          <article className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 text-center relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_28px_56px_-16px_rgba(93,58,65,0.28)] transition-[transform,box-shadow] duration-300">
            {/* 3D Glare Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mb-3.5 grid place-items-center group-hover:scale-105 transition-transform duration-300">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>
            <h3 className="font-serif font-semibold text-2xl text-rose-900">
              Akad Nikah
            </h3>
            <p className="mt-1.5 text-xs font-semibold tracking-[0.24em] uppercase text-rose-700">
              {displayDate}
            </p>
            <p className="mt-2 text-sm text-ink flex items-center justify-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-gold-600 stroke-[1.8]" />
              {akadTime}
            </p>
            <SongketRibbon className="w-28 my-3.5 mx-auto" />
            <p className="font-serif font-semibold text-lg text-ink">
              {venueName}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {venueAddress}
              <br />
              {venuePlusCode}
            </p>
          </article>
        </ScrollReveal>

        {/* Card 2: Resepsi (Staggered Chunk 3) */}
        <ScrollReveal delay={270} variant="scale-up" className="mb-6">
          <article className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 text-center relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_28px_56px_-16px_rgba(93,58,65,0.28)] transition-[transform,box-shadow] duration-300">
            {/* 3D Glare Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mb-3.5 grid place-items-center group-hover:scale-105 transition-transform duration-300">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>
            <h3 className="font-serif font-semibold text-2xl text-rose-900">
              Resepsi
            </h3>
            <p className="mt-1.5 text-xs font-semibold tracking-[0.24em] uppercase text-rose-700">
              {displayDate}
            </p>
            <p className="mt-2 text-sm text-ink flex items-center justify-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-gold-600 stroke-[1.8]" />
              {resepsiTime}
            </p>
            <SongketRibbon className="w-28 my-3.5 mx-auto" />
            <p className="font-serif font-semibold text-lg text-ink">
              {venueName}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {venueAddress}
              <br />
              {venuePlusCode}
            </p>
          </article>
        </ScrollReveal>

        {/* Calendar Action Buttons (Staggered Chunk 4) */}
        <ScrollReveal delay={360} variant="fade-up">
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold-500/45 bg-surface-white/80 text-rose-900 text-xs font-semibold tracking-wider uppercase hover:bg-rose-100/70 active:scale-[0.96] transition-transform duration-150 shadow-xs"
            >
              <CalendarPlus className="w-4 h-4 text-gold-600" />
              <span>Simpan ke Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold-500/45 bg-surface-white/80 text-rose-900 text-xs font-semibold tracking-wider uppercase hover:bg-rose-100/70 active:scale-[0.96] transition-transform duration-150 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-gold-600" />
              <span>Unduh Pengingat (.ics)</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Card 3: Google Maps Embed (Staggered Chunk 4) */}
        <ScrollReveal delay={450} variant="fade-up">
          <div className="card-ornament bg-surface-white border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-5 sm:p-6 text-center">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-gold-500/25 mb-4 shadow-inner">
              <iframe
                src={googleMapsEmbed}
                title={`Peta Lokasi Pernikahan Fauzan dan Sinta di ${venueName}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 text-white text-xs font-bold tracking-wider uppercase shadow-[0_12px_24px_-8px_rgba(93,58,65,0.5)] active:scale-[0.96] transition-transform duration-150 hover:brightness-110"
            >
              <MapPin className="w-4 h-4" />
              <span>Buka Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
