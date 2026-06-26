import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const GEMINI_KEYS = [
  process.env.VITE_GEMINI_API_KEY,
  process.env.VITE_GEMINI_API_KEY_1,
  process.env.VITE_GEMINI_API_KEY_2,
  process.env.VITE_GEMINI_API_KEY_3,
  process.env.VITE_GEMINI_API_KEY_4,
  process.env.VITE_GEMINI_API_KEY_5,
  process.env.VITE_GEMINI_API_KEY_6,
].filter(Boolean) as string[];

const MODEL = 'gemini-2.5-flash-lite';

// Use a real UploadThing URL from the seed data
const TEST_IMAGE_URL = 'https://utfs.io/f/rcR5Ive7JRKEYCXcCWvzjkS9PKwZ46dx5W7iFzpNlXB1fnJO';

async function testGemini() {
  console.log('🧪 Testing Gemini AI image analysis\n');
  console.log(`Model: ${MODEL}`);
  console.log(`Keys available: ${GEMINI_KEYS.length}`);
  console.log(`Test image: ${TEST_IMAGE_URL}\n`);

  // Fetch image
  console.log('1. Fetching image...');
  const response = await fetch(TEST_IMAGE_URL);
  if (!response.ok) {
    console.error(`❌ Failed to fetch image: ${response.status}`);
    process.exit(1);
  }
  const blob = await response.blob();
  console.log(`   ✅ Image fetched: ${blob.type}, ${(blob.size / 1024).toFixed(1)}KB`);

  // Convert to base64
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  console.log(`   ✅ Base64 encoded: ${base64.length} chars`);

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

  // Try each key
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[i];
    console.log(`\n2. Trying key ${i + 1}/${GEMINI_KEYS.length} (${key.slice(0, 15)}...)...`);

    try {
      const { GoogleGenAI } = await import('@google/genai');
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
                  mimeType: blob.type || 'image/jpeg',
                  data: base64,
                },
              },
            ],
          },
        ],
      });

      const text = result.text || '';
      console.log(`   ✅ Response received (${text.length} chars)`);

      if (text) {
        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const suggestion = JSON.parse(jsonMatch[0]);
          console.log('\n🎉 AI Product Suggestion:');
          console.log(JSON.stringify(suggestion, null, 2));

          // Validate
          const validCategories = ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS'];
          if (validCategories.includes(suggestion.category)) {
            console.log(`\n✅ Category valid: ${suggestion.category}`);
          } else {
            console.log(`\n⚠️  Category invalid: ${suggestion.category}`);
          }

          console.log('\n✅ Gemini AI test PASSED!');
          return;
        } else {
          console.log(`   ⚠️  No JSON found in response: ${text.slice(0, 200)}`);
        }
      } else {
        console.log(`   ⚠️  Empty response`);
      }
    } catch (err: any) {
      console.log(`   ❌ Key ${i + 1} failed: ${err.message}`);
      if (err.status) console.log(`      Status: ${err.status}`);
    }
  }

  console.error('\n❌ All Gemini keys failed!');
  process.exit(1);
}

testGemini().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
