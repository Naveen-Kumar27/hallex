const genai = require('@google/genai');
console.log('Keys in @google/genai:', Object.keys(genai));

try {
    const { GoogleGenAI } = genai;
    if (GoogleGenAI) {
        console.log('GoogleGenAI is exported');
        const ai = new GoogleGenAI({ apiKey: 'test' });
        console.log('AI instance keys:', Object.keys(ai));
        if (ai.models) console.log('ai.models exists');
    }
} catch (e) {
    console.log('Error checking @google/genai:', e.message);
}
