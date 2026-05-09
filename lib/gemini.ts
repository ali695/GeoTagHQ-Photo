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
  streetAddress?: string;
  postalCode?: string;
  stateRegion?: string;
  countryCode?: string;
}) {
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
  }

  const ai = new GoogleGenAI({ apiKey });
  const { 
    businessName, 
    serviceCategory, 
    city, 
    district, 
    country, 
    businessType, 
    language = 'en',
    streetAddress,
    postalCode,
    stateRegion,
    countryCode
  } = params;

  const prompt = `You are a world-class Semantic SEO Strategist and expert Copywriter specializing in Topical Authority and Local SEO entity optimization. 
    Generate highly optimized, entity-rich SEO metadata based on these confirmed details:
    - Business Name: ${businessName || 'N/A'}
    - Service/Category: ${serviceCategory || 'N/A'}
    - Business Type: ${businessType || 'general'}
    - Primary Location: ${streetAddress ? `${streetAddress}, ` : ''}${district ? `${district}, ` : ''}${city || ''} ${postalCode || ''}
    - Specific District/Area: ${district || 'N/A'}
    - Language/Locale: ${language}
    
    CRITICAL CONSTRAINTS:
    1. LANGUAGE: All content (title, description, alt text, keywords, semantic clusters) MUST be written in ${language}.
    2. LOCAL TERMINOLOGY: Use authentic local terminology, industry slang, and regional semantic variants. Absolute avoidance of generic machine translations.
    3. TONE: Adapt the writing tone to match the "${businessType}" niche (e.g., professional for medical, urgent/helpful for towing/plumbing, luxurious for high-end services).
    4. KORAY TUGBERK GUBUR METHODOLOGY:
       - Focus on "Information Gain" — provide specific details about the service area and business specialty that aren't generic.
       - Entity Optimization: Identify and connect relevant local entities (landmarks, neighborhood names, related services).
       - Topical Authority: Group keywords into semantic clusters that establish the business as a local subject matter expert.
    
    REQUIRED JSON OUTPUT FIELDS:
    1. "title": A compelling, CTR-optimized SEO title (60-70 chars). Include the primary service and the city/area.
    2. "description": A high-conversion meta description (150-160 chars) mentioning unique selling points and location.
    3. "suggestedAltText": A descriptive, context-rich alt text that incorporates the primary entity and location.
    4. "keywords": A comma-separated string of 12-15 highly relevant semantic keywords and entities.
    5. "schemaMarkup": An exhaustive JSON-LD LocalBusiness or specialized type (e.g., Plumber, Lawyer) schema. Include address, geo, openingHours (standard), and sameAs if possible.
    6. "ogTags": A JSON object with exhaustive OpenGraph and Twitter Card properties.
    7. "hreflang": A JSON mapping of locale codes (e.g., en-US, en-GB, local-locale).
    8. "semanticClusters": An array of 6-8 distinct entity-based topics that build topical authority for this business.

    Return ONLY the raw JSON object. No markdown, no conversational filler.`;

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
