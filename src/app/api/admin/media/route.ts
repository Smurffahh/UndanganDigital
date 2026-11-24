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
import {
  validateFileMagicBytes,
  scanFileForMaliciousPayload,
  sanitizeUploadFileName,
} from "@/lib/fileSecurity";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_PREFIXES = ["gallery", "couple", "audio"] as const;

const BLOCKED_EXTENSIONS = new Set([
  "svg",
  "html",
  "htm",
  "js",
  "mjs",
  "php",
  "exe",
  "sh",
  "bat",
  "cmd",
  "vbs",
  "jsp",
  "asp",
  "aspx",
  "cgi",
]);

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

      const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "" : "";
      if (BLOCKED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `Ekstensi file ".${ext}" dilarang demi keamanan sistem.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 1. Magic bytes verification
      const category = prefix === "audio" ? "audio" : "image";
      const magicResult = validateFileMagicBytes(buffer, category);
      if (!magicResult.valid || !magicResult.detectedType) {
        return NextResponse.json(
          { success: false, error: magicResult.error || "Format biner file tidak valid." },
          { status: 400 }
        );
      }

      // 2. Malicious payload / polyglot scan
      const scanResult = scanFileForMaliciousPayload(buffer);
      if (!scanResult.safe) {
        return NextResponse.json(
          { success: false, error: scanResult.reason || "File ditolak karena memuat konten mencurigakan." },
          { status: 400 }
        );
      }

      const isImage = category === "image";
      const maxSize = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_AUDIO_SIZE_BYTES;
      if (buffer.length > maxSize) {
        return NextResponse.json(
          { success: false, error: `Ukuran file melebihi batas maksimal ${maxSize / (1024 * 1024)} MB` },
          { status: 413 }
        );
      }

      const safeName = sanitizeUploadFileName(file.name);
      const pathname = `${prefix}/${safeName}`;

      const blob = await put(pathname, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: magicResult.detectedType,
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
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        const magic = validateFileMagicBytes(buffer, "image");
        const scan = scanFileForMaliciousPayload(buffer);

        if (magic.valid && magic.detectedType && scan.safe && buffer.length <= MAX_IMAGE_SIZE_BYTES) {
          const ext = magic.detectedType === "image/png" ? "png" : magic.detectedType === "image/webp" ? "webp" : "jpg";
          const blob = await put(`gallery/photo.${ext}`, buffer, {
            access: "public",
            addRandomSuffix: true,
            contentType: magic.detectedType,
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
              const base64Data = match[2];
              const buffer = Buffer.from(base64Data, "base64");
              const magic = validateFileMagicBytes(buffer, "image");
              const scan = scanFileForMaliciousPayload(buffer);

              if (magic.valid && magic.detectedType && scan.safe && buffer.length <= MAX_IMAGE_SIZE_BYTES) {
                const ext = magic.detectedType === "image/png" ? "png" : magic.detectedType === "image/webp" ? "webp" : "jpg";
                const blob = await put(`couple/${key}.${ext}`, buffer, {
                  access: "public",
                  addRandomSuffix: true,
                  contentType: magic.detectedType,
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
