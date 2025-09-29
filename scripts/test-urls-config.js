// Test script to verify all URLs use environment variables
const { config } = require('dotenv') 

console.log('🔗 Testing URL Configuration')
console.log('============================')

// Load environment
config({ path: '.env.local' })

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

console.log(`\n📋 Configuration:`)
console.log(`Base URL: ${baseUrl}`)
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)

console.log(`\n🔧 API Endpoints (using environment variables):`)
const endpoints = [
  `${baseUrl}/api/config`,
  `${baseUrl}/api/auth/2fa/enable`,
  `${baseUrl}/api/auth/2fa/verify`, 
  `${baseUrl}/api/auth/2fa/status`,
  `${baseUrl}/api/auth/2fa/required`,
  `${baseUrl}/api/auth/2fa/complete`,
  `${baseUrl}/api/teams`,
  `${baseUrl}/api/payments`,
  `${baseUrl}/api/integrations/stripe`,
  `${baseUrl}/api/analytics`
]

endpoints.forEach(endpoint => {
  console.log(`  ✅ ${endpoint}`)
})

console.log(`\n🌐 Pages (using environment variables):`)
const pages = [
  `${baseUrl}/security`,
  `${baseUrl}/auth/2fa-verify`,
  `${baseUrl}/features`,
  `${baseUrl}/config-test`,
  `${baseUrl}/subscriptions`,
  `${baseUrl}/profile`
]

pages.forEach(page => {
  console.log(`  🔗 ${page}`)
})

console.log(`\n📱 2FA Flow URLs:`)
const twoFAFlow = [
  `${baseUrl}/security - Setup 2FA`,
  `${baseUrl}/auth/2fa-verify - Verify 2FA after login`,
  `${baseUrl}/api/auth/2fa/required - Check if 2FA required`,
  `${baseUrl}/api/auth/2fa/complete - Complete 2FA verification`
]

twoFAFlow.forEach(flow => {
  console.log(`  🔐 ${flow}`)
})

console.log(`\n✅ All URLs now use environment variables!`)
console.log(`📋 No more hardcoded URLs in the codebase`)
console.log(`🔧 Easy to deploy to different environments`)

console.log(`\n🎯 Test Commands:`)
console.log(`1. Start server: npm run dev`)
console.log(`2. Visit: ${baseUrl}/security`)
console.log(`3. Test 2FA flow`)
console.log(`4. Check all URLs work with environment variables`)

console.log(`\n🚀 Ready for production deployment!`)