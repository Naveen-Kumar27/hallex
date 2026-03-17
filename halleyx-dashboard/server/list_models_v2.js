const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    console.log("Checking available models for this API key...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("NO KEY");
        return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.list();
        for (const m of response.models) {
            console.log(`- ${m.name}`);
        }
    } catch(e) {
        console.error("ERROR listing models:", e.message);
    }
}

listModels();
