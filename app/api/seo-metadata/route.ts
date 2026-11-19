import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSeoMetadata } from '@/lib/gemini';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { AI_ENABLED } from '@/lib/features';

const s = (max: number) => z.string().trim().max(max).optional();

const schema = z.object({
  businessName: s(120),
  serviceCategory: s(120),
  city: s(80),
  district: s(80),
  country: s(80),
  businessType: s(60),
  language: s(10),
  streetAddress: s(160),
  postalCode: s(20),
  stateRegion: s(80),
  countryCode: s(3),
});

export async function POST(req: Request) {
  if (!AI_ENABLED) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const limit = rateLimit(`seo:${clientIp(req)}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `AI limit reached. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes or fill the fields manually.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  try {
    const data = await generateSeoMetadata(parsed.data);
    return NextResponse.json(data);
  } catch (e: any) {
    const notConfigured = /not configured/i.test(e?.message || '');
    return NextResponse.json(
      { error: notConfigured ? 'AI suggestions are not set up on this site yet.' : 'AI generation failed. Please try again.' },
      { status: notConfigured ? 503 : 502 },
    );
  }
}
