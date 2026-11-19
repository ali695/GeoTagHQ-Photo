'use client';

// Removes metadata (EXIF incl. GPS, XMP, IPTC, comments) from images in the browser.
// JPEG, PNG and WebP are cleaned losslessly by cutting the metadata blocks out of the
// file, so the pixels are untouched. Other formats are re-encoded, which drops metadata.

import { encodeCanvas, fileToCanvas, isHeicFile, replaceExt } from './imageIO';
import { parseExifAny } from './exifAny';

export type StripNote = 'heic' | 'format' | 'rotated';
export type StripResult = { blob: Blob; name: string; method: 'lossless' | 're-encoded'; note?: StripNote };

const u8 = async (b: Blob) => new Uint8Array(await b.arrayBuffer());
const ascii = (b: Uint8Array, at: number, len: number) => String.fromCharCode(...b.subarray(at, at + len));

/** JPEG: drop APP1 (EXIF/XMP), APP12/APP13 (Ducky/IPTC/Photoshop) and COM; keep APP0, APP2 (ICC), APP14 and image data. */
function stripJpeg(b: Uint8Array): Uint8Array {
  if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error('Not a JPEG');
  const out: Uint8Array[] = [b.subarray(0, 2)];
  let pos = 2;
  while (pos + 4 <= b.length) {
    if (b[pos] !== 0xff) throw new Error('Corrupt JPEG');
    const marker = b[pos + 1];
    if (marker === 0xda) {
      // Start of scan: the rest is compressed image data, copy as-is.
      out.push(b.subarray(pos));
      break;
    }
    const len = (b[pos + 2] << 8) | b[pos + 3];
    const seg = b.subarray(pos, pos + 2 + len);
    const drop = marker === 0xe1 || marker === 0xec || marker === 0xed || marker === 0xfe;
    if (!drop) out.push(seg);
    pos += 2 + len;
  }
  const total = out.reduce((s, x) => s + x.length, 0);
  const res = new Uint8Array(total);
  let o = 0;
  for (const x of out) {
    res.set(x, o);
    o += x.length;
  }
  return res;
}

/** PNG: keep only rendering-critical chunks. */
const PNG_KEEP = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS', 'gAMA', 'cHRM', 'sRGB', 'iCCP', 'sBIT', 'pHYs', 'acTL', 'fcTL', 'fdAT', 'bKGD']);
function stripPng(b: Uint8Array): Uint8Array {
  const parts: Uint8Array[] = [b.subarray(0, 8)];
  let pos = 8;
  while (pos + 12 <= b.length) {
    const len = ((b[pos] << 24) | (b[pos + 1] << 16) | (b[pos + 2] << 8) | b[pos + 3]) >>> 0;
    const type = ascii(b, pos + 4, 4);
    const end = pos + 12 + len;
    if (PNG_KEEP.has(type)) parts.push(b.subarray(pos, end));
    pos = end;
    if (type === 'IEND') break;
  }
  const res = new Uint8Array(parts.reduce((s, x) => s + x.length, 0));
  let o = 0;
  for (const x of parts) {
    res.set(x, o);
    o += x.length;
  }
  return res;
}

/** WebP: drop EXIF and XMP chunks, clear their VP8X flags and fix the RIFF size. */
function stripWebp(b: Uint8Array): Uint8Array {
  const parts: Uint8Array[] = [];
  let pos = 12;
  while (pos + 8 <= b.length) {
    const id = ascii(b, pos, 4);
    const size = (b[pos + 4] | (b[pos + 5] << 8) | (b[pos + 6] << 16) | (b[pos + 7] << 24)) >>> 0;
    const end = pos + 8 + size + (size % 2);
    if (id !== 'EXIF' && id !== 'XMP ') {
      const chunk = b.slice(pos, Math.min(end, b.length));
      if (id === 'VP8X') chunk[8] &= ~(0x08 | 0x04); // clear EXIF and XMP flags
      parts.push(chunk);
    }
    pos = end;
  }
  const body = parts.reduce((s, x) => s + x.length, 0);
  const res = new Uint8Array(12 + body);
  res.set(b.subarray(0, 12));
  const riff = body + 4;
  res[4] = riff & 0xff;
  res[5] = (riff >> 8) & 0xff;
  res[6] = (riff >> 16) & 0xff;
  res[7] = (riff >> 24) & 0xff;
  let o = 12;
  for (const x of parts) {
    res.set(x, o);
    o += x.length;
  }
  return res;
}

