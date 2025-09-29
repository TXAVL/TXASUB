import { config } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'

// Server-side configuration loader
export function loadServerConfig(): { source: string, loaded: boolean } {
  let source = 'default'
  let loaded = false
  
  try {
    // Thử đọc từ .env.local trước (ưu tiên cao nhất)
    if (existsSync('.env.local')) {
      config({ path: '.env.local' })
      source = '.env.local'
      loaded = true
      console.log('✅ Server: Đã đọc cấu hình từ .env.local')
    }
    // Nếu không có .env.local, thử đọc từ .env
    else if (existsSync('.env')) {
      config({ path: '.env' })
      source = '.env'
      loaded = true
      console.log('✅ Server: Đã đọc cấu hình từ .env')
    }
    // Nếu không có file nào, sử dụng default
    else {
      console.log('⚠️ Server: Không tìm thấy file .env hoặc .env.local, sử dụng cấu hình mặc định')
    }
  } catch (error) {
    console.error('❌ Server: Lỗi khi đọc cấu hình:', error)
    source = 'error'
    loaded = false
  }
  
  return { source, loaded }
}

// Helper để kiểm tra file .env
export function checkEnvFiles(): { hasEnvLocal: boolean, hasEnv: boolean } {
  return {
    hasEnvLocal: existsSync('.env.local'),
    hasEnv: existsSync('.env')
  }
}