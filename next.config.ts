import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Security headers on every response. The CSP allows only what the tools need:
  // Google Maps (script + Places API), OpenStreetMap/Esri tiles (images), Leaflet CSS from unpkg,
  // and the HEIC decoder (WebAssembly in a blob: worker). Next.js injects inline bootstrap scripts,
  // so script-src keeps 'unsafe-inline' (nonces would force every page to render dynamically).
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''} https://maps.googleapis.com https://maps.gstatic.com`,
      "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com",
      "worker-src 'self' blob:",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), interest-cohort=(), browsing-topics=(), geolocation=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // API responses are per-request and must never be indexed or cached by shared caches.
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        // Plain-text files for crawlers and AI assistants.
        source: '/:file(llms.txt|llms-full.txt)',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
  async redirects() {
    return [
      // "/" is now the tools homepage (it used to redirect to the geotag tool).
      // English lives at the root, so /en/... is a duplicate.
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Chinese was listed before but never translated; send it to the English page.
      {
        source: '/zh/:path*',
        destination: '/free-geo-tagging-tool',
        permanent: true,
      },
      // Old URLs that were in the sitemap but never existed.
      {
        source: '/how-it-works',
        destination: '/free-geo-tagging-tool#how-it-works',
        permanent: true,
      },
      {
        source: '/geotagging-for-local-seo',
        destination: '/free-geo-tagging-tool#local-seo',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
