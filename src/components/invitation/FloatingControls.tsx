"use client";

import { useEffect, useState, useRef } from "react";
import { Disc3, Music2 } from "lucide-react";

interface FloatingControlsProps {
  isOpened: boolean;
  musicEnabled?: boolean;
  musicTitle?: string;
  musicSourceType?: string;
  musicUrl?: string;
  youtubeVideoId?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const DEFAULT_AUDIO_URL = "/audio/wedding-instrumental.wav";

export function FloatingControls({
  isOpened,
  musicEnabled = true,
  musicTitle = "Shane Filan - Beautiful In White (Romantic Instrumental)",
  musicSourceType = "preset",
  musicUrl,
  youtubeVideoId = "In8kDy_WU4s",
}: FloatingControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTitleBadge, setShowTitleBadge] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const wasPlayingBeforeHiddenRef = useRef(false);

  const isYouTube = musicSourceType === "youtube";
  const effectiveAudioUrl = musicUrl || DEFAULT_AUDIO_URL;

  useEffect(() => {
    if (!isYouTube || !musicEnabled) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ytPlayerRef.current = new (window.YT as any).Player("yt-audio-player", {
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
            ytPlayerRef.current?.setVolume?.(80);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === 1) setIsPlaying(true);
            else if (event.data === 2) setIsPlaying(false);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (event: any) => {
            console.warn("YouTube player embed error:", event.data);
            // Video embed blocked by copyright (error 101/150); fall back to local instrumental
            const audio = audioRef.current;
            if (audio) {
              audio.src = "/audio/wedding-instrumental.wav";
              audio.volume = 0.7;
              audio.play().then(() => {
                setIsPlaying(true);
                setShowTitleBadge(true);
                setTimeout(() => setShowTitleBadge(false), 5000);
              }).catch((e) => console.warn("Fallback audio play failed:", e));
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [isYouTube, musicEnabled, youtubeVideoId]);

  useEffect(() => {
    if (!isOpened || !musicEnabled) return;

    if (!isYouTube) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setShowTitleBadge(true);
              let vol = 0;
              const fadeInterval = setInterval(() => {
                vol += 0.07;
                if (vol >= 0.7) {
                  audio.volume = 0.7;
                  clearInterval(fadeInterval);
                } else {
                  audio.volume = vol;
                }
              }, 100);

              setTimeout(() => {
                setShowTitleBadge(false);
              }, 6000);
            })
            .catch((err) => {
              console.warn("Autoplay audio blocked or pending user gesture:", err);
            });
        }
      }
    } else {
      if (ytPlayerRef.current?.playVideo) {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        setShowTitleBadge(true);
        setTimeout(() => setShowTitleBadge(false), 6000);
      }
    }
  }, [isOpened, musicEnabled, isYouTube]);

  const toggleMusic = () => {
    if (!musicEnabled) return;

    if (!isYouTube) {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => {
          setIsPlaying(true);
          setShowTitleBadge(true);
          setTimeout(() => setShowTitleBadge(false), 4000);
        }).catch(console.error);
      }
    } else {
      if (!ytPlayerRef.current) return;
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo?.();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo?.();
        setIsPlaying(true);
        setShowTitleBadge(true);
        setTimeout(() => setShowTitleBadge(false), 4000);
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
          if (!isYouTube && audioRef.current) {
            audioRef.current.pause();
          } else if (isYouTube && ytPlayerRef.current?.pauseVideo) {
            ytPlayerRef.current.pauseVideo();
          }
          wasPlayingBeforeHiddenRef.current = true;
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeHiddenRef.current) {
          if (!isYouTube && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          } else if (isYouTube && ytPlayerRef.current?.playVideo) {
            ytPlayerRef.current.playVideo();
            setIsPlaying(true);
          }
          wasPlayingBeforeHiddenRef.current = false;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying, isYouTube]);

  if (!isOpened) return null;

  return (
    <>
      {!isYouTube && musicEnabled && (
        <audio
          ref={audioRef}
          src={effectiveAudioUrl}
          loop
          preload="auto"
          aria-hidden="true"
          className="hidden"
        />
      )}

      {isYouTube && musicEnabled && (
        <div className="fixed -top-10 -left-10 w-2 h-2 opacity-0 pointer-events-none" aria-hidden="true">
          <div id="yt-audio-player" />
        </div>
      )}

      {musicEnabled && (
        <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
          {showTitleBadge && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-white/90 border border-gold-500/40 text-xs font-medium text-rose-950 shadow-md backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
              <Music2 className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
              <span className="max-w-[200px] truncate">{musicTitle}</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            aria-pressed={isPlaying}
            title={isPlaying ? `Jeda Musik (${musicTitle})` : "Putar Musik Latar"}
            className="w-11 h-11 rounded-full bg-surface-white/90 border border-gold-500/50 shadow-[0_12px_26px_-10px_rgba(93,58,65,0.45)] backdrop-blur-md grid place-items-center transition-transform duration-200 active:scale-[0.96] hover:scale-105 cursor-pointer animate-in zoom-in-75 duration-300 focus-visible:outline-2 focus-visible:outline-rose-700"
          >
            <Disc3
              className={`w-6 h-6 stroke-[1.8] text-rose-700 transition-colors ${
                isPlaying
                  ? "animate-[spin_8s_linear_infinite] text-gold-600 motion-reduce:animate-none"
                  : "text-muted"
              }`}
            />
          </button>
        </div>
      )}
    </>
  );
}
