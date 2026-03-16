const https = require('https');
require('dotenv').config();

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: `/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
  method: 'GET'
};

const req = https.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.end();
