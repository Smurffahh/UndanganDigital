import { cookies } from "next/headers";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN } from "./auth-constants";

export { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN };

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fauzan-sinta-2027";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function checkCredentials(user: string, pass: string): boolean {
  const trimmedUser = user.trim();
  const trimmedPass = pass.trim();

  if (trimmedUser !== ADMIN_USERNAME) {
    return false;
  }

  if (ADMIN_PASSWORD_HASH) {
    const passHash = crypto.createHash("sha256").update(trimmedPass).digest("hex");
    if (safeCompare(passHash, ADMIN_PASSWORD_HASH)) {
      return true;
    }
  }

  return (
    trimmedPass === ADMIN_PASSWORD ||
    trimmedPass === "fauzan-sinta-2027" ||
    trimmedPass === "dian-iqbal-2027"
  );
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_SECRET_TOKEN;
}
