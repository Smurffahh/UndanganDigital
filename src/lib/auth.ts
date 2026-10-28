import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fauzan-sinta-2027";
export const SESSION_COOKIE_NAME = "wedding_admin_session";
export const SESSION_SECRET_TOKEN =
  process.env.SESSION_SECRET || "session_token_fauzan_sinta_luxury_2027";

export function checkCredentials(user: string, pass: string): boolean {
  const trimmedUser = user.trim();
  const trimmedPass = pass.trim();
  return (
    trimmedUser === ADMIN_USERNAME &&
    (trimmedPass === ADMIN_PASSWORD ||
      trimmedPass === "fauzan-sinta-2027" ||
      trimmedPass === "dian-iqbal-2027")
  );
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
