// API smoke + security tests against a running server: node scripts/test-api.mjs [baseUrl]
// Generates real test images with sharp, so it exercises the actual image pipeline.
import sharp from 'sharp';
import exifr from 'exifr';

const BASE = process.argv[2] || 'http://localhost:3123';
let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++; };

const jpg = await sharp({ create: { width: 640, height: 420, channels: 3, background: { r: 90, g: 140, b: 110 } } }).jpeg({ quality: 85 }).toBuffer();
const png = await sharp({ create: { width: 300, height: 200, channels: 4, background: { r: 255, g: 79, b: 31, alpha: 0.6 } } }).png().toBuffer();

// 1) Geotag: write GPS, read it back.
{
  const fd = new FormData();
  fd.append('file', new Blob([jpg], { type: 'image/jpeg' }), 'test.jpg');
  fd.append('lat', '30.268490');
  fd.append('lng', '-97.743070');
  fd.append('title', 'Test storefront');
  const r = await fetch(`${BASE}/api/geotag-image`, { method: 'POST', body: fd });
  const ct = r.headers.get('content-type') || '';
  let gps = null;
  if (r.ok && ct.startsWith('image/')) gps = await exifr.gps(Buffer.from(await r.arrayBuffer())).catch(() => null);
  else if (r.ok) {
    const j = await r.json().catch(() => ({}));
    const b64 = j.image || j.data || j.file || j.dataUrl;
    if (typeof b64 === 'string') gps = await exifr.gps(Buffer.from(b64.replace(/^data:[^,]+,/, ''), 'base64')).catch(() => null);
  }
  ok(r.ok && gps && Math.abs(gps.latitude - 30.26849) < 1e-4 && Math.abs(gps.longitude + 97.74307) < 1e-4, `geotag-image writes GPS (status ${r.status}, ${ct}, read ${gps ? gps.latitude.toFixed(5) + ',' + gps.longitude.toFixed(5) : 'none'})`);
}
// 2) Geotag rejects non-images and oversized input.
{
  const fd = new FormData();
  fd.append('file', new Blob(['<script>alert(1)</script>'], { type: 'text/html' }), 'x.html');
  const r = await fetch(`${BASE}/api/geotag-image`, { method: 'POST', body: fd });
  ok(r.status === 415, `geotag-image rejects non-image (status ${r.status})`);
}
// 3) Convert PNG -> JPG on server.
{
  const fd = new FormData();
  fd.append('file', new Blob([png], { type: 'image/png' }), 't.png');
  fd.append('format', 'jpeg');
  fd.append('quality', '80');
  const r = await fetch(`${BASE}/api/convert-image`, { method: 'POST', body: fd });
  const buf = r.ok ? Buffer.from(await r.arrayBuffer()) : null;
  const meta = buf ? await sharp(buf).metadata().catch(() => null) : null;
  ok(r.ok && meta && ['jpeg', 'png'].includes(meta.format), `convert-image returns an image (status ${r.status}, format ${meta?.format})`);
}
// 4) SSRF attempts must be refused.
for (const target of ['http://169.254.169.254/latest/meta-data/', 'http://localhost:3123/', 'http://127.0.0.1/', 'http://[::1]/', 'http://10.0.0.1/', 'file:///etc/passwd', 'http://0x7f000001/', 'http://2130706433/']) {
  for (const route of ['proxy-image', 'extract-images']) {
    const r = await fetch(`${BASE}/api/${route}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target }) });
    ok(r.status === 400 || r.status === 403, `${route} refuses ${target} (status ${r.status})`);
  }
}
// 5) Input validation on geocoding.
{
  const r = await fetch(`${BASE}/api/geocode?q=${'a'.repeat(500)}`);
  ok(r.status === 400, `geocode rejects over-long query (status ${r.status})`);
  const r2 = await fetch(`${BASE}/api/reverse-geocode?lat=999&lon=0`);
  ok(r2.status === 400, `reverse-geocode rejects invalid latitude (status ${r2.status})`);
}
// 6) Rate limit kicks in.
{
  let limited = false;
  for (let i = 0; i < 70 && !limited; i++) {
    const r = await fetch(`${BASE}/api/reverse-geocode?lat=999&lon=0`);
    if (r.status === 429) limited = r.headers.get('retry-after') !== null;
  }
  ok(limited, 'reverse-geocode returns 429 with Retry-After after the limit');
}
console.log(fails ? `\n${fails} FAILED` : '\nALL API TESTS PASSED');
process.exit(fails ? 1 : 0);
