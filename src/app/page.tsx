import type { Metadata } from "next";
import { getWeddingSettings, getGalleryPhotos, getRsvpWishes } from "@/lib/db/store";
import { InvitationOrchestrator } from "@/components/invitation/InvitationOrchestrator";
import { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";
import { sanitizeGuestKpdParam } from "@/lib/guestUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawParam = resolvedParams.kpd;
  const guestName = rawParam ? sanitizeGuestKpdParam(rawParam) : "";
  const hasGuest = Boolean(guestName && guestName !== "Tamu Undangan");

  const baseTitle = "The Wedding of Fauzan & Sinta (#SINgkatceritaFAUZAN)";
  const description =
    "Minggu, 3 Januari 2027 — Undangan Pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Buka untuk melihat waktu, lokasi acara, dan konfirmasi kehadiran.";
  const title = hasGuest ? `${baseTitle} — Kepada Yth. ${guestName}` : baseTitle;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    robots: hasGuest
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
  const rawParam = resolvedParams.kpd;
  const guestName = sanitizeGuestKpdParam(rawParam);
  const isCustomGuest = Boolean(rawParam && guestName !== "Tamu Undangan");

  const [rawSettings, rawGalleryPhotos, rawWishes] = await Promise.all([
    getWeddingSettings(),
    getGalleryPhotos(),
    getRsvpWishes(),
  ]);

  const settings: typeof DEFAULT_WEDDING_SETTINGS = {
    ...DEFAULT_WEDDING_SETTINGS,
    ...rawSettings,
    brideName: (rawSettings.brideName || DEFAULT_WEDDING_SETTINGS.brideName).trim() || DEFAULT_WEDDING_SETTINGS.brideName,
    groomName: (rawSettings.groomName || DEFAULT_WEDDING_SETTINGS.groomName).trim() || DEFAULT_WEDDING_SETTINGS.groomName,
    weddingDateIso: rawSettings.weddingDateIso || DEFAULT_WEDDING_SETTINGS.weddingDateIso,
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
        isVerifiedGuest={isCustomGuest}
        guestToken={null}
      />
    </>
  );
}
