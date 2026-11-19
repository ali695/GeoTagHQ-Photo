import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { geminiApiKey, GEMINI_MODEL } from '@/lib/gemini';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { AI_ENABLED } from '@/lib/features';

// AI alt text. The browser sends a downscaled JPEG (max 1024px) as base64; it is
// passed to Gemini and not stored by us.
const schema = z.object({
  image: z.string().min(100).max(2_800_000), // ~2 MB of base64
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']).default('image/jpeg'),
  keyword: z.string().trim().max(80).optional(),
  context: z.string().trim().max(300).optional(),
  language: z.string().trim().max(30).default('English'),
});

const HOURLY_LIMIT = 15;

export async function POST(req: Request) {
  if (!AI_ENABLED) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const limit = rateLimit(`alt:${clientIp(req)}`, HOURLY_LIMIT, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `You’ve reached the free limit of ${HOURLY_LIMIT} images per hour. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const apiKey = geminiApiKey();
  if (!apiKey) return NextResponse.json({ error: 'The AI alt text generator is not set up on this site yet.' }, { status: 503 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid image or settings.' }, { status: 400 });
  const { image, mimeType, keyword, context, language } = parsed.data;

  const prompt = `You write image alt text for websites, following WCAG and SEO best practice.
Describe what is actually visible in the image. Do not invent brand names, places or people's identities you cannot see.
${keyword ? `If it fits naturally and truthfully, include this keyword once: "${keyword}". Never force it.` : ''}
${context ? `Page context (use only if relevant): ${context}` : ''}
Write everything in ${language}.

Return JSON with:
- "altText": the best alt text, 80-125 characters, no "image of" or "picture of", ends without a period unless it's a full sentence.
- "alternatives": array of 2 other alt texts with different wording, each under 125 characters.
- "caption": one natural sentence that could appear under the image.
- "fileName": an SEO-friendly lowercase file name with hyphens, 3-6 words, no extension.
- "decorative": true only if the image is purely decorative (pattern, texture, divider) and should use empty alt.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: image } }, { text: prompt }] }],
      config: { responseMimeType: 'application/json', temperature: 0.4 },
    });
    const data = JSON.parse(res.text || '{}');
    if (!data.altText) throw new Error('empty');
    return NextResponse.json(
      {
        altText: String(data.altText).slice(0, 200),
        alternatives: Array.isArray(data.alternatives) ? data.alternatives.slice(0, 2).map((s: unknown) => String(s).slice(0, 200)) : [],
        caption: data.caption ? String(data.caption).slice(0, 300) : '',
        fileName: String(data.fileName || '').toLowerCase().replace(/[^a-z0-9À-ɏ-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80),
        decorative: !!data.decorative,
        remaining: limit.remaining,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'The AI could not describe this image. Please try again.' }, { status: 502 });
  }
}
