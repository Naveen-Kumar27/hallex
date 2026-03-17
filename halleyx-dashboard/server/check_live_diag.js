const axios = require('axios');

async function checkDiag() {
  const url = 'https://hallex.onrender.com/api/analytics/diag';
  console.log(`Checking diagnostic route: ${url}...`);
  try {
    const res = await axios.get(url);
    console.log("DIAG SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error(`DIAG FAILED - Status: ${err.response.status}`);
      console.error("DATA:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("ERROR:", err.message);
    }
  }
}

checkDiag();
