import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const secret = speakeasy.generateSecret({
      name: `TXA:${user.email}`, // Format chuẩn: issuer:email@domain.com
      issuer: 'TXA',
      length: 32
    })

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    })
  } catch (error) {
    console.error('Error generating 2FA secret:', error)
    return NextResponse.json(
      { error: 'Failed to generate 2FA secret' },
      { status: 500 }
    )
  }
}