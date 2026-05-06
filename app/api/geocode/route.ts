export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { geocodeSearchSchema } from '@/lib/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const validationResult = geocodeSearchSchema.safeParse({ query });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search query' },
        { status: 400 }
      );
    }

    const { query: validQuery } = validationResult.data;

    // We use Nominatim (OpenStreetMap) as a free geocoding provider for this demo.
    // Note for production: Consider using Google Maps API, Mapbox, or other premium 
    // providers to avoid rate limits and improve search reliability.
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(validQuery)}&limit=8`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch geocoding data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error(`Unexpected data format from Photon`);
    }

    const results = data.features.map((feature: any) => {
      const p = feature.properties;
      const coords = feature.geometry.coordinates; // [lon, lat]
      
      const displayNameParts = [p.name || p.city, p.state, p.country].filter(Boolean);
      const displayName = Array.from(new Set(displayNameParts)).join(', ');

      return {
        id: p.osm_id?.toString() || Math.random().toString(),
        displayName: displayName || 'Unknown Location',
        city: p.city || p.town || p.village || p.name,
        state: p.state,
        country: p.country,
        lat: coords[1],
        lon: coords[0],
        provider: 'photon',
        type: p.osm_value || 'location',
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Geocoding error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to search location', message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
