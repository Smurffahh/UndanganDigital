import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getRsvpWishes, deleteRsvpWish } from "@/lib/db/store";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const wishes = await getRsvpWishes();
    return NextResponse.json({ success: true, data: wishes }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat daftar ucapan" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID ucapan diperlukan" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const id = parseInt(idParam, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: "ID ucapan tidak valid" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await deleteRsvpWish(id);
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true, message: "Ucapan berhasil dihapus" }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to delete wish:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus ucapan" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
