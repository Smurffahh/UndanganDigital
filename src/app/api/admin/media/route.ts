import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import {
  getGalleryPhotos,
  createGalleryPhoto,
  deleteGalleryPhoto,
  getWeddingSettings,
  updateWeddingSettings,
} from "@/lib/db/store";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BASE64_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateImageInput(input: string): { valid: boolean; error?: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Format gambar tidak valid" };
  }

  const trimmed = input.trim();

  if (trimmed.startsWith("data:")) {
    const match = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return { valid: false, error: "Format data gambar base64 tidak valid" };
    }

    const mime = match[1].toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return {
        valid: false,
        error: `Tipe file "${mime}" tidak diizinkan. Hanya menerima JPG, PNG, atau WebP`,
      };
    }

    const base64Data = match[2];
    const byteSize = (base64Data.length * 3) / 4;
    if (byteSize > MAX_BASE64_SIZE_BYTES) {
      return {
        valid: false,
        error: "Ukuran gambar melebihi batas maksimal 5 MB",
      };
    }

    return { valid: true };
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { valid: false, error: "Protokol URL tidak aman" };
      }
      return { valid: true };
    } catch {
      return { valid: false, error: "URL gambar tidak valid" };
    }
  }

  return {
    valid: false,
    error:
      "Sumber gambar harus berupa URL HTTP/HTTPS atau Data URL (JPEG, PNG, WebP)",
  };
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const [gallery, settings] = await Promise.all([getGalleryPhotos(), getWeddingSettings()]);
  return NextResponse.json({
    success: true,
    data: {
      gallery,
      mainPhotos: {
        coverPhotoUrl: settings.coverPhotoUrl,
        heroPhotoUrl: settings.heroPhotoUrl,
        bridePhotoUrl: settings.bridePhotoUrl,
        groomPhotoUrl: settings.groomPhotoUrl,
        qrisImageUrl: settings.qrisImageUrl,
      },
      isGalleryEnabled: settings.isGalleryEnabled,
      coupleVisualMode: settings.coupleVisualMode,
      svgCharacterPreset: settings.svgCharacterPreset,
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.imageUrl) {
      return NextResponse.json({ success: false, error: "URL gambar wajib diisi" }, { status: 400 });
    }

    const validation = validateImageInput(body.imageUrl);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const newPhoto = await createGalleryPhoto({
      imageUrl: body.imageUrl,
      caption: body.caption || "",
      aspectRatio: body.aspectRatio || "3/4",
      sortOrder: body.sortOrder ?? 99,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, data: newPhoto }, { status: 201 });
  } catch (err) {
    console.error("Failed to add gallery photo:", err);
    return NextResponse.json({ success: false, error: "Gagal menambahkan foto galeri" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatesToApply: Record<string, any> = {};

    if (body.mainPhotos && typeof body.mainPhotos === "object") {
      for (const [key, val] of Object.entries(body.mainPhotos)) {
        if (typeof val === "string" && val.trim()) {
          const valResult = validateImageInput(val);
          if (!valResult.valid) {
            return NextResponse.json(
              { success: false, error: `${key}: ${valResult.error}` },
              { status: 400 }
            );
          }
        }
        updatesToApply[key] = val;
      }
    }

    if (typeof body.isGalleryEnabled === "boolean") {
      updatesToApply.isGalleryEnabled = body.isGalleryEnabled;
    }
    if (body.coupleVisualMode === "photo" || body.coupleVisualMode === "svg") {
      updatesToApply.coupleVisualMode = body.coupleVisualMode;
    }
    if (
      body.svgCharacterPreset &&
      ["javanese-royal", "modern-editorial", "islamic-grace", "casual-botanical"].includes(
        body.svgCharacterPreset
      )
    ) {
      updatesToApply.svgCharacterPreset = body.svgCharacterPreset;
    }

    if (Object.keys(updatesToApply).length > 0) {
      const updated = await updateWeddingSettings(updatesToApply);
      revalidatePath("/");
      return NextResponse.json({ success: true, data: updated });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update media:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID foto diperlukan" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    await deleteGalleryPhoto(id);
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" });
  } catch (err) {
    console.error("Failed to delete gallery photo:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus foto" }, { status: 500 });
  }
}
