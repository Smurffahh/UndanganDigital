import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { updateUserWaTemplate, getDashboardUserByUsername } from "@/lib/db/store";
import { DEFAULT_COUPLE_WA_TEMPLATE, DEFAULT_PARENT_WA_TEMPLATE } from "@/lib/guestTemplate";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

const templateSchema = z
  .object({
    waTemplate: z.string().max(4000, "Panjang template maksimal 4000 karakter"),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const user = await getDashboardUserByUsername(session.username);
    const waTemplate =
      user?.waTemplate || (session.role === "parent" ? DEFAULT_PARENT_WA_TEMPLATE : DEFAULT_COUPLE_WA_TEMPLATE);

    return NextResponse.json(
      {
        success: true,
        data: {
          username: session.username,
          role: session.role,
          waTemplate,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat template WhatsApp" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  try {
    const body = await request.json();
    const parsed = templateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format template tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await updateUserWaTemplate(session.username, parsed.data.waTemplate);

    return NextResponse.json(
      {
        success: true,
        message: "Template WhatsApp berhasil disimpan untuk akun ini.",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error("Failed to update profile WA template:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan template WhatsApp" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
