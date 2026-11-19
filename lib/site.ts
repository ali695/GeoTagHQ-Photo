// Site identity in one place.
//
// The site address comes from NEXT_PUBLIC_SITE_URL. Until pinpixl.com is bought and
// connected in Vercel it stays on geotaghq.com, so canonical URLs always point at a
// domain that actually serves the site. When the new domain is live, set
// NEXT_PUBLIC_SITE_URL=https://pinpixl.com in Vercel and redeploy.
export const SITE_NAME = 'PinPixl';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://geotaghq.com').replace(/\/+$/, '');
export const SITE_HOST = new URL(SITE_URL).host;
export const BRAND_COLOR = '#4f46e5';
export const OG_IMAGE = { url: '/og/pinpixl-og.png', width: 1200, height: 630, alt: 'PinPixl – free photo tools' };
