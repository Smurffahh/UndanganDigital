import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { importGuests } from "@/lib/db/store";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.guests)) {
      return NextResponse.json({ success: false, error: "Format data tamu harus berupa array" }, { status: 400 });
    }

    const cleanedGuests = body.guests
      .map((item: { name?: string; whatsappNumber?: string; category?: string }) => {
        if (!item.name || !item.name.trim()) return null;
        let phone = item.whatsappNumber ? String(item.whatsappNumber).replace(/[^0-9]/g, "") : null;
        if (phone) {
          if (phone.startsWith("0")) phone = "62" + phone.slice(1);
          else if (phone.startsWith("8")) phone = "62" + phone;
        }
        return {
          name: item.name.trim(),
          whatsappNumber: phone,
          category: item.category || "Reguler",
        };
      })
      .filter((item: unknown): item is { name: string; whatsappNumber: string | null; category: string } => item !== null);

    const count = await importGuests(cleanedGuests);
    return NextResponse.json({
      success: true,
      message: `${count} kontak tamu berhasil diimpor`,
      count,
    });
  } catch (err) {
    console.error("Bulk import failed:", err);
    return NextResponse.json({ success: false, error: "Gagal mengimpor daftar tamu" }, { status: 500 });
  }
}
