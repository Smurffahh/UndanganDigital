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
import { useParallax } from "@/hooks/useParallax";
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

  // Layer 1: Deep Ambient Background Parallax (Speed 0.15x, reverse)
  const bgParallax = useParallax(0.15, true);

  // Layer 2: Floating Cultural Ornaments Parallax (Speed 0.35x, gentle shift)
  const ornamentParallax = useParallax(0.35, true);

  const handleOpenCover = () => {
    setIsOpened(true);
    // Trigger Staggered Blur Reveal on CountdownHero after split-arch doors begin opening
    setTimeout(() => {
      setIsRevealed(true);
    }, 450);
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-cream text-ink">
      {/* ============================================================ */}
      {/* LAYER 1: Deep Ambient Background Parallax (Speed 0.15x)     */}
      {/* ============================================================ */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={bgParallax.transformStyle}
        aria-hidden="true"
      >
        {/* Subtle Ambient Radial Glows (Dusty Rose & Champagne Gold) */}
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute top-[35%] -left-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(156,95,102,0.07),transparent_70%)] blur-2xl" />
        <div className="absolute top-[65%] -right-[200px] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[var(--kawung-pattern)] opacity-35" />
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: Floating Cultural Ornaments Parallax (Speed 0.35x) */}
      {/* ============================================================ */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
        style={ornamentParallax.transformStyle}
        aria-hidden="true"
      >
        {/* Gunungan Wayang Left Edge Silhouette */}
        <div className="absolute top-[22%] left-3 sm:left-6 opacity-30 transform -rotate-12">
          <GununganWayang className="w-12 sm:w-16 text-gold-500" />
        </div>
        {/* Gunungan Wayang Right Edge Silhouette */}
        <div className="absolute top-[52%] right-3 sm:right-6 opacity-30 transform rotate-12">
          <GununganWayang className="w-12 sm:w-16 text-gold-500" />
        </div>
        {/* Radiant Stars Accent Floating */}
        <div className="absolute top-[38%] right-8 sm:right-16 opacity-45">
          <RadiantStar className="w-5 h-5 fill-gold-400" />
        </div>
        <div className="absolute top-[72%] left-6 sm:left-14 opacity-45">
          <RadiantStar className="w-5 h-5 fill-gold-400" />
        </div>
      </div>

      {/* Falling Petals Simulation */}
      <PetalsCanvas />

      {/* ============================================================ */}
      {/* 01. Cover Gate (Royal Split-Arch Envelope Gate)             */}
      {/* ============================================================ */}
      <CoverGate
        guestName={guestName}
        onOpen={handleOpenCover}
        coverPhotoUrl={settings.coverPhotoUrl}
        weddingDateIso={settings.weddingDateIso}
        eventDateLabel={settings.eventDateLabel}
      />

      {/* ============================================================ */}
      {/* 02. Hero & Countdown (02-hitung-mundur)                      */}
      {/* ============================================================ */}
      <CountdownHero
        weddingDateIso={settings.weddingDateIso}
        heroPhotoUrl={settings.heroPhotoUrl}
        isRevealed={isRevealed}
        eventDateLabel={settings.eventDateLabel}
      />

      {/* ============================================================ */}
      {/* 03. Couple Profiles (03-mempelai)                           */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* LAYER 4: Love Story Timeline (#SINgkatceritaFAUZAN)         */}
      {/* ============================================================ */}
      <LoveStoryTimeline
        loveStoryText={settings.loveStoryText}
        storyHashtag={settings.storyHashtag}
      />

      {/* ============================================================ */}
      {/* 04. Event Details (04-acara)                                */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* 05. Photo Gallery (05-galeri)                               */}
      {/* ============================================================ */}
      <PhotoGallery photos={galleryPhotos} />

      {/* ============================================================ */}
      {/* 06. RSVP & Guestbook (06-rsvp)                              */}
      {/* ============================================================ */}
      <RsvpGuestbook
        initialWishes={wishes}
        defaultGuestName={guestName}
      />

      {/* ============================================================ */}
      {/* 07. Digital Envelope (07-amplop)                            */}
      {/* ============================================================ */}
      <DigitalEnvelope
        bankAccounts={settings.bankAccounts}
        ewallets={settings.ewallets}
        giftAddress={settings.giftAddress}
        qrisImageUrl={settings.qrisImageUrl}
      />

      {/* ============================================================ */}
      {/* 08. Closing Footer (08-penutup)                             */}
      {/* ============================================================ */}
      <ClosingFooter weddingDateIso={settings.weddingDateIso} />

      {/* ============================================================ */}
      {/* 09. Floating Controls (Glass Pill Dock & Vinyl Music Disc)  */}
      {/* ============================================================ */}
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
