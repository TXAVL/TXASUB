// Script to check user 2FA status
const fs = require('fs')
const path = require('path')

console.log('🔐 Checking User 2FA Status')
console.log('============================')

const subscriptionsFile = path.join(process.cwd(), 'data', 'subscriptions.json')

function checkUser2FA() {
  try {
    if (!fs.existsSync(subscriptionsFile)) {
      console.log('❌ subscriptions.json file not found')
      return
    }
    
    const data = JSON.parse(fs.readFileSync(subscriptionsFile, 'utf8'))
    
    console.log('\n📋 Users in database:')
    console.log('====================')
    
    if (!data.users || Object.keys(data.users).length === 0) {
      console.log('❌ No users found in database')
      return
    }
    
    Object.entries(data.users).forEach(([userId, userData]) => {
      console.log(`\n👤 User ID: ${userId}`)
      console.log(`   Email: ${userData.profile?.email || 'N/A'}`)
      console.log(`   Name: ${userData.profile?.name || 'N/A'}`)
      
      if (userData.profile) {
        console.log(`   🔐 2FA Enabled: ${userData.profile.twoFactorEnabled ? '✅ YES' : '❌ NO'}`)
        console.log(`   📅 2FA Setup Date: ${userData.profile.twoFASetupDate || 'Not set'}`)
        console.log(`   🕒 2FA Last Used: ${userData.profile.twoFALastUsed || 'Never'}`)
        console.log(`   🔑 2FA Secret: ${userData.profile.twoFASecret ? 'Set' : 'Not set'}`)
      } else {
        console.log(`   🔐 2FA Enabled: ❌ NO (no profile data)`)
      }
    })
    
    console.log('\n🎯 Summary:')
    console.log('===========')
    
    const usersWith2FA = Object.values(data.users).filter(user => 
      user.profile && user.profile.twoFactorEnabled
    ).length
    
    const totalUsers = Object.keys(data.users).length
    
    console.log(`Total users: ${totalUsers}`)
    console.log(`Users with 2FA enabled: ${usersWith2FA}`)
    console.log(`Users without 2FA: ${totalUsers - usersWith2FA}`)
    
  } catch (error) {
    console.error('❌ Error reading subscriptions file:', error.message)
  }
}

// Run check
checkUser2FA()