import crypto from "crypto";

// 32-byte key derived from secret
const ENCRYPTION_SECRET =
  process.env.ENCRYPTION_KEY || "wedding-encryption-secret-key-32b-fauzan-sinta";
const BLIND_INDEX_SECRET =
  process.env.BLIND_INDEX_SECRET || "wedding-blind-index-salt-secret-fauzan-sinta";

const CIPHER_ALGORITHM = "aes-256-gcm";
const PREFIX = "enc:v1:";

function getDerivedKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Output format: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptField(plainText: string | null | undefined): string {
  if (plainText === null || plainText === undefined || plainText === "") {
    return "";
  }

  // If already encrypted, don't double-encrypt
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

/**
 * Decrypt a ciphertext string back to plaintext.
 * Gracefully returns original value if not encrypted or on corruption.
 */
export function decryptField(cipherText: string | null | undefined): string {
  if (!cipherText || typeof cipherText !== "string") {
    return cipherText || "";
  }

  // If not encrypted with our format, return gracefully as plaintext
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
    // Graceful fallback without crashing
    return cipherText;
  }
}

/**
 * Normalize and generate an HMAC-SHA256 blind index for exact matching / duplicate detection.
 */
export function createBlindIndex(val: string | null | undefined): string {
  if (!val) return "";
  const normalized = String(val).trim().toLowerCase();
  return crypto
    .createHmac("sha256", BLIND_INDEX_SECRET)
    .update(normalized)
    .digest("hex");
}

/**
 * Normalize phone number and generate blind index
 */
export function createPhoneBlindIndex(phone: string | null | undefined): string {
  if (!phone) return "";
  // Strip non-digits
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
