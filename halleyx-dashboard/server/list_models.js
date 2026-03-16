const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    console.log('Listing models...');
    const result = await ai.models.list();
    console.log('Models found:', result.map(m => m.name));
  } catch (err) {
    console.error('List Models Failed:', err);
  }
}

listModels();
