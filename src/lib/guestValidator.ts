import { GuestData } from "./db/store";
import { createBlindIndex, createPhoneBlindIndex } from "./crypto";

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

/**
 * Safely parses raw phone input from Excel/CSV (handles numbers, scientific notation, strings).
 */
export function parseRawPhoneToString(rawPhone: any): string {
  if (rawPhone === null || rawPhone === undefined) return "";
  if (typeof rawPhone === "number") {
    // Convert scientific notation or large float safely to plain string without exponential notation
    return rawPhone.toLocaleString("fullwide", { useGrouping: false });
  }

  const str = String(rawPhone).trim();
  // Check if string matches scientific notation e.g. "6.28123456789E+12" or "6.28E+11"
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(str)) {
    const num = Number(str);
    if (!isNaN(num)) {
      return num.toLocaleString("fullwide", { useGrouping: false });
    }
  }

  return str;
}

/**
 * Normalizes an Indonesian phone number to standard 628... format.
 * Intelligently handles Microsoft Excel quirks:
 * - Leading zero cut by Excel (e.g. 81234567890 -> 6281234567890)
 * - Standard 08... format (e.g. 081234567890 -> 6281234567890)
 * - International +628... or 628... (cleans +, -, spaces, dots)
 * - Rejects PSTN landlines (e.g. 021...) and numbers < 10 or > 15 digits.
 * Returns null if invalid or cannot be normalized.
 */
export function normalizePhoneNumber(rawPhone: any): string | null {
  if (rawPhone === null || rawPhone === undefined) return null;
  const str = parseRawPhoneToString(rawPhone);
  if (!str) return null;

  // Reject obvious placeholder or invalid patterns immediately
  if (/[a-zA-Z]/.test(str)) return null;

  // Strip all non-digit characters (+, -, spaces, dots, parentheses)
  let digits = str.replace(/\D/g, "");
  if (!digits) return null;

  // Reject Indonesian landline numbers (e.g. 021, 022, 024, 031, 061, etc.)
  if (/^0[2-9][0-9]{1,2}[0-9]+/.test(str.replace(/\D/g, "")) && !digits.startsWith("08")) {
    return null;
  }

  // Case 1: Excel stripped leading '0', leaving '8...' (e.g. 81234567890, 9 to 13 digits)
  if (digits.startsWith("8") && digits.length >= 9 && digits.length <= 13) {
    digits = "628" + digits.slice(1);
  }
  // Case 2: Standard Indonesian mobile with leading '08...' (e.g. 081234567890)
  else if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  }
  // Case 3: International dialing prefix '00628...'
  else if (digits.startsWith("00628")) {
    digits = "628" + digits.slice(5);
  }

  // Indonesian WhatsApp numbers should be between 10 and 15 digits starting with 628
  if (digits.startsWith("628") && digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  // Other valid international phone numbers (10 to 15 digits, not starting with 0)
  if (digits.length >= 10 && digits.length <= 15 && !digits.startsWith("0")) {
    return digits;
  }

  return null;
}

/**
 * Validates raw rows from CSV / Excel file before insertion.
 * Detects in-batch duplicates and database duplicates using blind indices.
 */
export function validateGuestImport(
  rawRows: Array<Record<string, any>>,
  existingGuests: GuestData[] = []
): GuestValidationResult {
  const validGuests: ValidatedGuest[] = [];
  const invalidRows: InvalidGuestRow[] = [];

  // Sets to track in-batch duplicates
  const seenNameIndices = new Set<string>();
  const seenPhoneIndices = new Set<string>();

  // Sets to track existing database duplicates
  const existingNameIndices = new Set<string>();
  const existingPhoneIndices = new Set<string>();

  for (const g of existingGuests) {
    if (g.name) {
      existingNameIndices.add(createBlindIndex(g.name));
    }
    if (g.whatsappNumber) {
      existingPhoneIndices.add(createPhoneBlindIndex(g.whatsappNumber));
    }
  }

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Assuming row 1 is header

    // Map common column name variations including official template headers
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

    // 1. Validate mandatory Name
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

    // 2. Validate Phone if provided
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

    // 3. Check In-Batch Duplicates
    const nameBindex = createBlindIndex(cleanName);
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
      const phoneBindex = createPhoneBlindIndex(normalizedPhone);
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

    // 4. Check Database Duplicates
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
      const phoneBindex = createPhoneBlindIndex(normalizedPhone);
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

    // Mark as seen in this batch
    seenNameIndices.add(nameBindex);

    // Row is completely valid!
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
