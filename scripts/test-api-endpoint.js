#!/usr/bin/env node

/**
 * Script để test API endpoint test email trực tiếp
 * Sử dụng: node scripts/test-api-endpoint.js
 */

const http = require('http');

console.log('🧪 Testing API endpoint /api/notifications/test...\n');

// Test data - simulate a user cookie
const testData = {
  googleId: "105968711043650964191",
  name: "TXA VLOG",
  email: "xuananhdepzai9@gmail.com",
  picture: "https://lh3.googleusercontent.com/a/ACg8ocKkpni5NE6E7r1nWVg0CN6yrU_YDi1PN8-IgJ1v8P6PHB6l0z0=s96-c"
};

const postData = JSON.stringify({});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/notifications/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Cookie': `user=${encodeURIComponent(JSON.stringify(testData))}`
  }
};

console.log('📧 Sending POST request to: http://localhost:3001/api/notifications/test');
console.log('🍪 Cookie:', `user=${JSON.stringify(testData)}`);

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ Response received:');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
    
    if (res.statusCode === 200) {
      console.log('🎉 API endpoint test successful!');
      console.log('📧 Check your email inbox for the test email!');
    } else {
      console.log('❌ API endpoint test failed');
      try {
        const error = JSON.parse(data);
        console.log('Error details:', error);
      } catch (e) {
        console.log('Raw error:', data);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('💡 Make sure the server is running: npm run dev');
});

req.write(postData);
req.end();