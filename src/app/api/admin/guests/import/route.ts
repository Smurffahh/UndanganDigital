import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { importGuests } from "@/lib/db/store";
import { normalizePhoneNumber } from "@/lib/phoneUtils";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

const importGuestRowSchema = z
  .object({
    rowNumber: z.coerce.number().int().positive().optional(),
    name: z.union([z.string(), z.number()]).optional(),
    whatsappNumber: z.union([z.string(), z.number()]).optional().nullable(),
    category: z.union([z.string(), z.number()]).optional().nullable(),
    isUpdate: z.boolean().optional(),
  })
  .strict();

const importBatchSchema = z
  .object({
    guests: z
      .array(importGuestRowSchema)
      .min(1, "Daftar tamu tidak boleh kosong")
      .max(2000, "Jumlah tamu yang diimpor melebihi batas maksimal 2000 baris per batch"),
    ownerScope: z.enum(["couple", "parent"]).optional(),
  })
  .strict();

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const body = await request.json();
    const parsed = importBatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tamu tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    let withPhoneCount = 0;
    let noPhoneCount = 0;

    const sanitizeField = (val: unknown, maxLen = 80): string => {
      if (!val) return "";
      const str = String(val).replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
      const neutralized = str.replace(/^[=\+\-@\t\r]+/, "");
      return neutralized.slice(0, maxLen).trim();
    };

    const cleanedGuests = parsed.data.guests
      .map((item) => {
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
      .filter((item): item is { name: string; whatsappNumber: string | null; category: string } => item !== null);

    const ownerScope =
      session.role === "parent"
        ? session.guestScope
        : parsed.data.ownerScope || "couple";
    const createdBy = session.username;

    const count = await importGuests(cleanedGuests, ownerScope, createdBy);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        success: true,
        message: `${count} tamu berhasil diproses (${withPhoneCount} dengan nomor WA, ${noPhoneCount} tanpa nomor WA)`,
        count,
        withPhone: withPhoneCount,
        noPhone: noPhoneCount,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error("Bulk import failed:", err);
    return NextResponse.json({ success: false, error: "Gagal mengimpor daftar tamu" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
