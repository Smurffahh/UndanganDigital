"use client";

import { useState, useEffect, useCallback } from "react";
import { WayangDivider } from "./Ornaments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollLinkedItem } from "./ScrollLinkedItem";
import { sanitizeSafeMediaSrc } from "@/lib/urlUtils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GalleryPhotoItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  aspectRatio: string | null;
}

interface PhotoGalleryProps {
  photos: GalleryPhotoItem[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleOpen = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleClose = useCallback(() => {
    setActiveIdx(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev! - 1 + photos.length) % photos.length);
  }, [activeIdx, photos.length]);

  const handleNext = useCallback(() => {
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev! + 1) % photos.length);
  }, [activeIdx, photos.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, handleClose, handlePrev, handleNext]);

  return (
    <section id="galeri" className="py-20 relative bg-transparent" aria-label="Galeri Foto Momen">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        <header className="text-center mb-9">
          <ScrollLinkedItem direction="down" offsetY={22}>
            <p className="typo-eyebrow text-[#C59B6D] mb-2">
              Our Gallery
            </p>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title text-[#6B1222]">
              Galeri Momen
            </h2>
            <WayangDivider />
            <p className="mt-2.5 font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#6B1222]">
              #SINgkatceritaFAUZAN
            </p>
          </ScrollLinkedItem>
        </header>

        <div className="columns-2 md:columns-3 gap-3.5 md:gap-4.5 space-y-3.5 md:space-y-4.5">
          {photos.map((item, idx) => {
            const aspectClass =
              item.aspectRatio === "square" || item.aspectRatio === "1/1"
                ? "aspect-square"
                : item.aspectRatio === "16/9"
                ? "aspect-[16/9]"
                : "aspect-[4/5]";

            return (
              <ScrollLinkedItem
                key={item.id}
                offsetY={36}
                stage={(((idx % 4) + 1) as 1 | 2 | 3 | 4)}
                className="break-inside-avoid"
              >
                <figure
                  onClick={() => handleOpen(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpen(idx);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Perbesar foto: ${item.caption || "Galeri prewedding"}`}
                  className="relative rounded-2xl overflow-hidden border border-[#C59B6D]/40 shadow-md cursor-zoom-in bg-[#FBF7F2]/50 group transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#6B1222]"
                >
                  <div className={`w-full ${aspectClass} rounded-2xl overflow-hidden relative`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sanitizeSafeMediaSrc(item.imageUrl, "")}
                      alt={item.caption || `Foto momen Fauzan dan Sinta #${idx + 1}`}
                      className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B1222]/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </figure>
              </ScrollLinkedItem>
            );
          })}
        </div>
      </div>

      <Dialog open={activeIdx !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="fixed left-[50%] top-[50%] z-50 w-[min(100vw-1.5rem,880px)] max-h-[92dvh] translate-x-[-50%] translate-y-[-50%] p-2.5 sm:p-4 bg-black/95 border border-[#C59B6D]/35 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white overflow-hidden"
        >
          <DialogTitle className="sr-only">Pratinjau Foto Galeri</DialogTitle>
          
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 min-h-11 min-w-11 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white grid place-items-center cursor-pointer active:scale-[0.96] transition-transform"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 min-h-11 min-w-11 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white grid place-items-center cursor-pointer active:scale-[0.96] transition-transform"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-5 h-5 stroke-[2]" />
          </button>

          <div className="w-full flex flex-col items-center justify-center">
            {activeIdx !== null && photos[activeIdx] && (
              <>
                <div className="w-full flex justify-center items-center overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sanitizeSafeMediaSrc(photos[activeIdx].imageUrl, "")}
                    alt={photos[activeIdx].caption || `Foto momen Fauzan dan Sinta #${activeIdx + 1}`}
                    className="max-w-full max-h-[75dvh] object-contain rounded-xl outline outline-1 -outline-offset-1 outline-white/10 shadow-2xl"
                  />
                </div>

                {photos[activeIdx].caption ? (
                  <DialogDescription className="mt-2 text-center text-white/95 font-sans text-xs sm:text-sm tracking-wide bg-white/10 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
                    {photos[activeIdx].caption}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    Foto momen pernikahan Fauzan dan Sinta
                  </DialogDescription>
                )}

                <span className="mt-1 text-white/70 font-sans text-xs tabular-nums font-medium">
                  {activeIdx + 1} / {photos.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
