// Server-only fetch for user-supplied URLs (SSRF protection).
// - only http/https on the default ports
// - the hostname is resolved first and every address must be public (blocks localhost, private
//   ranges, link-local/cloud metadata 169.254.169.254, CGNAT, multicast, IPv6 ULA/link-local,
//   and IPv4-mapped IPv6)
// - redirects are followed manually (max 3), re-checking each hop
// - hard timeout and a byte cap while streaming the body
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export class UnsafeUrlError extends Error {}

function ipv4Private(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224 // multicast + reserved
  );
}

function ipv6Private(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === '::' || v === '::1') return true;
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return ipv4Private(mapped[1]);
  return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v);
}

export function isPrivateAddress(ip: string): boolean {
  const kind = isIP(ip);
  if (kind === 4) return ipv4Private(ip);
  if (kind === 6) return ipv6Private(ip);
  return true;
}

async function assertPublicUrl(raw: string | URL): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UnsafeUrlError('Invalid URL.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new UnsafeUrlError('Only HTTP and HTTPS URLs are allowed.');
  if (url.username || url.password) throw new UnsafeUrlError('URLs with credentials are not allowed.');
  if (url.port && url.port !== '80' && url.port !== '443') throw new UnsafeUrlError('Only standard ports are allowed.');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new UnsafeUrlError('Internal URLs are not allowed.');
  }
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true }).catch(() => []);
  if (!addrs.length) throw new UnsafeUrlError('This address could not be found.');
  if (addrs.some((a) => isPrivateAddress(a.address))) throw new UnsafeUrlError('Internal URLs are not allowed.');
  return url;
}

export async function safeFetch(
  raw: string,
  init: { headers?: Record<string, string>; timeoutMs?: number; maxBytes?: number } = {},
): Promise<{ res: Response; body: ArrayBuffer; url: URL }> {
  const { headers = {}, timeoutMs = 10_000, maxBytes = 10 * 1024 * 1024 } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let url = await assertPublicUrl(raw);
    let res: Response | undefined;
    for (let hop = 0; hop <= 3; hop++) {
      res = await fetch(url, { headers, redirect: 'manual', signal: controller.signal });
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        url = await assertPublicUrl(new URL(res.headers.get('location')!, url));
        continue;
      }
      break;
    }
    if (!res || (res.status >= 300 && res.status < 400)) throw new UnsafeUrlError('Too many redirects.');
    const declared = Number(res.headers.get('content-length') || 0);
    if (declared > maxBytes) throw new UnsafeUrlError('The file is too large.');
    // Stream with a byte cap so a lying Content-Length can't exhaust memory.
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
          controller.abort();
          throw new UnsafeUrlError('The file is too large.');
        }
        chunks.push(value);
      }
    }
    const body = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) {
      body.set(c, off);
      off += c.byteLength;
    }
    return { res, body: body.buffer, url };
  } finally {
    clearTimeout(timer);
  }
}
