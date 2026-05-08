import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const isInternalOrPrivate = (hostname: string) => {
  if (['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname)) return true;
  const isPrivateIp = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(hostname);
  return isPrivateIp;
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required.', errorCode: 'INVALID_URL' }, { status: 400 });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: 'Please enter a valid URL.', errorCode: 'INVALID_URL' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return NextResponse.json({ success: false, error: 'Only HTTP and HTTPS URLs are allowed.', errorCode: 'INVALID_URL' }, { status: 400 });
    }

    if (isInternalOrPrivate(targetUrl.hostname)) {
      return NextResponse.json({ success: false, error: 'Internal or private URLs are not allowed.', errorCode: 'INVALID_URL' }, { status: 403 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let fetchRes;
    try {
      fetchRes = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!fetchRes.ok) {
        if (fetchRes.status === 401 || fetchRes.status === 403 || fetchRes.status >= 500) {
          return NextResponse.json({ success: false, error: 'The website blocked the request or is unavailable.', errorCode: 'WEBSITE_BLOCKED' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Failed to fetch the URL.', errorCode: 'FETCH_FAILED' }, { status: Math.min(fetchRes.status, 500) });
      }
    } catch (e: any) {
      clearTimeout(timeout);
      return NextResponse.json({ success: false, error: 'We could not reach this URL. It may be invalid or blocking requests.', errorCode: 'FETCH_FAILED' }, { status: 400 });
    }

    const contentType = fetchRes.headers.get('content-type') || '';
    
    // Direct Image URL Handling
    if (contentType.startsWith('image/')) {
      if (contentType.includes('svg')) {
        return NextResponse.json({ success: false, error: 'SVG images are not supported for extraction.', errorCode: 'UNSUPPORTED_URL' }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        images: [{ url: targetUrl.toString(), alt: '', source: 'direct' }]
      });
    }

    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
       return NextResponse.json({ success: false, error: 'The provided URL does not point to an HTML webpage or a supported image.', errorCode: 'UNSUPPORTED_URL' }, { status: 400 });
    }
    
    const contentLength = Number(fetchRes.headers.get('content-length') || 0);
    if (contentLength > 10 * 1024 * 1024) { // 10MB limit for HTML
       return NextResponse.json({ success: false, error: 'The webpage is too large to process.', errorCode: 'UNSUPPORTED_URL' }, { status: 413 });
    }

    const html = await fetchRes.text();
    if (html.length > 10 * 1024 * 1024) {
       return NextResponse.json({ success: false, error: 'The webpage is too large to process.', errorCode: 'UNSUPPORTED_URL' }, { status: 413 });
    }

    const $ = cheerio.load(html);
    const extractedImages = new Map<string, { url: string, alt: string, source: string }>();

    const resolveUrl = (src: string) => {
      try {
        return new URL(src, targetUrl.toString()).toString();
      } catch {
        return null;
      }
    };

    const addImage = (src: string, alt: string, source: string) => {
       const absolute = resolveUrl(src);
       if (absolute && !extractedImages.has(absolute)) {
         extractedImages.set(absolute, { url: absolute, alt: alt || '', source });
       }
    };

    // 1. og:image
    $('meta[property="og:image"]').each((_, el) => {
      const content = $(el).attr('content');
      if (content) addImage(content, '', 'og:image');
    });

    // 2. twitter:image
    $('meta[name="twitter:image"]').each((_, el) => {
      const content = $(el).attr('content');
      if (content) addImage(content, '', 'twitter:image');
    });

    // 3. link rel=image_src
    $('link[rel="image_src"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) addImage(href, '', 'link:image_src');
    });

    // 4. picture source srcset
    $('picture source').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const candidates = srcset.split(',').map(s => s.trim().split(' ')[0]);
        for (const candidate of candidates) {
          if (candidate) addImage(candidate, '', 'picture-source');
        }
      }
    });

    // 5. img tags
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src) addImage(src, alt, 'img');

      const srcset = $(el).attr('srcset');
      if (srcset) {
        const candidates = srcset.split(',').map(s => s.trim().split(' ')[0]);
        for (const candidate of candidates) {
           if (candidate) addImage(candidate, alt, 'img-srcset');
        }
      }
    });

    // 6. JSON-LD Simple Parsing
    $('script[type="application/ld+json"]').each((_, el) => {
       try {
         const jsonBody = $(el).html();
         if (jsonBody) {
           const parsed = JSON.parse(jsonBody);
           // Try extracting image field blindly from top level
           let imageField = parsed.image || (parsed[0] && parsed[0].image);
           if (imageField) {
             if (typeof imageField === 'string') {
               addImage(imageField, '', 'json-ld');
             } else if (Array.isArray(imageField)) {
               imageField.forEach(img => typeof img === 'string' && addImage(img, '', 'json-ld'));
             } else if (imageField.url && typeof imageField.url === 'string') {
               addImage(imageField.url, '', 'json-ld');
             }
           }
         }
       } catch (e) {
         // ignore parsing errors
       }
    });

    // Filter out svg, data, javascript
    const validImages = Array.from(extractedImages.values()).filter(img => {
      if (img.url.startsWith('data:') || img.url.startsWith('javascript:')) return false;
      const lower = img.url.toLowerCase();
      if (lower.includes('.svg')) return false;
      return true;
    });

    if (validImages.length === 0) {
      return NextResponse.json({ success: false, error: 'No images were found on this page.', errorCode: 'NO_IMAGES_FOUND' });
    }

    return NextResponse.json({
      success: true,
      images: validImages.slice(0, 30) // Limit to 30 images
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unexpected error occurred during extraction.', errorCode: 'FETCH_FAILED' }, { status: 500 });
  }
}
