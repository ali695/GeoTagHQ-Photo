import { NextRequest, NextResponse } from 'next/server';
import { guard } from '@/lib/rateLimit';
import { safeFetch, UnsafeUrlError } from '@/lib/safeFetch';
import { SITE_URL } from '@/lib/site';

// Fetches a remote image for the "extract images from a URL" feature.
// SSRF-safe: public addresses only, redirects re-checked, 10 MB cap, raster images only.
const MAX = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = guard(req, 'proxy', 150, 10 * 60 * 1000);
  if (limited) return limited;
  try {
    const { url } = await req.json().catch(() => ({ url: '' }));
    if (!url || typeof url !== 'string' || url.length > 2048) {
      return NextResponse.json({ success: false, error: 'A valid image URL is required.' }, { status: 400 });
    }

    let fetched;
    try {
      fetched = await safeFetch(url, {
        timeoutMs: 15_000,
        maxBytes: MAX,
        headers: {
          'User-Agent': `Mozilla/5.0 (compatible; PinPixlBot/1.0; +${SITE_URL}/)`,
          Accept: 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,image/tiff,*/*;q=0.8',
        },
      });
    } catch (e) {
      const msg = e instanceof UnsafeUrlError ? e.message : 'Could not fetch image.';
      return NextResponse.json({ success: false, error: msg }, { status: e instanceof UnsafeUrlError ? 400 : 502 });
    }

    const { res, body } = fetched;
    if (!res.ok) return NextResponse.json({ success: false, error: 'Failed to fetch the image.' }, { status: 502 });
    const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    // SVG can carry scripts, so only raster formats are passed through.
    if (!contentType.startsWith('image/') || contentType.includes('svg')) {
      return NextResponse.json({ success: false, error: 'This image format is not supported.' }, { status: 415 });
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=600',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
