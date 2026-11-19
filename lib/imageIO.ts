'use client';

// Shared browser-side image helpers used by the geotag tool and the converter,
// compressor and metadata tools. Everything here runs in the visitor's browser.

export type OutputMime = 'image/jpeg' | 'image/png' | 'image/webp';

export const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/tiff': 'tiff',
  'image/bmp': 'bmp',
};

/** HEIC/HEIF by MIME type or extension (Windows often reports an empty type). */
export function isHeicFile(file: File): boolean {
  const t = (file.type || '').toLowerCase();
  return t === 'image/heic' || t === 'image/heif' || /\.(heic|heif)$/i.test(file.name);
}

export function isTiffFile(file: File): boolean {
  return file.type === 'image/tiff' || /\.tiff?$/i.test(file.name);
}

export function isSvgFile(file: File): boolean {
  return file.type === 'image/svg+xml' || /\.svg$/i.test(file.name);
}

export function replaceExt(name: string, ext: string): string {
  const base = name.replace(/\.[^/.]+$/, '');
  return `${base || 'image'}.${ext}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Decodes HEIC/HEIF (HEVC) in the browser with libheif compiled to WebAssembly.
 * Loaded on demand so other pages never download the decoder.
 */
export async function heicToBlob(file: Blob, type: 'image/jpeg' | 'image/png' = 'image/jpeg', quality = 0.92): Promise<Blob> {
  const { heicTo } = await import('heic-to/next');
  return heicTo({ blob: file, type, quality });
}

async function heicToBitmap(file: Blob): Promise<ImageBitmap> {
  const { heicTo } = await import('heic-to/next');
  return heicTo({ blob: file, type: 'bitmap' });
}

/** Loads any browser-decodable image (plus HEIC) into something drawable. */
export async function loadDrawable(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close?: () => void }> {
  if (isHeicFile(file)) {
    const bmp = await heicToBitmap(file);
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
  }

  // SVG needs an <img> so it gets a size; give it a default if it has none.
  if (isSvgFile(file)) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Could not read this SVG file.'));
        el.src = url;
      });
      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      return { source: img, width: w, height: h, close: () => URL.revokeObjectURL(url) };
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }

  try {
    // imageOrientation: 'from-image' applies the EXIF rotation, so phone photos stay upright.
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
  } catch {
    // Most browsers (all but Safari) cannot decode TIFF. Decode it on the server instead:
    // sharp turns it into a lossless PNG in memory, nothing is stored.
    if (isTiffFile(file)) {
      const png = await serverConvert(file, 'image/png', 1);
      const bmp = await createImageBitmap(png, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    }
    throw new Error('Your browser cannot read this image format.');
  }
}

/** Draws a file onto a canvas, optionally scaled down and on a solid background. */
export async function fileToCanvas(
  file: File,
  opts: { maxWidth?: number; maxHeight?: number; background?: string; scale?: number } = {},
): Promise<HTMLCanvasElement> {
  const img = await loadDrawable(file);
  try {
    let { width, height } = img;
    if (opts.scale && opts.scale > 0) {
      width = Math.round(width * opts.scale);
      height = Math.round(height * opts.scale);
    }
    const ratio = Math.min(1, opts.maxWidth ? opts.maxWidth / width : 1, opts.maxHeight ? opts.maxHeight / height : 1);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser.');
    if (opts.background) {
      ctx.fillStyle = opts.background;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img.source, 0, 0, width, height);
    return canvas;
  } finally {
    img.close?.();
  }
}

/**
 * Encodes a canvas. Some browsers (older Safari) silently return PNG when asked
 * for WebP; in that case the PNG is converted on the server with sharp.
 */
export async function encodeCanvas(canvas: HTMLCanvasElement, mime: OutputMime, quality = 0.9): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));
  if (!blob) throw new Error('Could not encode the image.');
  if (blob.type === mime) return blob;
  return serverConvert(blob, mime, quality);
}

/** Server fallback (sharp) for formats the browser cannot encode. */
export async function serverConvert(input: Blob, mime: OutputMime, quality = 0.9): Promise<Blob> {
  const format = MIME_EXT[mime];
  const form = new FormData();
  form.append('file', input, `image.${MIME_EXT[input.type] || 'png'}`);
  form.append('format', format);
  form.append('quality', String(Math.round(quality * 100)));
  const res = await fetch('/api/convert-image', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Conversion failed on the server. Please try again.');
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadZip(items: { name: string; blob: Blob }[], zipName: string) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const used = new Set<string>();
  for (const it of items) {
    // Avoid two files with the same name overwriting each other in the ZIP.
    let name = it.name;
    let n = 1;
    while (used.has(name)) name = it.name.replace(/(\.[^.]+)?$/, `-${n++}$1`);
    used.add(name);
    zip.file(name, it.blob);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, zipName);
}
