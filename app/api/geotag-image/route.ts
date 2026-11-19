import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import piexif from "piexifjs";

// Utility for GPS
function degToDmsRational(degrees: number): [[number, number], [number, number], [number, number]] {
  const d = Math.abs(degrees);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = (d - deg - min / 60) * 3600;
  return [
    [deg, 1],
    [min, 1],
    [Math.round(sec * 10000), 10000],
  ];
}

// Convert string to UCS-2 byte array for Windows XP tags
function toUCS2ByteArray(str: string): number[] {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    arr.push(code & 0xff);
    arr.push(code >> 8);
  }
  arr.push(0);
  arr.push(0);
  return arr;
}

const SEOSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  keywords: z.string().optional(),
  businessName: z.string().max(80).optional(),
  serviceCategory: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  district: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  streetAddress: z.string().max(120).optional(),
  postalCode: z.string().max(20).optional(),
  stateRegion: z.string().max(80).optional(),
  countryCode: z.string().max(2).optional(),
  websiteUrl: z.union([z.string().url(), z.literal('')]).optional(),
  schemaMarkup: z.string().optional(),
  ogTags: z.string().optional(),
  hreflang: z.string().optional(),
  semanticClusters: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File | null;
    const lat = formData.get("lat")?.toString();
    const lng = formData.get("lng")?.toString();
    const make = formData.get("cameraMake")?.toString();
    const model = formData.get("cameraModel")?.toString();
    const dateTaken = formData.get("dateTaken")?.toString();
    const forceJpgConversion = formData.get("bestCompatibility") === "true";

    // Extract SEO fields
    const seoDataRaw = {
      title: formData.get("title")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      keywords: formData.get("keywords")?.toString() || undefined,
      businessName: formData.get("businessName")?.toString() || undefined,
      serviceCategory: formData.get("serviceCategory")?.toString() || undefined,
      city: formData.get("city")?.toString() || undefined,
      district: formData.get("district")?.toString() || undefined,
      country: formData.get("country")?.toString() || undefined,
      streetAddress: formData.get("streetAddress")?.toString() || undefined,
      postalCode: formData.get("postalCode")?.toString() || undefined,
      stateRegion: formData.get("stateRegion")?.toString() || undefined,
      countryCode: formData.get("countryCode")?.toString() || undefined,
      websiteUrl: formData.get("websiteUrl")?.toString() || undefined,
      schemaMarkup: formData.get("schemaMarkup")?.toString() || undefined,
      ogTags: formData.get("ogTags")?.toString() || undefined,
      hreflang: formData.get("hreflang")?.toString() || undefined,
      semanticClusters: formData.get("semanticClusters")?.toString() || undefined,
    };

    let seoData;
    try {
      seoData = SEOSchema.parse(seoDataRaw);
    } catch (e: any) {
      return NextResponse.json({ error: "Validation Error on SEO fields", details: e.errors }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "Missing uploaded file. Received formData keys: " + Array.from(formData.keys()).join(', ') }, { status: 400 });
    }
    
    if (lat && !lng) {
      return NextResponse.json({ error: "Longitude missing but Latitude was provided." }, { status: 400 });
    }
    if (!lat && lng) {
      return NextResponse.json({ error: "Latitude missing but Longitude was provided." }, { status: 400 });
    }

    if (!lat && !lng && Object.keys(seoData).every(k => !seoData[k as keyof typeof seoData]) && !make && !model && !dateTaken) {
      return NextResponse.json({ error: "No metadata provided to write. Require at least one of: lat/lng, SEO fields, or Camera fields." }, { status: 400 });
    }

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
      
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
         return NextResponse.json({ error: "Invalid latitude: " + lat }, { status: 400 });
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
         return NextResponse.json({ error: "Invalid longitude: " + lng }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    let processedBuffer: Buffer = buffer;
    
    const compressionMode = formData.get("compressionMode")?.toString() || 'none';
    const targetFormat = formData.get("exportFormat")?.toString() || 'original';

    // Intermediate JPG quality for metadata
    let quality = 95;
    if (compressionMode === 'low') quality = 60;
    else if (compressionMode === 'medium') quality = 75;
    else if (compressionMode === 'high') quality = 90;

    // HEIC/HEIF (HEVC) can't be decoded by sharp. The browser converts these to
    // JPEG before upload, so this only triggers if that step was skipped.
    if (['heic', 'heif'].includes(originalExt) || /image\/hei[cf]/i.test(file.type)) {
      return NextResponse.json({ error: "HEIC photos must be converted to JPG first. Please re-add the photo." }, { status: 415 });
    }

    // Convert to JPG first, because piexifjs ONLY works with JPGs.
    const isJpg = ['jpg', 'jpeg'].includes(originalExt) || file.type === 'image/jpeg';

    // Keep the original EXIF (camera, date, etc.) from JPEG input so recompressing
    // doesn't throw it away.
    let originalExif: any = null;
    if (isJpg) {
      try {
        originalExif = piexif.load("data:image/jpeg;base64," + buffer.toString('base64'));
      } catch {
        originalExif = null;
      }
    }

    let reencoded = false;
    // Re-encode when the input isn't JPEG, when compressing, or when exporting to another
    // format, so the pixels get the EXIF rotation applied (PNG/WebP viewers often ignore the tag).
    const exportsOtherFormat = targetFormat !== 'original' && !['jpg', 'jpeg'].includes(targetFormat);
    if (!isJpg || compressionMode !== 'none' || exportsOtherFormat) {
       // rotate() applies the EXIF orientation to the pixels, so phone photos stay upright
       // once the orientation tag is reset below.
       processedBuffer = Buffer.from(await sharp(buffer).rotate().jpeg({ quality, mozjpeg: true }).toBuffer());
       reencoded = true;
    }

    // Now processedBuffer is definitely a JPEG. We can modify its EXIF via piexifjs!
    const jpegDataStr = "data:image/jpeg;base64," + processedBuffer.toString('base64');
    let exifObject: any = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };
    
    try {
      const loadedExif = reencoded && originalExif ? originalExif : piexif.load(jpegDataStr);
      exifObject = { ...exifObject, ...loadedExif };
    } catch (e) {
      // no existing exif, ignore
    }
    if (reencoded) {
      // Pixels are already upright and the old embedded thumbnail may be rotated or stale.
      exifObject['0th'][piexif.ImageIFD.Orientation] = 1;
      exifObject['1st'] = {};
      exifObject['thumbnail'] = null;
    }

    // Set GPS
    if (latitude !== undefined && longitude !== undefined) {
      exifObject.GPS = {
        ...exifObject.GPS,
        [piexif.GPSIFD.GPSLatitudeRef]: latitude >= 0 ? "N" : "S",
        [piexif.GPSIFD.GPSLatitude]: degToDmsRational(latitude),
        [piexif.GPSIFD.GPSLongitudeRef]: longitude >= 0 ? "E" : "W",
        [piexif.GPSIFD.GPSLongitude]: degToDmsRational(longitude),
        [piexif.GPSIFD.GPSVersionID]: [2, 2, 0, 0],
      };
    }

    // Set Camera attributes
    if (make) exifObject['0th'][piexif.ImageIFD.Make] = make;
    if (model) exifObject['0th'][piexif.ImageIFD.Model] = model;
    if (dateTaken) {
       const d = new Date(dateTaken);
       if (!isNaN(d.getTime())) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          const dateStr = `${d.getFullYear()}:${pad(d.getMonth()+1)}:${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
          exifObject['Exif'][piexif.ExifIFD.DateTimeOriginal] = dateStr;
          exifObject['Exif'][piexif.ExifIFD.DateTimeDigitized] = dateStr;
          exifObject['0th'][piexif.ImageIFD.DateTime] = dateStr;
       }
    }

    // Set SEO Data into EXIF using available fields
    if (seoData.title) {
       exifObject['0th'][piexif.ImageIFD.ImageDescription] = seoData.title;
       exifObject['0th'][40091] = toUCS2ByteArray(seoData.title); // XPTitle
    }
    if (seoData.description) {
       exifObject['0th'][40092] = toUCS2ByteArray(seoData.description); // XPComment
    }
    if (seoData.keywords) {
       exifObject['0th'][40094] = toUCS2ByteArray(seoData.keywords); // XPKeywords
    }
    if (seoData.businessName) {
       exifObject['0th'][piexif.ImageIFD.Artist] = seoData.businessName;
       exifObject['0th'][40093] = toUCS2ByteArray(seoData.businessName); // XPAuthor
    }

    // Extended SEO tags into UserComment for discovery
    const extendedInfo = [];
    if (seoData.serviceCategory) extendedInfo.push(`Service: ${seoData.serviceCategory}`);
    if (seoData.city) extendedInfo.push(`City: ${seoData.city}`);
    if (seoData.country) extendedInfo.push(`Country: ${seoData.country}`);
    if (seoData.websiteUrl) extendedInfo.push(`Website: ${seoData.websiteUrl}`);
    if (seoData.schemaMarkup) extendedInfo.push(`Schema: ${seoData.schemaMarkup.substring(0, 1000)}`);
    if (seoData.semanticClusters) extendedInfo.push(`Topics: ${seoData.semanticClusters}`);
    
    if (extendedInfo.length > 0) {
      const comment = extendedInfo.join(' | ');
      // UserComment is in Exif IFD
      exifObject['Exif'][piexif.ExifIFD.UserComment] = [0, 0, 0, 0, 0, 0, 0, 0, ...Buffer.from(comment, 'utf8')];
    }

    // Since we only use piexifjs, we cannot easily set XMP/IPTC without binary manipulation.
    // However, EXIF tags (ImageDescription, XPTitle, XPKeywords) cover main Local SEO signals.

    let finalBuffer = processedBuffer;
    try {
      const exifBytes = piexif.dump(exifObject);
      const newJpegData = piexif.insert(exifBytes, jpegDataStr);
      const base64Data = newJpegData.split(',')[1];
      finalBuffer = Buffer.from(base64Data, 'base64');
    } catch (e: any) {
      console.error("piexifjs error:", e);
      return NextResponse.json({ error: "Failed to embed metadata: " + e.message }, { status: 500 });
    }

    let formatToConvert = targetFormat === 'original' ? (['jpg', 'jpeg'].includes(originalExt) ? 'jpg' : originalExt) : targetFormat;
    let mimeType = 'image/jpeg';
    let ext = 'jpg';
    let convertedFormat = false;

    try {
       if (formatToConvert === 'png') {
          mimeType = 'image/png';
          ext = 'png';
          convertedFormat = originalExt !== 'png';
          finalBuffer = await sharp(finalBuffer).withMetadata().png().toBuffer();
       } else if (formatToConvert === 'webp') {
          mimeType = 'image/webp';
          ext = 'webp';
          convertedFormat = originalExt !== 'webp';
          finalBuffer = await sharp(finalBuffer).withMetadata().webp({ quality }).toBuffer();
       } else if (formatToConvert === 'avif') {
          mimeType = 'image/avif';
          ext = 'avif';
          convertedFormat = originalExt !== 'avif';
          finalBuffer = await sharp(finalBuffer).withMetadata().avif({ quality }).toBuffer();
       } else if (formatToConvert === 'tiff') {
          mimeType = 'image/tiff';
          ext = 'tiff';
          convertedFormat = originalExt !== 'tiff';
          finalBuffer = await sharp(finalBuffer).withMetadata().tiff().toBuffer();
       } else if (formatToConvert === 'gif') {
          mimeType = 'image/gif';
          ext = 'gif';
          convertedFormat = originalExt !== 'gif';
          finalBuffer = await sharp(finalBuffer).withMetadata().gif().toBuffer();
       } else {
          // Defaults to jpg which is our intermediate format
          convertedFormat = originalExt !== 'jpg' && originalExt !== 'jpeg';
       }
    } catch (e) {
       console.error("Sharp conversion error after EXIF:", e);
       // Fallback to jpeg
       mimeType = 'image/jpeg';
       ext = 'jpg';
    }

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-geotagged." + ext;
    
    return new NextResponse(finalBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${newFileName}"`,
        "X-Converted": convertedFormat ? "true" : "false"
      }
    });

  } catch (error: any) {
    console.error("Geotagging error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}
