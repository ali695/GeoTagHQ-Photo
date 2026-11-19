// Minimal, dependency-free PDF writer: one JPEG image per page (DCTDecode), so the browser
// can build a PDF locally without uploading anything. Sizes are in PDF points (1/72 inch).

export type PageSize = 'a4' | 'letter' | 'fit';
export type Orientation = 'auto' | 'portrait' | 'landscape';
export type PdfImage = { jpeg: Uint8Array; width: number; height: number };

const SIZES: Record<Exclude<PageSize, 'fit'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

const enc = new TextEncoder();
const num = (n: number) => (Math.round(n * 100) / 100).toString();

export function buildPdf(
  images: PdfImage[],
  opts: { size: PageSize; orientation: Orientation; marginMm: number; title?: string },
): Uint8Array {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (data: string | Uint8Array) => {
    const bytes = typeof data === 'string' ? enc.encode(data) : data;
    chunks.push(bytes);
    length += bytes.length;
  };
  const startObj = (id: number) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
  };

  // Object ids: 1 catalog, 2 pages, 3 info, then 3 per page (page, contents, image).
  const pageIds = images.map((_, i) => 4 + i * 3);
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  startObj(1);
  push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  startObj(2);
  push(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${images.length} >>\nendobj\n`);
  startObj(3);
  const safeTitle = (opts.title || 'Images').replace(/[()\\]/g, '');
  push(`<< /Title (${safeTitle}) /Producer (PinPixl) >>\nendobj\n`);

  const margin = (opts.marginMm / 25.4) * 72;
  images.forEach((img, i) => {
    const pageId = pageIds[i];
    const contentId = pageId + 1;
    const imageId = pageId + 2;

    // Page size: fixed paper size (rotated for landscape) or the image's own size at 96 dpi.
    let pw: number, ph: number;
    if (opts.size === 'fit') {
      pw = (img.width * 72) / 96 + margin * 2;
      ph = (img.height * 72) / 96 + margin * 2;
    } else {
      const [w, h] = SIZES[opts.size];
      const landscape = opts.orientation === 'landscape' || (opts.orientation === 'auto' && img.width > img.height);
      [pw, ph] = landscape ? [h, w] : [w, h];
    }
    // Fit the image inside the printable area, centred, keeping its aspect ratio.
    const aw = pw - margin * 2;
    const ah = ph - margin * 2;
    const scale = Math.min(aw / img.width, ah / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const x = (pw - dw) / 2;
    const y = (ph - dh) / 2;

    startObj(pageId);
    push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(pw)} ${num(ph)}] /Resources << /XObject << /Im0 ${imageId} 0 R >> /ProcSet [/PDF /ImageC] >> /Contents ${contentId} 0 R >>\nendobj\n`);

    const stream = `q\n${num(dw)} 0 0 ${num(dh)} ${num(x)} ${num(y)} cm\n/Im0 Do\nQ\n`;
    startObj(contentId);
    push(`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream\nendobj\n`);

    startObj(imageId);
    push(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.jpeg.length} >>\nstream\n`);
    push(img.jpeg);
    push('\nendstream\nendobj\n');
  });

  const total = 4 + images.length * 3;
  const xrefAt = length;
  let xref = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let id = 1; id < total; id++) xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${total} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}
