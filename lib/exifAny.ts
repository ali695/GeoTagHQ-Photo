import exifr from 'exifr';

// exifr reads JPEG, TIFF, HEIC, AVIF and PNG but not WebP. WebP keeps EXIF in a
// RIFF "EXIF" chunk holding a plain TIFF block, so pull that out and parse it as TIFF.

async function toBytes(input: Blob | ArrayBuffer | Uint8Array): Promise<Uint8Array> {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  return new Uint8Array(await input.arrayBuffer());
}

const ascii = (b: Uint8Array, at: number, len: number) => String.fromCharCode(...b.subarray(at, at + len));

export function isWebp(bytes: Uint8Array): boolean {
  return bytes.length > 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP';
}

/** Returns the TIFF/EXIF block from a WebP file, or null if it has none. */
export function webpExifBlock(bytes: Uint8Array): Uint8Array | null {
  let pos = 12;
  while (pos + 8 <= bytes.length) {
    const id = ascii(bytes, pos, 4);
    const size = bytes[pos + 4] | (bytes[pos + 5] << 8) | (bytes[pos + 6] << 16) | (bytes[pos + 7] << 24);
    const start = pos + 8;
    if (id === 'EXIF') {
      let block = bytes.subarray(start, start + size);
      // Some writers prefix the block with "Exif\0\0" like JPEG does.
      if (ascii(block, 0, 4) === 'Exif') block = block.subarray(6);
      return block;
    }
    pos = start + size + (size % 2); // chunks are padded to an even size
  }
  return null;
}

/** exifr.parse that also understands WebP. Returns undefined when there is no metadata. */
export async function parseExifAny(input: Blob | ArrayBuffer | Uint8Array, options: any = true): Promise<any> {
  const bytes = await toBytes(input);
  try {
    if (isWebp(bytes)) {
      const block = webpExifBlock(bytes);
      return block ? await exifr.parse(block, options) : undefined;
    }
    return await exifr.parse(bytes, options);
  } catch (e: any) {
    if (/unknown file format/i.test(e?.message || '')) return undefined;
    throw e;
  }
}

/** GPS from any supported image (including WebP), or null. */
export async function readGpsAny(input: Blob | ArrayBuffer | Uint8Array): Promise<{ lat: number; lng: number } | null> {
  try {
    const bytes = await toBytes(input);
    const src = isWebp(bytes) ? webpExifBlock(bytes) : bytes;
    if (!src) return null;
    const g = await exifr.gps(src);
    return g && Number.isFinite(g.latitude) && Number.isFinite(g.longitude) ? { lat: g.latitude, lng: g.longitude } : null;
  } catch {
    return null;
  }
}
