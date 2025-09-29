import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'
import { getPendingUser } from '@/lib/pending-verification'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')

async function readSubscriptions() {
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { users: {} }
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const data = await readSubscriptions()
    const userProfile = data.users[user.googleId]?.profile
    
    if (userProfile) {
      return NextResponse.json({
        id: user.googleId,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
        googleId: user.googleId,
        emailVerified: userProfile.emailVerified || false,
        twoFactorEnabled: data.users[user.googleId]?.twoFactorEnabled || false,
        profile: userProfile
      })
    } else {
      // Kiểm tra xem user có trong pending verification không
      const pendingUser = await getPendingUser(user.googleId)
      if (pendingUser) {
        return NextResponse.json({
          id: user.googleId,
          email: pendingUser.email,
          name: pendingUser.name,
          picture: pendingUser.picture,
          googleId: user.googleId,
          twoFactorEnabled: false,
          profile: {
            email: pendingUser.email,
            name: pendingUser.name,
            picture: pendingUser.picture,
            emailVerified: false
          }
        })
      }
      
      // Nếu không có profile trong database và không trong pending, trả về thông tin từ cookie
      return NextResponse.json({
        id: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        twoFactorEnabled: false,
        profile: {
          email: user.email,
          name: user.name,
          picture: user.picture
        }
      })
    }
  } catch (error) {
    console.error('Error in /api/user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const body = await request.json()
    
    // Cập nhật email settings
    if (body.emailNotifications) {
      const data = await readSubscriptions()
      if (data.users[user.googleId]) {
        if (!data.users[user.googleId].profile) {
          data.users[user.googleId].profile = {}
        }
        data.users[user.googleId].profile.emailNotifications = body.emailNotifications
        await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true })
      }
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}