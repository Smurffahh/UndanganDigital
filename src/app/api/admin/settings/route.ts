import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getWeddingSettings, updateWeddingSettings } from "@/lib/db/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getWeddingSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();
    const updated = await updateWeddingSettings(updates);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengaturan" }, { status: 500 });
  }
}
