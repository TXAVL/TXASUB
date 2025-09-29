"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { EmailSettings } from "@/components/email-settings"
import { DebugCookies } from "@/components/debug-cookies"
import { CookieTest } from "@/components/cookie-test"
import { BrowserDebug } from "@/components/browser-debug"
import { LogManager } from "@/components/log-manager"
import { NotificationManager } from "@/components/notification-manager"
import { DeleteAccountModal } from "@/components/delete-account-modal"
import { User, Mail, Settings, Bell, FileText, Smartphone } from "lucide-react"

export function ProfilePage() {
    const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'browser' | 'logs'>('profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin cá nhân và cài đặt thông báo
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </Button>
          <Button
            variant={activeTab === 'email' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('email')}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email Notifications
          </Button>
          <Button
            variant={activeTab === 'browser' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('browser')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Browser Notifications
          </Button>
          <Button
            variant={activeTab === 'logs' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('logs')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Log Manager
          </Button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </div>
                <CardDescription>
                  Thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tên</label>
                    <p className="text-sm">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Google ID</label>
                    <p className="text-sm font-mono text-xs">{user.googleId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Đăng nhập lần cuối</label>
                    <p className="text-sm">{new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </div>
                <CardDescription>
                  Quản lý các cài đặt tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Xóa tài khoản</h4>
                      <p className="text-sm text-muted-foreground">
                        Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <EmailSettings />
            
            <DebugCookies />
            
            <CookieTest />
            
            <BrowserDebug />
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <CardTitle>Thông tin Email</CardTitle>
                </div>
                <CardDescription>
                  Hướng dẫn cấu hình email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📧 Cấu hình Gmail SMTP</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Để nhận email notifications, bạn cần cấu hình Gmail SMTP trong file .env:
                  </p>
                  <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-400">
                    <code className="text-xs text-blue-900">
                      GMAIL_USER=your-email@gmail.com<br/>
                      GMAIL_APP_PASSWORD=your-app-password
                    </code>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">🔐 App Password</h4>
                  <p className="text-sm text-yellow-800">
                    Bạn cần tạo App Password trong Google Account Settings để sử dụng Gmail SMTP.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Browser Notifications Tab */}
        {activeTab === 'browser' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <CardTitle>Thông báo trình duyệt</CardTitle>
                </div>
                <CardDescription>
                  Quản lý thông báo trực tiếp từ trình duyệt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationManager />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <LogManager />
        )}
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  )
}