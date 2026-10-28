import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials, setAdminSession, clearAdminSession, isAuthenticated } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format login tidak valid" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const isValid = checkCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Username atau kata sandi tidak sesuai" },
        { status: 401 }
      );
    }

    await setAdminSession();
    return NextResponse.json({ success: true, message: "Login berhasil" });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Logout berhasil" });
}
