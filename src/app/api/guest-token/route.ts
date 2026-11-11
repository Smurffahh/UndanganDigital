import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPin, createShortGuestToken, sanitizeGuestName } from "@/lib/guest-crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, name, names } = body;

    if (!pin || typeof pin !== "string" || !verifyAdminPin(pin)) {
      return NextResponse.json(
        { error: "PIN otorisasi tidak valid." },
        { status: 401 }
      );
    }

    const rawNames: string[] = [];
    if (typeof name === "string" && name.trim()) {
      rawNames.push(name.trim());
    }
    if (Array.isArray(names)) {
      for (const item of names) {
        if (typeof item === "string" && item.trim()) {
          rawNames.push(item.trim());
        }
      }
    }

    if (rawNames.length === 0) {
      return NextResponse.json(
        { error: "Daftar nama tamu tidak boleh kosong." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.fauzansinta.my.id";
    const tokens: Array<{ name: string; code: string; url: string }> = [];

    for (const rawName of rawNames) {
      const cleanName = sanitizeGuestName(rawName);
      if (!cleanName) continue;
      const res = await createShortGuestToken(cleanName);
      tokens.push({
        name: res.guestName,
        code: res.code,
        url: `${baseUrl}/?to=${res.code}`,
      });
    }

    return NextResponse.json({
      success: true,
      tokens,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses token tamu." },
      { status: 500 }
    );
  }
}
