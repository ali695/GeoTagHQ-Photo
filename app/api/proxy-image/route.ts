import { NextRequest, NextResponse } from 'next/server';

const isInternalOrPrivate = (hostname: string) => {
  if (['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname)) return true;
  const isPrivateIp = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(hostname);
  return isPrivateIp;
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required.' }, { status: 400 });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL.' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return NextResponse.json({ success: false, error: 'Only HTTP and HTTPS URLs are allowed.' }, { status: 400 });
    }

    if (isInternalOrPrivate(targetUrl.hostname)) {
      return NextResponse.json({ success: false, error: 'Internal URLs are not allowed.' }, { status: 403 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let fetchRes: Response;
    try {
      fetchRes = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GeoTagHQBot/1.0; +http://geotaghq.com/)',
          'Accept': 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,image/tiff,*/*;q=0.8',
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (e) {
      clearTimeout(timeout);
      return NextResponse.json({ success: false, error: 'Could not fetch image.' }, { status: 400 });
    }

    if (!fetchRes.ok) {
      return NextResponse.json({ success: false, error: 'Failed to proxy image.' }, { status: fetchRes.status });
    }

    const contentType = fetchRes.headers.get('content-type') || '';
    if (!contentType.startsWith('image/') || contentType.includes('svg')) {
      return NextResponse.json({ success: false, error: 'This image format is not supported.' }, { status: 415 });
    }

    const contentLength = Number(fetchRes.headers.get('content-length') || 0);
    if (contentLength > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image exceeds 10MB limit.' }, { status: 413 });
    }

    const buffer = await fetchRes.arrayBuffer();
    if (buffer.byteLength > 10 * 1024 * 1024) {
       return NextResponse.json({ success: false, error: 'Image exceeds 10MB limit.' }, { status: 413 });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
