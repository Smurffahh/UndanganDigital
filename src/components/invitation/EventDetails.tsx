"use client";

import { SongketRibbon } from "./Ornaments";
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Download } from "lucide-react";

interface EventDetailsProps {
  akadTime: string;
  resepsiTime: string;
  venueName: string;
  venueAddress: string;
  venuePlusCode: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
}

export function EventDetails({
  akadTime,
  resepsiTime,
  venueName,
  venueAddress,
  venuePlusCode,
  googleMapsUrl,
  googleMapsEmbed,
}: EventDetailsProps) {
  // Generate downloadable ICS file for offline / Apple / Outlook calendar
  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Fauzan & Sinta//Pernikahan Fauzan & Sinta//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "SUMMARY:Pernikahan Fauzan & Sinta",
      "DESCRIPTION:Akad Nikah 08.00 WIB — Resepsi 11.00 WIB di Kelurahan Air Putih, Tuah Madani, Pekanbaru",
      "LOCATION:Kelurahan Air Putih, Tuah Madani, Kota Pekanbaru, Riau",
      "DTSTART:20270110T010000Z",
      "DTEND:20270110T070000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

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

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Pernikahan Fauzan & Sinta"
  )}&dates=20270110T010000Z/20270110T070000Z&location=${encodeURIComponent(
    `${venueName}, ${venueAddress}`
  )}&details=${encodeURIComponent(
    `Akad Nikah: ${akadTime} — Resepsi: ${resepsiTime}. Lokasi: ${venueName}, ${venueAddress}`
  )}`;

  return (
    <section id="acara" className="py-20 relative bg-gradient-to-b from-rose-100/0 via-rose-100/50 to-rose-100/0" aria-label="Detail Acara dan Lokasi">
      <div className="w-[min(100%-2.75rem,560px)] mx-auto">
        <header className="text-center mb-9">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
            Save The Date
          </p>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
            Waktu &amp; Tempat
          </h2>
          <SongketRibbon />
        </header>

        {/* Card 1: Akad Nikah */}
        <article className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mb-3.5 grid place-items-center">
            <Calendar className="w-6 h-6 stroke-[1.6]" />
          </div>
          <h3 className="font-serif font-semibold text-2xl text-rose-900">
            Akad Nikah
          </h3>
          <p className="mt-1.5 text-xs font-semibold tracking-[0.24em] uppercase text-rose-700">
            Ahad, 10 Januari 2027
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

        {/* Card 2: Resepsi */}
        <article className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mb-3.5 grid place-items-center">
            <Calendar className="w-6 h-6 stroke-[1.6]" />
          </div>
          <h3 className="font-serif font-semibold text-2xl text-rose-900">
            Resepsi
          </h3>
          <p className="mt-1.5 text-xs font-semibold tracking-[0.24em] uppercase text-rose-700">
            Ahad, 10 Januari 2027
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

        {/* Tombol Buka Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#e9d3a3] to-[#c9a24b] text-[#443114] text-xs font-bold tracking-[0.2em] uppercase shadow-[0_14px_30px_-10px_rgba(169,130,58,0.55)] transition-transform duration-150 active:scale-[0.96] hover:brightness-105 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          <MapPin className="w-4 h-4 stroke-[1.8]" />
          <span>Buka Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        {/* Peta Google Maps Embed */}
        <div className="mt-5 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-gold-500/40 shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)]">
          <iframe
            title="Peta Lokasi Pernikahan Fauzan & Sinta"
            src={googleMapsEmbed}
            className="w-full h-full border-0 [filter:sepia(0.12)_saturate(1.02)]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Calendar Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold-600/55 text-gold-600 bg-surface-white/80 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-150 active:scale-[0.96] hover:bg-rose-100 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 stroke-[1.8]" />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold-600/55 text-gold-600 bg-surface-white/80 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-150 active:scale-[0.96] hover:bg-rose-100 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[1.8]" />
            <span>Unduh File (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
