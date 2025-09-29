import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Bell, 
  Shield, 
  BarChart3, 
  Users, 
  Smartphone,
  Clock,
  DollarSign,
  CheckCircle,
  Star
} from "lucide-react"

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-blue-600" />,
    title: "Quản lý Subscription",
    description: "Theo dõi tất cả các gói subscription của bạn ở một nơi",
    features: [
      "Thêm/sửa/xóa subscription",
      "Theo dõi ngày hết hạn",
      "Phân loại theo chu kỳ",
      "Ghi chú chi tiết"
    ],
    color: "border-blue-200 bg-blue-50"
  },
  {
    icon: <Bell className="h-8 w-8 text-green-600" />,
    title: "Thông báo thông minh",
    description: "Không bao giờ bỏ lỡ ngày gia hạn quan trọng",
    features: [
      "Thông báo trước 7 ngày",
      "Thông báo trước 1 ngày",
      "Email tự động",
      "Tùy chỉnh thời gian"
    ],
    color: "border-green-200 bg-green-50"
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Bảo mật cao",
    description: "Dữ liệu của bạn được bảo vệ an toàn",
    features: [
      "Xác thực 2FA",
      "Mã hóa dữ liệu",
      "Backup tự động",
      "Quyền riêng tư"
    ],
    color: "border-purple-200 bg-purple-50"
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
    title: "Phân tích chi tiết",
    description: "Hiểu rõ chi phí và xu hướng chi tiêu",
    features: [
      "Biểu đồ chi phí",
      "Thống kê theo tháng",
      "Xu hướng tăng/giảm",
      "Báo cáo chi tiết"
    ],
    color: "border-orange-200 bg-orange-50"
  },
  {
    icon: <Users className="h-8 w-8 text-pink-600" />,
    title: "Quản lý nhóm",
    description: "Chia sẻ và quản lý subscription với team",
    features: [
      "Mời thành viên",
      "Phân quyền truy cập",
      "Chia sẻ dữ liệu",
      "Quản lý nhóm"
    ],
    color: "border-pink-200 bg-pink-50"
  },
  {
    icon: <Smartphone className="h-8 w-8 text-cyan-600" />,
    title: "Đa nền tảng",
    description: "Truy cập từ mọi thiết bị",
    features: [
      "Web responsive",
      "Mobile friendly",
      "Sync real-time",
      "Offline support"
    ],
    color: "border-cyan-200 bg-cyan-50"
  }
]

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Freelancer",
    content: "Tuyệt vời! Giờ tôi không còn quên gia hạn Netflix hay Spotify nữa. Tiết kiệm được rất nhiều thời gian!",
    rating: 5
  },
  {
    name: "Trần Thị B",
    role: "Doanh nhân",
    content: "Công cụ quản lý subscription tốt nhất tôi từng dùng. Giao diện đẹp, dễ sử dụng.",
    rating: 5
  },
  {
    name: "Lê Văn C",
    role: "Developer",
    content: "Tính năng thông báo rất hữu ích. Không còn bị charge phí không mong muốn.",
    rating: 5
  }
]

export function FeatureCards() {
  return (
    <div id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quản lý subscription một cách thông minh và hiệu quả với các tính năng được thiết kế dành riêng cho bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className={`${feature.color} hover:shadow-lg transition-shadow duration-300`}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StatsSection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Số liệu ấn tượng
          </h2>
          <p className="text-xl text-gray-600">
            Hàng nghìn người dùng đã tin tưởng và sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-600">Người dùng</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
            <div className="text-gray-600">Subscription được quản lý</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$2M+</div>
            <div className="text-gray-600">Tiết kiệm chi phí</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}