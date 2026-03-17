const AIDashboardService = require('./src/services/AIDashboardService');
require('dotenv').config();

async function testAnalyze() {
    console.log("Testing AIDashboardService.analyzeRequirement...");
    const prompt = "Show me sales by product for the last week";
    
    try {
        const analysis = await AIDashboardService.analyzeRequirement(prompt, []);
        console.log("\n--- ANALYSIS RESULT ---");
        console.log(JSON.stringify(analysis, null, 2));
    } catch (error) {
        console.error("\n--- ANALYSIS FAILED ---");
        console.error(error.message);
        if (error.message.includes("403") || error.message.includes("PERMISSION_DENIED")) {
            console.log("\n[TIP] The API key is likely invalid or lacks permissions for gemini-1.5-flash.");
        }
    }
}

testAnalyze();
