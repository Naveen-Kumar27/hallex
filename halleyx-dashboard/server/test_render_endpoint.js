const axios = require('axios');

async function testRender() {
  try {
    const response = await axios.post('https://hallex.onrender.com/api/analytics/ai-analyze', {
      prompt: "Show me sales by product"
    });
    console.log('SUCCESS:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('ERROR STATUS:', error.response.status);
      console.log('ERROR DATA:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('ERROR MESSAGE:', error.message);
    }
  }
}

testRender();
