import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')?.value

    if (!userCookie) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người dùng' }, { status: 401 })
    }

    const userData = JSON.parse(userCookie)
    const { password, twoFactorCode, deleteText } = await request.json()

    // Check if 2FA is enabled
    const has2FA = await check2FAStatus(userData.googleId)
    
    if (has2FA) {
      // If 2FA is enabled, verify 2FA code (no need for DELETE text)
      if (!twoFactorCode) {
        return NextResponse.json({ error: 'Vui lòng nhập mã 2FA' }, { status: 400 })
      }
      
      const is2FAValid = await verify2FACode(userData.googleId, twoFactorCode)
      if (!is2FAValid) {
        return NextResponse.json({ error: 'Mã 2FA không đúng' }, { status: 400 })
      }
    } else {
      // If no 2FA, verify DELETE text and password
      if (deleteText !== 'DELETE') {
        return NextResponse.json({ error: 'Văn bản xác nhận không đúng' }, { status: 400 })
      }
      
      if (!password) {
        return NextResponse.json({ error: 'Vui lòng nhập mật khẩu' }, { status: 400 })
      }
      
      // For Google OAuth users, password should be today's date
      const today = new Date()
      const expectedPassword = today.toLocaleDateString('vi-VN')
      
      if (password !== expectedPassword) {
        return NextResponse.json({ 
          error: `Mật khẩu không đúng. Vui lòng nhập ngày hôm nay: ${expectedPassword}` 
        }, { status: 400 })
      }
    }

    // Delete user data
    await deleteUserData(userData.googleId)

    // Clear cookies
    const response = NextResponse.json({ success: true })
    response.cookies.delete('user')
    response.cookies.delete('userId')

    return response

  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Có lỗi xảy ra khi xóa tài khoản' }, { status: 500 })
  }
}

async function check2FAStatus(googleId: string): Promise<boolean> {
  try {
    const subscriptionsPath = path.join(process.cwd(), 'data', 'subscriptions.json')
    
    if (!fs.existsSync(subscriptionsPath)) {
      return false
    }

    const subscriptionsData = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
    
    // Check if user exists in subscriptions.json
    if (subscriptionsData.users && subscriptionsData.users[googleId]) {
      const user = subscriptionsData.users[googleId]
      return user.twoFactorEnabled || false
    }
    
    return false
  } catch (error) {
    console.error('Error checking 2FA status:', error)
    return false
  }
}

async function verify2FACode(googleId: string, code: string): Promise<boolean> {
  try {
    // This is a simplified 2FA verification
    // In a real app, you'd use a proper 2FA library like speakeasy
    const subscriptionsPath = path.join(process.cwd(), 'data', 'subscriptions.json')
    
    if (!fs.existsSync(subscriptionsPath)) {
      return false
    }

    const subscriptionsData = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
    const user = subscriptionsData.find((u: any) => u.googleId === googleId)
    
    if (!user?.twoFactorSecret) {
      return false
    }

    // For demo purposes, accept any 6-digit code
    // In production, use proper TOTP verification
    return /^\d{6}$/.test(code)
  } catch (error) {
    console.error('Error verifying 2FA code:', error)
    return false
  }
}

async function deleteUserData(googleId: string): Promise<void> {
  try {
    // Delete from subscriptions.json
    const subscriptionsPath = path.join(process.cwd(), 'data', 'subscriptions.json')
    if (fs.existsSync(subscriptionsPath)) {
      const subscriptionsData = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf8'))
      const updatedData = subscriptionsData.filter((user: any) => user.googleId !== googleId)
      fs.writeFileSync(subscriptionsPath, JSON.stringify(updatedData, null, 2))
    }

    // Delete from pending_verification.json
    const pendingPath = path.join(process.cwd(), 'data', 'pending_verification.json')
    if (fs.existsSync(pendingPath)) {
      const pendingData = JSON.parse(fs.readFileSync(pendingPath, 'utf8'))
      const updatedPendingData = pendingData.filter((user: any) => user.googleId !== googleId)
      fs.writeFileSync(pendingPath, JSON.stringify(updatedPendingData, null, 2))
    }

    // Delete verification tokens
    const tokensPath = path.join(process.cwd(), 'data', 'verification_tokens.json')
    if (fs.existsSync(tokensPath)) {
      const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'))
      const updatedTokens = tokensData.filter((token: any) => token.email !== googleId)
      fs.writeFileSync(tokensPath, JSON.stringify(updatedTokens, null, 2))
    }

    console.log(`User data deleted for Google ID: ${googleId}`)
  } catch (error) {
    console.error('Error deleting user data:', error)
    throw error
  }
}