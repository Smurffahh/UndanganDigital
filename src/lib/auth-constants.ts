export const SESSION_COOKIE_NAME = "wedding_admin_session";

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (secret && secret.length > 0) {
    return secret;
  }
  return "session_token_fauzan_sinta_luxury_2027_sec_min32b";
}

export const SESSION_SECRET_TOKEN = getSessionSecret();
