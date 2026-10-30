"use client";

import { useState } from "react";
import { PetalsCanvas } from "./PetalsCanvas";
import { CoverGate } from "./CoverGate";
import { CountdownHero } from "./CountdownHero";
import { CoupleProfile } from "./CoupleProfile";
import { LoveStoryTimeline } from "./LoveStoryTimeline";
import { EventDetails } from "./EventDetails";
import { PhotoGallery } from "./PhotoGallery";
import { RsvpGuestbook } from "./RsvpGuestbook";
import { DigitalEnvelope } from "./DigitalEnvelope";
import { ClosingFooter } from "./ClosingFooter";
import { FloatingControls } from "./FloatingControls";
import { FixedInvitationBackground } from "./FixedInvitationBackground";
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
  const [isHeroReady, setIsHeroReady] = useState(false);

  const handleOpenCover = () => {
    setIsOpened(true);
    setIsHeroReady(true);
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-transparent text-ink">
      <FixedInvitationBackground heroPhotoUrl={settings.heroPhotoUrl} />

      <PetalsCanvas />

      <CoverGate
        guestName={guestName}
        onOpen={handleOpenCover}
        coverPhotoUrl={settings.coverPhotoUrl}
        weddingDateIso={settings.weddingDateIso}
        eventDateLabel={settings.eventDateLabel}
      />

      <div className="relative z-10">
        <CountdownHero
          weddingDateIso={settings.weddingDateIso}
          heroPhotoUrl={settings.heroPhotoUrl}
          isHeroReady={isHeroReady}
          eventDateLabel={settings.eventDateLabel}
        />

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

        <LoveStoryTimeline
          loveStoryText={settings.loveStoryText}
          storyHashtag={settings.storyHashtag}
        />

        <EventDetails
          akadTime={settings.akadTime}
          resepsiTime={settings.resepsiTime}
          venueName={settings.venueName}
          venueAddress={settings.venueAddress}
          venuePlusCode={settings.venuePlusCode}
          googleMapsUrl={settings.googleMapsUrl}
          googleMapsEmbed={settings.googleMapsEmbed}
          weddingDateIso={settings.weddingDateIso}
          eventDateLabel={settings.eventDateLabel}
        />

        <PhotoGallery photos={galleryPhotos} />

        <RsvpGuestbook
          initialWishes={wishes}
          defaultGuestName={guestName}
        />

        <DigitalEnvelope
          bankAccounts={settings.bankAccounts}
          ewallets={settings.ewallets}
          giftAddress={settings.giftAddress}
          qrisImageUrl={settings.qrisImageUrl}
        />

        <ClosingFooter weddingDateIso={settings.weddingDateIso} />
      </div>

      <FloatingControls
        isOpened={isOpened}
        musicEnabled={settings.musicEnabled}
        musicTitle={settings.musicTitle}
        musicSourceType={settings.musicSourceType}
        musicUrl={settings.musicUrl}
        youtubeVideoId={settings.youtubeVideoId}
      />
    </main>
  );
}
