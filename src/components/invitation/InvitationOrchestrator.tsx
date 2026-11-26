"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CoverGate } from "./CoverGate";
import { FixedInvitationBackground } from "./FixedInvitationBackground";
import type { DEFAULT_WEDDING_SETTINGS } from "@/lib/db/seed-data";
import { normalizeFontTheme, type FontTheme } from "@/lib/fontThemes";

const FloatingFlowers = dynamic(() => import("./FloatingFlowers").then((m) => m.FloatingFlowers), {
  ssr: false,
});
const CountdownHero = dynamic(() => import("./CountdownHero").then((m) => m.CountdownHero), {
  ssr: false,
});
const CoupleProfile = dynamic(() => import("./CoupleProfile").then((m) => m.CoupleProfile), {
  ssr: false,
});
const LoveStoryTimeline = dynamic(() => import("./LoveStoryTimeline").then((m) => m.LoveStoryTimeline), {
  ssr: false,
});
const EventDetails = dynamic(() => import("./EventDetails").then((m) => m.EventDetails), {
  ssr: false,
});
const PhotoGallery = dynamic(() => import("./PhotoGallery").then((m) => m.PhotoGallery), {
  ssr: false,
});
const RsvpGuestbook = dynamic(() => import("./RsvpGuestbook").then((m) => m.RsvpGuestbook), {
  ssr: false,
});
const DigitalEnvelope = dynamic(() => import("./DigitalEnvelope").then((m) => m.DigitalEnvelope), {
  ssr: false,
});
const ClosingFooter = dynamic(() => import("./ClosingFooter").then((m) => m.ClosingFooter), {
  ssr: false,
});
const FloatingControls = dynamic(() => import("./FloatingControls").then((m) => m.FloatingControls), {
  ssr: false,
});
const FloatingNav = dynamic(() => import("./FloatingNav").then((m) => m.FloatingNav), {
  ssr: false,
});

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
  rsvpTicket?: string | null;
  showWishesInPreview?: boolean;
  fontTheme?: FontTheme;
}

type RevealPhase = "cover" | "opening" | "assets-entering" | "content-ready";

