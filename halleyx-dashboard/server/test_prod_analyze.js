const axios = require('axios');

const BASE_URL = 'https://hallex.onrender.com/api';

async function testProd() {
    console.log("--- Starting Production 403 Test ---");
    try {
        console.log("Attempting Login...");
        let token;
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@halleyx.com',
                password: 'password123'
            });
            token = loginRes.data.token;
            console.log("Login successful, token obtained.");
        } catch (e) {
            console.log("Login failed, attempting registration...");
            const regRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test Admin',
                email: 'admin@halleyx.com',
                password: 'password123'
            });
            token = regRes.data.token;
            console.log("Registration successful, token obtained.");
        }

        console.log("Calling ai-analyze...");
        const analyzeRes = await axios.post(`${BASE_URL}/analytics/ai-analyze`, 
            { prompt: 'Show me my revenue' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("SUCCESS:", JSON.stringify(analyzeRes.data, null, 2));
        console.log("HEADERS:", analyzeRes.headers);

    } catch (error) {
        if (error.response) {
            console.error("\n>>> FAILED with Status:", error.response.status);
            console.error(">>> ERROR HEADERS:");
            console.error(error.response.headers);
            console.error(">>> ERROR MESSAGE:", error.response.data?.error || error.response.data?.message);
            console.error(">>> FULL DATA:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("ERROR:", error.message);
        }
    }
}

// Keep trying every 10 seconds until it succeeds or we see the X-Debug-Source header
async function pollProd() {
    for(let i=0; i<6; i++) {
        console.log(`\n--- Attempt ${i+1} ---`);
        await testProd();
        await new Promise(r => setTimeout(r, 15000));
    }
}

pollProd();
