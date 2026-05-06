import { z } from 'zod';

export const geocodeSearchSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters").max(200, "Search query is too long"),
});

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const reverseGeocodeSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});
