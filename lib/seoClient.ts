'use client';

// Browser-side wrapper: asks our server for AI metadata so the Gemini key stays on the server.
export async function generateSeoMetadata(params: Record<string, string | undefined>) {
  const res = await fetch('/api/seo-metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'AI generation failed. Please try again.');
  return data;
}
