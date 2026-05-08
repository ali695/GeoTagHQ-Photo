import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  query: z.string().min(2).max(200)
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const validationResult = schema.safeParse({ query });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid search query' },
        { status: 400 }
      );
    }

    const validQuery = validationResult.data.query;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(validQuery)}&format=json&addressdetails=1&limit=8`;
    
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

    if (!Array.isArray(data)) {
      return NextResponse.json({ success: true, results: [] });
    }

    const results = data.map((item: any) => {
      const a = item.address || {};
      const houseNumber = a.house_number;
      const street = a.road || a.pedestrian || a.street;
      const district = a.suburb || a.city_district || a.quarter || a.borough;
      const city = a.city || a.town || a.village || a.county;
      const state = a.state;
      const country = a.country;
      const countryCode = a.country_code ? a.country_code.toUpperCase() : undefined;
      const postcode = a.postcode;
      const name = item.name;

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
          displayName = item.display_name || 'Unknown Location';
      }

      return {
        id: item.place_id?.toString() || Math.random().toString(),
        displayName,
        street,
        houseNumber,
        district,
        city,
        state,
        country,
        countryCode,
        postcode,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        provider: 'nominatim',
        type: item.class === 'place' && item.type === 'house' ? 'address' : item.type,
      };
    }).filter((r: any) => 
       typeof r.lat === 'number' && !isNaN(r.lat) && r.lat >= -90 && r.lat <= 90 &&
       typeof r.lon === 'number' && !isNaN(r.lon) && r.lon >= -180 && r.lon <= 180
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { success: false, error: 'Location search is temporarily unavailable. Try manual coordinates.' },
      { status: 500 }
    );
  }
}
