# Subscription Manager

Ứng dụng quản lý gói đăng ký được xây dựng với Next.js, React và Node.js.

## Tính năng

### Xác thực
- Đăng nhập với Google OAuth
- Quản lý phiên đăng nhập an toàn
- Chế độ khách với giới thiệu

### Quản lý gói đăng ký
- Thêm, sửa, xóa gói đăng ký
- Autocomplete cho tên gói phổ biến
- Theo dõi ngày hết hạn, chi phí, chu kỳ
- Ghi chú chi tiết cho từng gói

### Dashboard
- Lịch hiển thị ngày hết hạn
- Thống kê tổng quan (số gói, chi phí, sắp hết hạn)
- Danh sách 3 gói sắp hết hạn
- Quản lý nhanh từ dashboard

### Tìm kiếm và lọc
- Tìm kiếm theo tên và ghi chú
- Autocomplete với gợi ý thông minh
- Lọc theo ngày hết hạn (7 ngày, 30 ngày, đã hết hạn)
- Lọc theo chu kỳ (hàng tháng/hàng năm)

### Thông báo
- Toast notifications cho gói hết hạn/sắp hết hạn
- Browser notifications (với quyền người dùng)
- **Email notifications với Gmail SMTP**
- **Cấu hình thông báo trong profile**
- **Báo cáo tuần/tháng tự động**
- Nút quản lý trực tiếp từ thông báo
- Kiểm tra tự động khi tải trang

### Xuất dữ liệu
- Xuất JSON với metadata đầy đủ
- Xuất CSV tương thích Excel
- Lọc dữ liệu trước khi xuất
- Tên file tự động với ngày tháng

### Giao diện
- Dark/Light mode với system preference
- Responsive design cho mobile/tablet/desktop
- Sticky navigation với mobile menu
- Professional design theo chuẩn v0/Vercel

## Cài đặt

### Backend
1. Tạo Google OAuth credentials tại [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo file `.env.local` với:
\`\`\`
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Gmail SMTP (cho email notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Cron Job Security (optional)
CRON_SECRET=your_secure_random_string
\`\`\`

**📖 Xem hướng dẫn chi tiết**: [ENV_SETUP.md](./ENV_SETUP.md)

3. Cài đặt dependencies:
\`\`\`bash
npm install
\`\`\`

4. Chạy backend:
\`\`\`bash
npm run server
\`\`\`

### Frontend
1. Chạy Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

2. Truy cập http://localhost:3000

## Cấu trúc dự án

\`\`\`
├── app/                    # Next.js App Router
│   ├── auth/              # Trang đăng nhập
│   ├── subscriptions/     # Trang quản lý gói
│   ├── layout.tsx         # Layout chính
│   ├── page.tsx          # Trang chủ
│   └── globals.css       # Styles toàn cục
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-provider.tsx # Context xác thực
│   ├── theme-provider.tsx# Context theme
│   ├── navigation.tsx    # Navigation bar
│   ├── home-page.tsx     # Trang chủ
│   ├── subscriptions-page.tsx # Trang quản lý
│   ├── calendar-view.tsx # Component lịch
│   ├── stats-cards.tsx   # Thống kê
│   ├── subscription-modal.tsx # Modal thêm/sửa
│   ├── subscription-table.tsx # Bảng danh sách
│   ├── notification-manager.tsx # Quản lý thông báo
│   └── export-manager.tsx # Xuất dữ liệu
├── lib/                   # Utilities
│   ├── auth.ts           # API calls
│   └── utils.ts          # Helper functions
├── server.js             # Express backend
├── data/
│   └── subscriptions.json    # Database file
└── package.json          # Dependencies
\`\`\`

## API Endpoints

### Authentication
- `GET /auth/google` - Redirect to Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Đăng xuất
- `GET /api/user` - Thông tin user

### Subscriptions
- `GET /api/subscriptions` - Lấy danh sách gói
- `POST /api/subscriptions` - Tạo gói mới
- `PUT /api/subscriptions/:id` - Cập nhật gói
- `DELETE /api/subscriptions/:id` - Xóa gói

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Google Auth Library
- **UI Components**: shadcn/ui, Lucide React
- **Calendar**: react-calendar
- **Notifications**: react-toastify, Browser Notification API
- **Date handling**: date-fns
- **Storage**: JSON file (có thể mở rộng sang database)

## Tính năng nâng cao

### Responsive Design
- Mobile-first approach
- Sticky navigation với mobile menu
- Responsive tables và modals
- Touch-friendly interactions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Performance
- Code splitting
- Lazy loading
- Optimized images
- Efficient re-renders

### Security
- HTTP-only cookies
- CSRF protection
- Input validation
- Secure OAuth flow

## Mở rộng

Ứng dụng có thể được mở rộng với:
- Database thực (PostgreSQL, MongoDB)
- Email notifications
- Team collaboration
- Payment tracking
- Mobile app
- API integrations
- Advanced analytics
