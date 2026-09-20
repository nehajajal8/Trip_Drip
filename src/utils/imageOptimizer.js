/**
 * Client-side image compression and resizing utility.
 * Optimizes photos to compact base64 data URLs for fast IndexedDB offline storage
 * and cloud sync without overloading browser storage or network payloads.
 */

export async function optimizeImage(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image."));
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down proportionally if larger than maximum constraints
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Unable to create canvas context for image optimization."));
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to compressed data URL
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      // Calculate approximate size in bytes
      const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
      const approxBytes = Math.round((base64Length * 3) / 4);

      resolve({
        url: dataUrl,
        width,
        height,
        sizeBytes: approxBytes,
        name: file.name,
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for optimization."));
    };

    img.src = objectUrl;
  });
}

/**
 * Format bytes into human readable format (e.g. 145 KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
