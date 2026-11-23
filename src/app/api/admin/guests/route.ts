import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  bulkUpdateGuestStatus,
  bulkDeleteGuests,
} from "@/lib/db/store";
import { normalizePhoneNumber } from "@/lib/phoneUtils";
import { z } from "zod";

const guestSchema = z
  .object({
    name: z.string().trim().min(1, "Nama tamu wajib diisi").max(100),
    whatsappNumber: z.string().optional().nullable(),
    category: z.string().optional().default("Reguler"),
    ownerScope: z.string().optional(),
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

const bulkUpdateSchema = z
  .object({
    ids: z.array(z.coerce.number().int().positive()).min(1).max(1000),
    waSentStatus: z.boolean(),
    waSentAt: z.string().nullable().optional(),
  })
  .strict();

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedScope = searchParams.get("scope");

  const effectiveScope =
    session.role === "parent"
      ? session.guestScope
      : requestedScope || "all";

  const guests = await getGuests(effectiveScope);
  return NextResponse.json({ success: true, data: guests });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
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

    const phone = normalizePhoneNumber(parsed.data.whatsappNumber) || null;
    const ownerScope =
      session.role === "parent"
        ? session.guestScope
        : parsed.data.ownerScope?.trim() || "couple";

    const newGuest = await createGuest({
      name: parsed.data.name,
      whatsappNumber: phone,
      category: parsed.data.category || "Reguler",
      ownerScope,
      createdBy: session.username,
    });

    return NextResponse.json({ success: true, data: newGuest }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambahkan tamu" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (Array.isArray(body.ids)) {
      const parsedBulk = bulkUpdateSchema.safeParse(body);
      if (!parsedBulk.success) {
        return NextResponse.json(
          { success: false, error: parsedBulk.error.issues[0]?.message || "Format data massal tidak valid" },
          { status: 400 }
        );
      }

      const expectedScope = session.role === "parent" ? session.guestScope : undefined;
      const count = await bulkUpdateGuestStatus(
        parsedBulk.data.ids,
        parsedBulk.data.waSentStatus,
        parsedBulk.data.waSentAt,
        expectedScope
      );

      if (session.role === "parent" && count !== parsedBulk.data.ids.length) {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk mengubah data tamu yang dipilih.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, count });
    }

    const parsed = updateGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400 }
      );
    }

    const { id, waSentStatus, waSentAt, name, whatsappNumber, category } = parsed.data;
    const phone = whatsappNumber !== undefined ? (normalizePhoneNumber(whatsappNumber) || null) : undefined;
    const expectedScope = session.role === "parent" ? session.guestScope : undefined;

    const updated = await updateGuest(
      id,
      {
        waSentStatus: waSentStatus !== undefined ? waSentStatus : undefined,
        waSentAt: waSentAt !== undefined ? waSentAt : (waSentStatus ? new Date().toISOString() : null),
        name,
        whatsappNumber: phone,
        category,
      },
      expectedScope
    );

    if (!updated) {
      if (session.role === "parent") {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk mengubah data tamu ini.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: false, error: "Tamu tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memperbarui status tamu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    const idParam = searchParams.get("id");
    const expectedScope = session.role === "parent" ? session.guestScope : undefined;

    if (idsParam) {
      const idList = idsParam
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0);
      if (idList.length === 0) {
        return NextResponse.json({ success: false, error: "Daftar ID tamu tidak valid" }, { status: 400 });
      }
      const count = await bulkDeleteGuests(idList, expectedScope);
      if (session.role === "parent" && count !== idList.length) {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, message: `${count} tamu berhasil dihapus`, count });
    }

    let bodyIds: number[] | null = null;
    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        bodyIds = body.ids.map((n: unknown) => Number(n)).filter((n: number) => !isNaN(n) && n > 0);
      }
    } catch {}

    if (bodyIds && bodyIds.length > 0) {
      const count = await bulkDeleteGuests(bodyIds, expectedScope);
      if (session.role === "parent" && count !== bodyIds.length) {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, message: `${count} tamu berhasil dihapus`, count });
    }

    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID tamu diperlukan" }, { status: 400 });
    }

    const idNum = parseInt(idParam, 10);
    const deleted = await deleteGuest(idNum, expectedScope);
    if (!deleted) {
      if (session.role === "parent") {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: false, error: "Tamu tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
