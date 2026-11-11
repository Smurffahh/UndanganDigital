export type FieldType = "asset" | "maps" | "social" | "general";

export function normalizeUrlOrPath(
  value: string | null | undefined,
  fieldType: FieldType = "general"
): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    (lower.startsWith("data:") && !lower.startsWith("data:image/") && !lower.startsWith("data:audio/"))
  ) {
    return "";
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (lower.startsWith("data:image/") || lower.startsWith("data:audio/") || lower.startsWith("blob:")) {
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
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    (lower.startsWith("data:") && !lower.startsWith("data:image/") && !lower.startsWith("data:audio/"))
  ) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return !/[\r\n\t]/.test(trimmed);
  }

  if (lower.startsWith("data:image/") || lower.startsWith("data:audio/") || lower.startsWith("blob:")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
