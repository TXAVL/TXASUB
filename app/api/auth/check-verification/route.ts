import { NextRequest, NextResponse } from 'next/server'
import { isEmailVerified } from '@/lib/email-verification'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Kiểm tra trạng thái xác thực email
    const verified = await isEmailVerified(email)

    if (verified) {
      logger.info(`Email verification confirmed for: ${email}`)
      return NextResponse.json({ 
        success: true, 
        verified: true,
        message: 'Email đã được xác thực' 
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        verified: false,
        message: 'Email chưa được xác thực' 
      })
    }

  } catch (error) {
    logger.error('Error checking email verification:', error)
    return NextResponse.json(
      { error: 'Lỗi kiểm tra xác thực email' },
      { status: 500 }
    )
  }
}