export function InvitationOrchestrator({
  settings,
  galleryPhotos,
  wishes,
  guestName,
  isVerifiedGuest = false,
  guestToken = null,
  rsvpTicket = null,
  showWishesInPreview = true,
  fontTheme: rawFontTheme,
}: InvitationOrchestratorProps) {
  const fontTheme = normalizeFontTheme(rawFontTheme ?? settings.fontTheme);
  const [revealPhase, setRevealPhase] = useState<RevealPhase>("cover");
  const [shouldMountContent, setShouldMountContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const hasUserPausedRef = useRef(false);
  const hasEverPlayedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idleHandler =
      "requestIdleCallback" in window
        ? (
            window as unknown as {
              requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
            }
          ).requestIdleCallback(() => setShouldMountContent(true), { timeout: 2000 })
        : setTimeout(() => setShouldMountContent(true), 1500);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleHandler === "number") {
        (
          window as unknown as {
            cancelIdleCallback: (id: number) => void;
          }
        ).cancelIdleCallback(idleHandler);
      } else {
        clearTimeout(idleHandler as unknown as NodeJS.Timeout);
      }
    };
  }, []);

  const effectiveAudioUrl = settings.musicUrl || "/audio/raim-laode-komang.mp3";
  const isYouTube = settings.musicSourceType === "youtube";

  const handleStartOpening = () => {
    setShouldMountContent(true);
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

    setRevealPhase("opening");
  };

  const handleOpenComplete = () => {
    setRevealPhase("assets-entering");
  };

  useEffect(() => {
    if (revealPhase !== "assets-entering") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setRevealPhase("content-ready");
      return;
    }

    const timer = setTimeout(() => {
      setRevealPhase("content-ready");
    }, 850);

    return () => clearTimeout(timer);
  }, [revealPhase]);

  useEffect(() => {
    if (revealPhase === "content-ready") {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      document.documentElement.style.removeProperty("position");
      document.documentElement.style.removeProperty("width");
      document.documentElement.style.removeProperty("touch-action");

      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("touch-action");
      return;
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Space",
          "Home",
          "End",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    document.documentElement.style.setProperty("overflow", "hidden", "important");
    document.documentElement.style.setProperty("height", "100dvh", "important");
    document.documentElement.style.setProperty("position", "fixed", "important");
    document.documentElement.style.setProperty("width", "100%", "important");
    document.documentElement.style.setProperty("touch-action", "none", "important");

    document.body.style.setProperty("overflow", "hidden", "important");
    document.body.style.setProperty("height", "100dvh", "important");
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.setProperty("width", "100%", "important");
    document.body.style.setProperty("touch-action", "none", "important");

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      document.documentElement.style.removeProperty("position");
      document.documentElement.style.removeProperty("width");
      document.documentElement.style.removeProperty("touch-action");

      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("touch-action");

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [revealPhase]);

  useEffect(() => {
    if (isPlayingAudio) {
      hasEverPlayedRef.current = true;
    }
  }, [isPlayingAudio]);

  useEffect(() => {
    if (revealPhase !== "content-ready" || isPlayingAudio || !settings.musicEnabled || isYouTube || hasUserPausedRef.current || hasEverPlayedRef.current) return;

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
  }, [revealPhase, isPlayingAudio, settings.musicEnabled, isYouTube]);

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
      data-font-theme={fontTheme}
      className={`relative min-h-screen overflow-x-clip bg-transparent text-ink ${
        revealPhase === "content-ready" ? "royal-seq-active" : ""
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

      {/* CoverGate is mounted immediately for instant FCP/LCP */}
      <CoverGate
        guestName={guestName}
        onStartOpening={handleStartOpening}
        onOpenComplete={handleOpenComplete}
        coverPhotoUrl={settings.coverPhotoUrl}
        weddingDateIso={settings.weddingDateIso}
        eventDateLabel={settings.eventDateLabel}
        coupleVisualMode={settings.coupleVisualMode}
        svgCharacterPreset={settings.svgCharacterPreset}
        fontTheme={fontTheme}
      />

      {/* Deferred below-the-fold content: pre-warmed on idle or mounted on opening */}
      {(shouldMountContent || revealPhase !== "cover") && (
        <>
          <FixedInvitationBackground
            heroPhotoUrl={settings.heroPhotoUrl}
            showCornerAssets={revealPhase === "assets-entering" || revealPhase === "content-ready"}
          />

          <FloatingFlowers active={revealPhase === "assets-entering" || revealPhase === "content-ready"} />

          <div
            className={`relative z-10 transition-opacity duration-[700ms] ${
              revealPhase === "content-ready"
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <CountdownHero
              weddingDateIso={settings.weddingDateIso}
              heroPhotoUrl={settings.heroPhotoUrl}
              isOpening={revealPhase === "opening"}
              isOpened={revealPhase === "content-ready"}
              isHeroReady={revealPhase === "content-ready"}
              eventDateLabel={settings.eventDateLabel}
              coupleVisualMode={settings.coupleVisualMode}
              svgCharacterPreset={settings.svgCharacterPreset}
              fontTheme={fontTheme}
            />

            <CoupleProfile
              brideName={settings.brideName}
              brideBio={settings.brideBio}
              bridePhotoUrl={settings.bridePhotoUrl}
              groomName={settings.groomName}
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
              fontTheme={fontTheme}
            />

            {settings.isLoveStoryEnabled && (
              <LoveStoryTimeline
                loveStoryText={settings.loveStoryText}
                storyHashtag={settings.storyHashtag}
              />
            )}

            <EventDetails
              isVerifiedGuest={isVerifiedGuest}
              akadTime={settings.akadTime}
              resepsiTime={settings.resepsiTime}
              venueName={settings.venueName}
              venueAddress={settings.venueAddress}
              venuePlusCode={settings.venuePlusCode}
              googleMapsUrl={settings.googleMapsUrl}
              googleMapsEmbed={settings.googleMapsEmbed}
              weddingDateIso={settings.weddingDateIso}
              eventDateLabel={settings.eventDateLabel}
              showTasyakuran={settings.showTasyakuran}
              tasyakuranTitle={settings.tasyakuranTitle}
              tasyakuranStartDate={settings.tasyakuranStartDate}
              tasyakuranEndDate={settings.tasyakuranEndDate}
              tasyakuranTime={settings.tasyakuranTime}
              tasyakuranSameLocation={settings.tasyakuranSameLocation}
              tasyakuranVenue={settings.tasyakuranVenue}
              tasyakuranAddress={settings.tasyakuranAddress}
              tasyakuranMapsUrl={settings.tasyakuranMapsUrl}
              fontTheme={fontTheme}
            />

            {settings.isGalleryEnabled && <PhotoGallery photos={galleryPhotos} />}

            {isVerifiedGuest && (
              <DigitalEnvelope
                bankAccounts={settings.bankAccounts}
                ewallets={settings.ewallets}
                giftAddress={settings.giftAddress}
                qrisImageUrl={settings.qrisImageUrl}
                fontTheme={fontTheme}
              />
            )}

            <RsvpGuestbook
              initialWishes={wishes}
              defaultGuestName={isVerifiedGuest ? guestName : ""}
              verifiedGuestName={isVerifiedGuest ? guestName : null}
              guestToken={guestToken}
              rsvpTicket={rsvpTicket}
              isVerifiedGuest={isVerifiedGuest}
              showWishesInPreview={showWishesInPreview}
              fontTheme={fontTheme}
            />

            <ClosingFooter
              weddingDateIso={settings.weddingDateIso}
              coupleVisualMode={settings.coupleVisualMode}
              svgCharacterPreset={settings.svgCharacterPreset}
              fontTheme={fontTheme}
            />
          </div>

          <FloatingNav
            isOpened={revealPhase === "content-ready"}
            isGalleryEnabled={settings.isGalleryEnabled}
            isLoveStoryEnabled={settings.isLoveStoryEnabled}
            isDigitalEnvelopeEnabled={isVerifiedGuest}
          />

          <FloatingControls
            isOpened={revealPhase === "content-ready"}
            isPlaying={isPlayingAudio}
            onTogglePlay={toggleAudioPlayback}
            onToggleMusic={toggleAudioPlayback}
            musicEnabled={settings.musicEnabled}
            musicTitle={settings.musicTitle}
            musicSourceType={settings.musicSourceType}
            musicUrl={effectiveAudioUrl}
            youtubeVideoId={settings.youtubeVideoId}
          />
        </>
      )}
    </main>
  );
}
