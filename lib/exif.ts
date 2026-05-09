import exifr from 'exifr';
import piexif from 'piexifjs';
import { GeoCoordinates } from '@/types/geo';
import { ImageMetadata } from '@/types/image';

function degToDmsRational(degrees: number): [[number, number], [number, number], [number, number]] {
  const d = Math.abs(degrees);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = (d - deg - min / 60) * 3600;

  // We multiply seconds by 10000 to keep precision
  return [
    [deg, 1],
    [min, 1],
    [Math.round(sec * 10000), 10000],
  ];
}

export async function readImageMetadata(file: File): Promise<ImageMetadata> {
  try {
    const data = await exifr.parse(file, { tiff: true, exif: true, gps: true }).catch(err => {
      // Suppress "Unknown file format" error as it just means exifr doesn't support this specific file's signature
      if (err?.message?.includes('Unknown file format')) return undefined;
      throw err;
    });
    
    // Fallbacks
    let width, height;
    
    // We try to grab the dimension from the browser if it's an image
    if (typeof window !== 'undefined') {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          width = img.width;
          height = img.height;
          resolve();
        };
        img.onerror = () => resolve();
      });
      URL.revokeObjectURL(url);
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      format: file.type,
      width: data?.ImageWidth || data?.ExifImageWidth || width,
      height: data?.ImageHeight || data?.ExifImageHeight || height,
      cameraMake: data?.Make,
      cameraModel: data?.Model,
      dateTaken: data?.DateTimeOriginal || data?.CreateDate,
      gps: data?.latitude && data?.longitude ? {
        lat: data.latitude,
        lng: data.longitude
      } : undefined,
      hasExif: !!data,
    };
  } catch (error) {
    console.error("Error reading EXIF:", error);
    return {
      fileName: file.name,
      fileSize: file.size,
      format: file.type,
      hasExif: false,
    };
  }
}

export async function writeGeoToJpeg(
  file: File | Blob, 
  coords: GeoCoordinates, 
  edits?: Partial<ImageMetadata>,
  originalFileWithExif?: File | Blob
): Promise<Blob> {
  if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
    throw new Error('Geotag writing is currently only fully supported for JPEG/JPG formats.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (!e.target?.result) {
        return reject(new Error('Failed to read file'));
      }
      try {
        const jpegData = e.target.result as string;
        
        let exifObject: any = { '0th': {}, 'Exif': {}, 'GPS': {}, 'Interop': {}, '1st': {}, 'thumbnail': null };
        
        // Helper to load and merge EXIF
        const loadExifData = (dataStr: string) => {
          try {
             const loadedExif = piexif.load(dataStr);
             exifObject = { ...exifObject, ...loadedExif };
          } catch (err) {
             console.warn("No existing EXIF found", err);
          }
        };

        if (originalFileWithExif) {
          // If we have an original file (e.g. from before crop), read its EXIF first
          const origReader = new FileReader();
          origReader.onload = function(oe) {
             if (oe.target?.result) {
                loadExifData(oe.target.result as string);
                applyEditsAndSave(jpegData, exifObject, coords, edits, resolve, reject);
             } else {
                applyEditsAndSave(jpegData, exifObject, coords, edits, resolve, reject);
             }
          };
          origReader.onerror = () => {
             applyEditsAndSave(jpegData, exifObject, coords, edits, resolve, reject);
          };
          origReader.readAsDataURL(originalFileWithExif);
        } else {
          loadExifData(jpegData);
          applyEditsAndSave(jpegData, exifObject, coords, edits, resolve, reject);
        }

      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function applyEditsAndSave(
  jpegData: string, 
  exifObject: any, 
  coords: GeoCoordinates, 
  edits: Partial<ImageMetadata> | undefined,
  resolve: (value: Blob | PromiseLike<Blob>) => void,
  reject: (reason?: any) => void
) {
  try {
    const latRef = coords.lat >= 0 ? "N" : "S";
    const lngRef = coords.lng >= 0 ? "E" : "W";

    exifObject.GPS = {
      ...exifObject.GPS,
      [piexif.GPSIFD.GPSLatitudeRef]: latRef,
      [piexif.GPSIFD.GPSLatitude]: degToDmsRational(coords.lat),
      [piexif.GPSIFD.GPSLongitudeRef]: lngRef,
      [piexif.GPSIFD.GPSLongitude]: degToDmsRational(coords.lng),
      [piexif.GPSIFD.GPSVersionID]: [2, 2, 0, 0],
    };

    if (edits) {
      if (edits.cameraMake !== undefined) {
         exifObject['0th'][piexif.ImageIFD.Make] = edits.cameraMake;
      }
      if (edits.cameraModel !== undefined) {
         exifObject['0th'][piexif.ImageIFD.Model] = edits.cameraModel;
      }
      if (edits.dateTaken !== undefined) {
         // EXIF expects 'YYYY:MM:DD HH:MM:SS'
         const d = new Date(edits.dateTaken);
         if (!isNaN(d.getTime())) {
            const pad = (n: number) => n.toString().padStart(2, '0');
            const exifDate = `${d.getFullYear()}:${pad(d.getMonth()+1)}:${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            exifObject['Exif'][piexif.ExifIFD.DateTimeOriginal] = exifDate;
            exifObject['Exif'][piexif.ExifIFD.DateTimeDigitized] = exifDate;
            exifObject['0th'][piexif.ImageIFD.DateTime] = exifDate;
         }
      }
    }

    const exifBytes = piexif.dump(exifObject);
    const newJpegData = piexif.insert(exifBytes, jpegData);
    
    // Convert base64 DataURL block back to Blob
    const parts = newJpegData.split(',');
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    const newBlob = new Blob([array], { type: 'image/jpeg' });
    resolve(newBlob);
  } catch (err) {
    reject(err);
  }
}
