import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, markEmailAsVerified } from '@/lib/email-verification'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=missing_params`)
    }

    // Kiểm tra token có hợp lệ không
    if (!(await verifyToken(email, token))) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=invalid_token`)
    }

    // Cập nhật trạng thái xác thực email
    await markEmailAsVerified(email)

    logger.info(`Email verified successfully for: ${email}`)

    // Redirect về trang chủ với thông báo thành công
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?verified=true`)

  } catch (error) {
    logger.error('Error verifying email:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-email?error=verification_failed`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email và token là bắt buộc' },
        { status: 400 }
      )
    }

    // Kiểm tra token có hợp lệ không
    if (!(await verifyToken(email, token))) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Cập nhật trạng thái xác thực email
    await markEmailAsVerified(email)

    logger.info(`Email verified successfully for: ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Email đã được xác thực thành công' 
    })

  } catch (error) {
    logger.error('Error verifying email:', error)
    return NextResponse.json(
      { error: 'Lỗi xác thực email' },
      { status: 500 }
    )
  }
}