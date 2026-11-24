export function sanitizeGuestKpdParam(raw: unknown): string {
  if (raw === null || raw === undefined) return "Tamu Undangan";
  const str = Array.isArray(raw) ? raw[0] : String(raw);
  if (!str) return "Tamu Undangan";

  let decoded = str;
  try {
    decoded = decodeURIComponent(str.replace(/\+/g, " "));
  } catch {
    decoded = str.replace(/\+/g, " ");
  }

  const cleaned = decoded
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();

  if (!cleaned) return "Tamu Undangan";

  return cleaned.slice(0, 100);
}

export function formatGuestSlug(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  return encodeURIComponent(clean).replace(/%20/g, "+");
}
