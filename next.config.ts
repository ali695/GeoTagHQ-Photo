import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)',
          },
        ],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
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
