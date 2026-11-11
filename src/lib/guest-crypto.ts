import crypto from "crypto";
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

if (typeof window !== "undefined") {
  throw new Error("This module can only be executed in a server-side environment.");
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const TOKEN_PREFIX = "v1.";
const DEV_FALLBACK_KEY_HEX = "e4f9b2d88c0147983ea1c5d90396489a2b5e7d189f3458c971624a0d9b4317fe";
const DEV_FALLBACK_PIN = "20270103";

export const SHORT_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const SHORT_CODE_LENGTH = 6;
export const SHORT_CODE_REGEX = /^[2-9A-HJ-NP-Za-km-z]{6}$/;

const shortCodeCache = new Map<string, string>();
let isTableInitialized = false;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "wedding-db.json");

function getLocalTokens(): Record<string, string> {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
      return data.guestTokens || {};
    }
  } catch {}
  return {};
}

function saveLocalToken(code: string, guestName: string) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let data: Record<string, unknown> = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      data = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
    }
    const currentTokens = (data.guestTokens as Record<string, string>) || {};
    currentTokens[code] = guestName;
    data.guestTokens = currentTokens;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {}
}

async function ensureGuestTokensTable() {
  if (isTableInitialized) return;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;

  try {
    const sql = neon(dbUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS guest_tokens (
        code VARCHAR(12) PRIMARY KEY,
        guest_name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    isTableInitialized = true;
  } catch {
  }
}

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

export function sanitizeGuestName(rawName: string): string {
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

export function generateShortCode(guestName: string, attempt = 0): string {
  const key = getSecretKey();
  const normalized = guestName.trim().toLowerCase();
  const message = `${normalized}${attempt > 0 ? `#${attempt}` : ""}`;
  const hmac = crypto.createHmac("sha256", key).update(message).digest();
  let code = "";
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    code += SHORT_CODE_ALPHABET[hmac[i] % SHORT_CODE_ALPHABET.length];
  }
  return code;
}

export async function createShortGuestToken(
  rawGuestName: string
): Promise<{ code: string; guestName: string }> {
  const cleanName = sanitizeGuestName(rawGuestName);
  if (!cleanName) {
    throw new Error("Nama tamu tidak boleh kosong.");
  }

  await ensureGuestTokensTable();

  let attempt = 0;
  let code = "";
  let success = false;
  const dbUrl = process.env.DATABASE_URL;

  while (attempt < 10) {
    code = generateShortCode(cleanName, attempt);

    const cachedName = shortCodeCache.get(code);
    if (cachedName && cachedName.toLowerCase() !== cleanName.toLowerCase()) {
      attempt++;
      continue;
    }

    if (dbUrl) {
      try {
        const sql = neon(dbUrl);
        const existing = await sql`SELECT guest_name FROM guest_tokens WHERE code = ${code} LIMIT 1`;
        if (existing.length > 0) {
          const rowName = existing[0].guest_name as string;
          if (rowName.toLowerCase() !== cleanName.toLowerCase()) {
            attempt++;
            continue;
          }
        }
        await sql`
          INSERT INTO guest_tokens (code, guest_name, created_at)
          VALUES (${code}, ${cleanName}, NOW())
          ON CONFLICT (code) DO UPDATE SET guest_name = EXCLUDED.guest_name
        `;
        success = true;
        break;
      } catch {
      }
    }

    saveLocalToken(code, cleanName);
    success = true;
    break;
  }

  if (!success) {
    code = generateShortCode(cleanName, 0);
  }

  shortCodeCache.set(code, cleanName);
  saveLocalToken(code, cleanName);

  return { code, guestName: cleanName };
}

export async function resolveGuestToken(
  token: string | null | undefined
): Promise<DecryptResult> {
  if (!token || typeof token !== "string") {
    return { guestName: null, isVerified: false, validToken: null };
  }

  const trimmed = token.trim();
  if (!trimmed) {
    return { guestName: null, isVerified: false, validToken: null };
  }

  if (SHORT_CODE_REGEX.test(trimmed)) {
    const cached = shortCodeCache.get(trimmed);
    if (cached) {
      return {
        guestName: cached,
        isVerified: true,
        validToken: trimmed,
      };
    }

    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        await ensureGuestTokensTable();
        const sql = neon(dbUrl);
        const rows = await sql`SELECT guest_name FROM guest_tokens WHERE code = ${trimmed} LIMIT 1`;
        if (rows.length > 0 && rows[0].guest_name) {
          const name = rows[0].guest_name as string;
          shortCodeCache.set(trimmed, name);
          saveLocalToken(trimmed, name);
          return {
            guestName: name,
            isVerified: true,
            validToken: trimmed,
          };
        }
      } catch {
      }
    }

    const localTokens = getLocalTokens();
    if (localTokens[trimmed]) {
      const name = localTokens[trimmed];
      shortCodeCache.set(trimmed, name);
      return {
        guestName: name,
        isVerified: true,
        validToken: trimmed,
      };
    }

    return { guestName: null, isVerified: false, validToken: null };
  }

  if (trimmed.startsWith(TOKEN_PREFIX)) {
    return decryptGuestToken(trimmed);
  }

  return { guestName: null, isVerified: false, validToken: null };
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
