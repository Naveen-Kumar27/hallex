const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function finalTest() {
  console.log("Starting Final Test with New Key...");
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: 'Respond with a JSON object: {"status": "ok"}. RAW JSON ONLY.' }] }]
    });
    
    console.log("--- RAW RESPONSE ---");
    console.log(result.text);
    
    // Test parsing logic similar to AIDashboardService
    let text = result.text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```[a-z]*\n?/, '').replace(/```\n?$/, '').trim();
    }
    
    const parsed = JSON.parse(text);
    console.log("--- PARSED SUCCESS ---");
    console.log(parsed);
  } catch (err) {
    console.error("--- TEST FAILED ---");
    console.error(err);
    process.exit(1);
  }
}

finalTest();
