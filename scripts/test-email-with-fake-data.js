#!/usr/bin/env node

/**
 * Script để test email với dữ liệu giả có thời gian phù hợp
 * Sử dụng: node scripts/test-email-with-fake-data.js
 */

const http = require('http');

// Tạo dữ liệu giả với gói sắp hết hạn trong 2 ngày
const fakeData = {
  users: {
    "105968711043650964191": {
      subscriptions: [
        {
          id: "test-123",
          name: "Test Subscription",
          expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
          cost: 29.99,
          cycle: "monthly",
          autoRenew: false,
          createdAt: new Date().toISOString()
        }
      ],
      profile: {
        email: "xuananhdepzai9@gmail.com",
        name: "TXA VLOG",
        emailNotifications: {
          enabled: true,
          expiringSoon: true,
          critical: true,
          weekly: false,
          monthly: false
        }
      }
    }
  }
};

console.log('🧪 Testing email with fake data...');
console.log(`📅 Test subscription expires: ${fakeData.users["105968711043650964191"].subscriptions[0].expiry}`);
console.log(`⏰ Days until expiry: ${Math.ceil((new Date(fakeData.users["105968711043650964191"].subscriptions[0].expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days\n`);

// Tạm thời backup và thay thế dữ liệu
const fs = require('fs');
const path = require('path');

const SUBSCRIPTIONS_FILE = path.join(__dirname, '..', 'data', 'subscriptions.json');

async function testWithFakeData() {
  try {
    // Backup original data
    const originalData = await fs.promises.readFile(SUBSCRIPTIONS_FILE, 'utf8');
    const originalJson = JSON.parse(originalData);
    
    // Write fake data
    await fs.promises.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(fakeData, null, 2));
    console.log('📝 Written fake data to subscriptions.json');
    
    // Test cron job
    console.log('🚀 Testing cron job with fake data...');
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/cron/notifications',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        console.log('✅ Response received:');
        console.log('Status:', res.statusCode);
        console.log('Body:', data);
        
        // Restore original data
        await fs.promises.writeFile(SUBSCRIPTIONS_FILE, originalData);
        console.log('🔄 Restored original data');
        
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          if (response.notificationsSent > 0) {
            console.log('🎉 Email notifications sent successfully!');
            console.log('📧 Check your email inbox for the new template!');
          } else {
            console.log('ℹ️ No notifications sent (no subscriptions match criteria)');
          }
        } else {
          console.log('❌ Error sending email notifications');
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error.message);
    });

    req.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWithFakeData();