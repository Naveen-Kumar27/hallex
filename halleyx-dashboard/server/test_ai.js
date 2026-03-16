const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function testAI() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    console.log('Testing AI generation...');
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hello, respond with JSON: {"status": "ok"}' }] }]
    });
    
    console.log('Result Keys:', Object.keys(result));
    console.log('Result.text:', result.text);
    if (result.candidates) {
        console.log('Candidate 0 Parts:', JSON.stringify(result.candidates[0].content.parts, null, 2));
    }
  } catch (err) {
    console.error('AI Call Failed:', err);
  }
}

testAI();
