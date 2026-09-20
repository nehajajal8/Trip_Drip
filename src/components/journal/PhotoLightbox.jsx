import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function PhotoLightbox({
  isOpen,
  photos = [],
  currentIndex = 0,
  onClose,
  onChangeIndex,
}) {
  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  const photoUrl = typeof currentPhoto === "string" ? currentPhoto : currentPhoto?.url;
  const photoCaption = typeof currentPhoto === "object" ? currentPhoto?.caption : "";

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
    },
    [currentIndex, photos.length, onChangeIndex]
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      onChangeIndex((currentIndex + 1) % photos.length);
    },
    [currentIndex, photos.length, onChangeIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-enter"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between text-sand w-full max-w-5xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-widest uppercase text-sand/60 bg-white/10 px-3 py-1">
            Photo {currentIndex + 1} / {photos.length}
          </span>
          {photos.length > 1 && (
            <span className="hidden sm:inline font-mono text-xs text-sand/40">
              Use ← → arrow keys to navigate
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 text-sand/70 hover:text-sand hover:bg-white/10 rounded-full transition-colors"
          title="Close (Esc)"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Photo Center Container */}
      <div
        className="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev Button */}
        {photos.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 z-10 p-2.5 rounded-full bg-slate/60 hover:bg-saffron text-white backdrop-blur-sm transition-colors shadow-lg"
            title="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* The Image */}
        <div className="relative max-h-[75vh] max-w-full flex items-center justify-center">
          <img
            src={photoUrl}
            alt={photoCaption || "Enlarged journal photo"}
            className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl transition-all select-none"
          />
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 z-10 p-2.5 rounded-full bg-slate/60 hover:bg-saffron text-white backdrop-blur-sm transition-colors shadow-lg"
            title="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Caption Bar */}
      <div
        className="w-full max-w-2xl mx-auto text-center py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {photoCaption ? (
          <p className="font-sans text-sm text-sand/90 bg-white/10 px-4 py-2 rounded inline-block backdrop-blur-sm shadow-sm">
            {photoCaption}
          </p>
        ) : (
          <p className="font-mono text-xs text-sand/30">
            Yatra Memory Snapshot
          </p>
        )}
      </div>
    </div>
  );
}
