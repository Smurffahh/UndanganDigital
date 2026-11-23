import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { updateUserWaTemplate, getDashboardUserByUsername } from "@/lib/db/store";
import { DEFAULT_PARENT_WA_TEMPLATE } from "@/lib/guestTemplate";

const templateSchema = z
  .object({
    waTemplate: z.string().max(4000, "Panjang template maksimal 4000 karakter"),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await getDashboardUserByUsername(session.username);
  const waTemplate =
    user?.waTemplate || (session.role === "parent" ? DEFAULT_PARENT_WA_TEMPLATE : "");

  return NextResponse.json({
    success: true,
    data: {
      username: session.username,
      role: session.role,
      waTemplate,
    },
  });
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = templateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format template tidak valid" },
        { status: 400 }
      );
    }

    await updateUserWaTemplate(session.username, parsed.data.waTemplate);

    return NextResponse.json({
      success: true,
      message: "Template WhatsApp berhasil disimpan untuk akun ini.",
    });
  } catch (err) {
    console.error("Failed to update profile WA template:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan template WhatsApp" },
      { status: 500 }
    );
  }
}
