import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { importGuests } from "@/lib/db/store";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.guests)) {
      return NextResponse.json({ success: false, error: "Format data tamu harus berupa array" }, { status: 400 });
    }

    if (body.guests.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Jumlah tamu yang diimpor melebihi batas maksimal 2000 baris per batch" },
        { status: 400 }
      );
    }

    let withPhoneCount = 0;
    let noPhoneCount = 0;

    const sanitizeField = (val: unknown, maxLen = 80): string => {
      if (!val) return "";
      const str = String(val).replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
      // Neutralize spreadsheet formula injection characters
      const neutralized = str.replace(/^[=\+\-@\t\r]+/, "");
      return neutralized.slice(0, maxLen).trim();
    };

    const cleanedGuests = body.guests
      .map((item: { name?: unknown; whatsappNumber?: unknown; category?: unknown }) => {
        const cleanName = sanitizeField(item.name, 80);
        if (!cleanName) return null;
        const normPhone = normalizePhoneNumber(item.whatsappNumber) || null;
        if (normPhone) {
          withPhoneCount++;
        } else {
          noPhoneCount++;
        }
        const cleanCategory = sanitizeField(item.category, 40) || "Reguler";
        return {
          name: cleanName,
          whatsappNumber: normPhone,
          category: cleanCategory,
        };
      })
      .filter((item: unknown): item is { name: string; whatsappNumber: string | null; category: string } => item !== null);

    const ownerScope = session.role === "parent" ? session.guestScope : (body.ownerScope || "couple");
    const createdBy = session.username;

    const count = await importGuests(cleanedGuests, ownerScope, createdBy);
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
