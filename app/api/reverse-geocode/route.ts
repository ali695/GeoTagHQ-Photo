export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { reverseGeocodeSchema } from '@/lib/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    const validationResult = reverseGeocodeSchema.safeParse({ lat: latStr, lon: lonStr });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const { lat, lon } = validationResult.data;

    const response = await fetch(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reverse geocoding data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      return NextResponse.json(
        { error: 'No location found for these coordinates' },
        { status: 404 }
      );
    }

    const feature = data.features[0];
    const p = feature.properties;
    const coords = feature.geometry.coordinates; // [lon, lat]
    
    const displayNameParts = [p.name || p.city, p.state, p.country].filter(Boolean);
    const displayName = Array.from(new Set(displayNameParts)).join(', ');

    const result = {
      id: p.osm_id?.toString() || Math.random().toString(),
      displayName: displayName || 'Unknown Location',
      city: p.city || p.town || p.village || p.name,
      state: p.state,
      country: p.country,
      lat: coords[1],
      lon: coords[0],
      provider: 'photon',
    };

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location', message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
