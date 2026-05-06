import { NextRequest, NextResponse } from "next/server";
import { ExifTool } from "exiftool-vendored";
import sharp from "sharp";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import { z } from "zod";

const exiftool = new ExifTool();

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
    
    console.log("=== API /geotag-image DEBUG ===");
    console.log("Method:", req.method);
    console.log("Content-Type:", req.headers.get("content-type"));
    console.log("FormData keys:", Array.from(formData.keys()));

    const file = formData.get("file") as File | null;
    console.log("File exists:", !!file);
    if (file) {
      console.log("File name:", file.name, "size:", file.size, "type:", file.type);
    }
    
    const lat = formData.get("lat")?.toString();
    const lng = formData.get("lng")?.toString();
    console.log("lat:", lat, "lng:", lng);
    
    const make = formData.get("cameraMake")?.toString();
    const model = formData.get("cameraModel")?.toString();
    const dateTaken = formData.get("dateTaken")?.toString();
    const forceJpgConversion = formData.get("bestCompatibility") === "true";
    console.log("bestCompatibility:", forceJpgConversion);

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
    console.log("seoDataRaw:", seoDataRaw);

    let seoData;
    try {
      seoData = SEOSchema.parse(seoDataRaw);
    } catch (e: any) {
      console.log("SEOSchema Validation Error:", e.errors);
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
        return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        return NextResponse.json({ error: "Invalid longitude" }, { status: 400 });
      }
    }

    const buffer = await file.arrayBuffer();
    const originalExt = file.name.split('.').pop()?.toLowerCase() || '';
    const tempDir = os.tmpdir();
    const originalFileId = Math.random().toString(36).substring(7);
    const inFilePath = path.join(tempDir, `in_${originalFileId}.${originalExt}`);
    await writeFile(inFilePath, Buffer.from(buffer));

    let processingFormat = originalExt;
    let currentInFilePath = inFilePath;
    let convertedToJpg = false;

    if (forceJpgConversion && !['jpg', 'jpeg'].includes(originalExt)) {
       const outJpgPath = path.join(tempDir, `converted_${originalFileId}.jpg`);
       await sharp(currentInFilePath).jpeg({ quality: 95 }).toFile(outJpgPath);
       processingFormat = 'jpg';
       currentInFilePath = outJpgPath;
       convertedToJpg = true;
    }

    const tags: any = {};
    
    if (latitude !== undefined && longitude !== undefined) {
      tags.GPSLatitude = latitude;
      tags.GPSLatitudeRef = latitude >= 0 ? "N" : "S";
      tags.GPSLongitude = longitude;
      tags.GPSLongitudeRef = longitude >= 0 ? "E" : "W";
    }

    if (make) tags.Make = make;
    if (model) tags.Model = model;
    if (dateTaken) {
       const d = new Date(dateTaken);
       if (!isNaN(d.getTime())) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          const dateStr = `${d.getFullYear()}:${pad(d.getMonth()+1)}:${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
          tags.DateTimeOriginal = dateStr;
       }
    }

    // Assign SEO tags based on requested mapping
    if (seoData.title) {
       tags['XMP-dc:Title'] = seoData.title;
       tags['ObjectName'] = seoData.title; // IPTC
       tags['ImageDescription'] = seoData.title; // EXIF
    }
    if (seoData.description) {
       tags['XMP-dc:Description'] = seoData.description;
       tags['Caption-Abstract'] = seoData.description; // IPTC
       // EXIF:ImageDescription is used for title usually, but let's just write to EXIF if needed or just use XMP/IPTC
    }
    if (seoData.keywords) {
       const kwArray = seoData.keywords.split(',').map(s => s.trim()).filter(Boolean);
       tags['XMP-dc:Subject'] = kwArray;
       tags['Keywords'] = kwArray; // IPTC
    }
    if (seoData.businessName) {
       tags['Artist'] = seoData.businessName; // EXIF
       tags['XMP-dc:Creator'] = seoData.businessName;
       tags['By-line'] = seoData.businessName; // IPTC
    }
    if (seoData.city) {
       tags['City'] = seoData.city; // IPTC
       tags['XMP-photoshop:City'] = seoData.city;
    }
    if (seoData.district) {
       tags['Sub-location'] = seoData.district; // IPTC
    }
    if (seoData.country) {
       tags['Country-PrimaryLocationName'] = seoData.country; // IPTC
       tags['XMP-photoshop:Country'] = seoData.country;
    }
    if (seoData.stateRegion) {
       tags['Province-State'] = seoData.stateRegion; // IPTC
       tags['XMP-photoshop:State'] = seoData.stateRegion;
    }
    if (seoData.countryCode) {
       tags['Country-PrimaryLocationCode'] = seoData.countryCode; // IPTC
    }
    if (seoData.websiteUrl) {
       tags['XMP-dc:Source'] = seoData.websiteUrl;
       tags['Source'] = seoData.websiteUrl; // IPTC
    }

    try {
      await exiftool.write(currentInFilePath, tags, ["-overwrite_original"]);
    } catch (etError: any) {
       console.error("ExifTool write failed:", etError);
       if (!convertedToJpg && !['jpg', 'jpeg'].includes(originalExt)) {
           console.log("Metadata write failed on original. Converting to JPG as fallback.");
           const outJpgPath = path.join(tempDir, `conv_fallback_${originalFileId}.jpg`);
           await sharp(currentInFilePath).jpeg({ quality: 95 }).toFile(outJpgPath);
           currentInFilePath = outJpgPath;
           processingFormat = 'jpg';
           convertedToJpg = true;
           await exiftool.write(currentInFilePath, tags, ["-overwrite_original"]);
       } else {
           throw etError;
       }
    }

    const fs = await import("fs");
    const processedBuffer = fs.readFileSync(currentInFilePath);

    try {
      if (fs.existsSync(inFilePath)) await unlink(inFilePath);
      if (convertedToJpg && currentInFilePath !== inFilePath && fs.existsSync(currentInFilePath)) {
          await unlink(currentInFilePath);
      }
    } catch (e) {
      console.error("Failed to delete tmp file", e);
    }

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-geotagged." + processingFormat;
    
    return new NextResponse(processedBuffer, {
      status: 200,
      headers: {
        "Content-Type": processingFormat === 'jpg' ? "image/jpeg" : file.type,
        "Content-Disposition": `attachment; filename="${newFileName}"`,
        "X-Converted-To-Jpg": convertedToJpg ? "true" : "false"
      }
    });

  } catch (error: any) {
    console.error("Geotagging error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}
