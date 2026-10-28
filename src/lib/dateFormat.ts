/**
 * Single Source of Truth untuk pemformatan tanggal pernikahan
 * Memastikan seluruh seksi undangan dan integrasi kalender tersinkronisasi 100%
 */

export const DEFAULT_EVENT_DATE_ISO = "2027-01-03T08:00:00+07:00";

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function parseEventDate(isoString?: string): Date {
  if (!isoString) {
    return new Date(DEFAULT_EVENT_DATE_ISO);
  }
  const parsed = new Date(isoString);
  return isNaN(parsed.getTime()) ? new Date(DEFAULT_EVENT_DATE_ISO) : parsed;
}

/**
 * Format untuk Sampul Cover Gate (01-cover)
 * Contoh: "Minggu · 03 · Januari · 2027"
 */
export function formatCoverDate(isoString?: string, overrideLabel?: string): string {
  if (overrideLabel && overrideLabel.trim()) {
    return overrideLabel.trim();
  }
  const d = parseEventDate(isoString);
  const dayName = INDONESIAN_DAYS[d.getDay()];
  const day = String(d.getDate()).padStart(2, "0");
  const month = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName} · ${day} · ${month} · ${year}`;
}

/**
 * Format untuk Kartu Acara Akad & Resepsi (04-acara)
 * Contoh: "Minggu, 3 Januari 2027"
 */
export function formatEventCardDate(isoString?: string, overrideLabel?: string): string {
  if (overrideLabel && overrideLabel.includes(",")) {
    return overrideLabel;
  }
  const d = parseEventDate(isoString);
  const dayName = INDONESIAN_DAYS[d.getDay()];
  const day = d.getDate();
  const month = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Format untuk Tanda Tangan Footer (08-penutup)
 * Contoh: "03 · 01 · 2027"
 */
export function formatFooterSignatureDate(isoString?: string): string {
  const d = parseEventDate(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day} · ${month} · ${year}`;
}

/**
 * Format untuk Pesan WhatsApp
 * Contoh: "Minggu, 3 Januari 2027"
 */
export function formatWaEventDate(isoString?: string): string {
  return formatEventCardDate(isoString);
}

/**
 * Helper untuk menghitung DTSTART & DTEND UTC kalender
 * Akad dimulai pukul 08.00 WIB (01:00 UTC) dan Resepsi berakhir pukul 14.00 WIB (07:00 UTC)
 */
export function getEventUtcTimestamps(weddingDateIso?: string) {
  const d = parseEventDate(weddingDateIso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  // YYYYMMDD
  const dateStr = `${year}${month}${day}`;

  // Akad Nikah jam 08.00 WIB = 01:00:00Z
  const dtStartUtc = `${dateStr}T010000Z`;
  // Resepsi selesai jam 14.00 WIB = 07:00:00Z
  const dtEndUtc = `${dateStr}T070000Z`;

  return { dtStartUtc, dtEndUtc };
}

/**
 * URL Google Calendar dinamis
 */
export function formatGoogleCalendarUrl(params: {
  weddingDateIso?: string;
  venueName: string;
  venueAddress: string;
  akadTime: string;
  resepsiTime: string;
  coupleNames?: string;
}): string {
  const { dtStartUtc, dtEndUtc } = getEventUtcTimestamps(params.weddingDateIso);
  const title = `Pernikahan ${params.coupleNames || "Fauzan & Sinta"}`;
  const location = `${params.venueName}, ${params.venueAddress}`;
  const details = `Akad Nikah: ${params.akadTime} — Resepsi: ${params.resepsiTime}. Lokasi: ${location}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${dtStartUtc}/${dtEndUtc}&location=${encodeURIComponent(
    location
  )}&details=${encodeURIComponent(details)}`;
}

/**
 * Isi file iCalendar (.ics) untuk Apple / Outlook / Google Calendar
 */
export function generateIcsContent(params: {
  weddingDateIso?: string;
  venueName: string;
  venueAddress: string;
  akadTime: string;
  resepsiTime: string;
  coupleNames?: string;
}): string {
  const { dtStartUtc, dtEndUtc } = getEventUtcTimestamps(params.weddingDateIso);
  const title = `Pernikahan ${params.coupleNames || "Fauzan & Sinta"}`;
  const location = `${params.venueName}, ${params.venueAddress}`;
  const description = `Akad Nikah: ${params.akadTime} — Resepsi: ${params.resepsiTime}. Lokasi: ${location}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fauzan & Sinta//Wedding Invitation//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${dtStartUtc}`,
    `DTEND:${dtEndUtc}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
