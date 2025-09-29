import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

// Debug logging
const LOG_FILE = path.join(process.cwd(), 'oauth-debug.log')

async function logToFile(message: string) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n`
  
  try {
    await fs.appendFile(LOG_FILE, logMessage)
  } catch (error) {
    console.error('Failed to write to log file:', error)
  }
}

// Environment variables for Google OAuth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

// Debug environment variables
console.log('Environment check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('GOOGLE_CLIENT_ID from env:', process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_SECRET from env:', process.env.GOOGLE_CLIENT_SECRET)
console.log('GOOGLE_REDIRECT_URI from env:', process.env.GOOGLE_REDIRECT_URI)

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export async function GET() {
  const debugInfo = {
    CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET ? 'SET' : 'NOT SET',
    REDIRECT_URI
  }
  
  console.log('=== GOOGLE OAUTH INIT DEBUG ===')
  console.log('CLIENT_ID:', CLIENT_ID)
  console.log('CLIENT_SECRET:', CLIENT_SECRET ? 'SET' : 'NOT SET')
  console.log('REDIRECT_URI:', REDIRECT_URI)
  
  await logToFile(`GOOGLE OAUTH INIT: ${JSON.stringify(debugInfo)}`)
  
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  })
  
  console.log('Generated auth URL:', authUrl)
  console.log('Redirecting to Google OAuth...')
  
  await logToFile(`Generated auth URL: ${authUrl}`)
  
  return NextResponse.redirect(authUrl)
}