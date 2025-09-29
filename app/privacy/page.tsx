import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, UserCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Chính sách bảo mật
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn một cách an toàn và minh bạch
              </p>
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Thu thập thông tin
                  </CardTitle>
                  <CardDescription>
                    Thông tin chúng tôi thu thập từ bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin cá nhân</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Tên và địa chỉ email từ Google OAuth</li>
                      <li>Ảnh đại diện từ tài khoản Google</li>
                      <li>Thông tin gói đăng ký bạn quản lý</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Dữ liệu sử dụng</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Lịch sử truy cập và sử dụng ứng dụng</li>
                      <li>Thông tin thiết bị và trình duyệt</li>
                      <li>Dữ liệu phân tích để cải thiện dịch vụ</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    Bảo mật dữ liệu
                  </CardTitle>
                  <CardDescription>
                    Cách chúng tôi bảo vệ thông tin của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Mã hóa dữ liệu</h4>
                    <p className="text-sm text-muted-foreground">
                      Tất cả dữ liệu được mã hóa trong quá trình truyền tải và lưu trữ.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Truy cập hạn chế</h4>
                    <p className="text-sm text-muted-foreground">
                      Chỉ bạn mới có thể truy cập dữ liệu cá nhân của mình.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Lưu trữ an toàn</h4>
                    <p className="text-sm text-muted-foreground">
                      Dữ liệu được lưu trữ trên các server bảo mật với các biện pháp bảo vệ nghiêm ngặt.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Sử dụng dữ liệu
                  </CardTitle>
                  <CardDescription>
                    Mục đích sử dụng thông tin của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Cung cấp dịch vụ</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Quản lý gói đăng ký của bạn</li>
                      <li>Gửi thông báo nhắc nhở hết hạn</li>
                      <li>Phân tích và báo cáo chi phí</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Cải thiện dịch vụ</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Phân tích xu hướng sử dụng</li>
                      <li>Tối ưu hóa hiệu suất ứng dụng</li>
                      <li>Phát triển tính năng mới</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Quyền của bạn
                  </CardTitle>
                  <CardDescription>
                    Quyền kiểm soát dữ liệu cá nhân
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Truy cập và chỉnh sửa</h4>
                    <p className="text-sm text-muted-foreground">
                      Bạn có thể xem, chỉnh sửa hoặc xóa dữ liệu cá nhân bất kỳ lúc nào.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Xuất dữ liệu</h4>
                    <p className="text-sm text-muted-foreground">
                      Bạn có thể yêu cầu xuất tất cả dữ liệu của mình dưới định dạng JSON.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Xóa tài khoản</h4>
                    <p className="text-sm text-muted-foreground">
                      Bạn có thể xóa tài khoản và tất cả dữ liệu liên quan bất kỳ lúc nào.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Liên hệ</CardTitle>
                  <CardDescription>
                    Nếu bạn có câu hỏi về chính sách bảo mật
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng liên hệ với chúng tôi qua email: <strong>privacy@submanager.com</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}