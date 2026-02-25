type OptimizeOptions = {
  maxBytes?: number; // default 500KB
  maxLongSide?: number; // student ~1200, invoice ~2000
  mimeType?: "image/jpeg"; // keep JPEG for compatibility
  initialQuality?: number; // default 0.82
  minQuality?: number; // default 0.55
};

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mimeType,
      quality,
    );
  });
}

export async function optimizeImage(
  input: Blob,
  opts: OptimizeOptions = {},
): Promise<File> {
  const {
    maxBytes = 500 * 1024,
    maxLongSide = 1600,
    mimeType = "image/jpeg",
    initialQuality = 0.82,
    minQuality = 0.55,
  } = opts;

  const img = await loadImageFromBlob(input);
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const longSide = Math.max(w, h);
  const scale = longSide > maxLongSide ? maxLongSide / longSide : 1;

  const targetW = Math.max(1, Math.round(w * scale));
  const targetH = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  let lo = minQuality;
  let hi = Math.min(0.95, initialQuality);
  let best: Blob | null = null;

  for (let i = 0; i < 8; i++) {
    const q = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, mimeType, q);

    if (blob.size <= maxBytes) {
      best = blob;
      lo = q;
    } else {
      hi = q;
    }
  }

  if (!best) {
    // aggressive fallback
    return optimizeImage(input, {
      ...opts,
      maxLongSide: Math.min(1200, maxLongSide),
      initialQuality: 0.78,
    });
  }

  return new File([best], `photo.jpg`, { type: mimeType });
}
