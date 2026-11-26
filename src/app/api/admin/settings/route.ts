import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { getWeddingSettings, updateWeddingSettings } from "@/lib/db/store";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";
import { FONT_THEME_VALUES } from "@/lib/fontThemes";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

export const dynamic = "force-dynamic";

const safeMapsUrlOrPath = z
  .string()
  .max(2048)
  .refine(isValidUrlOrLocalPath, { message: "Format URL atau path tidak valid" })
  .transform((val) => normalizeUrlOrPath(val))
  .optional();

const safeMediaUrlOrPath = z
  .string()
  .max(7_500_000)
  .refine(isValidUrlOrLocalPath, { message: "Format URL media atau path tidak valid" })
  .transform((val) => normalizeUrlOrPath(val, "asset"))
  .optional();

const safeAudioUrlOrPath = z
  .string()
  .max(15_000_000)
  .refine(isValidUrlOrLocalPath, { message: "Format URL audio atau path tidak valid" })
  .transform((val) => normalizeUrlOrPath(val, "asset"))
  .optional();

const accountItemSchema = z
  .object({
    brand: z.string().max(60),
    type: z.string().max(60),
    number: z.string().max(80),
    holder: z.string().max(120),
  })
  .strict();

const giftAddressSchema = z
  .object({
    receiver: z.string().max(120),
    phone: z.string().max(40),
    address: z.string().max(500),
  })
  .strict();

const updateSettingsSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  brideName: z.string().max(100).optional(),
  brideBio: z.string().max(1000).optional(),
  bridePhotoUrl: safeMediaUrlOrPath,
  groomName: z.string().max(100).optional(),
  groomBio: z.string().max(1000).optional(),
  groomPhotoUrl: safeMediaUrlOrPath,
  coverPhotoUrl: safeMediaUrlOrPath,
  heroPhotoUrl: safeMediaUrlOrPath,
  weddingDateIso: z.string().max(50).optional(),
  eventDateLabel: z.string().max(100).optional(),
  akadTime: z.string().max(100).optional(),
  resepsiTime: z.string().max(100).optional(),
  venueName: z.string().max(255).optional(),
  venueAddress: z.string().max(1000).optional(),
  venuePlusCode: z.string().max(100).optional(),
  googleMapsUrl: safeMapsUrlOrPath,
  googleMapsEmbed: safeMapsUrlOrPath,
  mapsLatitude: z.string().max(50).optional(),
  mapsLongitude: z.string().max(50).optional(),
  youtubeVideoId: z.string().max(50).optional(),
  musicEnabled: z.boolean().optional(),
  musicTitle: z.string().max(255).optional(),
  musicSourceType: z.enum(["preset", "audio_url", "youtube"]).optional(),
  musicUrl: safeAudioUrlOrPath,
  bankAccounts: z.array(accountItemSchema).max(20).optional(),
  ewallets: z.array(accountItemSchema).max(20).optional(),
  giftAddress: giftAddressSchema.optional(),
  qrisImageUrl: safeMediaUrlOrPath,
  loveStoryText: z.string().max(2000).optional(),
  storyHashtag: z.string().max(100).optional(),
  waMessageTemplate: z.string().max(4000).optional(),
  coupleVisualMode: z.enum(["photo", "svg"]).optional(),
  svgCharacterPreset: z
    .enum(["javanese-royal", "modern-editorial", "islamic-grace", "casual-botanical"])
    .optional(),
  isGalleryEnabled: z.boolean().optional(),
  isLoveStoryEnabled: z.boolean().optional(),
  groomChildOrder: z.string().max(100).optional(),
  brideChildOrder: z.string().max(100).optional(),
  groomParents: z.string().max(255).optional(),
  brideParents: z.string().max(255).optional(),
  showTasyakuran: z.boolean().optional(),
  tasyakuranTitle: z.string().max(100).optional(),
  tasyakuranStartDate: z.string().max(50).optional(),
  tasyakuranEndDate: z.string().max(50).optional(),
  tasyakuranTime: z.string().max(100).optional(),
  tasyakuranSameLocation: z.boolean().optional(),
  tasyakuranVenue: z.string().max(255).optional(),
  tasyakuranAddress: z.string().max(1000).optional(),
  tasyakuranMapsUrl: safeMapsUrlOrPath,
  showPublicPreviewWishes: z.boolean().optional(),
  fontTheme: z.enum(FONT_THEME_VALUES).optional(),
  createdAt: z.union([z.string().max(64), z.date()]).optional(),
  updatedAt: z.union([z.string().max(64), z.date()]).optional(),
}).strict();

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }
  const settings = await getWeddingSettings();
  return NextResponse.json({ success: true, data: settings }, { headers: NO_CACHE_HEADERS });
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        code: "FORBIDDEN",
        error: "Akses ditolak. Fitur ini hanya tersedia untuk admin.",
      },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const rawUpdates = await request.json();
    const parseResult = updateSettingsSchema.safeParse(rawUpdates);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi data gagal",
          details: parseResult.error.flatten(),
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = await updateWeddingSettings(parseResult.data);
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/api/admin/settings");
    return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengaturan" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
