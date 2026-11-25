import type { Metadata } from "next";
import { preload } from "react-dom";
import {
  getWeddingSettings,
  getGalleryPhotos,
  getRsvpWishes,
  findVerifiedGuestByKpd,
} from "@/lib/db/store";
import { InvitationOrchestrator } from "@/components/invitation/InvitationOrchestrator";
import { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";
import { createRsvpTicket } from "@/lib/rsvpTicket";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawParam = resolvedParams.kpd;
  const verifiedGuest = rawParam ? await findVerifiedGuestByKpd(rawParam) : null;
  const hasGuest = Boolean(verifiedGuest);
  const guestName = verifiedGuest ? verifiedGuest.name : "";

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
          url: "https://www.fauzansinta.my.id/images/og-wedding-preview.jpg",
          width: 1200,
          height: 630,
          alt: "Undangan Pernikahan Fauzan & Sinta",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://www.fauzansinta.my.id/images/og-wedding-preview.jpg",
      ],
    },
  };
}

export default async function InvitationPage({ searchParams }: PageProps) {
  preload("/assets/javanese/dua-pengantin.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });
  preload("/assets/javanese/background.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });
  preload("/images/ornament-golden-seal.svg", {
    as: "image",
    type: "image/svg+xml",
    fetchPriority: "high",
  });

  const resolvedParams = await searchParams;
  const rawParam = resolvedParams.kpd;
  const verifiedGuest = rawParam ? await findVerifiedGuestByKpd(rawParam) : null;
  const isVerifiedGuest = verifiedGuest !== null;
  const displayGuestName = isVerifiedGuest ? verifiedGuest.name : "Tamu Undangan";
  const rsvpTicket = isVerifiedGuest
    ? createRsvpTicket({ guestId: verifiedGuest.id, guestName: verifiedGuest.name })
    : null;

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
    showPublicPreviewWishes: rawSettings.showPublicPreviewWishes !== false,
  };

  const showWishesInPreview = settings.showPublicPreviewWishes !== false;
  const canViewWishes = isVerifiedGuest || showWishesInPreview;

  const safeSettings: typeof DEFAULT_WEDDING_SETTINGS = isVerifiedGuest
    ? settings
    : {
        ...settings,
        bankAccounts: [],
        ewallets: [],
        giftAddress: { receiver: "", phone: "", address: "" },
        qrisImageUrl: "",
        venueAddress: "",
        venuePlusCode: "",
        googleMapsUrl: "",
        googleMapsEmbed: "",
        mapsLatitude: "",
        mapsLongitude: "",
        tasyakuranAddress: "",
        tasyakuranMapsUrl: "",
      };

  const galleryPhotos = rawGalleryPhotos.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    caption: item.caption || null,
    aspectRatio: item.aspectRatio || "3/4",
  }));

  const wishes = canViewWishes
    ? rawWishes.map((item) => ({
        id: item.id,
        guestName: item.guestName,
        attendanceStatus: item.attendanceStatus,
        paxCount: item.paxCount ?? 1,
        message: item.message,
        createdAt: item.createdAt || new Date(),
      }))
    : [];

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
      name: isVerifiedGuest ? settings.venueName : "Purbalingga, Jawa Tengah",
      address: {
        "@type": "PostalAddress",
        streetAddress: isVerifiedGuest ? settings.venueAddress : "Purbalingga, Jawa Tengah",
        addressCountry: "ID",
      },
      ...(isVerifiedGuest && settings.mapsLatitude && settings.mapsLongitude
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: settings.mapsLatitude,
              longitude: settings.mapsLongitude,
            },
          }
        : {}),
    },
    image: ["https://www.fauzansinta.my.id/images/og-wedding-preview.jpg"],
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
        settings={safeSettings}
        galleryPhotos={galleryPhotos}
        wishes={wishes}
        guestName={displayGuestName}
        isVerifiedGuest={isVerifiedGuest}
        guestToken={null}
        rsvpTicket={rsvpTicket}
        showWishesInPreview={showWishesInPreview}
      />
    </>
  );
}
