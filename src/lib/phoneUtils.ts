export function parseRawPhoneToString(rawPhone: unknown): string {
  if (rawPhone === null || rawPhone === undefined) return "";
  if (typeof rawPhone === "number") {
    return rawPhone.toLocaleString("fullwide", { useGrouping: false });
  }

  const str = String(rawPhone).trim();
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(str)) {
    const num = Number(str);
    if (!isNaN(num)) {
      return num.toLocaleString("fullwide", { useGrouping: false });
    }
  }

  return str.replace(/^['"]/, "");
}

export function normalizePhoneNumber(raw: unknown): string {
  if (raw === null || raw === undefined) return "";

  const str = parseRawPhoneToString(raw);
  if (!str || /[a-zA-Z]/.test(str)) return "";

  let digits = str.replace(/\D/g, "");
  if (!digits) return "";

  if (/^0[2-9]/.test(str.replace(/\D/g, "")) && !digits.startsWith("08")) {
    return "";
  }

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

export function isValidPhoneNumber(phone: unknown): boolean {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  return normalized.length >= 10 && normalized.length <= 15;
}

export function formatPhoneDisplay(phone: unknown): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone ? String(phone) : "—";
  return `+${normalized}`;
}

export function sanitizeCellForSpreadsheet(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  if (/^[=\+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}
