import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getGuests, createGuest, updateGuest, deleteGuest } from "@/lib/db/store";
import { z } from "zod";

const guestSchema = z
  .object({
    name: z.string().trim().min(1, "Nama tamu wajib diisi").max(100),
    whatsappNumber: z.string().optional().nullable(),
    category: z.string().optional().default("Reguler"),
  })
  .strict();

const updateGuestSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional(),
    whatsappNumber: z.string().optional().nullable(),
    category: z.string().optional(),
    waSentStatus: z.boolean().optional(),
    waSentAt: z.string().nullable().optional(),
  })
  .strict();

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
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambahkan tamu" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400 }
      );
    }

    const { id, waSentStatus, waSentAt, name, whatsappNumber, category } = parsed.data;

    const updated = await updateGuest(id, {
      waSentStatus: waSentStatus !== undefined ? waSentStatus : undefined,
      waSentAt: waSentAt !== undefined ? waSentAt : (waSentStatus ? new Date().toISOString() : null),
      name,
      whatsappNumber,
      category,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
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
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
