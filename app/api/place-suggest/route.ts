import { guard } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SITE_URL } from '@/lib/site';

// Search-as-you-type suggestions. Nominatim's usage policy forbids autocomplete,
// so suggestions come from Photon (komoot), an OpenStreetMap geocoder built for it.
// Full searches and reverse lookups still use Nominatim via /api/geocode.
const schema = z.object({
  q: z.string().trim().min(2).max(200),
  lang: z.string().max(5).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
});

const PHOTON_LANGS = new Set(['en', 'de', 'fr', 'it']);

export async function GET(request: Request) {
  const limited = guard(request, 'suggest', 120, 60 * 1000);
  if (limited) return limited;
  const sp = new URL(request.url).searchParams;
  const parsed = schema.safeParse({
    q: sp.get('q') || '',
    lang: sp.get('lang') || undefined,
    lat: sp.get('lat') || undefined,
    lon: sp.get('lon') || undefined,
  });
  if (!parsed.success) return NextResponse.json({ success: true, results: [] });

  const { q, lang, lat, lon } = parsed.data;
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', q);
  url.searchParams.set('limit', '8');
  if (lang && PHOTON_LANGS.has(lang)) url.searchParams.set('lang', lang);
  // Bias results toward where the map is currently looking.
  if (lat !== undefined && lon !== undefined) {
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': `PinPixl/1.0 (+${SITE_URL})` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json({ success: false, results: [] }, { status: res.status === 429 ? 429 : 502 });
    const data = await res.json();

    const results = (data.features || [])
      .map((f: any) => {
        const p = f.properties || {};
        const [lng, latV] = f.geometry?.coordinates || [];
        const street = p.street || (p.osm_key === 'highway' ? p.name : undefined);
        const title =
          p.housenumber && street ? `${street} ${p.housenumber}` : p.name || street || p.city || p.country || '';
        const context = [p.district, p.city, p.state, p.country].filter((v: string) => v && v !== title);
        return {
          id: `${p.osm_type || ''}${p.osm_id || Math.random()}`,
          title,
          subtitle: Array.from(new Set(context)).join(', '),
          displayName: [title, ...Array.from(new Set(context))].filter(Boolean).join(', '),
          street,
          houseNumber: p.housenumber,
          district: p.district || p.locality,
          city: p.city || p.town || p.village,
          state: p.state,
          country: p.country,
          countryCode: p.countrycode ? String(p.countrycode).toUpperCase() : undefined,
          postcode: p.postcode,
          lat: Number(latV),
          lon: Number(lng),
          type: p.housenumber ? 'address' : p.osm_value || p.type,
          category: p.osm_key,
          provider: 'Photon (OpenStreetMap)',
        };
      })
      .filter((r: any) => r.title && Number.isFinite(r.lat) && Number.isFinite(r.lon));

    return NextResponse.json({ success: true, results });
  } catch {
    return NextResponse.json({ success: false, results: [] }, { status: 502 });
  }
}
