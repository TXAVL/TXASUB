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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params
    const { name, expiry, cost, notes, cycle, autoRenew, finalExpiry } = await request.json()
    console.log("Update subscription data:", { name, autoRenew, finalExpiry })
    const data = await readSubscriptions()

    const userSubscriptions = data.users[userId]?.subscriptions || []
    const subscriptionIndex = userSubscriptions.findIndex((sub: any) => sub.id === id)

    if (subscriptionIndex === -1) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    userSubscriptions[subscriptionIndex] = {
      ...userSubscriptions[subscriptionIndex],
      name,
      expiry,
      cost: Number.parseFloat(cost),
      notes,
      cycle,
      autoRenew: autoRenew || false,
      finalExpiry: finalExpiry || undefined,
      updatedAt: new Date().toISOString(),
    }

    await writeSubscriptions(data)
    console.log("Updated subscription:", userSubscriptions[subscriptionIndex])
    return NextResponse.json(userSubscriptions[subscriptionIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params
    const data = await readSubscriptions()

    const userSubscriptions = data.users[userId]?.subscriptions || []
    const filteredSubscriptions = userSubscriptions.filter((sub: any) => sub.id !== id)

    data.users[userId].subscriptions = filteredSubscriptions
    await writeSubscriptions(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}