"use client";

import { useEffect, useState, useRef } from "react";
import { Music2 } from "lucide-react";

interface FloatingControlsProps {
  isOpened: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onToggleMusic?: () => void;
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

const DEFAULT_AUDIO_URL = "/audio/raim-laode-komang.mp3";

export function FloatingControls({
  isOpened,
  isPlaying: externalIsPlaying,
  onTogglePlay,
  onToggleMusic,
  musicEnabled = true,
  musicTitle = "Raim Laode — Komang (Official Romantic Wedding Theme)",
  musicSourceType = "preset",
  musicUrl,
  youtubeVideoId = "In8kDy_WU4s",
}: FloatingControlsProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const setIsPlaying = (val: boolean) => setInternalIsPlaying(val);
  const [showTitleBadge, setShowTitleBadge] = useState(false);
  const [showFeedbackBadge, setShowFeedbackBadge] = useState(false);
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
    if (!isOpened || !musicEnabled || onTogglePlay || onToggleMusic) return;

    if (!isYouTube) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              requestAnimationFrame(() => {
                setIsPlaying(true);
                setShowTitleBadge(true);
              });
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
        requestAnimationFrame(() => {
          setIsPlaying(true);
          setShowTitleBadge(true);
        });
        setTimeout(() => setShowTitleBadge(false), 6000);
      }
    }
  }, [isOpened, musicEnabled, isYouTube, onTogglePlay, onToggleMusic]);

  const toggleMusic = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!musicEnabled) return;

    if (onTogglePlay) {
      onTogglePlay();
      setShowFeedbackBadge(true);
      setTimeout(() => setShowFeedbackBadge(false), 2200);
      return;
    }

    if (onToggleMusic) {
      onToggleMusic();
      setShowFeedbackBadge(true);
      setTimeout(() => setShowFeedbackBadge(false), 2200);
      return;
    }

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
      setShowFeedbackBadge(true);
      setTimeout(() => setShowFeedbackBadge(false), 2200);
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
      setShowFeedbackBadge(true);
      setTimeout(() => setShowFeedbackBadge(false), 2200);
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

  return (
    <>
      {musicEnabled && !onToggleMusic && !onTogglePlay && (
        <audio
          ref={audioRef}
          src={effectiveAudioUrl}
          loop
          preload="none"
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
        <div
          className={`fixed top-5 right-5 z-40 flex items-center gap-2 royal-seq-item ${
            isOpened ? "pointer-events-auto" : "pointer-events-none"
          }`}
          data-seq-dir="right"
          style={{ "--seq-delay": "2720ms" } as React.CSSProperties}
        >
          {showTitleBadge && !showFeedbackBadge && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-white/95 border border-gold-500/40 text-xs font-medium text-rose-950 shadow-md backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
              <Music2 className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
              <span className="max-w-[200px] truncate">{musicTitle}</span>
            </div>
          )}

          {showFeedbackBadge && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fffdfa]/95 border border-[#c9a24b]/60 text-xs font-medium text-[#5d3a41] shadow-md backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-emerald-600 animate-pulse" : "bg-amber-600"
                }`}
              />
              <span>{isPlaying ? "Musik Berputar" : "Musik Dijeda"}</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            aria-pressed={isPlaying}
            title={isPlaying ? `Jeda Musik (${musicTitle})` : `Putar Musik (${musicTitle})`}
            className="relative size-12 sm:size-14 rounded-full bg-[#181314] border border-[#c9a24b]/75 shadow-[0_12px_28px_-8px_rgba(40,20,25,0.55),0_0_0_1px_rgba(201,162,75,0.3)] flex items-center justify-center cursor-pointer select-none transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.96] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8f3] group"
          >
            {/* Spinning Vinyl Grooves */}
            <div
              className="absolute inset-[3px] rounded-full overflow-hidden pointer-events-none animate-vinyl-spin select-none"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="26" cy="26" r="25" fill="#181314" />
                <circle cx="26" cy="26" r="23" stroke="#2c2225" strokeWidth="0.8" />
                <circle cx="26" cy="26" r="21" stroke="#3b2d31" strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.8" />
                <circle cx="26" cy="26" r="19" stroke="#2c2225" strokeWidth="0.8" />
                <circle cx="26" cy="26" r="17" stroke="#c9a24b" strokeWidth="0.5" opacity="0.35" />
                <circle cx="26" cy="26" r="15" stroke="#2c2225" strokeWidth="0.8" />
                <circle cx="26" cy="26" r="13" stroke="#e9d3a3" strokeWidth="0.4" strokeDasharray="1.5 2" opacity="0.5" />
                <circle cx="26" cy="26" r="10.5" fill="#5d3a41" stroke="#c9a24b" strokeWidth="0.8" />
                <circle cx="26" cy="26" r="8" stroke="#e9d3a3" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.6" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const rad = (i * 45 * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={26 + 8.5 * Math.cos(rad)}
                      y1={26 + 8.5 * Math.sin(rad)}
                      x2={26 + 10 * Math.cos(rad)}
                      y2={26 + 10 * Math.sin(rad)}
                      stroke="#c9a24b"
                      strokeWidth="0.6"
                      opacity="0.8"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Miniature Tonearm Needle */}
            <div
              className="absolute -top-1 -right-1 w-6 h-6 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
              style={{
                transformOrigin: "82% 18%",
                transform: isPlaying ? "rotate(0deg)" : "rotate(-22deg)",
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
                <circle cx="19" cy="5" r="2.8" fill="#e9d3a3" stroke="#a9823a" strokeWidth="0.8" />
                <circle cx="19" cy="5" r="1.1" fill="#5d3a41" />
                <path
                  d="M 17,6 C 14,10 11,12 8,15"
                  stroke="#e9d3a3"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path d="M 8,15 L 6,18 L 4,16 L 7,14 Z" fill="#c9a24b" stroke="#5d3a41" strokeWidth="0.5" />
                <circle cx="5" cy="18" r="0.8" fill="#fffdfa" />
              </svg>
            </div>

            {/* Center Play/Pause Action Hub (Does NOT spin) */}
            <div
              className="relative z-10 size-6 sm:size-7 rounded-full bg-[#fdf8f3] border border-[#c9a24b] shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#fff9f0]"
              aria-hidden="true"
            >
              {isPlaying ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-[#c9a24b]/20 animate-ping opacity-60 pointer-events-none" />
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#5d3a41] relative z-10" viewBox="0 0 12 12" fill="currentColor">
                    <rect x="2.5" y="2" width="2.2" height="8" rx="0.9" />
                    <rect x="7.3" y="2" width="2.2" height="8" rx="0.9" />
                  </svg>
                </>
              ) : (
                <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#5d3a41] translate-x-[0.75px] relative z-10" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M 3.2,2.2 C 3.2,1.8 3.6,1.5 4.0,1.7 L 9.8,5.5 C 10.2,5.7 10.2,6.3 9.8,6.5 L 4.0,10.3 C 3.6,10.5 3.2,10.2 3.2,9.8 Z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      )}
    </>
  );
}
