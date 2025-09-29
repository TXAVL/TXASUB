import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'
import { createVerificationToken, isEmailVerified } from '@/lib/email-verification'
import { addPendingUser, getPendingUserByEmail } from '@/lib/pending-verification'

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

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Debug logging
  const debugInfo = {
    fullUrl: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
    code,
    CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET ? 'SET' : 'NOT SET',
    REDIRECT_URI
  }
  
  console.log('=== GOOGLE OAUTH CALLBACK DEBUG ===')
  console.log('Full URL:', request.url)
  console.log('Search params:', Object.fromEntries(searchParams.entries()))
  console.log('Code received:', code)
  console.log('CLIENT_ID:', CLIENT_ID, process.env.GOOGLE_CLIENT_ID ? '(từ env)' : '(dùng default hardcoded)')
  console.log('CLIENT_SECRET:', CLIENT_SECRET ? 'SET' : 'NOT SET', process.env.GOOGLE_CLIENT_SECRET ? '(từ env)' : '(dùng default hardcoded)')
  console.log('REDIRECT_URI:', REDIRECT_URI, process.env.GOOGLE_REDIRECT_URI ? '(từ env)' : '(dùng default)')
  
  await logToFile(`GOOGLE OAUTH CALLBACK: ${JSON.stringify(debugInfo)}`)
  
  if (!code) {
    console.log('ERROR: No code received from Google')
    await logToFile('ERROR: No code received from Google')
    return NextResponse.redirect('http://localhost:3001/auth?error=auth_failed')
  }

  try {
    console.log('Attempting to get tokens from Google...')
    await logToFile('Attempting to get tokens from Google...')
    
    const { tokens } = await client.getToken(code)
    const tokenInfo = { 
      access_token: tokens.access_token ? 'SET' : 'NOT SET',
      refresh_token: tokens.refresh_token ? 'SET' : 'NOT SET',
      id_token: tokens.id_token ? 'SET' : 'NOT SET'
    }
    
    console.log('Tokens received:', tokenInfo)
    await logToFile(`Tokens received: ${JSON.stringify(tokenInfo)}`)
    
    client.setCredentials(tokens)

    console.log('Verifying ID token...')
    await logToFile('Verifying ID token...')
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const userInfo = {
      sub: payload!.sub,
      email: payload!.email,
      name: payload!.name
    }
    
    console.log('User payload:', userInfo)
    await logToFile(`User payload: ${JSON.stringify(userInfo)}`)
    
    const userId = payload!.sub!

    // Check if email verification is required
    const requireEmailVerify = process.env.REQUIRE_EMAIL_VERIFY === 'true'
    
    if (requireEmailVerify) {
      console.log('Email verification is required, checking status for:', payload!.email)
      await logToFile(`Email verification is required, checking status for: ${payload!.email}`)
      
      // Check if email is already verified
      const emailVerified = await isEmailVerified(payload!.email!)
      console.log('Email verification status:', emailVerified)
      await logToFile(`Email verification status: ${emailVerified}`)
      
      if (!emailVerified) {
        console.log('Email not verified, creating verification token')
        await logToFile(`Email not verified, creating verification token for: ${payload!.email}`)
        
        // Create verification token and send email
        await createVerificationToken(payload!.email!)
        
        // Lưu user vào pending verification file
        await addPendingUser({
          googleId: userId,
          email: payload!.email!,
          name: payload!.name!,
          picture: payload!.picture!,
          createdAt: new Date().toISOString()
        })
        
        // Set normal session but mark as pending verification
        const cookieStore = await cookies()
        const userCookie = JSON.stringify({
          googleId: userId,
          email: payload!.email,
          name: payload!.name,
          picture: payload!.picture,
          emailVerified: false,
          requiresEmailVerification: true
        })
        
        cookieStore.set('user', userCookie, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours normal session
          path: '/'
        })
        
        // Redirect to email verification page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-email`)
      }
    }

    // Initialize user data if doesn't exist
    const data = await readSubscriptions()
    if (!data.users[userId]) {
      data.users[userId] = {
        subscriptions: [],
        profile: {
          email: payload!.email,
          name: payload!.name,
          picture: payload!.picture,
        },
      }
      await writeSubscriptions(data)
    }

    // Check if user requires 2FA
    console.log('Checking 2FA requirement for user:', payload!.email)
    await logToFile(`Checking 2FA requirement for user: ${payload!.email}`)
    
    try {
      const twoFAResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/2fa/required`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          email: payload!.email
        })
      })
      
      const twoFAData = await twoFAResponse.json()
      
      if (twoFAData.success && twoFAData.requires2FA) {
        console.log('User requires 2FA verification')
        await logToFile(`User requires 2FA verification: ${payload!.email}`)
        
        // Set temporary session for 2FA verification
        const cookieStore = await cookies()
        const tempCookie = JSON.stringify({
          googleId: userId,
          email: payload!.email,
          name: payload!.name,
          picture: payload!.picture,
          requires2FA: true,
          twoFAPending: true
        })
        
        cookieStore.set('user', tempCookie, {
          httpOnly: true,
          maxAge: 10 * 60 * 1000, // 10 minutes for 2FA
          path: '/'
        })
        
        // Redirect to 2FA verification page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/2fa-verify`)
      }
    } catch (twoFAError) {
      console.error('Error checking 2FA requirement:', twoFAError)
      await logToFile(`Error checking 2FA requirement: ${twoFAError}`)
      // Continue with normal login if 2FA check fails
    }

    // Set session cookie and redirect (normal login without 2FA)
    console.log('Setting cookie for userId:', userId)
    await logToFile(`Setting cookie for userId: ${userId}`)
    
    const cookieStore = await cookies()
    const userCookie = JSON.stringify({
      googleId: userId,
      email: payload!.email,
      name: payload!.name,
      picture: payload!.picture,
      twoFactorEnabled: false
    })
    
    cookieStore.set('user', userCookie, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    })
    
    // Log success to file only (not console)
    await logToFile('SUCCESS: Cookie set and redirecting to home page')
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
  } catch (error) {
    const errorInfo = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }
    
    console.error('AUTH ERROR:', error)
    console.error('Error details:', errorInfo)
    await logToFile(`AUTH ERROR: ${JSON.stringify(errorInfo)}`)
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=auth_failed`)
  }
}