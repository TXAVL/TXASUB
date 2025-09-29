import { sendVerificationEmail } from './email'
import { logger } from './logger'
import fs from 'fs/promises'
import path from 'path'
import { getPendingUserByEmail, removePendingUser } from './pending-verification'

// Log file riêng cho email verification
const EMAIL_VERIFICATION_LOG = path.join(process.cwd(), 'txa_email_verification.log')

async function logEmailVerification(message: string) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n`
  
  try {
    await fs.appendFile(EMAIL_VERIFICATION_LOG, logMessage)
  } catch (error) {
    console.error('Failed to write to email verification log file:', error)
  }
}

export interface VerificationToken {
  email: string
  token: string
  expiresAt: string
  createdAt: string
}

// File-based storage for tokens
const TOKENS_FILE = path.join(process.cwd(), 'data', 'verification_tokens.json')

async function loadTokens(): Promise<Map<string, VerificationToken>> {
  try {
    const data = await fs.readFile(TOKENS_FILE, 'utf8')
    const tokens = JSON.parse(data)
    const map = new Map<string, VerificationToken>()
    for (const [email, tokenData] of Object.entries(tokens)) {
      map.set(email, tokenData as VerificationToken)
    }
    return map
  } catch (error) {
    return new Map<string, VerificationToken>()
  }
}

async function saveTokens(tokens: Map<string, VerificationToken>): Promise<void> {
  const data = Object.fromEntries(tokens.entries())
  
  // Đảm bảo thư mục data tồn tại
  const dataDir = path.dirname(TOKENS_FILE)
  await fs.mkdir(dataDir, { recursive: true })
  
  await fs.writeFile(TOKENS_FILE, JSON.stringify(data, null, 2))
}

export async function createVerificationToken(email: string): Promise<string> {
  try {
    const token = generateToken()
    const expiresAt = new Date(Date.now() + (parseInt(process.env.VERIFY_TOKEN_EXPIRY || '15') * 60 * 1000))
    
    const tokenData: VerificationToken = {
      email,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    }
    
    // Load tokens, xóa token cũ và thêm token mới
    const tokens = await loadTokens()
    tokens.delete(email)
    tokens.set(email, tokenData)
    await saveTokens(tokens)
    
    await logEmailVerification(`Token saved to file: ${JSON.stringify(tokenData)}`)
    
    // Gửi email xác thực
    try {
      await sendVerificationEmail(email, token)
      logger.info(`Verification email sent to: ${email}`)
    } catch (emailError) {
      logger.error(`Failed to send verification email to ${email}:`, emailError)
      // Không throw error, vì token đã được tạo
    }
    
    logger.info(`Verification token created for: ${email}`)
    await logEmailVerification(`Verification token created for: ${email}`)
    return token
  } catch (error) {
    logger.error(`Error creating verification token for ${email}:`, error)
    throw error
  }
}

export async function verifyToken(email: string, token: string): Promise<boolean> {
  const tokens = await loadTokens()
  const tokenData = tokens.get(email)
  
  logEmailVerification(`Verifying token for ${email}: ${token}`)
  logEmailVerification(`Stored token data: ${tokenData ? JSON.stringify(tokenData) : 'null'}`)
  
  if (!tokenData) {
    logEmailVerification(`Token verification failed for ${email}: No token found`)
    return false
  }
  
  if (tokenData.token !== token) {
    logEmailVerification(`Token verification failed for ${email}: Invalid token. Expected: ${tokenData.token}, Got: ${token}`)
    return false
  }
  
  if (new Date() > new Date(tokenData.expiresAt)) {
    tokens.delete(email)
    await saveTokens(tokens)
    logEmailVerification(`Token verification failed for ${email}: Token expired at ${tokenData.expiresAt}`)
    return false
  }
  
  logEmailVerification(`Token verification successful for ${email}`)
  return true
}

export async function markEmailAsVerified(email: string): Promise<void> {
  try {
    logger.info(`Marking email as verified for: ${email}`)
    
    // Xóa token khỏi file storage
    const tokens = await loadTokens()
    tokens.delete(email)
    await saveTokens(tokens)
    
    // Tìm user trong pending verification
    const pendingUser = await getPendingUserByEmail(email)
    
    if (pendingUser) {
      logger.info(`Found pending user for ${email}, moving to subscriptions`)
      
      // Chuyển user từ pending sang subscriptions.json
      const subscriptionsFile = path.join(process.cwd(), 'data', 'subscriptions.json')
      const data = await fs.readFile(subscriptionsFile, 'utf8')
      const subscriptions = JSON.parse(data)
      
      // Tạo user mới trong subscriptions.json
      subscriptions.users[pendingUser.googleId] = {
        subscriptions: [],
        profile: {
          email: pendingUser.email,
          name: pendingUser.name,
          picture: pendingUser.picture,
          emailVerified: true,
          emailNotifications: {
            enabled: true,
            expiringSoon: true,
            critical: true,
            weekly: false,
            monthly: true
          }
        }
      }
      
      // Lưu lại file subscriptions.json
      await fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions, null, 2))
      
      // Xóa user khỏi pending verification
      await removePendingUser(pendingUser.googleId)
      
      logger.info(`Email verified and user moved from pending to subscriptions for: ${email}`)
      await logEmailVerification(`Email verified successfully for: ${email}`)
    } else {
      logger.info(`No pending user found for ${email}, updating existing user`)
      
      // Nếu không tìm thấy trong pending, cập nhật user hiện có
      const subscriptionsFile = path.join(process.cwd(), 'data', 'subscriptions.json')
      const data = await fs.readFile(subscriptionsFile, 'utf8')
      const subscriptions = JSON.parse(data)
      
      // Tìm user theo email và cập nhật emailVerified
      let userFound = false
      for (const userId in subscriptions.users) {
        const user = subscriptions.users[userId]
        if (user.profile && user.profile.email === email) {
          user.profile.emailVerified = true
          userFound = true
          logger.info(`Updated existing user ${email} to verified`)
          break
        }
      }
      
      if (!userFound) {
        logger.warn(`No user found for email ${email} in subscriptions`)
      }
      
      // Lưu lại file
      await fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions, null, 2))
      
      logger.info(`Email verified for existing user: ${email}`)
      await logEmailVerification(`Email verified successfully for: ${email}`)
    }
  } catch (error) {
    logger.error('Error marking email as verified:', error)
  }
}

export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    logger.info(`Checking email verification for: ${email}`)
    
    // Kiểm tra trong pending verification trước
    const pendingUser = await getPendingUserByEmail(email)
    if (pendingUser) {
      logger.info(`User ${email} is still in pending verification`)
      return false
    }
    
    // Đọc file subscriptions.json
    const subscriptionsFile = path.join(process.cwd(), 'data', 'subscriptions.json')
    const data = await fs.readFile(subscriptionsFile, 'utf8')
    const subscriptions = JSON.parse(data)
    
    logger.info(`Checking subscriptions for email: ${email}`)
    logger.info(`Available users: ${Object.keys(subscriptions.users || {}).length}`)
    
    // Tìm user theo email
    for (const userId in subscriptions.users) {
      const user = subscriptions.users[userId]
      logger.info(`Checking user ${userId}: email=${user.profile?.email}, emailVerified=${user.profile?.emailVerified}`)
      
      if (user.profile && user.profile.email === email) {
        const isVerified = user.profile.emailVerified === true
        logger.info(`User ${email} found, emailVerified: ${isVerified}`)
        return isVerified
      }
    }
    
    logger.info(`User ${email} not found in subscriptions`)
    return false
  } catch (error) {
    logger.error('Error checking email verification status:', error)
    logger.error('Error details:', error)
    return false
  }
}

export async function getTokenExpiry(email: string): Promise<Date | null> {
  const tokens = await loadTokens()
  const tokenData = tokens.get(email)
  return tokenData ? new Date(tokenData.expiresAt) : null
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}