import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN } from "./auth-constants";

export { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN };

export interface SessionUser {
  userId: number;
  username: string;
  role: "admin" | "parent";
  displayName: string;
  guestScope: string;
  tokenVersion: number;
  waTemplate?: string;
}

export interface SessionPayload extends SessionUser {
  exp: number;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    if (derivedKey.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    ...user,
    tokenVersion: typeof user.tokenVersion === "number" ? user.tokenVersion : 1,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET_TOKEN)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET_TOKEN)
      .update(payloadB64)
      .digest("base64url");

    const bufActual = Buffer.from(signature);
    const bufExpected = Buffer.from(expectedSig);
    if (bufActual.length !== bufExpected.length) return null;
    if (!crypto.timingSafeEqual(bufActual, bufExpected)) return null;

    const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as SessionPayload;

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    if (!payload.role || !["admin", "parent"].includes(payload.role)) {
      return null;
    }

    if (typeof payload.tokenVersion !== "number" || payload.tokenVersion < 1) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
