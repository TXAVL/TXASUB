import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    
    // Get user email from database
    const fs = await import('fs/promises')
    const path = await import('path')
    const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')
    
    let userEmail = user.email // fallback to cookie email
    
    try {
      const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf8')
      const subscriptions = JSON.parse(data)
      const userData = subscriptions.users[user.googleId]
      
      if (userData && userData.profile && userData.profile.email) {
        userEmail = userData.profile.email
      }
    } catch (error) {
      console.error('Error reading user data:', error)
    }
    
    // Create a test subscription
    const testSubscription = {
      id: 'test',
      name: 'Test Subscription',
      expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      cost: 29.99,
      cycle: 'monthly',
      autoRenew: false
    }

    // Send test email
    const template = emailTemplates.expiringSoon(testSubscription, 2)
    const sent = await sendEmail({
      to: userEmail,
      subject: `[TEST] ${template.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #1976d2; margin: 0 0 10px 0;">🧪 Email Test</h2>
            <p style="color: #1976d2; margin: 0;">Đây là email test để kiểm tra cài đặt email notifications.</p>
          </div>
          ${template.html}
        </div>
      `
    })

    if (sent) {
      return NextResponse.json({ message: 'Test email sent successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 })
    }

  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}