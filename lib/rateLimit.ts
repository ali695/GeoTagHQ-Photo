// Simple per-IP fixed-window rate limiter for the AI endpoints.
// It lives in memory, so on serverless hosting each instance keeps its own count:
// good enough to stop casual abuse, not a hard global cap. For a strict limit use
// a shared store such as Upstash Redis or Vercel KV.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip')) || 'unknown';
}

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000), remaining: 0 };
  b.count += 1;
  return { ok: true, retryAfter: 0, remaining: limit - b.count };
}
