"use client";

import { Calendar, Clock, MapPin, CalendarPlus, ExternalLink, Download } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { FloralCornerAccent, WayangDivider, SongketRibbon } from "./Ornaments";
import { formatGoogleCalendarUrl, generateIcsContent, parseEventDate } from "@/lib/dateFormat";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

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
  const dateObj = parseEventDate(weddingDateIso);
  const dayNumber = dateObj.getDate();

  const googleCalendarUrl = formatGoogleCalendarUrl({
    weddingDateIso,
    venueName,
    venueAddress,
    akadTime,
    resepsiTime,
    coupleNames: "Fauzan & Sinta",
  });

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
    <section id="acara" className="py-20 relative bg-transparent" aria-label="Detail Acara dan Lokasi">
      <div className="w-[min(100%-2.75rem,560px)] mx-auto">
        <header className="text-center mb-10">
          <ScrollLinkedItem offsetY={36}>
            <span className="inline-block px-4 py-1 rounded-full border border-gold-500/40 bg-surface-white/90 typo-eyebrow text-[#a9823a] tracking-[0.22em] uppercase shadow-xs mb-3">
              Save The Date
            </span>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title">
              Waktu &amp; Tempat
            </h2>
            <WayangDivider />
          </ScrollLinkedItem>
        </header>

        <ScrollLinkedItem direction="left" className="mb-8">
          <article className="rounded-t-[999px] rounded-b-[120px] border-2 border-[#c9a24b]/70 bg-[#fffdfa]/88 backdrop-blur-sm shadow-lg p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-[0_28px_56px_-16px_rgba(93,58,65,0.25)] transition-[box-shadow] duration-300">
            <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>

            <h3 className="typo-card-title text-2xl sm:text-3xl text-[#5d3a41]">
              Akad Nikah
            </h3>

            <div className="my-5 flex flex-col items-center justify-center">
              <span className="typo-eyebrow text-[#a9823a] tracking-[0.25em] uppercase text-xs mb-1">
                Minggu
              </span>
              <div className="flex items-baseline justify-center">
                <NumberFlow
                  value={dayNumber}
                  format={{ minimumIntegerDigits: 2 }}
                  className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#5d3a41]"
                />
              </div>
              <span className="typo-eyebrow text-[#9c5f66] tracking-[0.2em] uppercase text-xs mt-1">
                Januari 2027
              </span>
            </div>

            <p className="font-sans text-[15px] sm:text-base font-semibold tabular-nums text-[#5d3a41] flex items-center justify-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-[#a9823a] stroke-[1.8]" />
              {akadTime}
            </p>

            <SongketRibbon className="w-28 my-3 mx-auto" />

            <p className="font-sans text-base font-semibold text-[#5d3a41]">
              {venueName}
            </p>
            <p className="mt-1 typo-body text-center mx-auto text-[#4b3a3e] max-w-[320px]">
              {venueAddress}
              <br />
              <span className="text-xs text-[#7a5c61]">{venuePlusCode}</span>
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold-500/50 bg-[#5d3a41] text-[#fffdfa] hover:bg-[#4b2f34] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-300" />
                <span className="text-xs tracking-wider uppercase font-semibold">Buka Petunjuk Arah Google Maps</span>
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold-500/50 bg-[#fffdfa] text-[#5d3a41] hover:bg-rose-100/70 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#a9823a]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Simpan ke Kalender</span>
              </a>
            </div>

            <div className="mt-6 flex justify-center pb-2">
              <FloralCornerAccent className="w-28 opacity-80" />
            </div>
          </article>
        </ScrollLinkedItem>

        <ScrollLinkedItem direction="right" className="mb-8">
          <article className="rounded-t-[999px] rounded-b-[120px] border-2 border-[#c9a24b]/70 bg-[#fffdfa]/88 backdrop-blur-sm shadow-lg p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-[0_28px_56px_-16px_rgba(93,58,65,0.25)] transition-[box-shadow] duration-300">
            <div className="w-14 h-14 rounded-full bg-rose-100 border border-gold-500/40 text-gold-600 mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>

            <h3 className="typo-card-title text-2xl sm:text-3xl text-[#5d3a41]">
              Resepsi
            </h3>

            <div className="my-5 flex flex-col items-center justify-center">
              <span className="typo-eyebrow text-[#a9823a] tracking-[0.25em] uppercase text-xs mb-1">
                Minggu
              </span>
              <div className="flex items-baseline justify-center">
                <NumberFlow
                  value={dayNumber}
                  format={{ minimumIntegerDigits: 2 }}
                  className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#5d3a41]"
                />
              </div>
              <span className="typo-eyebrow text-[#9c5f66] tracking-[0.2em] uppercase text-xs mt-1">
                Januari 2027
              </span>
            </div>

            <p className="font-sans text-[15px] sm:text-base font-semibold tabular-nums text-[#5d3a41] flex items-center justify-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-[#a9823a] stroke-[1.8]" />
              {resepsiTime}
            </p>

            <SongketRibbon className="w-28 my-3 mx-auto" />

            <p className="font-sans text-base font-semibold text-[#5d3a41]">
              {venueName}
            </p>
            <p className="mt-1 typo-body text-center mx-auto text-[#4b3a3e] max-w-[320px]">
              {venueAddress}
              <br />
              <span className="text-xs text-[#7a5c61]">{venuePlusCode}</span>
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold-500/50 bg-[#5d3a41] text-[#fffdfa] hover:bg-[#4b2f34] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-300" />
                <span className="text-xs tracking-wider uppercase font-semibold">Buka Petunjuk Arah Google Maps</span>
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold-500/50 bg-[#fffdfa] text-[#5d3a41] hover:bg-rose-100/70 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#a9823a]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Simpan ke Kalender</span>
              </a>
            </div>

            <div className="mt-6 flex justify-center pb-2">
              <FloralCornerAccent className="w-28 opacity-80" />
            </div>
          </article>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="typo-button inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gold-500/40 bg-surface-white/80 text-[#5d3a41] hover:bg-rose-100/70 active:scale-[0.96] transition-transform duration-150 shadow-xs cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#a9823a]" />
            <span>Unduh Pengingat Kalender (.ics)</span>
          </button>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
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
              className="typo-button inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 text-white uppercase shadow-[0_12px_24px_-8px_rgba(93,58,65,0.5)] active:scale-[0.96] transition-transform duration-150 hover:brightness-110"
            >
              <MapPin className="w-4 h-4" />
              <span>Buka Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </ScrollLinkedItem>
      </div>
    </section>
  );
}
