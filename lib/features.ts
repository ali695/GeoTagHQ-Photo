// Feature switches.
//
// AI features (the "AI suggest" metadata button in the photo editor and the
// AI Alt Text Generator page) need a Gemini API key, so they are OFF by default.
// To turn them on later: set GEMINI_API_KEY and NEXT_PUBLIC_ENABLE_AI=true in Vercel,
// then redeploy.
export const AI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';
