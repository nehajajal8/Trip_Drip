import React, { useState, useRef, useCallback } from "react";
import { Image as ImageIcon, Camera, UploadCloud, X, Trash2, Loader2, Sparkles } from "lucide-react";
import { optimizeImage, formatBytes } from "../../utils/imageOptimizer";

export default function PhotoUploader({ photos = [], onChange, maxPhotos = 10 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`Maximum ${maxPhotos} photos allowed per memory entry.`);
      return;
    }

    const filesToProcess = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remainingSlots);

    if (filesToProcess.length === 0) {
      setErrorMsg("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    setProcessing(true);

    try {
      const optimizedResults = await Promise.all(
        filesToProcess.map(async (file) => {
          try {
            const res = await optimizeImage(file, { maxWidth: 1600, quality: 0.82 });
            return {
              id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              url: res.url,
              caption: "",
              sizeBytes: res.sizeBytes,
              name: file.name,
            };
          } catch (err) {
            console.error("Failed to optimize photo:", err);
            return null;
          }
        })
      );

      const validPhotos = optimizedResults.filter(Boolean);
      onChange([...photos, ...validPhotos]);
    } catch (err) {
      setErrorMsg("Some photos could not be processed. Please try again.");
    } finally {
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [photos, maxPhotos]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (idToRemove) => {
    onChange(photos.filter((p) => p.id !== idToRemove));
  };

  const handleCaptionChange = (id, newCaption) => {
    onChange(
      photos.map((p) => (p.id === id ? { ...p, caption: newCaption } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-xs uppercase tracking-widest text-slate/60">
          Visual Memories ({photos.length}/{maxPhotos} Photos)
        </label>
        {photos.length > 0 && (
          <span className="font-mono text-[11px] text-slate/40">
            Click photo to inspect · Captions saved automatically
          </span>
        )}
      </div>

      {/* Dropzone */}
      {photos.length < maxPhotos && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-saffron bg-saffron/5 scale-[0.99]"
              : "border-mist hover:border-saffron/60 bg-ivory/50 hover:bg-ivory"
          } ${processing ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => processFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron mb-1">
              {processing ? (
                <Loader2 size={22} className="animate-spin text-saffron" />
              ) : (
                <Camera size={22} />
              )}
            </div>

            <p className="font-sans text-sm font-semibold text-slate">
              {processing ? "Optimizing & Attaching Photos…" : "Add Trip Photos & Snapshots"}
            </p>
            <p className="font-sans text-xs text-slate/50 max-w-sm">
              Drag & drop photos here, or click to browse. Images are automatically optimized for fast offline loading.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-crimson/10 border border-crimson/20 text-crimson text-xs font-sans flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-crimson/70 hover:text-crimson"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Photos Thumbnail List */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              className="group relative bg-white border border-mist hover:border-saffron/40 transition-shadow shadow-xs flex flex-col overflow-hidden"
            >
              {/* Image preview thumbnail */}
              <div className="relative aspect-[4/3] bg-sand/20 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption || `Memory photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemove(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-slate/80 hover:bg-crimson text-white rounded-full transition-colors shadow-sm"
                  title="Remove photo"
                >
                  <Trash2 size={13} />
                </button>

                {/* Size badge */}
                {photo.sizeBytes && (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-slate/75 text-white font-mono text-[10px] tracking-wider">
                    {formatBytes(photo.sizeBytes)}
                  </span>
                )}
              </div>

              {/* Photo Caption Input */}
              <div className="p-2.5 bg-ivory/60 border-t border-mist/60 flex-1 flex flex-col justify-center">
                <input
                  type="text"
                  placeholder="Caption this photo (e.g. Sunset at Hawa Mahal)..."
                  value={photo.caption || ""}
                  onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                  className="w-full bg-transparent border-b border-transparent focus:border-saffron text-xs font-sans text-slate placeholder:text-slate/40 focus:outline-none py-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
