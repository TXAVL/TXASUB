import { NextResponse } from 'next/server'

export async function GET() {
  const footerEnv = {
    socialLinks: {
      github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
      twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
      linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
      youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || ''
    },
    contactInfo: {
      email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
      phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
      address: process.env.NEXT_PUBLIC_SUPPORT_ADDRESS || ''
    }
  }

  // Debug log
  console.log('Footer Env API Debug:', {
    github: process.env.NEXT_PUBLIC_GITHUB_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL
  })

  return NextResponse.json(footerEnv)
}