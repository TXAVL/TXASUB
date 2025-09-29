import { config } from 'dotenv'

// Interface cho cấu hình ứng dụng
export interface AppConfig {
  // Database
  DATABASE_URL: string
  DATABASE_TYPE: 'postgresql' | 'mysql' | 'sqlite'
  
  // Authentication
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REDIRECT_URI: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  
  // Email
  GMAIL_USER: string
  GMAIL_APP_PASSWORD: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_SECURE: boolean
  
  // App
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  
  // Security
  ENCRYPTION_KEY: string
  SESSION_SECRET: string
  
  // Team & Collaboration
  TEAM_INVITE_EXPIRY_DAYS: number
  MAX_TEAM_MEMBERS: number
  
  // Payment
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  PAYPAL_CLIENT_ID: string
  PAYPAL_CLIENT_SECRET: string
  
  // API Integrations
  OPENAI_API_KEY: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: string
  
  // Performance
  REDIS_URL: string
  CACHE_TTL: number
  MAX_CACHE_SIZE: number
}

// Default values
const defaultConfig: Partial<AppConfig> = {
  DATABASE_TYPE: 'sqlite',
  JWT_EXPIRES_IN: '7d',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  NODE_ENV: 'development',
  PORT: 3001,
  ENCRYPTION_KEY: 'default-encryption-key-change-in-production',
  SESSION_SECRET: 'default-session-secret-change-in-production',
  TEAM_INVITE_EXPIRY_DAYS: 7,
  MAX_TEAM_MEMBERS: 10,
  CACHE_TTL: 3600,
  MAX_CACHE_SIZE: 100,
  AWS_REGION: 'us-east-1'
}

// Load environment variables
function loadEnvironmentConfig(): { config: Partial<AppConfig>, source: string } {
  let source = 'default'
  
  // Trong Next.js, process.env đã được load sẵn từ .env files
  // Kiểm tra xem có biến nào từ .env.local không (ưu tiên cao hơn)
  if (process.env.NODE_ENV && process.env.NEXT_PUBLIC_APP_URL) {
    // Nếu có các biến môi trường, có thể đã load từ .env files
    source = 'environment'
    console.log('✅ Đã đọc cấu hình từ environment variables')
  } else {
    console.log('⚠️ Sử dụng cấu hình mặc định')
  }
  
  return {
    config: process.env as any,
    source
  }
}

// Tạo cấu hình cuối cùng
function createConfig(): AppConfig {
  const { config: envConfig, source } = loadEnvironmentConfig()
  
  console.log(`📋 Nguồn cấu hình: ${source}`)
  
  // Merge với default values
  const finalConfig: AppConfig = {
    ...defaultConfig,
    ...envConfig,
  } as AppConfig
  
  // Validate required fields
  const requiredFields: (keyof AppConfig)[] = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  const missingFields = requiredFields.filter(field => !finalConfig[field])
  
  if (missingFields.length > 0) {
    console.warn(`⚠️ Thiếu các trường bắt buộc: ${missingFields.join(', ')}`)
  }
  
  // Log configuration source
  console.log(`🔧 Cấu hình được tải từ: ${source}`)
  console.log(`🌍 Environment: ${finalConfig.NODE_ENV}`)
  console.log(`🔗 App URL: ${finalConfig.NEXT_PUBLIC_APP_URL}`)
  
  return finalConfig
}

// Export singleton config
export const appConfig = createConfig()

// Helper functions
export const isDevelopment = () => appConfig.NODE_ENV === 'development'
export const isProduction = () => appConfig.NODE_ENV === 'production'
export const isTest = () => appConfig.NODE_ENV === 'test'

// Database helpers
export const getDatabaseConfig = () => ({
  url: appConfig.DATABASE_URL,
  type: appConfig.DATABASE_TYPE,
})

// Email helpers
export const getEmailConfig = () => ({
  user: appConfig.GMAIL_USER,
  password: appConfig.GMAIL_APP_PASSWORD,
  host: appConfig.SMTP_HOST,
  port: appConfig.SMTP_PORT,
  secure: appConfig.SMTP_SECURE,
})

// Security helpers
export const getSecurityConfig = () => ({
  jwtSecret: appConfig.JWT_SECRET,
  jwtExpiresIn: appConfig.JWT_EXPIRES_IN,
  encryptionKey: appConfig.ENCRYPTION_KEY,
  sessionSecret: appConfig.SESSION_SECRET,
})

// Team helpers
export const getTeamConfig = () => ({
  inviteExpiryDays: appConfig.TEAM_INVITE_EXPIRY_DAYS,
  maxMembers: appConfig.MAX_TEAM_MEMBERS,
})

// Payment helpers
export const getPaymentConfig = () => ({
  stripe: {
    secretKey: appConfig.STRIPE_SECRET_KEY,
    webhookSecret: appConfig.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    clientId: appConfig.PAYPAL_CLIENT_ID,
    clientSecret: appConfig.PAYPAL_CLIENT_SECRET,
  },
})

// API Integration helpers
export const getApiConfig = () => ({
  openai: appConfig.OPENAI_API_KEY,
  aws: {
    accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY,
    region: appConfig.AWS_REGION,
  },
})

// Performance helpers
export const getPerformanceConfig = () => ({
  redisUrl: appConfig.REDIS_URL,
  cacheTtl: appConfig.CACHE_TTL,
  maxCacheSize: appConfig.MAX_CACHE_SIZE,
})