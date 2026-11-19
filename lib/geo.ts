// Coordinate formatting helpers shared by the map, the lat/long finder and the EXIF viewer.

export function toDms(value: number, isLat: boolean): string {
  const hemi = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  const abs = Math.abs(value);
  let d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  let m = Math.floor(mFloat);
  let s = Math.round((mFloat - m) * 60 * 10) / 10;
  if (s >= 60) { s = 0; m += 1; }
  if (m >= 60) { m = 0; d += 1; }
  return `${d}°${String(m).padStart(2, '0')}'${s.toFixed(1).padStart(4, '0')}" ${hemi}`;
}

export const formatDecimal = (lat: number, lng: number, digits = 6) => `${lat.toFixed(digits)}, ${lng.toFixed(digits)}`;

export const formatDms = (lat: number, lng: number) => `${toDms(lat, true)} ${toDms(lng, false)}`;

export const googleMapsUrl = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

/**
 * Parses "lat, lng" in decimal or DMS (e.g. 40°26'46"N 79°58'56"W).
 * Returns null if it can't find two valid numbers.
 */
export function parseCoordinates(input: string): { lat: number; lng: number } | null {
  const text = input.trim();
  if (!text) return null;

  const dms = /(\d+(?:\.\d+)?)\s*[°º]\s*(?:(\d+(?:\.\d+)?)\s*['′]\s*)?(?:(\d+(?:\.\d+)?)\s*["″]\s*)?([NSEW])/gi;
  const parts = [...text.matchAll(dms)];
  if (parts.length === 2) {
    const vals = parts.map((p) => {
      const v = Number(p[1]) + Number(p[2] || 0) / 60 + Number(p[3] || 0) / 3600;
      const h = p[4].toUpperCase();
      return { v: h === 'S' || h === 'W' ? -v : v, isLat: h === 'N' || h === 'S' };
    });
    const latPart = vals.find((x) => x.isLat);
    const lngPart = vals.find((x) => !x.isLat);
    if (latPart && lngPart) return valid(latPart.v, lngPart.v);
  }

  const nums = text.match(/-?\d+(?:\.\d+)?/g);
  if (nums && nums.length === 2) return valid(Number(nums[0]), Number(nums[1]));
  return null;
}

function valid(lat: number, lng: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}
