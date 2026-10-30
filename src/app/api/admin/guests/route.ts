import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getGuests, createGuest, updateGuest, deleteGuest } from "@/lib/db/store";
import { z } from "zod";

const guestSchema = z.object({
  name: z.string().trim().min(1, "Nama tamu wajib diisi").max(100),
  whatsappNumber: z.string().optional().nullable(),
  category: z.string().optional().default("Reguler"),
});

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const guests = await getGuests();
  return NextResponse.json({ success: true, data: guests });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400 }
      );
    }

    // Excel strips leading 0 on numeric cells; normalizes 08... and 8... to 628...
    let phone = parsed.data.whatsappNumber ? parsed.data.whatsappNumber.replace(/[^0-9]/g, "") : null;
    if (phone) {
      if (phone.startsWith("0")) {
        phone = "62" + phone.slice(1);
      } else if (phone.startsWith("8")) {
        phone = "62" + phone;
      }
    }

    const newGuest = await createGuest({
      name: parsed.data.name,
      whatsappNumber: phone,
      category: parsed.data.category || "Reguler",
    });

    return NextResponse.json({ success: true, data: newGuest }, { status: 201 });
  } catch (err) {
    console.error("Failed to create guest:", err);
    return NextResponse.json({ success: false, error: "Gagal menambahkan tamu" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "ID tamu diperlukan" }, { status: 400 });
    }

    const updated = await updateGuest(body.id, {
      waSentStatus: body.waSentStatus !== undefined ? body.waSentStatus : undefined,
      waSentAt: body.waSentAt !== undefined ? body.waSentAt : (body.waSentStatus ? new Date().toISOString() : null),
      name: body.name,
      whatsappNumber: body.whatsappNumber,
      category: body.category,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update guest:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui status tamu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID tamu diperlukan" }, { status: 400 });
    }

    await deleteGuest(parseInt(idParam, 10));
    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" });
  } catch (err) {
    console.error("Failed to delete guest:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
