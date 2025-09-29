import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

// GET /api/auth/2fa/status - Kiểm tra trạng thái 2FA của user
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'No user session found' }, { status: 401 })
    }
    
    const userData = JSON.parse(userCookie.value)
    const googleId = userData.googleId
    
    console.log(`🔍 Checking 2FA status for user: ${googleId}`)
    
    // Check from subscriptions.json file if user has 2FA enabled
    const subscriptionsPath = path.join(process.cwd(), 'data', 'subscriptions.json')
    
    let user2FAStatus = {
      enabled: false,
      setupDate: null,
      lastUsed: null
    }
    
    try {
      if (fs.existsSync(subscriptionsPath)) {
        const data = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
        
        if (data.users && data.users[googleId]) {
          const user = data.users[googleId]
          user2FAStatus = {
            enabled: user.twoFactorEnabled || false,
            setupDate: user.twoFASetupDate || null,
            lastUsed: user.twoFALastUsed || null
          }
        }
      }
    } catch (error) {
      console.error('Error reading user 2FA status:', error)
    }
    
    console.log(`🔍 User ${googleId} 2FA status:`, user2FAStatus)
    
    return NextResponse.json({
      success: true,
      enabled: user2FAStatus.enabled,
      setupDate: user2FAStatus.setupDate,
      lastUsed: user2FAStatus.lastUsed
    })
  } catch (error) {
    console.error('Error checking 2FA status:', error)
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