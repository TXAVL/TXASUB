#!/usr/bin/env node

/**
 * Script để test email notifications trên localhost
 * Sử dụng: node scripts/test-email.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/cron/notifications',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🚀 Testing email notifications...');
console.log('📧 Sending request to: http://localhost:3001/api/cron/notifications');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response received:');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
    
    if (res.statusCode === 200) {
      console.log('🎉 Email notifications sent successfully!');
    } else {
      console.log('❌ Error sending email notifications');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('💡 Make sure the server is running: npm run dev');
});

req.end();