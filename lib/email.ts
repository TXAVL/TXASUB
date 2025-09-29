import nodemailer from 'nodemailer'

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

// Debug environment variables
console.log('🔧 Email Config Debug:')
console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Missing')
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing')

export interface EmailNotification {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SubscriptionData {
  id: string
  name: string
  expiry: string
  cost: number
  cycle: string
  autoRenew: boolean
  finalExpiry?: string
}

export interface UserProfile {
  email: string
  name: string
  emailNotifications: {
    enabled: boolean
    expiringSoon: boolean // 30 days
    critical: boolean // 2 days
    weekly: boolean
    monthly: boolean
  }
}

// Email templates
export const emailTemplates = {
  expiringSoon: (subscription: SubscriptionData, daysLeft: number) => ({
    subject: `⚠️ Gói "${subscription.name}" sắp hết hạn (${daysLeft} ngày)`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📱 Subscription Manager</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Quản lý gói đăng ký thông minh</p>
        </div>
        
        <!-- Alert Box -->
        <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-left: 5px solid #ff8c00; padding: 25px; margin: 0;">
          <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #ff8c00; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-right: 20px; flex-shrink: 0; line-height: 1;">⚠️</div>
            <div style="flex: 1;">
              <h2 style="color: #d2691e; margin: 0 0 8px 0; font-size: 24px; font-weight: 600; line-height: 1.2;">Gói sắp hết hạn</h2>
              <p style="color: #8b4513; margin: 0; font-size: 18px; font-weight: 500; line-height: 1.3;">Còn ${daysLeft} ngày nữa gói sẽ hết hạn</p>
            </div>
          </div>
        </div>
        
        <!-- Subscription Info -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">📋 Thông tin gói đăng ký</h3>
          
          <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">TÊN GÓI</label>
                <p style="margin: 0; color: #2c3e50; font-size: 18px; font-weight: 600;">${subscription.name}</p>
              </div>
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">CHI PHÍ</label>
                <p style="margin: 0; color: #27ae60; font-size: 18px; font-weight: 600;">$${subscription.cost}/${subscription.cycle === 'monthly' ? 'tháng' : 'năm'}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">NGÀY HẾT HẠN</label>
                <p style="margin: 0; color: #e74c3c; font-size: 16px; font-weight: 600;">${new Date(subscription.expiry).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">TỰ ĐỘNG GIA HẠN</label>
                <p style="margin: 0; color: ${subscription.autoRenew ? '#27ae60' : '#e74c3c'}; font-size: 16px; font-weight: 600;">${subscription.autoRenew ? '✅ Có' : '❌ Không'}</p>
              </div>
            </div>
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin-top: 25px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/subscriptions" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              🔧 Quản lý gói đăng ký
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #2c3e50; color: #bdc3c7; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 12px 12px;">
          <p style="margin: 0;">📧 Email tự động từ <strong>Subscription Manager</strong></p>
          <p style="margin: 5px 0 0 0;">Để tắt thông báo, vui lòng cập nhật cài đặt trong profile</p>
        </div>
      </div>
    `
  }),

  critical: (subscription: SubscriptionData, hoursLeft: number) => ({
    subject: `🚨 KHẨN CẤP: Gói "${subscription.name}" hết hạn trong ${hoursLeft} giờ!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🚨 KHẨN CẤP</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Gói đăng ký sắp hết hạn!</p>
        </div>
        
        <!-- Critical Alert -->
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); border-left: 5px solid #dc3545; padding: 25px; margin: 0;">
          <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dc3545; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-right: 20px; flex-shrink: 0; line-height: 1; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);">🚨</div>
            <div style="flex: 1;">
              <h2 style="color: white; margin: 0 0 8px 0; font-size: 26px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); line-height: 1.2;">CẢNH BÁO KHẨN CẤP</h2>
              <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3;">Còn ${hoursLeft} giờ nữa gói sẽ hết hạn!</p>
            </div>
          </div>
        </div>
        
        <!-- Subscription Info -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">📋 Thông tin gói đăng ký</h3>
          
          <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 4px 20px rgba(220, 53, 69, 0.2); border: 2px solid #ff6b6b;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">TÊN GÓI</label>
                <p style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">${subscription.name}</p>
              </div>
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">CHI PHÍ</label>
                <p style="margin: 0; color: #27ae60; font-size: 20px; font-weight: 700;">$${subscription.cost}/${subscription.cycle === 'monthly' ? 'tháng' : 'năm'}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">NGÀY HẾT HẠN</label>
                <p style="margin: 0; color: #dc3545; font-size: 18px; font-weight: 700; text-shadow: 0 1px 2px rgba(220, 53, 69, 0.3);">${new Date(subscription.expiry).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label style="display: block; color: #7f8c8d; font-size: 14px; font-weight: 500; margin-bottom: 5px;">TỰ ĐỘNG GIA HẠN</label>
                <p style="margin: 0; color: ${subscription.autoRenew ? '#27ae60' : '#dc3545'}; font-size: 18px; font-weight: 700;">${subscription.autoRenew ? '✅ Có' : '❌ Không'}</p>
              </div>
            </div>
          </div>
          
          <!-- Urgent Action Button -->
          <div style="text-align: center; margin-top: 25px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/subscriptions" 
               style="background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); color: white; padding: 18px 35px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 700; font-size: 18px; box-shadow: 0 6px 20px rgba(255, 65, 108, 0.4); text-transform: uppercase; letter-spacing: 1px;">
              🔥 GIA HẠN NGAY
            </a>
          </div>
          
          <!-- Countdown Timer -->
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 16px;">⏰ THỜI GIAN CÒN LẠI</h4>
            <p style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${hoursLeft} GIỜ</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #2c3e50; color: #bdc3c7; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 12px 12px;">
          <p style="margin: 0;">🚨 Email khẩn cấp từ <strong>Subscription Manager</strong></p>
          <p style="margin: 5px 0 0 0;">Hành động ngay để tránh gián đoạn dịch vụ!</p>
        </div>
      </div>
    `
  }),

  weekly: (subscriptions: SubscriptionData[]) => ({
    subject: `📊 Báo cáo tuần - ${subscriptions.length} gói đăng ký`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #0c5460; margin: 0 0 10px 0;">📊 Báo cáo tuần</h2>
          <p style="color: #0c5460; margin: 0;">Tổng quan về các gói đăng ký của bạn.</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Thống kê</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #007bff;">${subscriptions.length}</div>
              <div style="color: #6c757d; font-size: 14px;">Tổng số gói</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #28a745;">$${subscriptions.reduce((sum, sub) => sum + sub.cost, 0)}</div>
              <div style="color: #6c757d; font-size: 14px;">Tổng chi phí</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/subscriptions" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      </div>
    `
  }),

  monthly: (subscriptions: SubscriptionData[]) => ({
    subject: `📈 Báo cáo tháng - Phân tích chi tiết`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #155724; margin: 0 0 10px 0;">📈 Báo cáo tháng</h2>
          <p style="color: #155724; margin: 0;">Phân tích chi tiết về các gói đăng ký của bạn.</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Thống kê chi tiết</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #007bff;">${subscriptions.length}</div>
              <div style="color: #6c757d; font-size: 14px;">Tổng số gói</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #28a745;">$${subscriptions.reduce((sum, sub) => sum + sub.cost, 0)}</div>
              <div style="color: #6c757d; font-size: 14px;">Tổng chi phí</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${subscriptions.filter(sub => !sub.autoRenew).length}</div>
              <div style="color: #6c757d; font-size: 14px;">Cần gia hạn thủ công</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #17a2b8;">${subscriptions.filter(sub => sub.autoRenew).length}</div>
              <div style="color: #6c757d; font-size: 14px;">Tự động gia hạn</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/subscriptions" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      </div>
    `
  })
}

// Send email function
export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Subscription Manager" <${process.env.GMAIL_USER}>`,
      to: notification.to,
      subject: notification.subject,
      html: notification.html,
      text: notification.text
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Email verification template
export function formatTimeRemaining(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours} giờ`
    } else {
      return `${hours} giờ ${remainingMinutes} phút`
    }
  } else {
    return `${minutes} phút`
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const expiryMinutes = parseInt(process.env.VERIFY_TOKEN_EXPIRY || '15')
  const timeRemaining = formatTimeRemaining(expiryMinutes)
  
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/auth/verify-email`
  
  const notification: EmailNotification = {
    to: email,
    subject: '🔐 Xác thực email - Subscription Manager',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Xác thực email</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Subscription Manager</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 24px; font-weight: 600;">Chào mừng bạn đến với Subscription Manager!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Để hoàn tất việc đăng ký tài khoản, vui lòng xác thực email của bạn bằng cách nhấp vào nút bên dưới:
            </p>
            
            <!-- Verification Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}?token=${token}&email=${encodeURIComponent(email)}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                ✅ Xác thực email ngay
              </a>
            </div>
            
            <!-- Time Remaining -->
            <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-left: 5px solid #ff8c00; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background: #ff8c00; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 15px; flex-shrink: 0;">⏰</div>
                <div>
                  <h3 style="color: #d2691e; margin: 0; font-size: 18px; font-weight: 600;">Thời gian hết hạn</h3>
                  <p style="color: #8b4513; margin: 5px 0 0 0; font-size: 16px; font-weight: 500;">Link xác thực sẽ hết hạn sau: <strong>${timeRemaining}</strong></p>
                </div>
              </div>
            </div>
            
            <!-- Alternative Method -->
            <div style="background: #e8f4fd; border: 1px solid #b8daff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #004085; margin: 0 0 10px 0; font-size: 16px;">🔗 Hoặc sao chép link này:</h4>
              <p style="color: #004085; margin: 0; font-size: 14px; word-break: break-all; background: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
                ${verificationUrl}?token=${token}&email=${encodeURIComponent(email)}
              </p>
            </div>
            
            <!-- Security Note -->
            <div style="background: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                <strong>🔒 Lưu ý bảo mật:</strong> Nếu bạn không yêu cầu xác thực email này, vui lòng bỏ qua email này. 
                Tài khoản của bạn sẽ không được tạo cho đến khi email được xác thực.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #2c3e50; color: #bdc3c7; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 12px 12px;">
          <p style="margin: 0;">📧 Email từ <strong>Subscription Manager</strong></p>
          <p style="margin: 5px 0 0 0;">Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ</p>
        </div>
      </div>
    `
  }
  
  return await sendEmail(notification)
}

// Check if user wants to receive notifications
export function shouldSendNotification(user: UserProfile, type: 'expiringSoon' | 'critical' | 'weekly' | 'monthly'): boolean {
  if (!user.emailNotifications.enabled) return false
  
  switch (type) {
    case 'expiringSoon':
      return user.emailNotifications.expiringSoon
    case 'critical':
      return user.emailNotifications.critical
    case 'weekly':
      return user.emailNotifications.weekly
    case 'monthly':
      return user.emailNotifications.monthly
    default:
      return false
  }
}