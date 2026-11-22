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
          <ScrollLinkedItem direction="down" offsetY={22}>
            <span className="inline-block px-4 py-1 rounded-full border border-[#C59B6D]/45 bg-[#FBF7F2]/90 typo-eyebrow text-[#C59B6D] tracking-[0.22em] uppercase shadow-xs mb-3">
              Save The Date
            </span>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title text-[#6B1222]">
              Waktu &amp; Tempat
            </h2>
            <WayangDivider />
          </ScrollLinkedItem>
        </header>

        <ScrollLinkedItem direction="left" stage={1} className="mb-8">
          <article className="rounded-t-[999px] rounded-b-[120px] border-2 border-[#C59B6D]/65 bg-[#FBF7F2]/92 backdrop-blur-sm shadow-lg p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-[0_28px_56px_-16px_rgba(67,10,20,0.22)] transition-[box-shadow] duration-300">
            <div className="w-14 h-14 rounded-full bg-[#6B1222]/10 border border-[#C59B6D]/40 text-[#6B1222] mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>

            <h3 className="typo-card-title text-2xl sm:text-3xl text-[#6B1222]">
              Akad Nikah
            </h3>

            <div className="my-5 flex flex-col items-center justify-center">
              <span className="typo-eyebrow text-[#C59B6D] tracking-[0.25em] uppercase text-xs mb-1">
                Minggu
              </span>
              <div className="flex items-baseline justify-center">
                <NumberFlow
                  value={dayNumber}
                  format={{ minimumIntegerDigits: 2 }}
                  className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#6B1222]"
                />
              </div>
              <span className="typo-eyebrow text-[#6E4A50] tracking-[0.2em] uppercase text-xs mt-1">
                Januari 2027
              </span>
            </div>

            <p className="font-sans text-[15px] sm:text-base font-semibold tabular-nums text-[#6B1222] flex items-center justify-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-[#C59B6D] stroke-[1.8]" />
              {akadTime}
            </p>

            <SongketRibbon className="w-28 my-3 mx-auto" />

            <p className="font-sans text-base font-semibold text-[#3B1A20]">
              {venueName}
            </p>
            <p className="mt-1 typo-body text-center mx-auto text-[#3B1A20] max-w-[320px]">
              {venueAddress}
              <br />
              <span className="text-xs text-[#6E4A50]">{venuePlusCode}</span>
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#6B1222] text-[#FBF7F2] hover:bg-[#520D1A] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Buka Petunjuk Arah Google Maps</span>
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#FBF7F2] text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Simpan ke Kalender</span>
              </a>
            </div>

            <div className="mt-6 flex justify-center pb-2">
              <FloralCornerAccent className="w-28 opacity-80" />
            </div>
          </article>
        </ScrollLinkedItem>

        <ScrollLinkedItem direction="right" stage={2} className="mb-8">
          <article className="rounded-t-[999px] rounded-b-[120px] border-2 border-[#C59B6D]/65 bg-[#FBF7F2]/92 backdrop-blur-sm shadow-lg p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-[0_28px_56px_-16px_rgba(67,10,20,0.22)] transition-[box-shadow] duration-300">
            <div className="w-14 h-14 rounded-full bg-[#6B1222]/10 border border-[#C59B6D]/40 text-[#6B1222] mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
              <Calendar className="w-6 h-6 stroke-[1.6]" />
            </div>

            <h3 className="typo-card-title text-2xl sm:text-3xl text-[#6B1222]">
              Resepsi
            </h3>

            <div className="my-5 flex flex-col items-center justify-center">
              <span className="typo-eyebrow text-[#C59B6D] tracking-[0.25em] uppercase text-xs mb-1">
                Minggu
              </span>
              <div className="flex items-baseline justify-center">
                <NumberFlow
                  value={dayNumber}
                  format={{ minimumIntegerDigits: 2 }}
                  className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#6B1222]"
                />
              </div>
              <span className="typo-eyebrow text-[#6E4A50] tracking-[0.2em] uppercase text-xs mt-1">
                Januari 2027
              </span>
            </div>

            <p className="font-sans text-[15px] sm:text-base font-semibold tabular-nums text-[#6B1222] flex items-center justify-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-[#C59B6D] stroke-[1.8]" />
              {resepsiTime}
            </p>

            <SongketRibbon className="w-28 my-3 mx-auto" />

            <p className="font-sans text-base font-semibold text-[#3B1A20]">
              {venueName}
            </p>
            <p className="mt-1 typo-body text-center mx-auto text-[#3B1A20] max-w-[320px]">
              {venueAddress}
              <br />
              <span className="text-xs text-[#6E4A50]">{venuePlusCode}</span>
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#6B1222] text-[#FBF7F2] hover:bg-[#520D1A] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Buka Petunjuk Arah Google Maps</span>
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#FBF7F2] text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#C59B6D]" />
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
            className="typo-button inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#C59B6D]/45 bg-[#FBF7F2]/90 text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-xs cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span>Unduh Pengingat Kalender (.ics)</span>
          </button>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36} stage={3}>
          <div className="card-ornament bg-[#FBF7F2]/95 border border-[#6B1222]/16 rounded-2xl shadow-[0_24px_50px_-18px_rgba(67,10,20,0.18)] p-5 sm:p-6 text-center">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-[#C59B6D]/30 mb-4 shadow-inner">
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
              className="typo-button inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#6B1222] via-[#8C2D3E] to-[#6B1222] hover:from-[#520D1A] hover:to-[#520D1A] text-[#FBF7F2] uppercase shadow-[0_12px_24px_-8px_rgba(107,18,34,0.4)] active:scale-[0.96] transition-transform duration-150"
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
