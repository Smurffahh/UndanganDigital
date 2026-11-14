import type { GuestData } from "./db/store";
import { normalizePhoneNumber, parseRawPhoneToString } from "./phoneUtils";

function normalizeNameKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhoneKey(phone: string): string {
  return phone.replace(/\D/g, "");
}

function findRowValue(row: Record<string, any>, candidates: string[]): any {
  const normCandidates = candidates.map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [key, value] of Object.entries(row)) {
    const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normCandidates.includes(normKey)) {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return value;
      }
    }
  }
  return "";
}

export interface ValidatedGuest {
  rowNumber: number;
  name: string;
  whatsappNumber: string | null;
  category: string;
  isUpdate?: boolean;
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

export function validateGuestImport(
  rawRows: Array<Record<string, any>>,
  existingGuests: GuestData[] = []
): GuestValidationResult {
  const validGuests: ValidatedGuest[] = [];
  const invalidRows: InvalidGuestRow[] = [];

  const seenNameIndices = new Set<string>();
  const seenPhoneIndices = new Set<string>();

  const existingNameMap = new Map<string, GuestData>();
  const existingPhoneMap = new Map<string, GuestData>();

  for (const g of existingGuests) {
    if (g.name) {
      existingNameMap.set(normalizeNameKey(g.name), g);
    }
    if (g.whatsappNumber) {
      existingPhoneMap.set(normalizePhoneKey(g.whatsappNumber), g);
    }
  }

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2;

    const rawName = findRowValue(row, [
      "namatamu",
      "nama_tamu",
      "nama tamu",
      "nama",
      "namalengkap",
      "name",
      "guestname",
      "guest_name",
      "penerima",
      "tamu",
      "tamuundangan",
    ]);

    const rawPhone = findRowValue(row, [
      "nomorwhatsapp",
      "nomor_whatsapp",
      "nomor whatsapp",
      "nomorwa",
      "nomor_wa",
      "nomor wa",
      "nowa",
      "no_wa",
      "no wa",
      "whatsapp",
      "wa",
      "kontakwhatsapp",
      "kontak wa",
      "kontak_wa",
      "kontak",
      "nokontak",
      "nomorkontak",
      "nohp",
      "no_hp",
      "no hp",
      "nomorhp",
      "nomor_hp",
      "nomor hp",
      "handphone",
      "phone",
      "phonenumber",
      "phone_number",
      "mobile",
      "cell",
      "telepon",
      "notelepon",
      "nomortelepon",
      "telp",
      "notelp",
      "nomortelp",
      "hp",
    ]);

    const rawCategory =
      findRowValue(row, [
        "kategori",
        "category",
        "kelompok",
        "grup",
        "group",
        "sesi",
        "relasi",
      ]) || "Reguler";

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

    const isExisting = existingNameMap.has(nameBindex);
    seenNameIndices.add(nameBindex);

    validGuests.push({
      rowNumber,
      name: cleanName,
      whatsappNumber: normalizedPhone,
      category: cleanCategory,
      isUpdate: isExisting,
    });
  });

  return {
    totalRows: rawRows.length,
    validGuests,
    invalidRows,
  };
}
