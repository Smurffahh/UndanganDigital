import { NextResponse } from "next/server";
import { z } from "zod";
import { getRsvpWishes, createRsvpWish } from "@/lib/db/store";
import { decryptGuestToken } from "@/lib/guest-crypto";

const rsvpInputSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    guestName: z.string().trim().min(1).max(60).optional(),
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

function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export async function GET() {
  try {
    const wishes = await getRsvpWishes();
    return NextResponse.json({ success: true, data: wishes });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data ucapan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rsvpInputSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Format data tidak valid";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    let finalGuestName = parsed.data.guestName || parsed.data.name || "";
    if (parsed.data.guestToken) {
      const decrypted = decryptGuestToken(parsed.data.guestToken);
      if (decrypted.isVerified && decrypted.guestName) {
        finalGuestName = decrypted.guestName;
      }
    }

    if (!finalGuestName || finalGuestName.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Nama tamu wajib diisi" }, { status: 400 });
    }

    const attendanceStatus = parsed.data.attendanceStatus || parsed.data.attend || "Hadir";
    const paxCount = parsed.data.paxCount !== undefined ? parsed.data.paxCount : (parsed.data.guests !== undefined ? parsed.data.guests : 1);

    const sanitizedName = sanitizeString(finalGuestName);
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
