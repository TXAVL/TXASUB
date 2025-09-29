import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import speakeasy from 'speakeasy'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token, secret } = await request.json()
    
    if (!token || !secret) {
      return NextResponse.json({ error: 'Token and secret are required' }, { status: 400 })
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2
    })

    if (!verified) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Save 2FA secret to user data
    const user = JSON.parse(userCookie.value)
    const dataDir = path.join(process.cwd(), 'data')
    const subscriptionsPath = path.join(dataDir, 'subscriptions.json')
    
    if (fs.existsSync(subscriptionsPath)) {
      const data = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
      
      // Check if data has users structure
      if (data.users && data.users[user.googleId]) {
        data.users[user.googleId].twoFactorEnabled = true
        data.users[user.googleId].twoFactorSecret = secret
        fs.writeFileSync(subscriptionsPath, JSON.stringify(data, null, 2))
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying 2FA code:', error)
    return NextResponse.json(
      { error: 'Failed to verify 2FA code' },
      { status: 500 }
    )
  }
}