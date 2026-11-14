export function normalizePhoneNumber(raw: string | null | undefined): string {
  if (!raw) return "";

  const str = String(raw).trim();
  if (/[a-zA-Z]/.test(str)) return "";

  let digits = str.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("8") && digits.length >= 9 && digits.length <= 13) {
    digits = "628" + digits.slice(1);
  } else if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  } else if (digits.startsWith("00628")) {
    digits = "628" + digits.slice(5);
  }

  if (digits.startsWith("628") && digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  if (digits.length >= 10 && digits.length <= 15 && !digits.startsWith("0")) {
    return digits;
  }

  return "";
}

export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  return normalized.length >= 10 && normalized.length <= 15;
}

export function formatPhoneDisplay(phone: string | null | undefined): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone ? String(phone) : "—";
  return `+${normalized}`;
}
