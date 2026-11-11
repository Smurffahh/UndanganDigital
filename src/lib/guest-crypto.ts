import crypto from "crypto";

if (typeof window !== "undefined") {
  throw new Error("This module can only be executed in a server-side environment.");
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const TOKEN_PREFIX = "v1.";
const DEV_FALLBACK_KEY_HEX = "e4f9b2d88c0147983ea1c5d90396489a2b5e7d189f3458c971624a0d9b4317fe";
const DEV_FALLBACK_PIN = "20270103";

function getSecretKey(): Buffer {
  const envKey = process.env.INVITATION_SECRET_KEY?.trim();
  if (envKey && /^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }

  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY ALERT] INVITATION_SECRET_KEY is missing or invalid in production! Please configure a 64-hex key.");
  }

  return Buffer.from(DEV_FALLBACK_KEY_HEX, "hex");
}

function sanitizeGuestName(rawName: string): string {
  return rawName
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"\\`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export interface DecryptResult {
  guestName: string | null;
  isVerified: boolean;
  validToken: string | null;
}

export function encryptGuestName(guestName: string): string {
  const sanitized = sanitizeGuestName(guestName);
  if (!sanitized) {
    throw new Error("Nama tamu tidak boleh kosong.");
  }

  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  const payload = JSON.stringify({ n: sanitized, v: 1 });
  const ciphertext = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const combined = Buffer.concat([iv, authTag, ciphertext]);
  return `${TOKEN_PREFIX}${combined.toString("base64url")}`;
}

export function decryptGuestToken(token: string | null | undefined): DecryptResult {
  if (!token || typeof token !== "string" || !token.startsWith(TOKEN_PREFIX)) {
    return { guestName: null, isVerified: false, validToken: null };
  }

  try {
    const rawBase64 = token.slice(TOKEN_PREFIX.length).trim();
    if (!rawBase64) {
      return { guestName: null, isVerified: false, validToken: null };
    }

    const buffer = Buffer.from(rawBase64, "base64url");
    if (buffer.length <= IV_LENGTH + AUTH_TAG_LENGTH) {
      return { guestName: null, isVerified: false, validToken: null };
    }

    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const parsed = JSON.parse(decrypted.toString("utf8"));

    if (parsed?.v === 1 && typeof parsed?.n === "string" && parsed.n.trim().length > 0) {
      return {
        guestName: parsed.n.trim(),
        isVerified: true,
        validToken: token,
      };
    }

    return { guestName: null, isVerified: false, validToken: null };
  } catch {
    return { guestName: null, isVerified: false, validToken: null };
  }
}

export function verifyAdminPin(inputPin: string): boolean {
  if (!inputPin || typeof inputPin !== "string") {
    return false;
  }

  const configuredPin =
    process.env.INVITATION_ADMIN_PIN?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : DEV_FALLBACK_PIN);

  if (!configuredPin) {
    return false;
  }

  const inputHash = crypto.createHash("sha256").update(inputPin.trim()).digest();
  const targetHash = crypto.createHash("sha256").update(configuredPin).digest();

  return crypto.timingSafeEqual(inputHash, targetHash);
}
