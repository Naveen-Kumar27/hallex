require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const modelsToTry = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'models/gemini-2.0-flash',
  'models/gemini-1.5-flash',
  'gemini-flash-latest',
];

async function test() {
  for (const model of modelsToTry) {
    try {
      process.stdout.write(`Testing: ${model} ... `);
      const result = await ai.models.generateContent({
        model,
        contents: 'Say: ok'
      });
      const text = result.text || '';
      console.log(`✅ SUCCESS: "${text.substring(0, 40)}"`);
      return; // stop on first success
    } catch (err) {
      const msg = err.message || '';
      // Extract just status code
      const codeMatch = msg.match(/"code":(\d+)/);
      const statusMatch = msg.match(/"status":"([^"]+)"/);
      console.log(`❌ ${codeMatch ? codeMatch[1] : '?'} ${statusMatch ? statusMatch[1] : err.message.substring(0, 60)}`);
    }
  }
}

test();
