import { guard } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_BYTES = 25 * 1024 * 1024;

// Server-side conversion with sharp. The browser tools use this only as a fallback
// (e.g. when a browser cannot encode WebP) and for PNG palette compression.
// Images are processed in memory and never written to disk.
export async function POST(req: NextRequest) {
  const limited = guard(req, 'convert', 150, 10 * 60 * 1000);
  if (limited) return limited;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const exportFormat = (formData.get("format")?.toString() || "original").toLowerCase();
    const q = parseInt(formData.get("quality")?.toString() || "", 10);
    const quality = Number.isFinite(q) ? Math.min(100, Math.max(1, q)) : 90;
    const keepMetadata = formData.get("keepMetadata")?.toString() !== "false";

    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 25 MB." }, { status: 413 });

    const buffer = Buffer.from(await file.arrayBuffer());
    // rotate() bakes the EXIF orientation into the pixels so output stays upright.
    let img = sharp(buffer, { failOn: "error" }).rotate();
    if (keepMetadata) img = img.withMetadata({ orientation: 1 });

    let finalBuffer: Buffer;
    let mimeType: string;
    let ext = exportFormat;

    switch (exportFormat) {
      case "png":
        // palette + quality gives TinyPNG-style lossy PNG compression when quality < 100.
        finalBuffer = await img.png(quality < 100 ? { palette: true, quality, effort: 8, compressionLevel: 9 } : { compressionLevel: 9 }).toBuffer();
        mimeType = "image/png";
        break;
      case "webp":
        finalBuffer = await img.webp({ quality }).toBuffer();
        mimeType = "image/webp";
        break;
      case "avif":
        finalBuffer = await img.avif({ quality: Math.min(quality, 80) }).toBuffer();
        mimeType = "image/avif";
        break;
      case "tiff":
        finalBuffer = await img.tiff().toBuffer();
        mimeType = "image/tiff";
        break;
      case "gif":
        finalBuffer = await img.gif().toBuffer();
        mimeType = "image/gif";
        break;
      case "jpg":
      case "jpeg":
        finalBuffer = await img.flatten({ background: "#ffffff" }).jpeg({ quality, mozjpeg: true }).toBuffer();
        mimeType = "image/jpeg";
        ext = "jpg";
        break;
      default:
        return new NextResponse(buffer as unknown as BodyInit, {
          status: 200,
          headers: { "Content-Type": file.type, "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"` },
        });
    }

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;
    return new NextResponse(finalBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(newFileName)}"`,
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error?.message);
    const msg = /unsupported image format|heif/i.test(error?.message || "")
      ? "This image format is not supported on the server."
      : "Failed to convert image";
    return NextResponse.json({ error: msg }, { status: 415 });
  }
}
