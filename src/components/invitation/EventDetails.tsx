"use client";

import { Calendar, Clock, MapPin, CalendarPlus, ExternalLink, Sparkles } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { FloralCornerAccent, WayangDivider, SongketRibbon } from "./Ornaments";
import {
  formatGoogleCalendarUrl,
  parseEventDate,
  formatEventDateRange,
  formatTasyakuranCalendarUrl,
} from "@/lib/dateFormat";
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
  showTasyakuran?: boolean;
  tasyakuranTitle?: string;
  tasyakuranStartDate?: string;
  tasyakuranEndDate?: string;
  tasyakuranTime?: string;
  tasyakuranSameLocation?: boolean;
  tasyakuranVenue?: string;
  tasyakuranAddress?: string;
  tasyakuranMapsUrl?: string;
}

const INDONESIAN_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

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
  showTasyakuran = true,
  tasyakuranTitle = "Tasyakuran",
  tasyakuranStartDate = "2027-01-01",
  tasyakuranEndDate = "2027-01-02",
  tasyakuranTime = "",
  tasyakuranSameLocation = true,
  tasyakuranVenue = "",
  tasyakuranAddress = "",
  tasyakuranMapsUrl = "",
}: EventDetailsProps) {
  const dateObj = parseEventDate(weddingDateIso);
  const dayNumber = dateObj.getDate();
  const dayName = INDONESIAN_DAYS[dateObj.getDay()];
  const monthName = INDONESIAN_MONTHS[dateObj.getMonth()];
  const yearNumber = dateObj.getFullYear();

  const isTasyakuranActive = showTasyakuran !== false;

  const effectiveTasyakuranVenue =
    tasyakuranSameLocation !== false || !tasyakuranVenue?.trim()
      ? venueName
      : tasyakuranVenue;

  const effectiveTasyakuranAddress =
    tasyakuranSameLocation !== false || !tasyakuranAddress?.trim()
      ? venueAddress
      : tasyakuranAddress;

  const effectiveTasyakuranMapsUrl =
    tasyakuranSameLocation !== false || !tasyakuranMapsUrl?.trim()
      ? googleMapsUrl
      : tasyakuranMapsUrl;

  const tasyakuranStartObj = parseEventDate(tasyakuranStartDate);
  const tasyakuranEndObj = parseEventDate(tasyakuranEndDate);
  const isMultiDayTasyakuran =
    tasyakuranStartDate !== tasyakuranEndDate && tasyakuranEndDate;

  const tasyakuranDayHeader = isMultiDayTasyakuran
    ? `${INDONESIAN_DAYS[tasyakuranStartObj.getDay()]} – ${INDONESIAN_DAYS[tasyakuranEndObj.getDay()]}`
    : INDONESIAN_DAYS[tasyakuranStartObj.getDay()];

  const tasyakuranDateNumbers = isMultiDayTasyakuran
    ? `${String(tasyakuranStartObj.getDate()).padStart(2, "0")} – ${String(tasyakuranEndObj.getDate()).padStart(2, "0")}`
    : String(tasyakuranStartObj.getDate()).padStart(2, "0");

  const tasyakuranMonthYear = `${INDONESIAN_MONTHS[tasyakuranStartObj.getMonth()]} ${tasyakuranStartObj.getFullYear()}`;

  const googleCalendarUrl = formatGoogleCalendarUrl({
    weddingDateIso,
    venueName,
    venueAddress,
    akadTime,
    resepsiTime,
    coupleNames: "Fauzan & Sinta",
  });

  const tasyakuranCalendarUrl = formatTasyakuranCalendarUrl({
    title: tasyakuranTitle,
    startDate: tasyakuranStartDate,
    endDate: tasyakuranEndDate,
    time: tasyakuranTime,
    venueName: effectiveTasyakuranVenue,
    venueAddress: effectiveTasyakuranAddress,
    coupleNames: "Fauzan & Sinta",
  });

  return (
    <section id="acara" className="py-20 relative bg-transparent" aria-label="Detail Acara dan Lokasi">
      <div className="w-[min(100%-2.75rem,560px)] md:w-[min(100%-2.75rem,880px)] mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* KARTU 1: TASYAKURAN (KRONOLOGIS PERTAMA) */}
          {isTasyakuranActive && (
            <ScrollLinkedItem
              direction="down"
              stage={1}
              className="md:col-span-2 max-w-[560px] mx-auto w-full"
            >
              <article className="rounded-t-[999px] rounded-b-[120px] border-2 border-[#C59B6D]/65 bg-[#FBF7F2]/92 backdrop-blur-sm shadow-sm p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-md transition-[box-shadow] duration-300">
                <div className="w-14 h-14 rounded-full bg-[#6B1222]/10 border border-[#C59B6D]/40 text-[#6B1222] mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
                  <Sparkles className="w-6 h-6 stroke-[1.6]" />
                </div>

                <h3 className="typo-card-title text-2xl sm:text-3xl text-[#6B1222]">
                  {tasyakuranTitle || "Tasyakuran"}
                </h3>

                <div className="my-5 flex flex-col items-center justify-center">
                  <span className="typo-eyebrow text-[#C59B6D] tracking-[0.25em] uppercase text-xs mb-1">
                    {tasyakuranDayHeader}
                  </span>
                  <div className="flex items-baseline justify-center">
                    <span className="font-serif text-4xl sm:text-5xl font-bold tabular-nums text-[#6B1222] tracking-tight">
                      {tasyakuranDateNumbers}
                    </span>
                  </div>
                  <span className="typo-eyebrow text-[#6E4A50] tracking-[0.2em] uppercase text-xs mt-1">
                    {tasyakuranMonthYear}
                  </span>
                </div>

                {tasyakuranTime && tasyakuranTime.trim() ? (
                  <p className="font-sans text-[15px] sm:text-base font-semibold tabular-nums text-[#6B1222] flex items-center justify-center gap-1.5 mb-3">
                    <Clock className="w-4 h-4 text-[#C59B6D] stroke-[1.8]" />
                    {tasyakuranTime.trim()}
                  </p>
                ) : null}

                <SongketRibbon className="w-28 my-3 mx-auto" />

                <p className="font-sans text-base font-semibold text-[#3B1A20]">
                  {effectiveTasyakuranVenue}
                </p>
                <p className="mt-1 typo-body text-center mx-auto text-[#3B1A20] max-w-[340px]">
                  {effectiveTasyakuranAddress}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
                  <a
                    href={effectiveTasyakuranMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#6B1222] text-[#FBF7F2] hover:bg-[#520D1A] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Petunjuk Arah</span>
                  </a>

                  <a
                    href={tasyakuranCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#FBF7F2] text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
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
          )}

          {/* KARTU 2: AKAD NIKAH */}
          <ScrollLinkedItem
            direction="left"
            stage={1}
            className={isTasyakuranActive ? "md:col-span-1" : "md:col-span-1"}
          >
            <article className="h-full rounded-t-[999px] rounded-b-[120px] border-2 border-[#C59B6D]/65 bg-[#FBF7F2]/92 backdrop-blur-sm shadow-sm p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-md transition-[box-shadow] duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-[#6B1222]/10 border border-[#C59B6D]/40 text-[#6B1222] mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
                  <Calendar className="w-6 h-6 stroke-[1.6]" />
                </div>

                <h3 className="typo-card-title text-2xl sm:text-3xl text-[#6B1222]">
                  Akad Nikah
                </h3>

                <div className="my-5 flex flex-col items-center justify-center">
                  <span className="typo-eyebrow text-[#C59B6D] tracking-[0.25em] uppercase text-xs mb-1">
                    {dayName}
                  </span>
                  <div className="flex items-baseline justify-center">
                    <NumberFlow
                      value={dayNumber}
                      format={{ minimumIntegerDigits: 2 }}
                      className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#6B1222]"
                    />
                  </div>
                  <span className="typo-eyebrow text-[#6E4A50] tracking-[0.2em] uppercase text-xs mt-1">
                    {monthName} {yearNumber}
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
                  {venuePlusCode && (
                    <>
                      <br />
                      <span className="text-xs text-[#6E4A50]">{venuePlusCode}</span>
                    </>
                  )}
                </p>
              </div>

              <div>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#6B1222] text-[#FBF7F2] hover:bg-[#520D1A] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Petunjuk Arah</span>
                  </a>

                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#FBF7F2] text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Simpan ke Kalender</span>
                  </a>
                </div>

                <div className="mt-6 flex justify-center pb-2">
                  <FloralCornerAccent className="w-28 opacity-80" />
                </div>
              </div>
            </article>
          </ScrollLinkedItem>

          {/* KARTU 3: RESEPSI */}
          <ScrollLinkedItem
            direction="right"
            stage={2}
            className={isTasyakuranActive ? "md:col-span-1" : "md:col-span-1"}
          >
            <article className="h-full rounded-t-[999px] rounded-b-[120px] border-2 border-[#C59B6D]/65 bg-[#FBF7F2]/92 backdrop-blur-sm shadow-sm p-7 sm:p-10 text-center relative overflow-hidden group hover:shadow-md transition-[box-shadow] duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-[#6B1222]/10 border border-[#C59B6D]/40 text-[#6B1222] mx-auto mt-4 mb-3 grid place-items-center shadow-xs">
                  <Calendar className="w-6 h-6 stroke-[1.6]" />
                </div>

                <h3 className="typo-card-title text-2xl sm:text-3xl text-[#6B1222]">
                  Resepsi
                </h3>

                <div className="my-5 flex flex-col items-center justify-center">
                  <span className="typo-eyebrow text-[#C59B6D] tracking-[0.25em] uppercase text-xs mb-1">
                    {dayName}
                  </span>
                  <div className="flex items-baseline justify-center">
                    <NumberFlow
                      value={dayNumber}
                      format={{ minimumIntegerDigits: 2 }}
                      className="font-serif text-5xl sm:text-6xl font-bold tabular-nums text-[#6B1222]"
                    />
                  </div>
                  <span className="typo-eyebrow text-[#6E4A50] tracking-[0.2em] uppercase text-xs mt-1">
                    {monthName} {yearNumber}
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
                  {venuePlusCode && (
                    <>
                      <br />
                      <span className="text-xs text-[#6E4A50]">{venuePlusCode}</span>
                    </>
                  )}
                </p>
              </div>

              <div>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[380px] mx-auto">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#6B1222] text-[#FBF7F2] hover:bg-[#520D1A] active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Petunjuk Arah</span>
                  </a>

                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#C59B6D]/50 bg-[#FBF7F2] text-[#6B1222] hover:bg-[#6B1222]/10 active:scale-[0.96] transition-transform duration-150 shadow-sm min-h-11 cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Simpan ke Kalender</span>
                  </a>
                </div>

                <div className="mt-6 flex justify-center pb-2">
                  <FloralCornerAccent className="w-28 opacity-80" />
                </div>
              </div>
            </article>
          </ScrollLinkedItem>
        </div>

        {/* MAPS EMBED */}
        <ScrollLinkedItem offsetY={36} stage={3}>
          <div className="card-ornament bg-[#FBF7F2]/95 border border-[#6B1222]/16 rounded-2xl shadow-xs p-5 sm:p-6 text-center">
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
              className="typo-button inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#6B1222] via-[#8C2D3E] to-[#6B1222] hover:from-[#520D1A] hover:to-[#520D1A] text-[#FBF7F2] uppercase shadow-[0_12px_24px_-8px_rgba(107,18,34,0.4)] active:scale-[0.96] transition-transform duration-150 cursor-pointer"
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
