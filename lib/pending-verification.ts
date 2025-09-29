import fs from 'fs/promises'
import path from 'path'

const PENDING_FILE = path.join(process.cwd(), 'data', 'pending_verification.json')

export interface PendingUser {
  googleId: string
  email: string
  name: string
  picture: string
  createdAt: string
}

async function readPendingUsers() {
  try {
    const data = await fs.readFile(PENDING_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { users: {} }
  }
}

async function savePendingUsers(data: any) {
  // Đảm bảo thư mục data tồn tại
  const dataDir = path.dirname(PENDING_FILE)
  await fs.mkdir(dataDir, { recursive: true })
  
  await fs.writeFile(PENDING_FILE, JSON.stringify(data, null, 2))
}

export async function addPendingUser(user: PendingUser) {
  const data = await readPendingUsers()
  data.users[user.googleId] = user
  await savePendingUsers(data)
}

export async function getPendingUser(googleId: string): Promise<PendingUser | null> {
  const data = await readPendingUsers()
  return data.users[googleId] || null
}

export async function removePendingUser(googleId: string) {
  const data = await readPendingUsers()
  delete data.users[googleId]
  await savePendingUsers(data)
}

export async function getPendingUserByEmail(email: string): Promise<PendingUser | null> {
  const data = await readPendingUsers()
  for (const userId in data.users) {
    if (data.users[userId].email === email) {
      return data.users[userId]
    }
  }
  return null
}