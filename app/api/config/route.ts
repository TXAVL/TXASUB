import { NextRequest, NextResponse } from 'next/server'
import { loadServerConfig, checkEnvFiles } from '@/lib/config-server'

// GET /api/config - Kiểm tra cấu hình server-side
export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Server: Checking configuration...')
    
    // Load server config
    const { source, loaded } = loadServerConfig()
    
    // Check environment files
    const envFiles = checkEnvFiles()
    
    // Get current environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'Not set',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? 'Set' : 'Not set',
      SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Not set',
      REQUIRE_EMAIL_VERIFY: process.env.REQUIRE_EMAIL_VERIFY,
      VERIFY_TOKEN_EXPIRY: process.env.VERIFY_TOKEN_EXPIRY
    }
    
    const response = {
      success: true,
      requireEmailVerify: process.env.REQUIRE_EMAIL_VERIFY === 'true',
      verifyTokenExpiry: parseInt(process.env.VERIFY_TOKEN_EXPIRY || '15'),
      // Footer config from env vars
      socialLinks: {
        github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/TXAVL',
        twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
        linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
        facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/vlog.txa.2311',
        youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@admintxa?sub-confirmation=1'
      },
      contactInfo: {
        email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'txafile@gmail.com',
        phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+84 389 077 187',
        address: process.env.NEXT_PUBLIC_SUPPORT_ADDRESS || 'Hải Phòng(Hải Dương cũ), Việt Nam'
      },
      config: {
        source,
        loaded,
        envFiles,
        variables: envVars,
        timestamp: new Date().toISOString()
      }
    }
    
    console.log('✅ Server: Configuration check completed')
    console.log(`📋 Server: Configuration source: ${source}`)
    console.log(`📁 Server: .env.local exists: ${envFiles.hasEnvLocal}`)
    console.log(`📁 Server: .env exists: ${envFiles.hasEnv}`)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Server: Configuration check failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}