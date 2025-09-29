import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/2fa/required - Kiểm tra xem user có cần 2FA sau khi login không
export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' }, 
        { status: 400 }
      )
    }
    
    console.log(`🔐 Checking if 2FA required for user: ${email}`)
    
    // Check from subscriptions.json file if user has 2FA enabled
    const fs = require('fs')
    const path = require('path')
    const subscriptionsFile = path.join(process.cwd(), 'data', 'subscriptions.json')
    
    let user2FAStatus = {
      enabled: false, // Default: no 2FA required
      setupDate: null,
      lastUsed: null
    }
    
    try {
      if (fs.existsSync(subscriptionsFile)) {
        const data = JSON.parse(fs.readFileSync(subscriptionsFile, 'utf8'))
        
        if (data.users && data.users[userId]) {
          const user = data.users[userId]
          
          if (user && user.profile) {
            user2FAStatus = {
              enabled: user.profile.twoFactorEnabled || false,
              setupDate: user.profile.twoFASetupDate || null,
              lastUsed: user.profile.twoFALastUsed || null
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading user 2FA status:', error)
      // Continue with default (no 2FA required)
    }
    
    const requires2FA = user2FAStatus.enabled
    
    if (requires2FA) {
      console.log(`✅ User ${email} requires 2FA verification`)
      return NextResponse.json({
        success: true,
        requires2FA: true,
        message: '2FA verification required',
        userEmail: email,
        setupDate: user2FAStatus.setupDate
      })
    } else {
      console.log(`❌ User ${email} does not require 2FA`)
      return NextResponse.json({
        success: true,
        requires2FA: false,
        message: '2FA verification not required'
      })
    }
  } catch (error) {
    console.error('Error checking 2FA requirement:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      }, 
      { status: 500 }
    )
  }
}