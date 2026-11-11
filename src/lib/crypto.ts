import crypto from "crypto";

const ENCRYPTION_SECRET =
  process.env.ENCRYPTION_KEY || "fauzan-sinta-wedding-secure-encryption-key-2027-secret";
const BLIND_INDEX_SECRET =
  process.env.BLIND_INDEX_SECRET || "wedding-blind-index-salt-secret-fauzan-sinta";

const CIPHER_ALGORITHM = "aes-256-gcm";
const PREFIX = "enc:v1:";

function getDerivedKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
}

export function encryptField(plainText: string | null | undefined): string {
  if (plainText === null || plainText === undefined || plainText === "") {
    return "";
  }

  if (typeof plainText === "string" && plainText.startsWith(PREFIX)) {
    return plainText;
  }

  try {
    const iv = crypto.randomBytes(12);
    const key = getDerivedKey();
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);

    const stringVal = typeof plainText === "string" ? plainText : JSON.stringify(plainText);
    const encrypted = Buffer.concat([
      cipher.update(stringVal, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return `${PREFIX}${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    console.error("Encryption error, fallback to plaintext:", error);
    return String(plainText);
  }
}

export function decryptField(cipherText: string | null | undefined): string {
  if (!cipherText || typeof cipherText !== "string") {
    return cipherText || "";
  }

  if (!cipherText.startsWith(PREFIX)) {
    return cipherText;
  }

  try {
    const payload = cipherText.slice(PREFIX.length);
    const parts = payload.split(":");
    if (parts.length !== 3) {
      return cipherText;
    }

    const [ivHex, tagHex, dataHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");
    const encryptedData = Buffer.from(dataHex, "hex");

    const key = getDerivedKey();
    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    return cipherText;
  }
}

// HMAC-SHA256 blind index enables exact-match queries and deduplication without decrypting columns
export function createBlindIndex(val: string | null | undefined): string {
  if (!val) return "";
  const normalized = String(val).trim().toLowerCase();
  return crypto
    .createHmac("sha256", BLIND_INDEX_SECRET)
    .update(normalized)
    .digest("hex");
}

export function createPhoneBlindIndex(phone: string | null | undefined): string {
  if (!phone) return "";
  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("08")) {
    digits = "628" + digits.slice(2);
  } else if (digits.startsWith("8")) {
    digits = "628" + digits.slice(1);
  }
  return crypto
    .createHmac("sha256", BLIND_INDEX_SECRET)
    .update(digits)
    .digest("hex");
}

import { encryptGuestName } from "./guest-crypto";

export interface PlainGuestInput {
  name: string;
  whatsappNumber?: string | null;
  category?: string | null;
  waSentStatus?: boolean;
  waSentAt?: Date | string | null;
}

export function encryptGuestRecord(input: PlainGuestInput) {
  const cleanName = input.name.trim();
  const slugQuery = encryptGuestName(cleanName);
  const cleanPhone = input.whatsappNumber?.trim() || null;
  const category = input.category?.trim() || "Reguler";

  return {
    name: encryptField(cleanName),
    slugQuery,
    whatsappNumber: cleanPhone ? encryptField(cleanPhone) : null,
    category: encryptField(category),
    nameBindex: createBlindIndex(cleanName),
    waBindex: cleanPhone ? createPhoneBlindIndex(cleanPhone) : null,
    waSentStatus: input.waSentStatus ?? false,
    waSentAt: input.waSentAt ? new Date(input.waSentAt) : null,
  };
}

export function decryptGuestRecord<T extends { name: string; whatsappNumber?: string | null; category?: string | null }>(row: T): T {
  return {
    ...row,
    name: decryptField(row.name),
    whatsappNumber: row.whatsappNumber ? decryptField(row.whatsappNumber) : null,
    category: row.category ? decryptField(row.category) : "Reguler",
  };
}

export interface PlainWishInput {
  guestName: string;
  attendanceStatus: string;
  paxCount: number;
  message: string;
  isApproved?: boolean;
}

export function encryptWishRecord(input: PlainWishInput) {
  return {
    guestName: encryptField(input.guestName.trim()),
    attendanceStatus: input.attendanceStatus,
    paxCount: input.paxCount,
    message: encryptField(input.message.trim()),
    isApproved: input.isApproved ?? true,
  };
}

export function decryptWishRecord<T extends { guestName: string; message: string }>(row: T): T {
  return {
    ...row,
    guestName: decryptField(row.guestName),
    message: decryptField(row.message),
  };
}
