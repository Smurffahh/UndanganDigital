"use client";

import { useState, useEffect, useCallback } from "react";
import { SongketRibbon } from "./Ornaments";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal, ParallaxPhotoFrame } from "./ScrollReveal";

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
        {/* Header Seksi (Staggered Chunk 1 & 2) */}
        <header className="text-center mb-9">
          <ScrollReveal delay={0} variant="fade-up">
            <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
              Our Gallery
            </p>
          </ScrollReveal>

          <ScrollReveal delay={90} variant="fade-up">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
              Galeri Momen
            </h2>
            <SongketRibbon />
            <p className="mt-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600">
              #SINgkatceritaFAUZAN
            </p>
          </ScrollReveal>
        </header>

        {/* CSS Multi-Column Masonry with Frame Reveal Stagger */}
        <div className="columns-2 md:columns-3 gap-3.5 md:gap-4.5 space-y-3.5 md:space-y-4.5">
          {photos.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              variant="frame-reveal"
              delay={Math.min(320, (idx % 6) * 60)}
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
                <ParallaxPhotoFrame maxShiftPercent={6} className="w-full h-full rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.caption || `Foto momen Fauzan dan Sinta #${idx + 1}`}
                    className="w-full h-auto object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                </ParallaxPhotoFrame>
                <div className="absolute inset-0 bg-gradient-to-t from-[#5d3a41]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Foto Layar Penuh"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup pratinjau foto"
            className="absolute top-5 right-5 p-2 rounded-full bg-surface-white/10 text-white hover:bg-surface-white/20 transition-colors z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-4 p-3 rounded-full bg-surface-white/10 text-white hover:bg-surface-white/20 transition-colors cursor-pointer hidden sm:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Lightbox Image and Caption */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIdx].imageUrl}
              alt={photos[activeIdx].caption || "Foto momen prewedding"}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-gold-500/30"
            />
            {photos[activeIdx].caption && (
              <p className="mt-3.5 text-center text-sm font-light text-rose-100/90 font-serif italic max-w-xl">
                {photos[activeIdx].caption}
              </p>
            )}
            <p className="text-[11px] text-gold-300/80 mt-1.5 tabular-nums">
              {activeIdx + 1} / {photos.length}
            </p>
          </div>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Foto selanjutnya"
            className="absolute right-4 p-3 rounded-full bg-surface-white/10 text-white hover:bg-surface-white/20 transition-colors cursor-pointer hidden sm:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
