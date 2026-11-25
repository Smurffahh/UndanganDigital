import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getRsvpWishes,
  createRsvpWish,
  getWeddingSettings,
  getGuestById,
} from "@/lib/db/store";
import { verifyRsvpTicket } from "@/lib/rsvpTicket";
import { getServerSession } from "@/lib/auth";

const rsvpInputSchema = z
  .object({
    rsvpTicket: z.string().trim().optional(),
    name: z.string().trim().max(60).optional(),
    guestName: z.string().trim().max(60).optional(),
    guestToken: z.string().trim().optional(),
    attend: z.enum(["Hadir", "Berhalangan", "Masih Ragu"]).optional(),
    attendanceStatus: z.enum(["Hadir", "Berhalangan", "Masih Ragu"]).optional(),
    guests: z.coerce.number().int().min(0).max(10).optional(),
    paxCount: z.coerce.number().int().min(0).max(10).optional(),
    message: z
      .string()
      .trim()
      .min(1, "Ucapan & doa wajib diisi")
      .max(500, "Maksimal 500 karakter"),
  })
  .strict();

const rsvpRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRsvpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rsvpRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rsvpRateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export async function GET(request: Request) {
  try {
    const settings = await getWeddingSettings();
    const isPublicPreviewWishesEnabled = settings.showPublicPreviewWishes !== false;

    if (!isPublicPreviewWishesEnabled) {
      const ticket = request.headers.get("x-rsvp-ticket");
      const hasValidTicket = Boolean(verifyRsvpTicket(ticket));
      const session = await getServerSession();
      const isAdmin = Boolean(session && session.role === "admin");

      if (!hasValidTicket && !isAdmin) {
        return NextResponse.json({ success: true, data: [], restricted: true });
      }
    }

    const wishes = await getRsvpWishes();
    return NextResponse.json({ success: true, data: wishes });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data ucapan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";
    if (!checkRsvpRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak permintaan ucapan. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = rsvpInputSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Format data tidak valid";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const rawTicket = parsed.data.rsvpTicket || request.headers.get("x-rsvp-ticket");
    const ticketData = rawTicket ? verifyRsvpTicket(rawTicket) : null;
    if (!ticketData) {
      return NextResponse.json(
        {
          success: false,
          error: "Konfirmasi kehadiran dan ucapan hanya dapat dikirim melalui tautan undangan pribadi yang valid.",
        },
        { status: 403 }
      );
    }

    const dbGuest = await getGuestById(ticketData.guestId);
    if (!dbGuest) {
      return NextResponse.json(
        {
          success: false,
          error: "Konfirmasi kehadiran dan ucapan hanya dapat dikirim melalui tautan undangan pribadi yang valid.",
        },
        { status: 403 }
      );
    }

    const attendanceStatus = parsed.data.attendanceStatus || parsed.data.attend || "Hadir";
    const paxCount =
      parsed.data.paxCount !== undefined
        ? parsed.data.paxCount
        : parsed.data.guests !== undefined
        ? parsed.data.guests
        : 1;

    const sanitizedName = sanitizeString(dbGuest.name);
    const sanitizedMessage = sanitizeString(parsed.data.message);

    const newWish = await createRsvpWish({
      guestName: sanitizedName,
      attendanceStatus,
      paxCount: attendanceStatus === "Hadir" ? paxCount : 0,
      message: sanitizedMessage,
    });

    return NextResponse.json({ success: true, data: newWish }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
