/**
 * Lightning-Fast Client-Side Image Resizing & Base64 Data-URL Conversion
 * 
 * Bypasses all server upload bottlenecks and eliminates hanging HTTP requests.
 * Uses HTML5 FileReader + Canvas to resize to max-width 800px and 0.8 JPEG quality.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export function compressImageToBase64(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file must be an image"));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error("Empty file data"));
        return;
      }

      const img = new Image();

      img.onerror = () => {
        reject(new Error("Failed to load image element for compression"));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Maintain aspect ratio within bounding box
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // If canvas context fails, fallback to raw reader result
          resolve(src);
          return;
        }

        // Fill background white to handle transparent PNGs converting to JPEG gracefully
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // High quality downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } catch {
          // Fallback to original data URL if toDataURL fails
          resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
