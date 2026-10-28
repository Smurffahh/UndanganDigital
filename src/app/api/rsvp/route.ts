import { NextResponse } from "next/server";
import { z } from "zod";
import { getRsvpWishes, createRsvpWish } from "@/lib/db/store";

const rsvpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama wajib diisi")
      .max(60, "Nama maksimal 60 karakter"),
    attend: z.enum(["Hadir", "Berhalangan", "Masih Ragu"]),
    guests: z.coerce.number().int().min(1).max(10).default(1),
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
  } catch (error) {
    console.error("Failed to fetch wishes", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data ucapan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Format data tidak valid";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    // Sanitize string to prevent Stored Cross-Site Scripting (XSS)
    const sanitizedName = sanitizeString(parsed.data.name);
    const sanitizedMessage = sanitizeString(parsed.data.message);

    const newWish = await createRsvpWish({
      guestName: sanitizedName,
      attendanceStatus: parsed.data.attend,
      paxCount: parsed.data.guests,
      message: sanitizedMessage,
    });

    return NextResponse.json({ success: true, data: newWish }, { status: 201 });
  } catch (error) {
    console.error("Failed to post RSVP", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
