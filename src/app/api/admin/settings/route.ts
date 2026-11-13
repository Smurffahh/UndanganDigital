import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { getWeddingSettings, updateWeddingSettings } from "@/lib/db/store";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";

const safeUrlOrPath = z
  .string()
  .refine(isValidUrlOrLocalPath, { message: "Format URL atau path tidak valid" })
  .transform((val) => normalizeUrlOrPath(val))
  .optional();

const updateSettingsSchema = z.object({
  brideName: z.string().max(100).optional(),
  brideBirth: z.string().max(150).optional(),
  brideBio: z.string().max(1000).optional(),
  bridePhotoUrl: safeUrlOrPath,
  groomName: z.string().max(100).optional(),
  groomBirth: z.string().max(150).optional(),
  groomBio: z.string().max(1000).optional(),
  groomPhotoUrl: safeUrlOrPath,
  coverPhotoUrl: safeUrlOrPath,
  heroPhotoUrl: safeUrlOrPath,
  weddingDateIso: z.string().max(50).optional(),
  eventDateLabel: z.string().max(100).optional(),
  akadTime: z.string().max(100).optional(),
  resepsiTime: z.string().max(100).optional(),
  venueName: z.string().max(255).optional(),
  venueAddress: z.string().max(1000).optional(),
  venuePlusCode: z.string().max(100).optional(),
  googleMapsUrl: safeUrlOrPath,
  googleMapsEmbed: z.string().optional(),
  mapsLatitude: z.string().max(50).optional(),
  mapsLongitude: z.string().max(50).optional(),
  youtubeVideoId: z.string().max(50).optional(),
  musicEnabled: z.boolean().optional(),
  musicTitle: z.string().max(255).optional(),
  musicSourceType: z.enum(["preset", "audio_url", "youtube"]).optional(),
  musicUrl: safeUrlOrPath,
  bankAccounts: z.array(z.any()).optional(),
  ewallets: z.array(z.any()).optional(),
  giftAddress: z.any().optional(),
  qrisImageUrl: safeUrlOrPath,
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
}).passthrough();

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getWeddingSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
        { status: 400 }
      );
    }

    const updated = await updateWeddingSettings(parseResult.data);
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengaturan" }, { status: 500 });
  }
}
