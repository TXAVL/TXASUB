import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

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
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = JSON.parse(userCookie.value)
    const data = await readSubscriptions()
    const userData = data.users[user.googleId]
    
    if (!userData || !userData.subscriptions) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 })
    }

    const subscriptions = userData.subscriptions
    const today = new Date()
    
    // Calculate analytics
    const totalSubscriptions = subscriptions.length
    let totalMonthlyCost = 0
    let totalYearlyCost = 0
    let expiringSoon = 0
    let critical = 0
    let autoRenewCount = 0
    const categories: { [key: string]: number } = {}
    const upcomingExpirations: any[] = []
    
    // Process each subscription
    subscriptions.forEach((sub: any) => {
      // Cost calculation
      if (sub.cycle === 'monthly') {
        totalMonthlyCost += sub.cost
      } else {
        totalYearlyCost += sub.cost
      }
      
      // Auto renew count
      if (sub.autoRenew) {
        autoRenewCount++
      }
      
      // Category analysis (simple keyword matching)
      const category = categorizeSubscription(sub.name)
      categories[category] = (categories[category] || 0) + 1
      
      // Expiration analysis
      const expiryDate = new Date(sub.expiry)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        expiringSoon++
        upcomingExpirations.push({ ...sub, daysLeft: daysUntilExpiry })
      }
      
      if (daysUntilExpiry <= 1) {
        critical++
      }
      
      // Add to upcoming if within 30 days
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        upcomingExpirations.push({ ...sub, daysLeft: daysUntilExpiry })
      }
    })
    
    // Sort upcoming expirations by days left
    upcomingExpirations.sort((a, b) => a.daysLeft - b.daysLeft)
    
    // Generate monthly trend (last 6 months)
    const monthlyTrend = generateMonthlyTrend(subscriptions)
    
    const analytics = {
      totalSubscriptions,
      totalMonthlyCost,
      totalYearlyCost,
      expiringSoon,
      critical,
      autoRenewCount,
      categories,
      monthlyTrend,
      upcomingExpirations: upcomingExpirations.slice(0, 10) // Limit to 10 most urgent
    }
    
    return NextResponse.json(analytics)
    
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 })
  }
}

function categorizeSubscription(name: string): string {
  const nameLower = name.toLowerCase()
  
  // Development tools
  if (nameLower.includes('cursor') || nameLower.includes('vscode') || nameLower.includes('jetbrains') || 
      nameLower.includes('github') || nameLower.includes('gitlab') || nameLower.includes('bitbucket')) {
    return 'Development Tools'
  }
  
  // Design tools
  if (nameLower.includes('adobe') || nameLower.includes('figma') || nameLower.includes('sketch') || 
      nameLower.includes('canva') || nameLower.includes('photoshop') || nameLower.includes('illustrator')) {
    return 'Design & Creative'
  }
  
  // Cloud services
  if (nameLower.includes('aws') || nameLower.includes('azure') || nameLower.includes('google cloud') || 
      nameLower.includes('digitalocean') || nameLower.includes('heroku') || nameLower.includes('vercel')) {
    return 'Cloud Services'
  }
  
  // Productivity
  if (nameLower.includes('office') || nameLower.includes('google workspace') || nameLower.includes('notion') || 
      nameLower.includes('slack') || nameLower.includes('trello') || nameLower.includes('asana')) {
    return 'Productivity'
  }
  
  // Entertainment
  if (nameLower.includes('netflix') || nameLower.includes('spotify') || nameLower.includes('youtube') || 
      nameLower.includes('disney') || nameLower.includes('hulu') || nameLower.includes('prime')) {
    return 'Entertainment'
  }
  
  // Security
  if (nameLower.includes('nordvpn') || nameLower.includes('expressvpn') || nameLower.includes('1password') || 
      nameLower.includes('lastpass') || nameLower.includes('dashlane')) {
    return 'Security & Privacy'
  }
  
  // Other
  return 'Other'
}

function generateMonthlyTrend(subscriptions: any[]): { month: string; cost: number }[] {
  const months = []
  const today = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
    
    // Calculate cost for this month (simplified - just use current costs)
    let monthlyCost = 0
    subscriptions.forEach(sub => {
      if (sub.cycle === 'monthly') {
        monthlyCost += sub.cost
      } else {
        monthlyCost += sub.cost / 12 // Convert yearly to monthly
      }
    })
    
    months.push({
      month: monthName,
      cost: Math.round(monthlyCost)
    })
  }
  
  return months
}