import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { z } from "zod";
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
  hasBlockedFileExtension,
} from "@/lib/fileSecurity";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_PREFIXES = ["gallery", "couple", "audio"] as const;
const MAX_RATE_LIMIT_ENTRIES = 1000;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }
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

const safeMediaUrl = z
  .string()
  .max(7_000_000)
  .refine(isValidUrlOrLocalPath, { message: "Format URL media tidak valid atau tidak aman" })
  .transform((v) => normalizeUrlOrPath(v, "asset"));

const addGalleryPhotoSchema = z
  .object({
    imageUrl: safeMediaUrl.refine((v) => v.length > 0, { message: "URL gambar wajib diisi" }),
    caption: z.string().max(300).optional().default(""),
    aspectRatio: z.enum(["3/4", "4/5", "1/1", "16/9", "square"]).optional().default("3/4"),
    sortOrder: z.coerce.number().int().min(0).max(10000).optional().default(99),
  })
  .strict();

const updateMediaSchema = z
  .object({
    mainPhotos: z
      .object({
        coverPhotoUrl: safeMediaUrl.optional(),
        heroPhotoUrl: safeMediaUrl.optional(),
        bridePhotoUrl: safeMediaUrl.optional(),
        groomPhotoUrl: safeMediaUrl.optional(),
        qrisImageUrl: safeMediaUrl.optional(),
      })
      .strict()
      .optional(),
    isGalleryEnabled: z.boolean().optional(),
    coupleVisualMode: z.enum(["photo", "svg"]).optional(),
    svgCharacterPreset: z
      .enum(["javanese-royal", "modern-editorial", "islamic-grace", "casual-botanical"])
      .optional(),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const [gallery, settings] = await Promise.all([getGalleryPhotos(), getWeddingSettings()]);
    return NextResponse.json(
      {
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
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat data media" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429, headers: NO_CACHE_HEADERS }
    );
  }

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Penyimpanan media tidak terkonfigurasi" },
        { status: 503, headers: NO_CACHE_HEADERS }
      );
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400, headers: NO_CACHE_HEADERS });
      }

      const rawPrefix = (formData.get("prefix") as string) || "gallery";
      const prefix = ALLOWED_PREFIXES.includes(rawPrefix as (typeof ALLOWED_PREFIXES)[number])
        ? rawPrefix
        : "gallery";

      const blockedExt = hasBlockedFileExtension(file.name);
      if (blockedExt) {
        return NextResponse.json(
          { success: false, error: `Ekstensi file ".${blockedExt}" dilarang demi keamanan sistem.` },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const category = prefix === "audio" ? "audio" : "image";
      const maxSize = category === "image" ? MAX_IMAGE_SIZE_BYTES : MAX_AUDIO_SIZE_BYTES;
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: `Ukuran file melebihi batas maksimal ${maxSize / (1024 * 1024)} MB` },
          { status: 413, headers: NO_CACHE_HEADERS }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length > maxSize) {
        return NextResponse.json(
          { success: false, error: `Ukuran file melebihi batas maksimal ${maxSize / (1024 * 1024)} MB` },
          { status: 413, headers: NO_CACHE_HEADERS }
        );
      }

      const magicResult = validateFileMagicBytes(buffer, category);
      if (!magicResult.valid || !magicResult.detectedType) {
        return NextResponse.json(
          { success: false, error: magicResult.error || "Format biner file tidak valid." },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const scanResult = scanFileForMaliciousPayload(buffer);
      if (!scanResult.safe) {
        return NextResponse.json(
          { success: false, error: scanResult.reason || "File ditolak karena memuat konten mencurigakan." },
          { status: 400, headers: NO_CACHE_HEADERS }
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

      return NextResponse.json(
        {
          success: true,
          data: {
            url: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType,
          },
        },
        { status: 201, headers: NO_CACHE_HEADERS }
      );
    } catch (err: unknown) {
      console.error("Vercel Blob upload failed:", err);
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah file ke penyimpanan media" },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }
  }

  try {
    const body = await request.json();
    const parsed = addGalleryPhotoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format data foto galeri tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    let finalImageUrl = parsed.data.imageUrl;

    if (finalImageUrl.startsWith("data:") && process.env.BLOB_READ_WRITE_TOKEN) {
      const match = finalImageUrl.match(/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,(.+)$/i);
      if (match) {
        const buffer = Buffer.from(match[1], "base64");
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
      caption: parsed.data.caption,
      aspectRatio: parsed.data.aspectRatio,
      sortOrder: parsed.data.sortOrder,
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, data: newPhoto }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to add gallery photo:", err);
    return NextResponse.json({ success: false, error: "Gagal menambahkan foto galeri" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateMediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Format pembaruan media tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updatesToApply: Record<string, unknown> = {};

    if (parsed.data.mainPhotos) {
      for (const [key, val] of Object.entries(parsed.data.mainPhotos)) {
        if (val === undefined) continue;
        let finalVal = val.trim();
        if (finalVal.startsWith("data:") && process.env.BLOB_READ_WRITE_TOKEN) {
          const match = finalVal.match(/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,(.+)$/i);
          if (match) {
            const buffer = Buffer.from(match[1], "base64");
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
      }
    }

    if (parsed.data.isGalleryEnabled !== undefined) {
      updatesToApply.isGalleryEnabled = parsed.data.isGalleryEnabled;
    }
    if (parsed.data.coupleVisualMode !== undefined) {
      updatesToApply.coupleVisualMode = parsed.data.coupleVisualMode;
    }
    if (parsed.data.svgCharacterPreset !== undefined) {
      updatesToApply.svgCharacterPreset = parsed.data.svgCharacterPreset;
    }

    if (Object.keys(updatesToApply).length > 0) {
      const updated = await updateWeddingSettings(updatesToApply);
      revalidatePath("/");
      return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to update media:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui media" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const blobUrlParam = searchParams.get("blobUrl");

    if (blobUrlParam) {
      if (!isValidBlobUrl(blobUrlParam)) {
        return NextResponse.json(
          { success: false, error: "URL blob tidak sah atau berada di luar domain Vercel Blob" },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        await del(blobUrlParam, { token: process.env.BLOB_READ_WRITE_TOKEN });
      }
      return NextResponse.json({ success: true, message: "Blob berhasil dihapus" }, { headers: NO_CACHE_HEADERS });
    }

    if (!idParam) {
      return NextResponse.json({ success: false, error: "ID foto atau blobUrl diperlukan" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const id = parseInt(idParam, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: "ID foto tidak valid" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

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
    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to delete media:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus foto" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
