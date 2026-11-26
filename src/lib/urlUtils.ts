type FieldType = "asset" | "maps" | "social" | "general";

const SAFE_RASTER_DATA_IMAGE_RE = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
const SAFE_DATA_AUDIO_RE = /^data:audio\/(?:mpeg|mp3|wav|ogg|mp4|webm|aac|x-m4a);base64,[A-Za-z0-9+/=]+$/i;
const CONTROL_CHAR_RE = /[\u0000-\u001F\u007F-\u009F]/g;

function stripControlChars(input: string): string {
  return input.replace(CONTROL_CHAR_RE, "");
}

function isSafeDataUri(trimmed: string): boolean {
  return SAFE_RASTER_DATA_IMAGE_RE.test(trimmed) || SAFE_DATA_AUDIO_RE.test(trimmed);
}

function isSafeLocalPath(trimmed: string): boolean {
  return trimmed.startsWith("/") && !trimmed.startsWith("//") && !CONTROL_CHAR_RE.test(trimmed);
}

export function normalizeUrlOrPath(
  value: string | null | undefined,
  fieldType: FieldType = "general"
): string {
  if (!value) return "";
  const trimmed = stripControlChars(value).trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    (lower.startsWith("data:") && !isSafeDataUri(trimmed))
  ) {
    return "";
  }

  if (trimmed.startsWith("/")) {
    return isSafeLocalPath(trimmed) ? trimmed : "";
  }

  if (isSafeDataUri(trimmed) || lower.startsWith("blob:")) {
    return trimmed;
  }

  if (fieldType === "social" && trimmed.startsWith("@")) {
    return `https://instagram.com/${trimmed.slice(1)}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function isValidUrlOrLocalPath(value: string | null | undefined): boolean {
  if (!value || value.trim() === "") return true;
  const trimmed = stripControlChars(value).trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    (lower.startsWith("data:") && !isSafeDataUri(trimmed))
  ) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return isSafeLocalPath(trimmed);
  }

  if (isSafeDataUri(trimmed) || lower.startsWith("blob:")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeSafeHref(value: string | null | undefined, fallback = "#"): string {
  if (!value) return fallback;
  const trimmed = stripControlChars(value).trim();
  if (!trimmed) return fallback;
  if (isSafeLocalPath(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export function sanitizeSafeMediaSrc(value: string | null | undefined, fallback = ""): string {
  if (!value) return fallback;
  const trimmed = stripControlChars(value).trim();
  if (!trimmed) return fallback;
  if (isSafeLocalPath(trimmed) || isSafeDataUri(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}
