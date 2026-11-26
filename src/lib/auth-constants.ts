export const SESSION_COOKIE_NAME = "wedding_admin_session";

const DEV_FALLBACK_SESSION_SECRET = "dev_only_session_secret_do_not_use_in_prod_32b";

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters in production.");
  }
  return secret || DEV_FALLBACK_SESSION_SECRET;
}
