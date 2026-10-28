import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getRsvpWishes, deleteRsvpWish } from "@/lib/db/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const wishes = await getRsvpWishes();
  return NextResponse.json({ success: true, data: wishes });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID ucapan diperlukan" }, { status: 400 });
    }

    await deleteRsvpWish(parseInt(idParam, 10));
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Ucapan berhasil dihapus" });
  } catch (err) {
    console.error("Failed to delete wish:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus ucapan" }, { status: 500 });
  }
}
