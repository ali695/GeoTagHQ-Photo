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
    };

    console.log("=== GEOTAG API INCOMING REQUEST ===");
    console.log("Method:", req.method);
    console.log("Content-Type:", req.headers.get("content-type"));
    console.log("FormData keys:", Array.from(formData.keys()));
    console.log("File exists:", !!file);
    console.log("File name:", file?.name);
    console.log("File size:", file?.size);
    console.log("File type:", file?.type);
    console.log("Lat:", lat, "Lng:", lng);
    console.log("make:", make, "model:", model, "dateTaken:", dateTaken);
    console.log("forceJpgConversion:", forceJpgConversion);
    console.log("SEO Data Raw:", seoDataRaw);

    let seoData;
    try {
      seoData = SEOSchema.parse(seoDataRaw);
    } catch (e: any) {
      console.error("Validation Error on SEO fields:", e.errors);
      return NextResponse.json({ error: "Validation Error on SEO fields", details: e.errors }, { status: 400 });
    }

    if (!file) {
      console.error("Missing file. Keys:", Array.from(formData.keys()));
      return NextResponse.json({ error: "Missing uploaded file. Received formData keys: " + Array.from(formData.keys()).join(', ') }, { status: 400 });
    }
    
    if (lat && !lng) {
      console.error("Lat missing lng");
      return NextResponse.json({ error: "Longitude missing but Latitude was provided." }, { status: 400 });
    }
    if (!lat && lng) {
      console.error("Lng missing lat");
      return NextResponse.json({ error: "Latitude missing but Longitude was provided." }, { status: 400 });
    }

    if (!lat && !lng && Object.keys(seoData).every(k => !seoData[k as keyof typeof seoData]) && !make && !model && !dateTaken) {
      console.error("No metadata provided at all");
      return NextResponse.json({ error: "No metadata provided to write. Require at least one of: lat/lng, SEO fields, or Camera fields." }, { status: 400 });
    }

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
      
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
         console.error("Invalid latitude:", latitude);
         return NextResponse.json({ error: "Invalid latitude: " + lat }, { status: 400 });
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
         console.error("Invalid longitude:", longitude);
         return NextResponse.json({ error: "Invalid longitude: " + lng }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    let processedBuffer: Buffer = buffer;
    let processingFormat = originalExt;
    let convertedToJpg = false;

    // Convert to JPG if requested, OR if we need to write EXIF (piexifjs only supports JPG natively here)
    if (forceJpgConversion || !['jpg', 'jpeg'].includes(originalExt)) {
       processedBuffer = Buffer.from(await sharp(buffer).jpeg({ quality: 95 }).toBuffer());
       processingFormat = 'jpg';
       convertedToJpg = true;
    }

    // Now processedBuffer is definitely a JPEG. We can modify its EXIF via piexifjs!
    const jpegDataStr = "data:image/jpeg;base64," + processedBuffer.toString('base64');
    let exifObject: any = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };
    
    try {
      const loadedExif = piexif.load(jpegDataStr);
      exifObject = { ...exifObject, ...loadedExif };
    } catch (e) {
      // no existing exif, ignore
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

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-geotagged." + processingFormat;
    
    return new NextResponse(finalBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${newFileName}"`,
        "X-Converted-To-Jpg": convertedToJpg ? "true" : "false"
      }
    });

  } catch (error: any) {
    console.error("Geotagging error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}
