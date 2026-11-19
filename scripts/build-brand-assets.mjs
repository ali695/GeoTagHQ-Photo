// Generates every PinPixl logo/icon file from public/brand/pinpixl-icon.svg.
// Run with: node scripts/build-brand-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const pub = path.resolve('public');
const iconSvg = fs.readFileSync(path.join(pub, 'brand/pinpixl-icon.svg'));
const png = (size) => sharp(iconSvg, { density: 512 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// ICO with embedded PNGs (supported by all current browsers).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...images.map((x) => x.data)]);
}

const ICON_INNER = fs
  .readFileSync(path.join(pub, 'brand/pinpixl-icon.svg'), 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

// Wordmark: icon + "Pin" + gradient "Pixl". Text uses common system fonts so the
// files render anywhere; the website itself draws the wordmark with its own font.
function wordmark({ dark }) {
  const ink = dark ? '#ffffff' : '#0f172a';
  const g1 = dark ? '#93c5fd' : '#2563eb';
  const g2 = dark ? '#c4b5fd' : '#7c3aed';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 256" role="img" aria-label="PinPixl">
  <defs>
    <linearGradient id="wm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient>
  </defs>
  <g transform="scale(0.5)">${ICON_INNER}</g>
  <text x="292" y="176" font-family="'Plus Jakarta Sans','Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="150" font-weight="800" letter-spacing="-4">
    <tspan fill="${ink}">Pin</tspan><tspan fill="url(#wm)">Pixl</tspan>
  </text>
</svg>`;
}

const OG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1225"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.55"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05"/></pattern>
    <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#c4b5fd"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(90 120) scale(0.45)">${ICON_INNER}</g>
  <text x="340" y="250" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="112" font-weight="800" letter-spacing="-3"><tspan fill="#ffffff">Pin</tspan><tspan fill="url(#txt)">Pixl</tspan></text>
  <text x="96" y="420" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="50" font-weight="700" fill="#ffffff">Free photo tools: geotag, EXIF,</text>
  <text x="96" y="484" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="50" font-weight="700" fill="#ffffff">convert &amp; compress</text>
  <text x="96" y="560" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="30" font-weight="500" fill="#a5b4fc">No sign-up · No watermark · Private by design</text>
</svg>`;

const out = async (rel, buf) => {
  fs.mkdirSync(path.dirname(path.join(pub, rel)), { recursive: true });
  fs.writeFileSync(path.join(pub, rel), buf);
  console.log('wrote', rel, `${(buf.length / 1024).toFixed(1)} KB`);
};

await out('favicon.svg', iconSvg);
await out('favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })))));
await out('favicon-96x96.png', await png(96));
await out('apple-touch-icon.png', await png(180));
await out('web-app-manifest-192x192.png', await png(192));
await out('web-app-manifest-512x512.png', await png(512));
await out('brand/pinpixl-icon-512.png', await png(512));
await out('logo.svg', Buffer.from(wordmark({ dark: false })));
await out('logo-dark.svg', Buffer.from(wordmark({ dark: true })));
await out('og/pinpixl-og.png', await sharp(Buffer.from(OG)).png({ compressionLevel: 9 }).toBuffer());

fs.writeFileSync(
  path.join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'PinPixl – Free Photo Tools',
      short_name: 'PinPixl',
      description: 'Geotag photos, view and remove EXIF data, convert HEIC and WebP, and compress images.',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4f46e5',
      icons: [
        { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('wrote site.webmanifest');
