import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { sendEmail, emailTemplates, shouldSendNotification, type SubscriptionData, type UserProfile } from '@/lib/email'

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json')

async function readSubscriptions() {
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { users: {} }
  }
}

// Check for expiring subscriptions and send notifications
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional security measure)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await readSubscriptions()
    const notificationsSent = []
    const now = new Date()

    // Process all users
    for (const [googleId, userData] of Object.entries(subscriptions.users)) {
      if (!userData.subscriptions || !userData.profile) continue

      const userSubscriptions: SubscriptionData[] = userData.subscriptions
      const userProfile: UserProfile = {
        email: userData.profile?.email || '',
        name: userData.profile?.name || '',
        emailNotifications: userData.profile?.emailNotifications || {
          enabled: true,
          expiringSoon: true,
          critical: true,
          weekly: false,
          monthly: false
        }
      }

      // Skip if email notifications disabled
      if (!userProfile.emailNotifications.enabled) continue

      // Check for expiring subscriptions (3 days) - Updated logic
      for (const subscription of userSubscriptions) {
        const expiryDate = new Date(subscription.expiry)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        // Sắp hết hạn: 3 ngày trở xuống (nhưng > 0)
        if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
          if (shouldSendNotification(userProfile, 'expiringSoon')) {
            const template = emailTemplates.expiringSoon(subscription, daysUntilExpiry)
            const sent = await sendEmail({
              to: userProfile.email,
              subject: template.subject,
              html: template.html
            })
            
            if (sent) {
              notificationsSent.push({
                user: userProfile.name,
                type: 'expiringSoon',
                subscription: subscription.name,
                daysLeft: daysUntilExpiry
              })
            }
          }
        }
        
        // Khẩn cấp: 1 ngày trở xuống (hoặc đã hết hạn)
        if (daysUntilExpiry <= 1) {
          if (shouldSendNotification(userProfile, 'critical')) {
            const hoursLeft = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)))
            const template = emailTemplates.critical(subscription, hoursLeft)
            const sent = await sendEmail({
              to: userProfile.email,
              subject: template.subject,
              html: template.html
            })
            
            if (sent) {
              notificationsSent.push({
                user: userProfile.name,
                type: 'critical',
                subscription: subscription.name,
                hoursLeft: hoursLeft
              })
            }
          }
        }
      }

      // Weekly report (send on Mondays)
      if (now.getDay() === 1 && shouldSendNotification(userProfile, 'weekly')) {
        const template = emailTemplates.weekly(userSubscriptions)
        const sent = await sendEmail({
          to: userProfile.email,
          subject: template.subject,
          html: template.html
        })
        
        if (sent) {
          notificationsSent.push({
            user: userProfile.name,
            type: 'weekly',
            subscriptionCount: userSubscriptions.length
          })
        }
      }

      // Monthly report (send on 1st of month)
      if (now.getDate() === 1 && shouldSendNotification(userProfile, 'monthly')) {
        const template = emailTemplates.monthly(userSubscriptions)
        const sent = await sendEmail({
          to: userProfile.email,
          subject: template.subject,
          html: template.html
        })
        
        if (sent) {
          notificationsSent.push({
            user: userProfile.name,
            type: 'monthly',
            subscriptionCount: userSubscriptions.length
          })
        }
      }
    }

    return NextResponse.json({ 
      message: 'Cron job completed successfully',
      timestamp: now.toISOString(),
      notificationsSent: notificationsSent.length,
      details: notificationsSent
    })

  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}