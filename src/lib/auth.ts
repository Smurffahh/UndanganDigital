import { cookies } from "next/headers";
import crypto from "crypto";
import {
  SESSION_COOKIE_NAME,
  SESSION_SECRET_TOKEN,
  SessionUser,
  SessionPayload,
  createSessionToken,
  verifySessionToken,
  verifyPassword,
} from "./session";
import { getDashboardUserByUsername, getDashboardUserById } from "./db/store";

export {
  SESSION_COOKIE_NAME,
  SESSION_SECRET_TOKEN,
  createSessionToken,
  verifySessionToken,
};
export type { SessionUser, SessionPayload };

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
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

const loginAttemptsMap = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(identifier: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginAttemptsMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    return { allowed: true };
  }
  if (entry.count >= 5) {
    const waitSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }
  return { allowed: true };
}

export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const entry = loginAttemptsMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    loginAttemptsMap.set(identifier, { count: 1, resetAt: now + 60000 });
  } else {
    entry.count += 1;
  }
}

export function resetLoginAttempts(identifier: string): void {
  loginAttemptsMap.delete(identifier);
}

export function checkCredentials(user: string, pass: string): boolean {
  const trimmedUser = user.trim().toLowerCase();
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

  if (ADMIN_PASSWORD && safeCompare(trimmedPass, ADMIN_PASSWORD)) {
    return true;
  }

  return false;
}

export async function authenticateUser(
  user: string,
  pass: string
): Promise<SessionUser | null> {
  const trimmedUser = user.trim().toLowerCase();
  const trimmedPass = pass.trim();

  try {
    const dbUser = await getDashboardUserByUsername(trimmedUser);
    if (dbUser && dbUser.isActive) {
      const isValid = verifyPassword(trimmedPass, dbUser.passwordHash);
      if (isValid) {
        return {
          userId: dbUser.id,
          username: dbUser.username,
          role: dbUser.role as "admin" | "parent",
          displayName: dbUser.displayName,
          guestScope: dbUser.guestScope,
          tokenVersion: dbUser.tokenVersion || 1,
          waTemplate: dbUser.waTemplate || undefined,
        };
      }
    }
  } catch (err) {
    console.warn("DB user authentication check warning:", err);
  }

  if (checkCredentials(user, pass)) {
    return {
      userId: 1,
      username: "admin",
      role: "admin",
      displayName: "Mempelai (Admin)",
      guestScope: "couple",
      tokenVersion: 1,
    };
  }

  return null;
}

export async function setSessionCookie(user: SessionUser) {
  const token = createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setAdminSession() {
  await setSessionCookie({
    userId: 1,
    username: "admin",
    role: "admin",
    displayName: "Mempelai (Admin)",
    guestScope: "couple",
    tokenVersion: 1,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function clearAdminSession() {
  await clearSessionCookie();
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(sessionCookie);
  if (!session) return null;

  try {
    const dbUser = await getDashboardUserById(session.userId);
    if (!dbUser) {
      if (
        session.userId === 1 &&
        session.role === "admin" &&
        Boolean(ADMIN_USERNAME) &&
        session.username.toLowerCase() === ADMIN_USERNAME
      ) {
        return session;
      }
      return null;
    }
    if (!dbUser.isActive) return null;
    if (dbUser.tokenVersion !== session.tokenVersion) return null;
  } catch (err) {
    console.warn("DB user session validation error:", err);
    if (
      session.userId === 1 &&
      session.role === "admin" &&
      Boolean(ADMIN_USERNAME) &&
      session.username.toLowerCase() === ADMIN_USERNAME
    ) {
      return session;
    }
    return null;
  }

  return session;
}

export async function requireSession(): Promise<SessionPayload | null> {
  return getServerSession();
}

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return session !== null;
}
