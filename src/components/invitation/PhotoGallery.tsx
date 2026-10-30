"use client";

import { useState, useEffect, useCallback } from "react";
import { SongketRibbon } from "./Ornaments";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

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
    document.body.style.overflow = "hidden";
  };

  const handleClose = useCallback(() => {
    setActiveIdx(null);
    document.body.style.overflow = "";
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
          <ScrollLinkedItem offsetY={45}>
            <p className="typo-eyebrow text-[#a9823a] mb-2">
              Our Gallery
            </p>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={55}>
            <h2 className="typo-section-title">
              Galeri Momen
            </h2>
            <SongketRibbon />
            <p className="mt-2.5 font-sans text-xs sm:text-sm font-semibold tracking-wide normal-case text-[#a9823a]">
              #SINgkatceritaFAUZAN
            </p>
          </ScrollLinkedItem>
        </header>

        <div className="columns-2 md:columns-3 gap-3.5 md:gap-4.5 space-y-3.5 md:space-y-4.5">
          {photos.map((item, idx) => (
            <ScrollLinkedItem
              key={item.id}
              offsetY={50}
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
                className="relative rounded-2xl overflow-hidden border border-gold-500/35 shadow-md cursor-zoom-in bg-rose-100 group transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-rose-700"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.caption || `Foto momen Fauzan dan Sinta #${idx + 1}`}
                    className="w-full h-auto object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#5d3a41]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </figure>
            </ScrollLinkedItem>
          ))}
        </div>
      </div>

      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Foto Penuh"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-[0.96] transition-transform duration-150"
            aria-label="Tutup foto penuh"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer active:scale-[0.96] transition-transform duration-150"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer active:scale-[0.96] transition-transform duration-150"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIdx].imageUrl}
              alt={photos[activeIdx].caption || `Foto momen Fauzan dan Sinta #${activeIdx + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-gold-500/40"
            />
            {photos[activeIdx].caption && (
              <p className="mt-3 text-center text-white/90 font-sans text-xs sm:text-sm tracking-wide bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-xs">
                {photos[activeIdx].caption}
              </p>
            )}
            <span className="mt-2 text-white/60 font-sans text-xs tabular-nums">
              {activeIdx + 1} / {photos.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
