import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Shield, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Điều khoản sử dụng
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Điều khoản và điều kiện sử dụng dịch vụ SubManager
              </p>
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-green-600" />
                  Chấp nhận điều khoản
                </CardTitle>
                <CardDescription>
                  Bằng việc sử dụng dịch vụ, bạn đồng ý với các điều khoản này
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Khi bạn truy cập và sử dụng SubManager, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.
                </p>
                <p className="text-sm text-muted-foreground">
                  Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Quyền sử dụng
                </CardTitle>
                <CardDescription>
                  Quyền và nghĩa vụ của người dùng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quyền của bạn</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Sử dụng dịch vụ để quản lý gói đăng ký cá nhân</li>
                    <li>Truy cập và chỉnh sửa dữ liệu của bạn</li>
                    <li>Xuất dữ liệu dưới định dạng JSON</li>
                    <li>Xóa tài khoản và dữ liệu bất kỳ lúc nào</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Nghĩa vụ của bạn</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Cung cấp thông tin chính xác và cập nhật</li>
                    <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                    <li>Không chia sẻ tài khoản với người khác</li>
                    <li>Báo cáo các lỗi bảo mật nếu phát hiện</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Giới hạn trách nhiệm
                </CardTitle>
                <CardDescription>
                  Các giới hạn về trách nhiệm của chúng tôi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Dịch vụ "như hiện tại"</h4>
                  <p className="text-sm text-muted-foreground">
                    Dịch vụ được cung cấp "như hiện tại" và chúng tôi không đảm bảo tính liên tục hoặc không có lỗi.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mất dữ liệu</h4>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi không chịu trách nhiệm về việc mất dữ liệu do lỗi kỹ thuật hoặc các sự kiện ngoài tầm kiểm soát.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Thiệt hại gián tiếp</h4>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi không chịu trách nhiệm về các thiệt hại gián tiếp, đặc biệt hoặc hậu quả.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Cấm sử dụng
                </CardTitle>
                <CardDescription>
                  Các hành vi bị cấm khi sử dụng dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Hành vi bất hợp pháp</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Sử dụng dịch vụ cho các hoạt động bất hợp pháp</li>
                    <li>Vi phạm quyền sở hữu trí tuệ của bên thứ ba</li>
                    <li>Phát tán nội dung độc hại hoặc không phù hợp</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Hành vi kỹ thuật</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Cố gắng hack hoặc tấn công hệ thống</li>
                    <li>Sử dụng bot hoặc script tự động</li>
                    <li>Khai thác lỗ hổng bảo mật</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thay đổi điều khoản</CardTitle>
                <CardDescription>
                  Quyền thay đổi và cập nhật điều khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào. 
                  Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là chấp nhận các điều khoản mới.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liên hệ</CardTitle>
                <CardDescription>
                  Nếu bạn có câu hỏi về điều khoản sử dụng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vui lòng liên hệ với chúng tôi qua email: <strong>legal@submanager.com</strong>
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