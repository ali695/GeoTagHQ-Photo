import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    const validationResult = schema.safeParse({ lat: latStr, lon: lonStr });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const { lat, lon } = validationResult.data;

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&extratags=1&namedetails=1&zoom=18`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GeoTagHQ/1.0 (ma7122671@gmail.com)'
      },
    });

    if (!response.ok) {
        if (response.status === 429) {
            return NextResponse.json(
                 { success: false, error: 'Location search is temporarily unavailable. Try manual coordinates.' },
                 { status: 429 }
            );
        }
      return NextResponse.json(
           { success: false, error: 'Location search is temporarily unavailable.' },
           { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { success: false, error: 'No location found for these coordinates' },
        { status: 404 }
      );
    }

    const a = data.address || {};
    const houseNumber = a.house_number || a.street_number || a.building;
    const street = a.road || a.pedestrian || a.street || a.path || a.footway || a.cycleway;
    const district = a.suburb || a.city_district || a.quarter || a.borough || a.neighborhood;
    const city = a.city || a.town || a.village || a.county;
    const state = a.state;
    const country = a.country;
    const countryCode = a.country_code ? a.country_code.toUpperCase() : undefined;
    const postcode = a.postcode;
    const name = data.name;

    const displayParts = [];
    if (name && name !== street && name !== city && name !== country) displayParts.push(name);
    
    const st = houseNumber ? `${street} ${houseNumber}` : street;
    if (st) displayParts.push(st);
    
    if (district && district !== city) displayParts.push(district);
    if (city) displayParts.push(city);
    if (state && state !== city) displayParts.push(state);
    if (country) displayParts.push(country);

    let displayName = displayParts.filter(Boolean).join(', ');
    if (!displayName) {
        displayName = data.display_name || 'Custom coordinates selected';
    }

    const result = {
      id: data.place_id?.toString() || Math.random().toString(),
      displayName,
      street,
      houseNumber,
      district,
      city,
      state,
      country,
      countryCode,
      postcode,
      lat: parseFloat(data.lat),
      lon: parseFloat(data.lon),
      provider: 'nominatim',
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reverse geocode location. Check network connection.' },
      { status: 500 }
    );
  }
}
