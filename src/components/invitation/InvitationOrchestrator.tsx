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
import { GununganWayang, RadiantStar } from "./Ornaments";
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
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-screen h-dvh"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={settings.heroPhotoUrl}
          alt=""
          className="w-full h-full object-cover object-center scale-105 opacity-[0.22] filter saturate-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f3]/85 via-[#fdf8f3]/80 to-[#f7e9e5]/88 backdrop-blur-[2px]" />
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute top-[35%] -left-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(156,95,102,0.07),transparent_70%)] blur-2xl" />
        <div className="absolute top-[65%] -right-[200px] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-30" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[1] p-3 sm:p-5" aria-hidden="true">
        <div className="relative w-full h-full border border-[#c9a24b]/20 rounded-2xl sm:rounded-3xl pointer-events-none">
          <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#c9a24b]/60 rounded-tl" />
          <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#c9a24b]/60 rounded-tr" />
          <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#c9a24b]/60 rounded-bl" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#c9a24b]/60 rounded-br" />
        </div>
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-[2] overflow-hidden w-screen h-dvh"
        aria-hidden="true"
      >
        <div className="absolute top-[22%] left-3 sm:left-6 opacity-30 transform -rotate-12">
          <GununganWayang className="w-12 sm:w-16 text-gold-500" />
        </div>
        <div className="absolute top-[52%] right-3 sm:right-6 opacity-30 transform rotate-12">
          <GununganWayang className="w-12 sm:w-16 text-gold-500" />
        </div>
        <div className="absolute top-[38%] right-8 sm:right-16 opacity-45">
          <RadiantStar className="w-5 h-5 fill-gold-400" />
        </div>
        <div className="absolute top-[72%] left-6 sm:left-14 opacity-45">
          <RadiantStar className="w-5 h-5 fill-gold-400" />
        </div>
      </div>

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
