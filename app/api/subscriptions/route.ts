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

async function writeSubscriptions(data: any) {
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')?.value
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userId: string
    try {
      const userData = JSON.parse(userCookie)
      userId = userData.googleId
    } catch (error) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
    }

    const data = await readSubscriptions()
    const userSubscriptions = data.users[userId]?.subscriptions || []
    return NextResponse.json(userSubscriptions)
  } catch (error) {
    console.error('Error in /api/subscriptions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')?.value
  
  if (!userCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let userId: string
  try {
    const userData = JSON.parse(userCookie)
    userId = userData.googleId
  } catch (error) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
  }

  try {
    const { name, expiry, cost, notes, cycle } = await request.json()
    const data = await readSubscriptions()

    if (!data.users[userId]) {
      data.users[userId] = { subscriptions: [] }
    }

    const newSubscription = {
      id: Date.now().toString(),
      name,
      expiry,
      cost: Number.parseFloat(cost),
      notes,
      cycle,
      createdAt: new Date().toISOString(),
    }

    data.users[userId].subscriptions.push(newSubscription)
    await writeSubscriptions(data)

    return NextResponse.json(newSubscription)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}