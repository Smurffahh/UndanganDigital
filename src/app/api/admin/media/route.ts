import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { requireSession } from "@/lib/auth";
import {
  getGalleryPhotos,
  createGalleryPhoto,
  deleteGalleryPhoto,
  getWeddingSettings,
  updateWeddingSettings,
} from "@/lib/db/store";

const ALLOWED_IMAGE_MIMES = ["image/webp", "image/jpeg", "image/png"];
const ALLOWED_AUDIO_MIMES = ["audio/mpeg", "audio/wav", "audio/mp4"];
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_PREFIXES = ["gallery", "couple", "audio"] as const;

// In-memory rate limiter: max 60 requests per 60s per client IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 60) {
    return false;
  }
  entry.count++;
  return true;
}

function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  // MP3: ID3 header or frame sync 0xFF 0xFB/F3/F2
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
  ) {
    return "audio/mpeg";
  }

  // WAV: RIFF (bytes 0-3) + WAVE (bytes 8-11)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x41 &&
    buffer[10] === 0x56 &&
    buffer[11] === 0x45
  ) {
    return "audio/wav";
  }

  // MP4 / M4A: ftyp at offset 4
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return "audio/mp4";
  }

  return null;
}

function sanitizeFilename(filename: string): string {
  const basename = filename.replace(/^.*[\\/]/, "");
  const clean = basename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return clean.replace(/^\.+/, "") || "upload";
}

function isValidBlobUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403 }
    );
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
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403 }
    );
  }

  const clientIp = request.headers.get("x-forwarded-for") || "local";
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429 }
    );
  }

  const contentType = request.headers.get("content-type") || "";

  // Handler A: Multipart Form Data (Direct File Upload to Vercel Blob)
  if (contentType.includes("multipart/form-data")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Vercel Blob storage tidak terkonfigurasi (BLOB_READ_WRITE_TOKEN hilang)" },
        { status: 503 }
      );
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
      }

      const rawPrefix = (formData.get("prefix") as string) || "gallery";
      const prefix = ALLOWED_PREFIXES.includes(rawPrefix as any) ? rawPrefix : "gallery";

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const detectedMime = detectMimeFromBuffer(buffer);
      if (!detectedMime) {
        return NextResponse.json(
          { success: false, error: "Format file tidak dikenali atau tidak didukung" },
          { status: 415 }
        );
      }

      const isImage = ALLOWED_IMAGE_MIMES.includes(detectedMime);
      const isAudio = ALLOWED_AUDIO_MIMES.includes(detectedMime);

      if (!isImage && !isAudio) {
        return NextResponse.json(
          { success: false, error: `Tipe file "${detectedMime}" tidak diizinkan` },
          { status: 422 }
        );
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_AUDIO_SIZE_BYTES;
      if (buffer.length > maxSize) {
        return NextResponse.json(
          { success: false, error: `Ukuran file melebihi batas maksimal ${maxSize / (1024 * 1024)} MB` },
          { status: 413 }
        );
      }

      const safeName = sanitizeFilename(file.name);
      const pathname = `${prefix}/${safeName}`;

      const blob = await put(pathname, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: detectedMime,
        token,
      });

      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
        },
      }, { status: 201 });
    } catch (err: unknown) {
      console.error("Vercel Blob upload failed:", err);
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah file ke Vercel Blob" },
        { status: 500 }
      );
    }
  }

  // Handler B: JSON Payload (Gallery Photo Creation or Base64 Conversion to Blob)
  try {
    const body = await request.json();
    if (!body.imageUrl) {
      return NextResponse.json({ success: false, error: "URL gambar wajib diisi" }, { status: 400 });
    }

    let finalImageUrl = body.imageUrl.trim();

    // Auto-convert Base64 Data URL to Vercel Blob if token is available
    if (finalImageUrl.startsWith("data:") && process.env.BLOB_READ_WRITE_TOKEN) {
      const match = finalImageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (match) {
        const declaredMime = match[1].toLowerCase();
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        const detectedMime = detectMimeFromBuffer(buffer) || declaredMime;

        if (ALLOWED_IMAGE_MIMES.includes(detectedMime) && buffer.length <= MAX_IMAGE_SIZE_BYTES) {
          const ext = detectedMime === "image/png" ? "png" : detectedMime === "image/webp" ? "webp" : "jpg";
          const blob = await put(`gallery/photo.${ext}`, buffer, {
            access: "public",
            addRandomSuffix: true,
            contentType: detectedMime,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          finalImageUrl = blob.url;
        }
      }
    }

    const newPhoto = await createGalleryPhoto({
      imageUrl: finalImageUrl,
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
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updatesToApply: Record<string, any> = {};

    if (body.mainPhotos && typeof body.mainPhotos === "object") {
      for (const [key, val] of Object.entries(body.mainPhotos)) {
        if (typeof val === "string" && val.trim()) {
          let finalVal = val.trim();
          // Auto-convert Base64 Data URL to Vercel Blob if token is available
          if (finalVal.startsWith("data:") && process.env.BLOB_READ_WRITE_TOKEN) {
            const match = finalVal.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
            if (match) {
              const declaredMime = match[1].toLowerCase();
              const base64Data = match[2];
              const buffer = Buffer.from(base64Data, "base64");
              const detectedMime = detectMimeFromBuffer(buffer) || declaredMime;

              if (ALLOWED_IMAGE_MIMES.includes(detectedMime) && buffer.length <= MAX_IMAGE_SIZE_BYTES) {
                const ext = detectedMime === "image/png" ? "png" : detectedMime === "image/webp" ? "webp" : "jpg";
                const blob = await put(`couple/${key}.${ext}`, buffer, {
                  access: "public",
                  addRandomSuffix: true,
                  contentType: detectedMime,
                  token: process.env.BLOB_READ_WRITE_TOKEN,
                });
                finalVal = blob.url;
              }
            }
          }
          updatesToApply[key] = finalVal;
        } else {
          updatesToApply[key] = val;
        }
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
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403 }
    );
  }

  const clientIp = request.headers.get("x-forwarded-for") || "local";
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const blobUrlParam = searchParams.get("blobUrl");

    // Protection: Delete by direct Blob URL
    if (blobUrlParam) {
      if (!isValidBlobUrl(blobUrlParam)) {
        return NextResponse.json(
          { success: false, error: "URL blob tidak sah atau berada di luar domain Vercel Blob" },
          { status: 400 }
        );
      }

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        await del(blobUrlParam, { token: process.env.BLOB_READ_WRITE_TOKEN });
      }
      return NextResponse.json({ success: true, message: "Blob berhasil dihapus" });
    }

    // Delete by Gallery Photo ID
    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID foto atau blobUrl diperlukan" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    const photos = await getGalleryPhotos();
    const target = photos.find((p) => p.id === id);

    if (target && target.imageUrl && isValidBlobUrl(target.imageUrl) && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(target.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (e) {
        console.warn("Could not delete underlying blob:", e);
      }
    }

    await deleteGalleryPhoto(id);
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" });
  } catch (err) {
    console.error("Failed to delete media:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus foto" }, { status: 500 });
  }
}
