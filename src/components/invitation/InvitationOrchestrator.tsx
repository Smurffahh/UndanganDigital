"use client";

import { useState } from "react";
import { PetalsCanvas } from "./PetalsCanvas";
import { CoverGate } from "./CoverGate";
import { CountdownHero } from "./CountdownHero";
import { CoupleProfile } from "./CoupleProfile";
import { EventDetails } from "./EventDetails";
import { PhotoGallery } from "./PhotoGallery";
import { RsvpGuestbook } from "./RsvpGuestbook";
import { DigitalEnvelope } from "./DigitalEnvelope";
import { ClosingFooter } from "./ClosingFooter";
import { FloatingControls } from "./FloatingControls";
import type { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";

interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  aspectRatio: string | null;
}

interface WishItem {
  id: number;
  guestName: string;
  attendanceStatus: string;
  paxCount: number | null;
  message: string;
  createdAt: Date | string;
}

interface InvitationOrchestratorProps {
  settings: typeof DEFAULT_WEDDING_SETTINGS;
  galleryPhotos: GalleryItem[];
  wishes: WishItem[];
  guestName: string;
}

export function InvitationOrchestrator({
  settings,
  galleryPhotos,
  wishes,
  guestName,
}: InvitationOrchestratorProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOpenCover = () => {
    setIsOpened(true);
    // Trigger Staggered Blur Reveal on CountdownHero after brief delay as cover lifts
    setTimeout(() => {
      setIsRevealed(true);
    }, 250);
  };

  return (
    <main className="relative min-h-screen">
      {/* 1. Falling Petals Simulation */}
      <PetalsCanvas />

      {/* 2. Cover Gate (01-cover) */}
      <CoverGate
        guestName={guestName}
        onOpen={handleOpenCover}
        coverPhotoUrl={settings.coverPhotoUrl}
      />

      {/* 3. Hero & Countdown (02-hitung-mundur) */}
      <CountdownHero
        weddingDateIso={settings.weddingDateIso}
        heroPhotoUrl={settings.heroPhotoUrl}
        isRevealed={isRevealed}
      />

      {/* 4. Couple Profiles (03-mempelai) */}
      <CoupleProfile
        brideName={settings.brideName}
        brideBirth={settings.brideBirth}
        brideBio={settings.brideBio}
        bridePhotoUrl={settings.bridePhotoUrl}
        groomName={settings.groomName}
        groomBirth={settings.groomBirth}
        groomBio={settings.groomBio}
        groomPhotoUrl={settings.groomPhotoUrl}
      />

      {/* 5. Event Details (04-acara) */}
      <EventDetails
        akadTime={settings.akadTime}
        resepsiTime={settings.resepsiTime}
        venueName={settings.venueName}
        venueAddress={settings.venueAddress}
        venuePlusCode={settings.venuePlusCode}
        googleMapsUrl={settings.googleMapsUrl}
        googleMapsEmbed={settings.googleMapsEmbed}
      />

      {/* 6. Photo Gallery (05-galeri) */}
      <PhotoGallery photos={galleryPhotos} />

      {/* 7. RSVP & Guestbook (06-rsvp) */}
      <RsvpGuestbook
        initialWishes={wishes}
        defaultGuestName={guestName}
      />

      {/* 8. Digital Envelope (07-amplop) */}
      <DigitalEnvelope
        bankAccounts={settings.bankAccounts}
        ewallets={settings.ewallets}
        giftAddress={settings.giftAddress}
        qrisImageUrl={settings.qrisImageUrl}
      />

      {/* 9. Closing Footer (08-penutup) */}
      <ClosingFooter />

      {/* 10. Floating Controls (Glass Pill Dock & Vinyl Music Disc) */}
      <FloatingControls
        isOpened={isOpened}
        youtubeVideoId={settings.youtubeVideoId}
      />
    </main>
  );
}
