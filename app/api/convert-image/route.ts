import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const exportFormat = formData.get("format")?.toString() || "original";
    
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    
    const buffer = Buffer.from(await file.arrayBuffer());
    let finalBuffer: any = buffer;
    
    let mimeType = 'application/octet-stream';
    let ext = exportFormat;
    
    if (exportFormat === 'png') {
       finalBuffer = await sharp(buffer).withMetadata().png().toBuffer();
       mimeType = 'image/png';
    } else if (exportFormat === 'webp') {
       finalBuffer = await sharp(buffer).withMetadata().webp({ quality: 90 }).toBuffer();
       mimeType = 'image/webp';
    } else if (exportFormat === 'avif') {
       finalBuffer = await sharp(buffer).withMetadata().avif({ quality: 90 }).toBuffer();
       mimeType = 'image/avif';
    } else if (exportFormat === 'tiff') {
       finalBuffer = await sharp(buffer).withMetadata().tiff().toBuffer();
       mimeType = 'image/tiff';
    } else if (exportFormat === 'gif') {
       finalBuffer = await sharp(buffer).withMetadata().gif().toBuffer();
       mimeType = 'image/gif';
    } else if (exportFormat === 'jpg' || exportFormat === 'jpeg') {
       finalBuffer = await sharp(buffer).withMetadata().jpeg({ quality: 95 }).toBuffer();
       mimeType = 'image/jpeg';
       ext = 'jpg';
    } else {
       // original
       return new NextResponse(buffer, {
          status: 200,
          headers: { "Content-Type": file.type, "Content-Disposition": `attachment; filename="${file.name}"` }
       });
    }
    
    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;
    return new NextResponse(finalBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${newFileName}"`
      }
    });

  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: error.message || "Failed to convert image" }, { status: 500 });
  }
}
