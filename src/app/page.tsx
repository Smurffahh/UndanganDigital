import type { Metadata } from "next";
import { getWeddingSettings, getGalleryPhotos, getRsvpWishes } from "@/lib/db/store";
import { InvitationOrchestrator } from "@/components/invitation/InvitationOrchestrator";
import { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";
import { resolveGuestToken } from "@/lib/guest-crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawParam =
    resolvedParams.to ||
    resolvedParams.kpd ||
    resolvedParams.guest ||
    resolvedParams.code ||
    resolvedParams.inv ||
    resolvedParams.tamu ||
    resolvedParams.name ||
    "";
  const paramStr = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  const { guestName: verifiedName } = await resolveGuestToken(paramStr);

  const baseTitle = "The Wedding of Fauzan & Sinta (#SINgkatceritaFAUZAN)";
  const description =
    "Minggu, 3 Januari 2027 — Undangan Pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Buka untuk melihat waktu, lokasi acara, dan konfirmasi kehadiran.";
  const title = verifiedName ? `${baseTitle} — Kepada Yth. ${verifiedName}` : baseTitle;
  const hasGuestParam = Boolean(paramStr && paramStr.trim().length > 0);

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    robots: hasGuestParam
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "The Wedding of Fauzan & Sinta",
      title,
      description,
      images: [
        {
          url: "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg?v=20270103",
          width: 1200,
          height: 630,
          alt: "The Wedding of Fauzan & Sinta",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg?v=20270103",
      ],
    },
  };
}

export default async function InvitationPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const rawParam =
    resolvedParams.to ||
    resolvedParams.kpd ||
    resolvedParams.guest ||
    resolvedParams.code ||
    resolvedParams.inv ||
    resolvedParams.tamu ||
    resolvedParams.name ||
    "";
  const paramStr = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  const { guestName: decryptedName, isVerified, validToken } = await resolveGuestToken(paramStr);
  const guestName = decryptedName || "Tamu Undangan";

  const [rawSettings, rawGalleryPhotos, rawWishes] = await Promise.all([
    getWeddingSettings(),
    getGalleryPhotos(),
    getRsvpWishes(),
  ]);

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
    eventDateLabel: rawSettings.eventDateLabel || DEFAULT_WEDDING_SETTINGS.eventDateLabel,
    akadTime: rawSettings.akadTime || DEFAULT_WEDDING_SETTINGS.akadTime,
    resepsiTime: rawSettings.resepsiTime || DEFAULT_WEDDING_SETTINGS.resepsiTime,
    venueName: rawSettings.venueName || DEFAULT_WEDDING_SETTINGS.venueName,
    venueAddress: rawSettings.venueAddress || DEFAULT_WEDDING_SETTINGS.venueAddress,
    venuePlusCode: rawSettings.venuePlusCode || DEFAULT_WEDDING_SETTINGS.venuePlusCode,
    googleMapsUrl: rawSettings.googleMapsUrl || DEFAULT_WEDDING_SETTINGS.googleMapsUrl,
    googleMapsEmbed: rawSettings.googleMapsEmbed || DEFAULT_WEDDING_SETTINGS.googleMapsEmbed,
    mapsLatitude: rawSettings.mapsLatitude || DEFAULT_WEDDING_SETTINGS.mapsLatitude,
    mapsLongitude: rawSettings.mapsLongitude || DEFAULT_WEDDING_SETTINGS.mapsLongitude,
    youtubeVideoId: rawSettings.youtubeVideoId || DEFAULT_WEDDING_SETTINGS.youtubeVideoId,
    musicEnabled: rawSettings.musicEnabled !== undefined ? rawSettings.musicEnabled : DEFAULT_WEDDING_SETTINGS.musicEnabled,
    musicTitle: rawSettings.musicTitle || DEFAULT_WEDDING_SETTINGS.musicTitle,
    musicSourceType: rawSettings.musicSourceType || DEFAULT_WEDDING_SETTINGS.musicSourceType,
    musicUrl: rawSettings.musicUrl || DEFAULT_WEDDING_SETTINGS.musicUrl,
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
    loveStoryText: rawSettings.loveStoryText || DEFAULT_WEDDING_SETTINGS.loveStoryText,
    storyHashtag: rawSettings.storyHashtag || DEFAULT_WEDDING_SETTINGS.storyHashtag,
    coupleVisualMode: rawSettings.coupleVisualMode || DEFAULT_WEDDING_SETTINGS.coupleVisualMode,
    svgCharacterPreset: rawSettings.svgCharacterPreset || DEFAULT_WEDDING_SETTINGS.svgCharacterPreset,
    isGalleryEnabled: rawSettings.isGalleryEnabled !== undefined ? rawSettings.isGalleryEnabled : DEFAULT_WEDDING_SETTINGS.isGalleryEnabled,
    isLoveStoryEnabled: rawSettings.isLoveStoryEnabled !== undefined ? rawSettings.isLoveStoryEnabled : DEFAULT_WEDDING_SETTINGS.isLoveStoryEnabled,
    groomChildOrder: rawSettings.groomChildOrder || DEFAULT_WEDDING_SETTINGS.groomChildOrder,
    groomParents: rawSettings.groomParents || DEFAULT_WEDDING_SETTINGS.groomParents,
    brideChildOrder: rawSettings.brideChildOrder || DEFAULT_WEDDING_SETTINGS.brideChildOrder,
    brideParents: rawSettings.brideParents || DEFAULT_WEDDING_SETTINGS.brideParents,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `The Wedding of ${settings.groomName.split(" ")[0]} & ${settings.brideName.split(" ")[0]}`,
    description: `Undangan Pernikahan ${settings.groomName} & ${settings.brideName} (#SINgkatceritaFAUZAN)`,
    startDate: settings.weddingDateIso,
    endDate: "2027-01-03T17:00:00+07:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: settings.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.venueAddress,
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: settings.mapsLatitude,
        longitude: settings.mapsLongitude,
      },
    },
    image: [settings.coverPhotoUrl, settings.heroPhotoUrl],
    performer: [
      { "@type": "Person", name: settings.groomName },
      { "@type": "Person", name: settings.brideName },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <InvitationOrchestrator
        settings={settings}
        galleryPhotos={galleryPhotos}
        wishes={wishes}
        guestName={guestName}
        isVerifiedGuest={isVerified}
        guestToken={validToken}
      />
    </>
  );
}
