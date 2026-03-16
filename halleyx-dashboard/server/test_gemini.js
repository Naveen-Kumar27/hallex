const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGemini() {
  try {
    const result = await ai.models.generateContent({
      model: 'models/gemini-flash-latest',
      contents: 'Say hello in JSON format like: {"message": "hello"}'
    });
    
    console.log('--- FULL RESULT TYPE ---');
    console.log(typeof result);
    console.log('--- FULL RESULT KEYS ---');
    console.log(Object.keys(result));
    
    console.log('\n--- result.text (property) ---');
    console.log(typeof result.text, result.text);
    
    console.log('\n--- result.text() (method call) ---');
    try { console.log(result.text()); } catch(e) { console.log('Error calling .text():', e.message); }
    
    console.log('\n--- result.candidates ---');
    console.log(JSON.stringify(result.candidates, null, 2));
    
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

testGemini();
