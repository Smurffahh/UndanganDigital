import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/session";
import {
  getDashboardUsers,
  getDashboardUserByUsername,
  createDashboardUser,
  updateDashboardUser,
  deleteDashboardUser,
} from "@/lib/db/store";
import { DEFAULT_COUPLE_WA_TEMPLATE, DEFAULT_PARENT_WA_TEMPLATE } from "@/lib/guestTemplate";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

const createUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username hanya boleh huruf, angka, strip, dan garis bawah"),
    password: z.string().trim().min(8, "Kata sandi minimal 8 karakter").max(128),
    displayName: z.string().trim().min(2, "Nama tampilan minimal 2 karakter").max(100),
    role: z.enum(["admin", "parent"]).default("parent"),
    guestScope: z.enum(["couple", "parent"]).default("parent"),
    waTemplate: z.string().max(4000).optional(),
  })
  .strict();

const updateUserSchema = z
  .object({
    id: z.coerce.number().int().positive("ID pengguna tidak valid"),
    password: z.string().trim().min(8, "Kata sandi minimal 8 karakter").max(128).optional(),
    displayName: z.string().trim().min(2).max(100).optional(),
    role: z.enum(["admin", "parent"]).optional(),
    guestScope: z.enum(["couple", "parent"]).optional(),
    waTemplate: z.string().max(4000).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const users = await getDashboardUsers();
    return NextResponse.json({ success: true, data: users }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar pengguna" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400 }
      );
    }

    const { username, password, displayName, role, guestScope, waTemplate } = parsed.data;

    const existing = await getDashboardUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Nama pengguna "${username}" sudah digunakan.` },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const newUser = await createDashboardUser({
      username,
      passwordHash,
      role,
      displayName,
      guestScope,
      waTemplate: waTemplate || (role === "parent" ? DEFAULT_PARENT_WA_TEMPLATE : DEFAULT_COUPLE_WA_TEMPLATE),
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to create dashboard user:", err);
    return NextResponse.json(
      { success: false, error: "Gagal membuat akun pengguna" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data tidak valid" },
        { status: 400 }
      );
    }

    const { id, password, displayName, role, guestScope, waTemplate, isActive } = parsed.data;

    const users = await getDashboardUsers();
    const target = users.find((u) => u.id === id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    if (target.username === "admin" && isActive === false) {
      return NextResponse.json(
        { success: false, error: "Akun admin utama tidak dapat dinonaktifkan." },
        { status: 400 }
      );
    }

    if (target.role === "admin" && isActive === false) {
      const activeAdmins = users.filter((u) => u.role === "admin" && u.isActive);
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menonaktifkan akun admin aktif terakhir." },
          { status: 400 }
        );
      }
    }

    const updates: Parameters<typeof updateDashboardUser>[1] = {};
    if (password) {
      updates.passwordHash = hashPassword(password);
    }
    if (displayName !== undefined) updates.displayName = displayName;
    if (role !== undefined) updates.role = role;
    if (guestScope !== undefined) updates.guestScope = guestScope;
    if (waTemplate !== undefined) updates.waTemplate = waTemplate;
    if (isActive !== undefined) updates.isActive = isActive;

    const currentTokenVersion = target.tokenVersion || 1;
    if (password || isActive === false) {
      updates.tokenVersion = currentTokenVersion + 1;
    }

    const updated = await updateDashboardUser(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan" }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to update dashboard user:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui akun pengguna" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
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
      return NextResponse.json({ success: false, error: "ID pengguna diperlukan" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ success: false, error: "ID pengguna tidak valid" }, { status: 400 });
    }

    if (id === admin.userId) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk." },
        { status: 400 }
      );
    }

    const users = await getDashboardUsers();
    const target = users.find((u) => u.id === id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    if (target.username === "admin") {
      return NextResponse.json(
        { success: false, error: "Akun admin utama tidak dapat dihapus demi keamanan sistem." },
        { status: 400 }
      );
    }

    await deleteDashboardUser(id);
    return NextResponse.json({ success: true, message: `Akun "${target.displayName}" berhasil dihapus.` }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to delete dashboard user:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus akun pengguna" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
