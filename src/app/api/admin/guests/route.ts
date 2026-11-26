import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";
import { z } from "zod";

export const dynamic = "force-dynamic";

const cleanText = (v: string) => v.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();

const guestSchema = z
  .object({
    name: z.string().transform(cleanText).pipe(z.string().min(1, "Nama tamu wajib diisi").max(100)),
    whatsappNumber: z.string().max(32).optional().nullable(),
    category: z.string().max(50).optional().default("Reguler"),
    ownerScope: z.enum(["couple", "parent"]).optional(),
  })
  .strict();

const updateGuestSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    name: z.string().transform(cleanText).pipe(z.string().min(1).max(100)).optional(),
    whatsappNumber: z.string().max(32).optional().nullable(),
    category: z.string().max(50).optional(),
    waSentStatus: z.boolean().optional(),
    waSentAt: z.string().max(64).nullable().optional(),
  })
  .strict();

const bulkUpdateSchema = z
  .object({
    ids: z.array(z.coerce.number().int().positive()).min(1).max(1000),
    waSentStatus: z.boolean(),
    waSentAt: z.string().max(64).nullable().optional(),
  })
  .strict();

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const { searchParams } = new URL(request.url);
    const requestedScope = searchParams.get("scope");

    const effectiveScope =
      session.role === "parent"
        ? session.guestScope
        : requestedScope === "couple" || requestedScope === "parent"
        ? requestedScope
        : "all";

    const guests = await getGuests(effectiveScope);
    return NextResponse.json({ success: true, data: guests }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat daftar tamu" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const body = await request.json();
    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
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

    revalidatePath("/");
    revalidatePath("/dashboard");

    return NextResponse.json({ success: true, data: newGuest }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambahkan tamu" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const body = await request.json();

    if (Array.isArray(body.ids)) {
      const parsedBulk = bulkUpdateSchema.safeParse(body);
      if (!parsedBulk.success) {
        return NextResponse.json(
          { success: false, error: parsedBulk.error.issues[0]?.message || "Format data massal tidak valid" },
          { status: 400, headers: NO_CACHE_HEADERS }
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
          { status: 403, headers: NO_CACHE_HEADERS }
        );
      }

      revalidatePath("/");
      revalidatePath("/dashboard");
      return NextResponse.json({ success: true, count }, { headers: NO_CACHE_HEADERS });
    }

    const parsed = updateGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
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
          { status: 403, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json({ success: false, error: "Tamu tidak ditemukan" }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memperbarui status tamu" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    const idParam = searchParams.get("id");
    const expectedScope = session.role === "parent" ? session.guestScope : undefined;

    if (idsParam) {
      const idList = idsParam
        .split(",")
        .slice(0, 1000)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isInteger(n) && n > 0);
      if (idList.length === 0) {
        return NextResponse.json({ success: false, error: "Daftar ID tamu tidak valid" }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      const count = await bulkDeleteGuests(idList, expectedScope);
      if (session.role === "parent" && count !== idList.length) {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403, headers: NO_CACHE_HEADERS }
        );
      }
      revalidatePath("/");
      revalidatePath("/dashboard");
      return NextResponse.json({ success: true, message: `${count} tamu berhasil dihapus`, count }, { headers: NO_CACHE_HEADERS });
    }

    let bodyIds: number[] | null = null;
    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        bodyIds = body.ids.map((n: unknown) => Number(n)).filter((n: number) => !isNaN(n) && n > 0);
      }
    } catch {}

    if (bodyIds && bodyIds.length > 0) {
      const cappedIds = bodyIds.slice(0, 1000);
      const count = await bulkDeleteGuests(cappedIds, expectedScope);
      if (session.role === "parent" && count !== cappedIds.length) {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403, headers: NO_CACHE_HEADERS }
        );
      }
      revalidatePath("/");
      revalidatePath("/dashboard");
      return NextResponse.json({ success: true, message: `${count} tamu berhasil dihapus`, count }, { headers: NO_CACHE_HEADERS });
    }

    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID tamu diperlukan" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const idNum = parseInt(idParam, 10);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ success: false, error: "ID tamu tidak valid" }, { status: 400, headers: NO_CACHE_HEADERS });
    }
    const deleted = await deleteGuest(idNum, expectedScope);
    if (!deleted) {
      if (session.role === "parent") {
        return NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Akses ditolak. Anda tidak memiliki izin untuk menghapus data tamu ini.",
          },
          { status: 403, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json({ success: false, error: "Tamu tidak ditemukan" }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menghapus tamu" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
