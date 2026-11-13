"use client";

import { useEffect, useRef, useState } from "react";
import { PetalsCanvas } from "./PetalsCanvas";
import { ScrollLinkedButterflies } from "./ScrollLinkedButterflies";
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
import { FloatingNav } from "./FloatingNav";
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
  isVerifiedGuest?: boolean;
  guestToken?: string | null;
}

export function InvitationOrchestrator({
  settings,
  galleryPhotos,
  wishes,
  guestName,
  isVerifiedGuest = false,
  guestToken = null,
}: InvitationOrchestratorProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const hasUserPausedRef = useRef(false);
  const hasEverPlayedRef = useRef(false);

  const effectiveAudioUrl = settings.musicUrl || "/audio/raim-laode-komang.mp3";
  const isYouTube = settings.musicSourceType === "youtube";

  const handleOpenCover = () => {
    if (audioRef.current && settings.musicEnabled && !isYouTube) {
      audioRef.current.volume = 0.15;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingAudio(true);
            hasEverPlayedRef.current = true;
            let vol = 0.15;
            const ramp = setInterval(() => {
              vol += 0.05;
              if (vol >= 0.8) {
                if (audioRef.current) audioRef.current.volume = 0.8;
                clearInterval(ramp);
              } else if (audioRef.current) {
                audioRef.current.volume = vol;
              }
            }, 80);
          })
          .catch(() => {});
      }
    }

    setIsOpening(true);
    setIsOpened(true);
    setIsHeroReady(true);
  };

  useEffect(() => {
    if (isPlayingAudio) {
      hasEverPlayedRef.current = true;
    }
  }, [isPlayingAudio]);

  useEffect(() => {
    if (!isOpened || isPlayingAudio || !settings.musicEnabled || isYouTube || hasUserPausedRef.current || hasEverPlayedRef.current) return;

    const tryPlayFallback = () => {
      if (audioRef.current && !isPlayingAudio && !hasUserPausedRef.current) {
        audioRef.current.volume = 0.8;
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
          hasEverPlayedRef.current = true;
        }).catch(() => {});
      }
    };

    window.addEventListener("click", tryPlayFallback, { once: true, passive: true });
    window.addEventListener("touchstart", tryPlayFallback, { once: true, passive: true });
    window.addEventListener("scroll", tryPlayFallback, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", tryPlayFallback);
      window.removeEventListener("touchstart", tryPlayFallback);
      window.removeEventListener("scroll", tryPlayFallback);
    };
  }, [isOpened, isPlayingAudio, settings.musicEnabled, isYouTube]);

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      hasUserPausedRef.current = true;
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      hasUserPausedRef.current = false;
      audioRef.current.volume = 0.8;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(console.error);
      setIsPlayingAudio(true);
    }
  };

  return (
    <main
      className={`relative min-h-screen overflow-x-clip bg-transparent text-ink ${
        isOpened ? "royal-seq-active" : ""
      }`}
    >
      {settings.musicEnabled && !isYouTube && (
        <audio
          ref={audioRef}
          src={effectiveAudioUrl}
          loop
          preload="auto"
          playsInline
          onPlay={() => setIsPlayingAudio(true)}
          onPause={() => setIsPlayingAudio(false)}
          onEnded={() => setIsPlayingAudio(false)}
          aria-hidden="true"
          className="hidden"
        />
      )}

      <FixedInvitationBackground heroPhotoUrl={settings.heroPhotoUrl} />

      <PetalsCanvas active={isOpening || isOpened} />
      <ScrollLinkedButterflies active={isOpening || isOpened} />

      <CoverGate
        guestName={guestName}
        onOpen={handleOpenCover}
        coverPhotoUrl={settings.coverPhotoUrl}
        weddingDateIso={settings.weddingDateIso}
        eventDateLabel={settings.eventDateLabel}
        coupleVisualMode={settings.coupleVisualMode}
        svgCharacterPreset={settings.svgCharacterPreset}
      />

      <div className="relative z-10">
        <CountdownHero
          weddingDateIso={settings.weddingDateIso}
          heroPhotoUrl={settings.heroPhotoUrl}
          isOpening={isOpening}
          isOpened={isOpened}
          isHeroReady={isHeroReady}
          eventDateLabel={settings.eventDateLabel}
          coupleVisualMode={settings.coupleVisualMode}
          svgCharacterPreset={settings.svgCharacterPreset}
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
          coupleVisualMode={settings.coupleVisualMode}
          svgCharacterPreset={settings.svgCharacterPreset}
          groomChildOrder={settings.groomChildOrder}
          groomParents={settings.groomParents}
          brideChildOrder={settings.brideChildOrder}
          brideParents={settings.brideParents}
          loveStoryText={settings.loveStoryText}
          storyHashtag={settings.storyHashtag}
        />

        {settings.isLoveStoryEnabled && (
          <LoveStoryTimeline
            loveStoryText={settings.loveStoryText}
            storyHashtag={settings.storyHashtag}
          />
        )}

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

        {settings.isGalleryEnabled && <PhotoGallery photos={galleryPhotos} />}

        <RsvpGuestbook
          initialWishes={wishes}
          defaultGuestName={isVerifiedGuest ? guestName : ""}
          verifiedGuestName={isVerifiedGuest ? guestName : null}
          guestToken={guestToken}
        />

        <DigitalEnvelope
          bankAccounts={settings.bankAccounts}
          ewallets={settings.ewallets}
          giftAddress={settings.giftAddress}
          qrisImageUrl={settings.qrisImageUrl}
        />

        <ClosingFooter
          weddingDateIso={settings.weddingDateIso}
          coupleVisualMode={settings.coupleVisualMode}
          svgCharacterPreset={settings.svgCharacterPreset}
        />
      </div>

      <FloatingNav
        isOpened={isOpened}
        isGalleryEnabled={settings.isGalleryEnabled}
        isLoveStoryEnabled={settings.isLoveStoryEnabled}
      />

      <FloatingControls
        isOpened={isOpened}
        isPlaying={isPlayingAudio}
        onTogglePlay={toggleAudioPlayback}
        onToggleMusic={toggleAudioPlayback}
        musicEnabled={settings.musicEnabled}
        musicTitle={settings.musicTitle}
        musicSourceType={settings.musicSourceType}
        musicUrl={effectiveAudioUrl}
        youtubeVideoId={settings.youtubeVideoId}
      />
    </main>
  );
}
