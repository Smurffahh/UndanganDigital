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
 * Normalizes an Indonesian phone number to standard 628... format.
 * Returns null if invalid or cannot be normalized.
 */
export function normalizePhoneNumber(rawPhone: any): string | null {
  if (!rawPhone) return null;
  const str = String(rawPhone).trim();
  if (!str) return null;

  // Strip all non-digit characters
  let digits = str.replace(/\D/g, "");

  if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  } else if (digits.startsWith("8")) {
    digits = "628" + digits.slice(1);
  } else if (digits.startsWith("00628")) {
    digits = "628" + digits.slice(5);
  }

  // Indonesian WhatsApp numbers should be between 10 and 15 digits (starting with 628)
  if (digits.length >= 10 && digits.length <= 15 && digits.startsWith("628")) {
    return digits;
  }

  // If international number or non-628, validate length 10-15 digits
  if (digits.length >= 10 && digits.length <= 15) {
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

    // Map common column name variations
    const rawName =
      row["Nama"] ||
      row["nama"] ||
      row["Nama Tamu"] ||
      row["name"] ||
      row["Guest Name"] ||
      "";
    const rawPhone =
      row["WhatsApp"] ||
      row["whatsapp"] ||
      row["No HP"] ||
      row["Nomor WA"] ||
      row["phone"] ||
      row["Phone"] ||
      row["Telepon"] ||
      "";
    const rawCategory =
      row["Kategori"] ||
      row["kategori"] ||
      row["Category"] ||
      row["category"] ||
      "Reguler";

    const cleanName = String(rawName).trim();
    const phoneInput = String(rawPhone).trim();
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
      normalizedPhone = normalizePhoneNumber(phoneInput);
      if (!normalizedPhone) {
        invalidRows.push({
          rowNumber,
          rawName: cleanName,
          rawPhone: phoneInput,
          rawCategory: cleanCategory,
          reason: "Nomor WhatsApp tidak valid (harus 10-15 digit angka)",
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
