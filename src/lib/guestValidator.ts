import type { GuestData } from "./db/store";

function normalizeNameKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhoneKey(phone: string): string {
  return phone.replace(/\D/g, "");
}

export interface ValidatedGuest {
  rowNumber: number;
  name: string;
  whatsappNumber: string | null;
  category: string;
}

export interface InvalidGuestRow {
  rowNumber: number;
  rawName: string;
  rawPhone: string;
  rawCategory: string;
  reason: string;
}

export interface GuestValidationResult {
  totalRows: number;
  validGuests: ValidatedGuest[];
  invalidRows: InvalidGuestRow[];
}

export function parseRawPhoneToString(rawPhone: any): string {
  if (rawPhone === null || rawPhone === undefined) return "";
  if (typeof rawPhone === "number") {
    // Converts scientific notation or float safely to plain string without exponential formatting
    return rawPhone.toLocaleString("fullwide", { useGrouping: false });
  }

  const str = String(rawPhone).trim();
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(str)) {
    const num = Number(str);
    if (!isNaN(num)) {
      return num.toLocaleString("fullwide", { useGrouping: false });
    }
  }

  return str;
}

export function normalizePhoneNumber(rawPhone: any): string | null {
  if (rawPhone === null || rawPhone === undefined) return null;
  const str = parseRawPhoneToString(rawPhone);
  if (!str) return null;

  if (/[a-zA-Z]/.test(str)) return null;

  let digits = str.replace(/\D/g, "");
  if (!digits) return null;

  if (/^0[2-9][0-9]{1,2}[0-9]+/.test(str.replace(/\D/g, "")) && !digits.startsWith("08")) {
    return null;
  }

  // Excel strips leading 0 on numeric cells; normalizes 08... and 8... to 628...
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

  return null;
}

export function validateGuestImport(
  rawRows: Array<Record<string, any>>,
  existingGuests: GuestData[] = []
): GuestValidationResult {
  const validGuests: ValidatedGuest[] = [];
  const invalidRows: InvalidGuestRow[] = [];

  const seenNameIndices = new Set<string>();
  const seenPhoneIndices = new Set<string>();

  const existingNameIndices = new Set<string>();
  const existingPhoneIndices = new Set<string>();

  for (const g of existingGuests) {
    if (g.name) {
      existingNameIndices.add(normalizeNameKey(g.name));
    }
    if (g.whatsappNumber) {
      existingPhoneIndices.add(normalizePhoneKey(g.whatsappNumber));
    }
  }

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2;

    const rawName =
      row["Nama_Tamu"] ||
      row["nama_tamu"] ||
      row["Nama Tamu"] ||
      row["Nama"] ||
      row["nama"] ||
      row["name"] ||
      row["Name"] ||
      row["Guest Name"] ||
      row["guest_name"] ||
      "";

    const rawPhone =
      row["Nomor_WhatsApp"] !== undefined
        ? row["Nomor_WhatsApp"]
        : row["nomor_whatsapp"] !== undefined
        ? row["nomor_whatsapp"]
        : row["Nomor WhatsApp"] !== undefined
        ? row["Nomor WhatsApp"]
        : row["Nomor WA"] !== undefined
        ? row["Nomor WA"]
        : row["nomor_wa"] !== undefined
        ? row["nomor_wa"]
        : row["WhatsApp"] !== undefined
        ? row["WhatsApp"]
        : row["whatsapp"] !== undefined
        ? row["whatsapp"]
        : row["No HP"] !== undefined
        ? row["No HP"]
        : row["no_hp"] !== undefined
        ? row["no_hp"]
        : row["No WA"] !== undefined
        ? row["No WA"]
        : row["phone"] !== undefined
        ? row["phone"]
        : row["Phone"] !== undefined
        ? row["Phone"]
        : row["Telepon"] !== undefined
        ? row["Telepon"]
        : "";

    const rawCategory =
      row["Kategori"] ||
      row["kategori"] ||
      row["Category"] ||
      row["category"] ||
      "Reguler";

    const cleanName = String(rawName).trim();
    const phoneInput = parseRawPhoneToString(rawPhone);
    const cleanCategory = String(rawCategory).trim() || "Reguler";

    if (!cleanName || cleanName.length < 2) {
      invalidRows.push({
        rowNumber,
        rawName: cleanName || "(kosong)",
        rawPhone: phoneInput || "-",
        rawCategory: cleanCategory,
        reason: "Nama tamu wajib diisi (minimal 2 karakter)",
      });
      return;
    }

    let normalizedPhone: string | null = null;
    if (phoneInput && phoneInput !== "-" && phoneInput !== "0") {
      normalizedPhone = normalizePhoneNumber(rawPhone);
      if (!normalizedPhone) {
        let reason = "Nomor WhatsApp tidak valid (harus 10-15 digit angka)";
        if (/[a-zA-Z]/.test(phoneInput)) {
          reason = "Nomor WhatsApp tidak boleh mengandung huruf";
        } else if (/^0[2-9]/.test(phoneInput.replace(/\D/g, ""))) {
          reason = "Nomor telepon rumah (PSTN) tidak didukung untuk WhatsApp";
        } else if (phoneInput.replace(/\D/g, "").length < 10) {
          reason = "Nomor WhatsApp terlalu pendek (minimal 10 digit)";
        } else if (phoneInput.replace(/\D/g, "").length > 15) {
          reason = "Nomor WhatsApp terlalu panjang (maksimal 15 digit)";
        }

        invalidRows.push({
          rowNumber,
          rawName: cleanName,
          rawPhone: phoneInput,
          rawCategory: cleanCategory,
          reason,
        });
        return;
      }
    }

    const nameBindex = normalizeNameKey(cleanName);
    if (seenNameIndices.has(nameBindex)) {
      invalidRows.push({
        rowNumber,
        rawName: cleanName,
        rawPhone: phoneInput || "-",
        rawCategory: cleanCategory,
        reason: "Duplikat nama di dalam berkas impor yang sama",
      });
      return;
    }

    if (normalizedPhone) {
      const phoneBindex = normalizePhoneKey(normalizedPhone);
      if (seenPhoneIndices.has(phoneBindex)) {
        invalidRows.push({
          rowNumber,
          rawName: cleanName,
          rawPhone: phoneInput,
          rawCategory: cleanCategory,
          reason: "Duplikat nomor WhatsApp di dalam berkas impor yang sama",
        });
        return;
      }
      seenPhoneIndices.add(phoneBindex);
    }

    if (existingNameIndices.has(nameBindex)) {
      invalidRows.push({
        rowNumber,
        rawName: cleanName,
        rawPhone: phoneInput || "-",
        rawCategory: cleanCategory,
        reason: "Nama tamu sudah terdaftar sebelumnya di database",
      });
      return;
    }

    if (normalizedPhone) {
      const phoneBindex = normalizePhoneKey(normalizedPhone);
      if (existingPhoneIndices.has(phoneBindex)) {
        invalidRows.push({
          rowNumber,
          rawName: cleanName,
          rawPhone: phoneInput,
          rawCategory: cleanCategory,
          reason: "Nomor WhatsApp sudah terdaftar sebelumnya di database",
        });
        return;
      }
    }

    seenNameIndices.add(nameBindex);

    validGuests.push({
      rowNumber,
      name: cleanName,
      whatsappNumber: normalizedPhone,
      category: cleanCategory,
    });
  });

  return {
    totalRows: rawRows.length,
    validGuests,
    invalidRows,
  };
}
