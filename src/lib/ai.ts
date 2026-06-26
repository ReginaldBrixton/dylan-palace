import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY. Add it to .env.local');
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

export interface AIProductSuggestion {
  name: string;
  description: string;
  brand: string;
  category: string;
  tags: string[];
  colors: string[];
}

/**
 * Analyzes a product image using Gemini AI and suggests
 * product name, description, brand, category, tags, and colors.
 * The seller still sets the price manually.
 */
export async function analyzeProductImage(imageUrl: string): Promise<AIProductSuggestion> {
  const genai = getAI();

  // Fetch the image and convert to base64
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const base64 = await blobToBase64(blob);

  const prompt = `You are a fashion product analyst. Analyze this product image and provide structured details for an e-commerce listing.

Return ONLY a JSON object with this exact structure:
{
  "name": "A concise, appealing product name (max 60 chars)",
  "description": "A detailed product description (2-3 sentences, highlighting material, style, and key features)",
  "brand": "Likely brand or 'Unbranded' if unknown",
  "category": "One of: SHIRTS, TROUSERS, SHOES, BAGS",
  "tags": ["3-5 relevant tags as an array"],
  "colors": ["2-4 dominant colors as an array"]
}

Analyze the image carefully and provide accurate fashion-specific details.`;

  const result = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: blob.type || 'image/jpeg',
              data: base64,
            },
          },
        ],
      },
    ],
  });

  const text = result.response?.text?.() || '';

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI did not return valid JSON');
  }

  const suggestion = JSON.parse(jsonMatch[0]) as AIProductSuggestion;

  // Validate category
  const validCategories = ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS'];
  if (!validCategories.includes(suggestion.category)) {
    suggestion.category = 'SHIRTS'; // Default fallback
  }

  return suggestion;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
