import { getWeddingSettings, getGalleryPhotos, getRsvpWishes } from "@/lib/db/store";
import { InvitationOrchestrator } from "@/components/invitation/InvitationOrchestrator";
import { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvitationPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Extract guest name from query parameters: ?to= or ?nama= or ?tamu=
  const rawParam =
    resolvedParams.to || resolvedParams.nama || resolvedParams.tamu || "";
  const paramStr = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  let guestName = "Tamu Undangan";
  if (paramStr) {
    guestName = decodeURIComponent(paramStr)
      .replace(/[+_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  }

  const [rawSettings, rawGalleryPhotos, rawWishes] = await Promise.all([
    getWeddingSettings(),
    getGalleryPhotos(),
    getRsvpWishes(),
  ]);

  // Ensure settings matches expected shape with defaults
  const settings: typeof DEFAULT_WEDDING_SETTINGS = {
    brideName: rawSettings.brideName || DEFAULT_WEDDING_SETTINGS.brideName,
    brideBirth: rawSettings.brideBirth || DEFAULT_WEDDING_SETTINGS.brideBirth,
    brideBio: rawSettings.brideBio || DEFAULT_WEDDING_SETTINGS.brideBio,
    bridePhotoUrl: rawSettings.bridePhotoUrl || DEFAULT_WEDDING_SETTINGS.bridePhotoUrl,
    groomName: rawSettings.groomName || DEFAULT_WEDDING_SETTINGS.groomName,
    groomBirth: rawSettings.groomBirth || DEFAULT_WEDDING_SETTINGS.groomBirth,
    groomBio: rawSettings.groomBio || DEFAULT_WEDDING_SETTINGS.groomBio,
    groomPhotoUrl: rawSettings.groomPhotoUrl || DEFAULT_WEDDING_SETTINGS.groomPhotoUrl,
    coverPhotoUrl: rawSettings.coverPhotoUrl || DEFAULT_WEDDING_SETTINGS.coverPhotoUrl,
    heroPhotoUrl: rawSettings.heroPhotoUrl || DEFAULT_WEDDING_SETTINGS.heroPhotoUrl,
    weddingDateIso: rawSettings.weddingDateIso || DEFAULT_WEDDING_SETTINGS.weddingDateIso,
    akadTime: rawSettings.akadTime || DEFAULT_WEDDING_SETTINGS.akadTime,
    resepsiTime: rawSettings.resepsiTime || DEFAULT_WEDDING_SETTINGS.resepsiTime,
    venueName: rawSettings.venueName || DEFAULT_WEDDING_SETTINGS.venueName,
    venueAddress: rawSettings.venueAddress || DEFAULT_WEDDING_SETTINGS.venueAddress,
    venuePlusCode: rawSettings.venuePlusCode || DEFAULT_WEDDING_SETTINGS.venuePlusCode,
    googleMapsUrl: rawSettings.googleMapsUrl || DEFAULT_WEDDING_SETTINGS.googleMapsUrl,
    googleMapsEmbed: rawSettings.googleMapsEmbed || DEFAULT_WEDDING_SETTINGS.googleMapsEmbed,
    youtubeVideoId: rawSettings.youtubeVideoId || DEFAULT_WEDDING_SETTINGS.youtubeVideoId,
    bankAccounts:
      (rawSettings?.bankAccounts as typeof DEFAULT_WEDDING_SETTINGS.bankAccounts) ||
      DEFAULT_WEDDING_SETTINGS.bankAccounts,
    ewallets:
      (rawSettings?.ewallets as typeof DEFAULT_WEDDING_SETTINGS.ewallets) ||
      DEFAULT_WEDDING_SETTINGS.ewallets,
    giftAddress:
      (rawSettings?.giftAddress as typeof DEFAULT_WEDDING_SETTINGS.giftAddress) ||
      DEFAULT_WEDDING_SETTINGS.giftAddress,
    qrisImageUrl: rawSettings.qrisImageUrl || DEFAULT_WEDDING_SETTINGS.qrisImageUrl,
    waMessageTemplate: rawSettings.waMessageTemplate || DEFAULT_WEDDING_SETTINGS.waMessageTemplate,
  };

  const galleryPhotos = rawGalleryPhotos.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    caption: item.caption || null,
    aspectRatio: item.aspectRatio || "3/4",
  }));

  const wishes = rawWishes.map((item) => ({
    id: item.id,
    guestName: item.guestName,
    attendanceStatus: item.attendanceStatus,
    paxCount: item.paxCount ?? 1,
    message: item.message,
    createdAt: item.createdAt || new Date(),
  }));

  return (
    <InvitationOrchestrator
      settings={settings}
      galleryPhotos={galleryPhotos}
      wishes={wishes}
      guestName={guestName}
    />
  );
}
