import { NextRequest, NextResponse } from 'next/server'
import { createVerificationToken, isEmailVerified } from '@/lib/email-verification'
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

    // Kiểm tra xem email đã được verify chưa
    const alreadyVerified = await isEmailVerified(email)
    if (alreadyVerified) {
      return NextResponse.json(
        { error: 'Email này đã được xác thực rồi' },
        { status: 400 }
      )
    }

    // Tạo token mới và gửi email
    await createVerificationToken(email)

    logger.info(`Verification email resent for: ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Email xác thực đã được gửi lại' 
    })

  } catch (error) {
    logger.error('Error resending verification email:', error)
    return NextResponse.json(
      { error: 'Lỗi gửi lại email xác thực' },
      { status: 500 }
    )
  }
}