import crypto from "crypto";
import { SESSION_SECRET_TOKEN } from "./session";

interface RsvpTicketPayload {
  gid: number;
  name: string;
  exp: number;
}

const TICKET_DOMAIN_SEPARATOR = "rsvp-ticket-v1:";
const TICKET_TTL_MS = 24 * 60 * 60 * 1000;

export function createRsvpTicket({
  guestId,
  guestName,
}: {
  guestId: number;
  guestName: string;
}): string {
  const payload: RsvpTicketPayload = {
    gid: guestId,
    name: guestName.trim(),
    exp: Date.now() + TICKET_TTL_MS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET_TOKEN)
    .update(`${TICKET_DOMAIN_SEPARATOR}${payloadB64}`)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyRsvpTicket(
  token: string | null | undefined
): { guestId: number; guestName: string } | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET_TOKEN)
      .update(`${TICKET_DOMAIN_SEPARATOR}${payloadB64}`)
      .digest("base64url");

    const bufActual = Buffer.from(signature);
    const bufExpected = Buffer.from(expectedSig);
    if (bufActual.length !== bufExpected.length) return null;
    if (!crypto.timingSafeEqual(bufActual, bufExpected)) return null;

    const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as Partial<RsvpTicketPayload>;

    if (
      typeof payload.gid !== "number" ||
      typeof payload.name !== "string" ||
      typeof payload.exp !== "number" ||
      Date.now() > payload.exp
    ) {
      return null;
    }

    return {
      guestId: payload.gid,
      guestName: payload.name,
    };
  } catch {
    return null;
  }
}
