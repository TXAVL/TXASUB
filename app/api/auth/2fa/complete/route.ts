import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// POST /api/auth/2fa/complete - Hoàn thành 2FA verification và cập nhật session
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Completing 2FA verification')
    
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'No user session found' }, 
        { status: 401 }
      )
    }
    
    const userData = JSON.parse(userCookie.value)
    
    if (!userData.twoFAPending) {
      return NextResponse.json(
        { error: '2FA verification not pending' }, 
        { status: 400 }
      )
    }
    
    // Update user session to mark 2FA as completed
    const updatedUserData = {
      ...userData,
      twoFactorEnabled: true,
      twoFAPending: false,
      twoFAVerified: true,
      twoFAVerifiedAt: new Date().toISOString()
    }
    
    // Set updated session cookie
    cookieStore.set('user', JSON.stringify(updatedUserData), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })
    
    console.log('✅ 2FA verification completed successfully')
    
    return NextResponse.json({
      success: true,
      message: '2FA verification completed',
      user: {
        email: userData.email,
        name: userData.name,
        twoFactorEnabled: true
      }
    })
  } catch (error) {
    console.error('Error completing 2FA verification:', error)
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