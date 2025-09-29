// Authentication utilities and API calls
import { appConfig } from './config'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  googleId?: string
  role?: 'admin' | 'member' | 'viewer'
  teamId?: string
  twoFactorEnabled?: boolean
  lastLogin?: string
}

export interface Subscription {
  id: string
  name: string
  expiry: string
  cost: number
  notes: string
  cycle: "monthly" | "yearly"
  autoRenew: boolean
  finalExpiry?: string
  createdAt: string
  teamId?: string
  sharedWith?: string[]
  paymentHistory?: PaymentRecord[]
  provider?: string
  apiKey?: string
}

export interface PaymentRecord {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  date: string
  notes?: string
}

export interface Team {
  id: string
  name: string
  ownerId: string
  members: TeamMember[]
  createdAt: string
  settings: TeamSettings
}

export interface TeamMember {
  id: string
  userId: string
  role: 'admin' | 'member' | 'viewer'
  joinedAt: string
  invitedBy: string
}

export interface TeamSettings {
  allowInvites: boolean
  maxMembers: number
  requireApproval: boolean
  defaultRole: 'member' | 'viewer'
}

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || ''

export async function checkAuthStatus(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/api/user`, {
      credentials: "include",
    })
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    return null
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const response = await fetch(`${API_BASE}/api/subscriptions`, {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions")
  }
  return response.json()
}

export async function createSubscription(subscription: Omit<Subscription, "id">): Promise<Subscription> {
  const response = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(subscription),
  })
  if (!response.ok) {
    throw new Error("Failed to create subscription")
  }
  return response.json()
}

export async function updateSubscription(id: string, subscription: Omit<Subscription, "id">): Promise<Subscription> {
  const response = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(subscription),
  })
  if (!response.ok) {
    throw new Error("Failed to update subscription")
  }
  return response.json()
}

export async function deleteSubscription(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/subscriptions/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to delete subscription")
  }
}

// Team Management APIs
export async function createTeam(name: string): Promise<Team> {
  const response = await fetch(`${API_BASE}/api/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  })
  if (!response.ok) {
    throw new Error("Failed to create team")
  }
  return response.json()
}

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE}/api/teams`, {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch teams")
  }
  return response.json()
}

export async function inviteTeamMember(teamId: string, email: string, role: 'admin' | 'member' | 'viewer' = 'member'): Promise<void> {
  const response = await fetch(`${API_BASE}/api/teams/${teamId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, role }),
  })
  if (!response.ok) {
    throw new Error("Failed to invite team member")
  }
}

export async function updateTeamMember(teamId: string, userId: string, role: 'admin' | 'member' | 'viewer'): Promise<void> {
  const response = await fetch(`${API_BASE}/api/teams/${teamId}/members/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role }),
  })
  if (!response.ok) {
    throw new Error("Failed to update team member")
  }
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to remove team member")
  }
}

// Payment Tracking APIs
export async function getPaymentHistory(subscriptionId?: string): Promise<PaymentRecord[]> {
  const url = subscriptionId 
    ? `${API_BASE}/api/payments?subscriptionId=${subscriptionId}`
    : `${API_BASE}/api/payments`
  
  const response = await fetch(url, {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch payment history")
  }
  return response.json()
}

export async function addPaymentRecord(payment: Omit<PaymentRecord, 'id'>): Promise<PaymentRecord> {
  const response = await fetch(`${API_BASE}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payment),
  })
  if (!response.ok) {
    throw new Error("Failed to add payment record")
  }
  return response.json()
}

export async function updatePaymentRecord(id: string, payment: Partial<PaymentRecord>): Promise<PaymentRecord> {
  const response = await fetch(`${API_BASE}/api/payments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payment),
  })
  if (!response.ok) {
    throw new Error("Failed to update payment record")
  }
  return response.json()
}


// API Integration APIs
export async function connectProvider(provider: string, credentials: any): Promise<void> {
  const response = await fetch(`${API_BASE}/api/integrations/${provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })
  if (!response.ok) {
    throw new Error(`Failed to connect ${provider}`)
  }
}

export async function syncSubscriptions(provider: string): Promise<Subscription[]> {
  const response = await fetch(`${API_BASE}/api/integrations/${provider}/sync`, {
    method: "POST",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(`Failed to sync from ${provider}`)
  }
  return response.json()
}

// Analytics APIs
export async function getAnalytics(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<any> {
  const response = await fetch(`${API_BASE}/api/analytics?range=${timeRange}`, {
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }
  return response.json()
}

// 2FA Functions
export async function enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
  const response = await fetch(`${API_BASE}/api/auth/2fa/enable`, {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('Failed to enable 2FA')
  }
  
  return response.json()
}

export async function verifyTwoFactor(token: string, secret: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/auth/2fa/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ token, secret }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to verify 2FA token')
  }
}

export async function disableTwoFactor(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/auth/2fa/disable`, {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error('Failed to disable 2FA')
  }
}
