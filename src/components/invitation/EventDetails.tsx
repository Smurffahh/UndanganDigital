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
  // Format readable Indonesian date
  const displayDate =
    eventDateLabel ||
    (() => {
      try {
        const d = new Date(weddingDateIso);
        return new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(d);
      } catch {
        return "Minggu, 3 Januari 2027";
      }
    })();

  // Calculate calendar UTC timestamps (DTSTART & DTEND)
  const { dtStartUtc, dtEndUtc } = (() => {
    try {
      const start = new Date(weddingDateIso);
      const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // 6 hours duration

      const formatUtc = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

      return {
        dtStartUtc: formatUtc(start),
        dtEndUtc: formatUtc(end),
      };
    } catch {
      return {
        dtStartUtc: "20270103T010000Z",
        dtEndUtc: "20270103T070000Z",
      };
    }
  })();

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
      `DESCRIPTION:Akad Nikah: ${akadTime} — Resepsi: ${resepsiTime} di ${venueName}, ${venueAddress}`,
      `LOCATION:${venueName}, ${venueAddress}`,
      `DTSTART:${dtStartUtc}`,
      `DTEND:${dtEndUtc}`,
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
  )}&dates=${dtStartUtc}/${dtEndUtc}&location=${encodeURIComponent(
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

        {/* Card 2: Resepsi */}
        <article className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-7 text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mb-3.5 grid place-items-center">
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

        {/* Calendar Action Buttons */}
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

        {/* Card 3: Google Maps */}
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
      </div>
    </section>
  );
}
