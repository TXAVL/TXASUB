// Using built-in fetch (Node.js 18+)

async function testAnalytics() {
  console.log('📊 Testing Analytics API...\n')
  
  try {
    // Test user cookie
    const userCookie = JSON.stringify({
      googleId: '105968711043650964191',
      email: 'xuananhdepzai9@gmail.com',
      name: 'TXA VLOG'
    })
    
    console.log('1️⃣ Testing /api/analytics endpoint...')
    
    const response = await fetch('http://localhost:3001/api/analytics', {
      method: 'GET',
      headers: {
        'Cookie': `user=${encodeURIComponent(userCookie)}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    console.log(`✅ /api/analytics response:`)
    console.log(`Status: ${response.status}`)
    console.log(`Body:`, JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('🎉 Analytics API works!')
      console.log('\n📈 Analytics Summary:')
      console.log(`- Total Subscriptions: ${data.totalSubscriptions}`)
      console.log(`- Monthly Cost: $${data.totalMonthlyCost}`)
      console.log(`- Yearly Cost: $${data.totalYearlyCost}`)
      console.log(`- Expiring Soon: ${data.expiringSoon}`)
      console.log(`- Critical: ${data.critical}`)
      console.log(`- Auto Renew: ${data.autoRenewCount}`)
      console.log(`- Categories:`, Object.keys(data.categories))
      console.log(`- Upcoming Expirations: ${data.upcomingExpirations.length}`)
    } else {
      console.log('❌ Analytics API failed')
    }
    
  } catch (error) {
    console.error('❌ Error testing analytics:', error.message)
  }
}

testAnalytics()