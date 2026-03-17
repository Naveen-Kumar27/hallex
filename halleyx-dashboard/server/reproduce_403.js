const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://hallex.onrender.com/api';

async function reproduce() {
    console.log("--- Starting Reproduction Script ---");
    try {
        // 1. Register/Login
        console.log("Logging in...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@halleyx.com', // Assuming this exists from previous tests or seed
            password: 'password123'
        }).catch(async () => {
             console.log("Login failed, trying register...");
             return await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test Admin',
                email: 'admin@halleyx.com',
                password: 'password123'
             });
        });

        const token = loginRes.data.token;
        console.log("Token obtained.");

        // 2. Call ai-analyze
        console.log("Calling ai-analyze...");
        const analyzeRes = await axios.post(`${BASE_URL}/analytics/ai-analyze`, 
            { prompt: 'Show me sales by product' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("SUCCESS:", JSON.stringify(analyzeRes.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error("FAILED with Status:", error.response.status);
            console.error("ERROR MESSAGE:", error.response.data.error || error.response.data.message);
            console.error("FULL DATA:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("ERROR:", error.message);
        }
    }
}

reproduce();
