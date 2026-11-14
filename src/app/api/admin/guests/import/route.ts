import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { importGuests } from "@/lib/db/store";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.guests)) {
      return NextResponse.json({ success: false, error: "Format data tamu harus berupa array" }, { status: 400 });
    }

    if (body.guests.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Jumlah tamu yang diimpor melebihi batas maksimal 1000 baris per batch" },
        { status: 400 }
      );
    }

    let withPhoneCount = 0;
    let noPhoneCount = 0;

    const cleanedGuests = body.guests
      .map((item: { name?: string; whatsappNumber?: unknown; category?: string }) => {
        if (!item.name || !String(item.name).trim()) return null;
        const normPhone = normalizePhoneNumber(item.whatsappNumber) || null;
        if (normPhone) {
          withPhoneCount++;
        } else {
          noPhoneCount++;
        }
        return {
          name: String(item.name).trim(),
          whatsappNumber: normPhone,
          category: item.category ? String(item.category).trim() : "Reguler",
        };
      })
      .filter((item: unknown): item is { name: string; whatsappNumber: string | null; category: string } => item !== null);

    const count = await importGuests(cleanedGuests);
    return NextResponse.json({
      success: true,
      message: `${count} tamu berhasil diproses (${withPhoneCount} dengan nomor WA, ${noPhoneCount} tanpa nomor WA)`,
      count,
      withPhone: withPhoneCount,
      noPhone: noPhoneCount,
    });
  } catch (err) {
    console.error("Bulk import failed:", err);
    return NextResponse.json({ success: false, error: "Gagal mengimpor daftar tamu" }, { status: 500 });
  }
}
