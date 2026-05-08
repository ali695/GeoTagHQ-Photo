import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, serviceCategory, city, district, country, businessType, language } = body;
    
    // AI Copywriting logic
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback templating logic
      const lang = language || 'en';
      let title = '';
      let desc = '';
      let alt = '';
      
      const parts = [serviceCategory, city, district].filter(Boolean);
      const loc = [city, district].filter(Boolean).join(', ');
      
      if (lang === 'en') {
        const noun = businessType === 'hotel' ? 'Best Hotel & Stays' : 
                     businessType === 'restaurant' ? 'Top Rated Restaurant' : 
                     businessType === 'plumber' ? 'Expert Plumbing Services' : 
                     businessType === 'real_estate' ? 'Premium Real Estate' : 
                     serviceCategory || 'Professional Services';
        title = `${noun} ${loc ? 'in ' + loc : ''} | ${businessName || 'Top Choice'}`;
        desc = `Looking for ${noun.toLowerCase()} ${loc ? 'in ' + loc : ''}? ${businessName ? businessName + ' offers' : 'We offer'} exceptional quality and reliable service. Contact us today!`;
        alt = `${noun} ${loc ? 'in ' + loc : ''} - ${businessName || 'Photo'}`;
      } else if (lang === 'de') {
        const noun = businessType === 'hotel' ? 'Bestes Hotel & Unterkünfte' : 
                     businessType === 'restaurant' ? 'Erstklassiges Restaurant' : 
                     businessType === 'plumber' ? 'Experten-Klempnerdienste' : 
                     businessType === 'real_estate' ? 'Premium-Immobilien' : 
                     serviceCategory || 'Professionelle Dienstleistungen';
        title = `${noun} ${loc ? 'in ' + loc : ''} | ${businessName || 'Top Wahl'}`;
        desc = `Suchen Sie nach ${noun.toLowerCase()} ${loc ? 'in ' + loc : ''}? ${businessName ? businessName + ' bietet' : 'Wir bieten'} außergewöhnliche Qualität und zuverlässigen Service. Kontaktieren Sie uns noch heute!`;
        alt = `${noun} ${loc ? 'in ' + loc : ''} - ${businessName || 'Foto'}`;
      } else {
        // basic fallback
        title = parts.join(' ') + (businessName ? ` - ${businessName}` : '');
        desc = `Professional ${serviceCategory || ''} in ${loc}. ${businessName ? 'By ' + businessName + '.' : ''}`;
        alt = parts.join(' ');
      }
      
      return NextResponse.json({
        title: title.substring(0, 60),
        description: desc.substring(0, 160),
        suggestedAltText: alt.substring(0, 100),
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are an expert SEO copywriter. Generate SEO metadata given the following context:
Business Name: ${businessName || 'Not specified'}
Service/Category: ${serviceCategory || 'Not specified'}
Location: ${[district, city, country].filter(Boolean).join(', ') || 'Not specified'}
Business Vertical/Type: ${businessType || 'General Professional'}
Target Language: ${language === 'en' ? 'English' : language === 'de' ? 'German' : language === 'fr' ? 'French' : language === 'es' ? 'Spanish' : language}

Rules:
1. Title must be under 60 characters and highly optimized.
2. Description must be between 120-160 characters, persuasive, and include a call to action.
3. Alt text should be descriptive (for accessibility) and include primary keywords.
4. Output EXACTLY JSON format with keys "title", "description", "suggestedAltText". Do not use markdown blocks. Ensure valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt]
    });
    
    let text = response.text || '';
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch(e) {
      console.error("Failed to parse Gemini response: ", text);
      throw new Error("Invalid AI format");
    }
  } catch (error: any) {
    console.error("SEO Gen error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate SEO" }, { status: 500 });
  }
}
