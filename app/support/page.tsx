import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  Mail, 
  MessageCircle, 
  HelpCircle,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function SupportPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Hỗ trợ khách hàng
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Chúng tôi đang bảo trì hệ thống để cải thiện dịch vụ
              </p>
            </div>

            {/* Maintenance Notice */}
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Thông báo bảo trì
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Hệ thống đang được bảo trì để nâng cấp và cải thiện
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Đang bảo trì
                </Badge>
                <span className="text-sm text-orange-700">
                  Dự kiến hoàn thành: 2-3 ngày tới
                </span>
              </div>
              <p className="text-sm text-orange-700">
                Trong thời gian này, một số tính năng có thể không hoạt động bình thường. 
                Chúng tôi xin lỗi vì sự bất tiện này.
              </p>
            </CardContent>
          </Card>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Hoạt động bình thường
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">✅ Đăng nhập Google</div>
                  <div className="text-sm">✅ Quản lý gói đăng ký</div>
                  <div className="text-sm">✅ Analytics Dashboard</div>
                </div>
              </CardContent>
            </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Đang bảo trì
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">🔧 Email Notifications</div>
                  <div className="text-sm">🔧 Export dữ liệu</div>
                  <div className="text-sm">🔧 API integrations</div>
                </div>
              </CardContent>
            </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    Sắp ra mắt
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">🚀 Mobile App</div>
                  <div className="text-sm">🚀 Team Collaboration</div>
                  <div className="text-sm">🚀 Payment Tracking</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Liên hệ hỗ trợ
                </CardTitle>
                <CardDescription>
                  Các cách liên hệ với chúng tôi trong thời gian bảo trì
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Email hỗ trợ</h4>
                    <p className="text-sm text-muted-foreground">
                      Gửi email cho chúng tôi và chúng tôi sẽ phản hồi trong vòng 24h
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      support@submanager.com
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Báo lỗi</h4>
                    <p className="text-sm text-muted-foreground">
                      Báo cáo lỗi hoặc đề xuất tính năng mới
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Báo lỗi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-600" />
                  Câu hỏi thường gặp
                </CardTitle>
                <CardDescription>
                  Các câu hỏi phổ biến trong thời gian bảo trì
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Tại sao hệ thống đang bảo trì?</h4>
                    <p className="text-sm text-muted-foreground">
                      Chúng tôi đang nâng cấp hệ thống để cải thiện hiệu suất và thêm tính năng mới.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Khi nào hệ thống hoạt động bình thường?</h4>
                    <p className="text-sm text-muted-foreground">
                      Dự kiến trong 2-3 ngày tới. Chúng tôi sẽ thông báo khi hoàn thành.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Dữ liệu của tôi có an toàn không?</h4>
                    <p className="text-sm text-muted-foreground">
                      Có, tất cả dữ liệu của bạn được bảo vệ an toàn trong quá trình bảo trì.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Tôi có thể sử dụng ứng dụng không?</h4>
                    <p className="text-sm text-muted-foreground">
                      Có, các tính năng cơ bản như quản lý gói đăng ký vẫn hoạt động bình thường.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin bảo trì</CardTitle>
                <CardDescription>
                  Chi tiết về quá trình bảo trì hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Các cải tiến đang được thực hiện:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Nâng cấp hệ thống email notifications</li>
                    <li>Cải thiện hiệu suất analytics</li>
                    <li>Thêm tính năng export dữ liệu</li>
                    <li>Tối ưu hóa bảo mật</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Tính năng mới sắp ra mắt:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                    <li>Mobile app cho iOS và Android</li>
                    <li>Tính năng chia sẻ team</li>
                    <li>Theo dõi thanh toán tự động</li>
                    <li>Tích hợp API từ các nhà cung cấp</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}