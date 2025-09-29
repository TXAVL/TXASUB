# Cấu hình Environment Variables

## Tạo file .env.local trong thư mục gốc với nội dung sau:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development

# Footer Configuration
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/your-page
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your-profile
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-handle

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=contact@yourcompany.com
NEXT_PUBLIC_CONTACT_PHONE=+84-xxx-xxx-xxx
NEXT_PUBLIC_CONTACT_ADDRESS=Your Company Address
```

## Hướng dẫn cấu hình Gmail:

1. **Tạo App Password:**
   - Vào Google Account Settings
   - Security → 2-Step Verification (bật nếu chưa)
   - App passwords → Generate password cho "Mail"
   - Copy password 16 ký tự

2. **Cập nhật .env.local:**
   - Thay `your-email@gmail.com` bằng email Gmail của bạn
   - Thay `your-app-password` bằng App Password vừa tạo

3. **Restart server:**
   ```bash
   npm run dev
   ```

## Kiểm tra cài đặt:

- Vào Profile → Email Settings
- Bấm "Gửi email test"
- Kiểm tra inbox email