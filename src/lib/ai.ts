import { GoogleGenAI } from '@google/genai';

const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBqceT8v86yhVtKyEw4vegn9uLEUA5Zpa4',
  import.meta.env.VITE_GEMINI_API_KEY_1 || 'AIzaSyAaIImIugbXNyVa0Y-bxak2Qievc9bbwz0',
  import.meta.env.VITE_GEMINI_API_KEY_2 || 'AIzaSyBVxYnsmw4j-jsRphYECj_TjP3BPD-gvHs',
  import.meta.env.VITE_GEMINI_API_KEY_3 || 'AIzaSyDhvJ2PosA-Ra_pOoHzFzzJ2SWD5Iugf-A',
  import.meta.env.VITE_GEMINI_API_KEY_4 || 'AIzaSyB6giA9QL_VTxc6hv1k5-3mRjxArSVM2tE',
  import.meta.env.VITE_GEMINI_API_KEY_5 || 'AIzaSyDLerpK9XgXZ-AOov-Jo8eLhpZgiCstBro',
  import.meta.env.VITE_GEMINI_API_KEY_6 || 'AIzaSyB0lcouTZWjK5nORiR6V_pr0m8vzStY3jA',
].filter(Boolean) as string[];

const MODEL = 'gemini-3.1-flash-lite';

export interface AIProductSuggestion {
  name: string;
  description: string;
  brand: string;
  category: string;
  tags: string[];
  colors: string[];
}

async function callGemini(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const key of GEMINI_KEYS) {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const result = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });
      const text = result.text || '';
      if (text) return text;
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini key failed (${key.slice(0, 10)}...):`, err.message);
    }
  }

  throw lastError || new Error('No Gemini API keys configured');
}

export async function analyzeProductImage(imageUrl: string): Promise<AIProductSuggestion> {
  if (GEMINI_KEYS.length === 0) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add at least one key to .env.local');
  }

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

  const text = await callGemini(base64, blob.type, prompt);

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI did not return valid JSON: ' + text.slice(0, 200));
  }

  const suggestion = JSON.parse(jsonMatch[0]) as AIProductSuggestion;

  // Validate category
  const validCategories = ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS'];
  if (!validCategories.includes(suggestion.category)) {
    suggestion.category = 'SHIRTS';
  }

  return suggestion;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
