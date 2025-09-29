'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  CreditCard, 
  Zap, 
  Shield, 
  Settings, 
  TrendingUp,
  Smartphone,
  Database,
  Cloud,
  Bot
} from 'lucide-react'
import { TeamManagement } from '@/components/team-management'
import { PaymentTracking } from '@/components/payment-tracking'
import { SecuritySettings } from '@/components/security-settings'
import { ApiIntegrations } from '@/components/api-integrations'
import { PerformanceOptimization } from '@/components/performance-optimization'

export default function FeaturesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Tính năng Mới</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Khám phá các tính năng mới được thêm vào Subscription Manager: 
          Team collaboration, Payment tracking, API integrations, Security upgrades và Performance optimization.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="payments">Thanh toán</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Team Collaboration
                </CardTitle>
                <CardDescription>
                  Chia sẻ và cộng tác quản lý subscription với team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Tạo team</Badge>
                  <Badge variant="outline">Mời thành viên</Badge>
                  <Badge variant="outline">Phân quyền</Badge>
                  <Badge variant="outline">Chia sẻ subscription</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  Payment Tracking
                </CardTitle>
                <CardDescription>
                  Theo dõi thanh toán và lịch sử giao dịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Lịch sử giao dịch</Badge>
                  <Badge variant="outline">Thống kê chi phí</Badge>
                  <Badge variant="outline">Báo cáo thanh toán</Badge>
                  <Badge variant="outline">Xuất dữ liệu</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Security Upgrade
                </CardTitle>
                <CardDescription>
                  Nâng cấp bảo mật với 2FA và encryption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">2FA Authentication</Badge>
                  <Badge variant="outline">Data Encryption</Badge>
                  <Badge variant="outline">Audit Logs</Badge>
                  <Badge variant="outline">Session Management</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  API Integrations
                </CardTitle>
                <CardDescription>
                  Tích hợp với các nhà cung cấp dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Stripe</Badge>
                  <Badge variant="outline">PayPal</Badge>
                  <Badge variant="outline">AWS</Badge>
                  <Badge variant="outline">OpenAI</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Tối ưu hóa hiệu suất và PWA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Caching</Badge>
                  <Badge variant="outline">Lazy Loading</Badge>
                  <Badge variant="outline">PWA Support</Badge>
                  <Badge variant="outline">CDN</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Hệ thống cấu hình mới với .env support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">.env.local</Badge>
                  <Badge variant="outline">.env fallback</Badge>
                  <Badge variant="outline">Default values</Badge>
                  <Badge variant="outline">Console logging</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn Sử dụng</CardTitle>
              <CardDescription>
                Cách sử dụng các tính năng mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">1. Team Collaboration</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tạo team và mời thành viên</li>
                    <li>• Phân quyền admin, member, viewer</li>
                    <li>• Chia sẻ subscription với team</li>
                    <li>• Quản lý thành viên và vai trò</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">2. Payment Tracking</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Thêm giao dịch thanh toán</li>
                    <li>• Theo dõi lịch sử giao dịch</li>
                    <li>• Thống kê chi phí theo thời gian</li>
                    <li>• Xuất báo cáo thanh toán</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">3. Security & 2FA</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bật xác thực hai yếu tố</li>
                    <li>• Mã hóa dữ liệu nhạy cảm</li>
                    <li>• Audit logs cho hoạt động</li>
                    <li>• Quản lý session an toàn</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">4. API Integrations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Kết nối Stripe, PayPal</li>
                    <li>• Tích hợp AWS services</li>
                    <li>• Sử dụng OpenAI API</li>
                    <li>• Đồng bộ dữ liệu tự động</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracking />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="integrations">
          <ApiIntegrations />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceOptimization />
        </TabsContent>
      </Tabs>
    </div>
  )
}