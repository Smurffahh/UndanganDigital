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

export function formatFooterSignatureDate(isoString?: string): string {
  const d = parseEventDate(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day} · ${month} · ${year}`;
}

export function formatWaEventDate(isoString?: string): string {
  return formatEventCardDate(isoString);
}

export function getEventUtcTimestamps(weddingDateIso?: string) {
  const d = parseEventDate(weddingDateIso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // WIB is UTC+7 (08:00 WIB = 01:00Z, 14:00 WIB = 07:00Z)
  const dtStartUtc = `${dateStr}T010000Z`;
  const dtEndUtc = `${dateStr}T070000Z`;

  return { dtStartUtc, dtEndUtc };
}

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

export function formatEventDateRange(startDateStr?: string, endDateStr?: string): string {
  if (!startDateStr) return "";
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return startDateStr;

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  if (!endDateStr || endDateStr === startDateStr) {
    const dayName = dayNames[start.getDay()];
    const date = start.getDate();
    const month = monthNames[start.getMonth()];
    const year = start.getFullYear();
    return `${dayName}, ${date} ${month} ${year}`;
  }

  const end = new Date(endDateStr);
  if (isNaN(end.getTime())) {
    const dayName = dayNames[start.getDay()];
    const date = start.getDate();
    const month = monthNames[start.getMonth()];
    const year = start.getFullYear();
    return `${dayName}, ${date} ${month} ${year}`;
  }

  const startDayName = dayNames[start.getDay()];
  const endDayName = dayNames[end.getDay()];
  const startDate = start.getDate();
  const endDate = end.getDate();
  const startMonth = monthNames[start.getMonth()];
  const endMonth = monthNames[end.getMonth()];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear && startMonth === endMonth) {
    return `${startDayName} - ${endDayName}, ${startDate} - ${endDate} ${endMonth} ${endYear}`;
  } else if (startYear === endYear) {
    return `${startDayName} - ${endDayName}, ${startDate} ${startMonth} - ${endDate} ${endMonth} ${endYear}`;
  } else {
    return `${startDayName} - ${endDayName}, ${startDate} ${startMonth} ${startYear} - ${endDate} ${endMonth} ${endYear}`;
  }
}

export function formatTasyakuranCalendarUrl(params: {
  title?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  venueName: string;
  venueAddress: string;
  coupleNames?: string;
}): string {
  const eventTitle = `${params.title || "Tasyakuran"} Pernikahan ${params.coupleNames || "Fauzan & Sinta"}`;
  const location = `${params.venueName}, ${params.venueAddress}`;
  const timeDesc = params.time && params.time.trim() ? `Waktu: ${params.time.trim()}` : "Acara Tasyakuran Pernikahan";
  const details = `${eventTitle}. ${timeDesc}. Lokasi: ${location}`;

  const cleanStart = (params.startDate || "2027-01-01").replace(/-/g, "");
  const cleanEnd = (params.endDate || "2027-01-02").replace(/-/g, "");

  if (!params.time || !params.time.trim()) {
    const endDateObj = new Date(params.endDate || "2027-01-02");
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endYear = endDateObj.getFullYear();
    const endMonth = String(endDateObj.getMonth() + 1).padStart(2, "0");
    const endDay = String(endDateObj.getDate()).padStart(2, "0");
    const nextDayStr = `${endYear}${endMonth}${endDay}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${cleanStart}/${nextDayStr}&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(details)}`;
  }

  const dtStartUtc = `${cleanStart}T020000Z`;
  const dtEndUtc = `${cleanEnd}T110000Z`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${dtStartUtc}/${dtEndUtc}&location=${encodeURIComponent(
    location
  )}&details=${encodeURIComponent(details)}`;
}

