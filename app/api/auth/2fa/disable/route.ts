import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const dataDir = path.join(process.cwd(), 'data')
    const subscriptionsPath = path.join(dataDir, 'subscriptions.json')
    
    if (fs.existsSync(subscriptionsPath)) {
      const data = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
      
      // Check if data has users structure
      if (data.users && data.users[user.googleId]) {
        data.users[user.googleId].twoFactorEnabled = false
        delete data.users[user.googleId].twoFactorSecret
        fs.writeFileSync(subscriptionsPath, JSON.stringify(data, null, 2))
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disabling 2FA:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}