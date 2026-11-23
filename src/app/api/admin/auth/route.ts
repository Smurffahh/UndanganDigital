import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticateUser,
  setSessionCookie,
  clearSessionCookie,
  getServerSession,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/auth";

const loginSchema = z
  .object({
    username: z.string().trim().min(1, "Nama pengguna wajib diisi"),
    password: z.string().trim().min(1, "Kata sandi wajib diisi"),
  })
  .strict();

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      username: session.username,
      role: session.role,
      displayName: session.displayName,
      guestScope: session.guestScope,
    },
  });
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format login tidak valid" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const rateLimitKey = `${ip}:${username.toLowerCase()}`;

    const rateLimit = checkLoginRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan gagal. Silakan tunggu ${rateLimit.waitSeconds} detik sebelum mencoba lagi.`,
        },
        { status: 429 }
      );
    }

    const sessionUser = await authenticateUser(username, password);

    if (!sessionUser) {
      recordFailedLogin(rateLimitKey);
      return NextResponse.json(
        { success: false, error: "Nama pengguna atau kata sandi tidak cocok. Periksa kembali." },
        { status: 401 }
      );
    }

    resetLoginAttempts(rateLimitKey);
    await setSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        username: sessionUser.username,
        role: sessionUser.role,
        displayName: sessionUser.displayName,
        guestScope: sessionUser.guestScope,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kendala pada server saat memproses login" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Sesi berhasil diakhiri" });
}
