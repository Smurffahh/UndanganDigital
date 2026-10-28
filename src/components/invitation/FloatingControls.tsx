"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Calendar, Image as ImageIcon, MessageSquare, Gift, Disc3 } from "lucide-react";

interface FloatingControlsProps {
  isOpened: boolean;
  youtubeVideoId?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function FloatingControls({
  isOpened,
  youtubeVideoId = "In8kDy_WU4s",
}: FloatingControlsProps) {
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window.YT as any).Player("yt-audio-player", {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: youtubeVideoId,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            playerRef.current?.setVolume?.(80);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2
            if (event.data === 1) setIsPlaying(true);
            else if (event.data === 2) setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [youtubeVideoId]);

  // Autoplay music when cover is opened
  useEffect(() => {
    if (isOpened && playerReady && playerRef.current) {
      playerRef.current.playVideo?.();
    }
  }, [isOpened, playerReady]);

  const toggleMusic = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  };

  // IntersectionObserver for tracking active section
  useEffect(() => {
    const sections = ["beranda", "mempelai", "acara", "galeri", "rsvp", "amplop"];
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isOpened]);

  if (!isOpened) return null;

  const navLinks = [
    { id: "mempelai", label: "Mempelai", icon: Users },
    { id: "acara", label: "Acara", icon: Calendar },
    { id: "galeri", label: "Galeri", icon: ImageIcon },
    { id: "rsvp", label: "RSVP", icon: MessageSquare },
    { id: "amplop", label: "Amplop", icon: Gift },
  ];

  return (
    <>
      {/* Hidden YouTube IFrame */}
      <div className="fixed -top-10 -left-10 w-2 h-2 opacity-0 pointer-events-none" aria-hidden="true">
        <div id="yt-audio-player" />
      </div>

      {/* Floating Vinyl Music Disc Button */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
        title={isPlaying ? "Jeda musik" : "Putar musik"}
        className="fixed top-5 right-5 z-40 w-11 h-11 rounded-full bg-surface-white/85 border border-gold-500/50 shadow-[0_12px_26px_-10px_rgba(93,58,65,0.45)] backdrop-blur-md grid place-items-center transition-transform duration-200 active:scale-[0.96] hover:scale-105 cursor-pointer animate-in zoom-in-75 duration-300"
      >
        <Disc3
          className={`w-6 h-6 stroke-[1.8] text-rose-700 ${
            isPlaying ? "animate-spin-slow text-gold-600" : ""
          }`}
        />
      </button>

      {/* Floating Glass Pill Dock Navigation */}
      <nav
        aria-label="Navigasi cepat undangan"
        className="fixed left-1/2 -translate-x-1/2 bottom-[calc(14px+env(safe-area-inset-bottom,0px))] z-40 flex items-center gap-1 p-1.5 rounded-full bg-surface-white/85 border border-gold-500/45 backdrop-blur-md shadow-[0_20px_40px_-14px_rgba(93,58,65,0.45)] animate-in slide-in-from-bottom-8 duration-500"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.label}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-rose-100 text-rose-800 shadow-xs"
                  : "text-muted hover:text-rose-700"
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.8]" />
              <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
