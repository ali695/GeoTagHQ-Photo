import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateSeoMetadata(params: {
  businessName?: string;
  serviceCategory?: string;
  city?: string;
  district?: string;
  country?: string;
  businessType?: string;
  language?: string;
}) {
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
  }

  const ai = new GoogleGenAI({ apiKey });
  const { businessName, serviceCategory, city, district, country, businessType, language = 'en' } = params;

  const prompt = `You are an expert SEO copywriter specializing in Local SEO. 
    Generate optimized SEO metadata based on these details:
    - Business Name: ${businessName || 'N/A'}
    - Service/Category: ${serviceCategory || 'N/A'}
    - Business Type: ${businessType || 'general'}
    - Location: ${[city, district, country].filter(Boolean).join(', ')}
    - Language: ${language}

    Return a JSON object with:
    1. "title": A compelling SEO title (60-80 chars) including service and location.
    2. "description": A persuasive meta description (140-160 chars).
    3. "suggestedAltText": An accessibility-friendly description for an image of this business.
    4. "keywords": A comma-separated string of 5-8 relevant SEO keywords.
    5. "schemaMarkup": A JSON string of Schema.org LocalBusiness or Service markup.
    6. "ogTags": A JSON object with "og:title", "og:description", and "twitter:card".
    7. "hreflang": A JSON object mapping language codes to suggested URL suffixes (e.g., {"en": "en", "es": "es"}).
    8. "semanticClusters": An array of 3-4 related entity clusters for content authority.

    Return ONLY the raw JSON object. No markdown, no prefixes. Follow Koray Tugberk Gubur's semantic SEO methodology: prioritize entity connections and informational value.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
          responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
