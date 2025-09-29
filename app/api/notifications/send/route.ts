import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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

async function writeSubscriptions(data: any) {
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2))
}

// Check for expiring subscriptions and send notifications
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const subscriptions = await readSubscriptions()
    const userData = subscriptions.users[user.googleId]
    
    if (!userData || !userData.subscriptions) {
      return NextResponse.json({ message: 'No subscriptions found' })
    }

    const userSubscriptions: SubscriptionData[] = userData.subscriptions
    const userProfile: UserProfile = {
      email: userData.profile?.email || user.email,
      name: userData.profile?.name || user.name,
      emailNotifications: userData.profile?.emailNotifications || {
        enabled: true,
        expiringSoon: true,
        critical: true,
        weekly: false,
        monthly: false
      }
    }

    const now = new Date()
    const notificationsSent = []

    // Check for expiring subscriptions (30 days)
    for (const subscription of userSubscriptions) {
      const expiryDate = new Date(subscription.expiry)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 2) {
        if (shouldSendNotification(userProfile, 'expiringSoon')) {
          const template = emailTemplates.expiringSoon(subscription, daysUntilExpiry)
          const sent = await sendEmail({
            to: userProfile.email,
            subject: template.subject,
            html: template.html
          })
          
          if (sent) {
            notificationsSent.push({
              type: 'expiringSoon',
              subscription: subscription.name,
              daysLeft: daysUntilExpiry
            })
          }
        }
      }
      
      // Check for critical subscriptions (2 days)
      if (daysUntilExpiry <= 2 && daysUntilExpiry > 0) {
        if (shouldSendNotification(userProfile, 'critical')) {
          const hoursLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
          const template = emailTemplates.critical(subscription, hoursLeft)
          const sent = await sendEmail({
            to: userProfile.email,
            subject: template.subject,
            html: template.html
          })
          
          if (sent) {
            notificationsSent.push({
              type: 'critical',
              subscription: subscription.name,
              hoursLeft: hoursLeft
            })
          }
        }
      }
    }

    return NextResponse.json({ 
      message: 'Notifications sent successfully',
      notificationsSent 
    })

  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}