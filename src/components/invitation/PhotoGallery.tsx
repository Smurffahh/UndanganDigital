"use client";

import { useState, useEffect, useCallback } from "react";
import { SongketRibbon } from "./Ornaments";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
    <section id="galeri" className="py-20 relative" aria-label="Galeri Foto Momen">
      <div className="w-[min(100%-2.75rem,980px)] mx-auto">
        <header className="text-center mb-9">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
            Our Gallery
          </p>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
            Galeri Momen
          </h2>
          <SongketRibbon />
        </header>

        {/* CSS Multi-Column Masonry */}
        <div className="columns-2 md:columns-3 gap-3.5 md:gap-4.5 space-y-3.5 md:space-y-4.5">
          {photos.map((item, idx) => (
            <figure
              key={item.id}
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
              className="break-inside-avoid relative rounded-2xl overflow-hidden border border-gold-500/35 shadow-md cursor-zoom-in bg-rose-100 group transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-rose-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.caption || "Foto momen Fauzan dan Sinta"}
                className="w-full h-auto object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5d3a41]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Foto Layar Penuh"
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-[#2b151b]/95 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-300"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup pratinjau foto"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-surface-white/15 border border-gold-300/40 text-gold-300 grid place-items-center hover:bg-surface-white/25 transition-transform duration-150 active:scale-[0.96] cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-white/15 border border-gold-300/40 text-gold-300 grid place-items-center hover:bg-surface-white/25 transition-transform duration-150 active:scale-[0.96] cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center max-w-[88vw] max-h-[80vh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIdx].imageUrl}
              alt={photos[activeIdx].caption || ""}
              className="max-w-full max-h-[72vh] object-contain rounded-xl border border-gold-300/50 shadow-2xl outline outline-1 -outline-offset-1 outline-black/10"
            />
            {photos[activeIdx].caption && (
              <p className="mt-3.5 text-xs sm:text-sm font-serif italic text-gold-300 text-center max-w-[500px]">
                {photos[activeIdx].caption}
              </p>
            )}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Foto berikutnya"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface-white/15 border border-gold-300/40 text-gold-300 grid place-items-center hover:bg-surface-white/25 transition-transform duration-150 active:scale-[0.96] cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      )}
    </section>
  );
}