async function orientation(file: Blob): Promise<number> {
  try {
    const d = await parseExifAny(file, { tiff: true, translateValues: false, pick: ['Orientation'] });
    return d?.Orientation || 1;
  } catch {
    return 1;
  }
}

export async function stripMetadata(file: File): Promise<StripResult> {
  const name = file.name.replace(/(\.[^.]+)?$/, (ext) => `-no-exif${ext || ''}`);
  const type = file.type || '';
  const lower = file.name.toLowerCase();

  // HEIC/AVIF/TIFF/GIF etc.: re-encode. HEIC becomes JPEG because browsers can't write HEIC.
  if (isHeicFile(file) || !/jpe?g|png|webp/.test(type + lower)) {
    const canvas = await fileToCanvas(file, isHeicFile(file) ? { background: '#ffffff' } : {});
    const toJpeg = isHeicFile(file) || /tiff?|avif|gif/.test(type + lower);
    const blob = await encodeCanvas(canvas, toJpeg ? 'image/jpeg' : 'image/png', 0.95);
    return {
      blob,
      name: replaceExt(name, toJpeg ? 'jpg' : 'png'),
      method: 're-encoded',
      note: isHeicFile(file) ? 'heic' : 'format',
    };
  }

  const bytes = await u8(file);
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isPng = ascii(bytes, 1, 3) === 'PNG';
  const isWebpFile = ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP';

  // A rotated photo depends on the EXIF orientation tag. Removing it would turn the
  // photo sideways, so re-encode it upright instead.
  if ((isJpeg || isWebpFile) && (await orientation(file)) !== 1) {
    const canvas = await fileToCanvas(file);
    const mime = isJpeg ? 'image/jpeg' : 'image/webp';
    return { blob: await encodeCanvas(canvas, mime, 0.95), name, method: 're-encoded', note: 'rotated' };
  }

  if (isJpeg) return { blob: new Blob([stripJpeg(bytes) as BlobPart], { type: 'image/jpeg' }), name, method: 'lossless' };
  if (isPng) return { blob: new Blob([stripPng(bytes) as BlobPart], { type: 'image/png' }), name, method: 'lossless' };
  if (isWebpFile) return { blob: new Blob([stripWebp(bytes) as BlobPart], { type: 'image/webp' }), name, method: 'lossless' };

  throw new Error('Unrecognised image file.');
}

/** Summary of privacy-relevant metadata, for showing what was found and confirming removal. */
export async function metadataSummary(file: Blob) {
  const d = await parseExifAny(file, { tiff: true, exif: true, gps: true, iptc: true, xmp: true, ifd1: false, mergeOutput: true }).catch(() => undefined);
  if (!d) return { count: 0, gps: null as null | { lat: number; lng: number }, camera: undefined as string | undefined, date: undefined as string | undefined, software: undefined as string | undefined };
  const count = Object.keys(d).filter((k) => !['latitude', 'longitude'].includes(k)).length;
  const gps = Number.isFinite(d.latitude) && Number.isFinite(d.longitude) ? { lat: d.latitude, lng: d.longitude } : null;
  const camera = [d.Make, d.Model].filter(Boolean).join(' ') || undefined;
  const date = d.DateTimeOriginal ? new Date(d.DateTimeOriginal).toLocaleString() : undefined;
  return { count, gps, camera, date, software: d.Software as string | undefined };
}
