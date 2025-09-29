"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Key, 
  Smartphone, 
  Bell, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  X,
  QrCode
} from "lucide-react"
import { toast } from "@/lib/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function SecurityPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>("default")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [showTwoFASetup, setShowTwoFASetup] = useState(false)
  const [twoFASecret, setTwoFASecret] = useState("")
  const [twoFAQRCode, setTwoFAQRCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [setupStep, setSetupStep] = useState<'qr' | 'verify'>('qr')

  useEffect(() => {
    if (user) {
      checkBrowserNotificationPermission()
      loadUserSettings()
    }
  }, [user])

  const checkBrowserNotificationPermission = () => {
    if ("Notification" in window) {
      setBrowserNotificationPermission(Notification.permission)
    }
  }

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const userData = await response.json()
        setTwoFAEnabled(userData.twoFactorEnabled || false)
      }
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const requestBrowserNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setBrowserNotificationPermission(permission)
      if (permission === "granted") {
        toast.success("Đã bật thông báo trình duyệt!")
      } else {
        toast.error("Cần cấp quyền thông báo để sử dụng tính năng này")
      }
    }
  }


  const toggle2FA = async () => {
    if (!twoFAEnabled) {
      // Enable 2FA - Generate secret and QR code
      setLoading(true)
      try {
        const response = await fetch('/api/auth/2fa/enable', {
          method: 'POST',
        })

        if (response.ok) {
          const data = await response.json()
          setTwoFASecret(data.secret)
          setTwoFAQRCode(data.qrCode)
          setShowTwoFASetup(true)
          setSetupStep('qr')
        } else {
          toast.error("Có lỗi xảy ra khi tạo 2FA")
        }
      } catch (error) {
        console.error('Error enabling 2FA:', error)
        toast.error("Có lỗi xảy ra")
      } finally {
        setLoading(false)
      }
    } else {
      // Disable 2FA
      setLoading(true)
      try {
        const response = await fetch('/api/auth/2fa/disable', {
          method: 'POST',
        })

        if (response.ok) {
          setTwoFAEnabled(false)
          toast.success("Đã tắt xác thực 2 yếu tố")
        } else {
          toast.error("Có lỗi xảy ra khi tắt 2FA")
        }
      } catch (error) {
        console.error('Error disabling 2FA:', error)
        toast.error("Có lỗi xảy ra")
      } finally {
        setLoading(false)
      }
    }
  }

  const verify2FACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Vui lòng nhập mã 6 chữ số")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verificationCode,
          secret: twoFASecret
        }),
      })

      if (response.ok) {
        setTwoFAEnabled(true)
        setShowTwoFASetup(false)
        setVerificationCode("")
        setTwoFASecret("")
        setTwoFAQRCode("")
        toast.success("Đã bật xác thực 2 yếu tố thành công!")
      } else {
        toast.error("Mã xác thực không đúng")
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cần đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để truy cập trang bảo mật</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảo mật</h1>
          <p className="text-gray-600">Quản lý cài đặt bảo mật và thông báo của bạn</p>
        </div>

        <div className="space-y-6">
          {/* 2FA Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle>Xác thực 2 yếu tố (2FA)</CardTitle>
                  <CardDescription>
                    Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="2fa-toggle" className="text-base font-medium">
                    Xác thực 2 yếu tố
                  </Label>
                  <p className="text-sm text-gray-600">
                    {twoFAEnabled 
                      ? "Tài khoản của bạn được bảo vệ bởi 2FA" 
                      : "Bật 2FA để tăng cường bảo mật tài khoản"
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={twoFAEnabled ? "default" : "secondary"}>
                    {twoFAEnabled ? "Đã bật" : "Chưa bật"}
                  </Badge>
                  <Button 
                    onClick={toggle2FA}
                    disabled={loading}
                    variant={twoFAEnabled ? "destructive" : "default"}
                  >
                    {loading ? "Đang xử lý..." : twoFAEnabled ? "Tắt 2FA" : "Bật 2FA"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Browser Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle>Thông báo trình duyệt</CardTitle>
                  <CardDescription>
                    Nhận thông báo trực tiếp từ trình duyệt
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Thông báo trình duyệt
                    </Label>
                    <p className="text-sm text-gray-600">
                      {browserNotificationPermission === "granted" 
                        ? "Bạn đã cấp quyền thông báo" 
                        : browserNotificationPermission === "denied"
                        ? "Thông báo bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt"
                        : "Cấp quyền để nhận thông báo từ trình duyệt"
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={
                      browserNotificationPermission === "granted" ? "default" : "secondary"
                    }>
                      {browserNotificationPermission === "granted" ? "Đã bật" : "Chưa bật"}
                    </Badge>
                    {browserNotificationPermission !== "granted" && (
                      <Button onClick={requestBrowserNotificationPermission}>
                        Cấp quyền
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* 2FA Setup Modal */}
      <Dialog open={showTwoFASetup} onOpenChange={setShowTwoFASetup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Thiết lập xác thực 2 yếu tố
            </DialogTitle>
          </DialogHeader>
          
          {setupStep === 'qr' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Quét mã QR bằng ứng dụng xác thực của bạn (Google Authenticator, Authy, etc.)
                </p>
                
                {twoFAQRCode && (
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white border rounded-lg">
                      <img 
                        src={twoFAQRCode} 
                        alt="2FA QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Hoặc nhập mã thủ công:</p>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {twoFASecret}
                  </code>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSetupStep('verify')}
                  className="flex-1"
                >
                  Tiếp theo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTwoFASetup(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {setupStep === 'verify' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Nhập mã 6 chữ số từ ứng dụng xác thực để hoàn tất thiết lập
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Mã xác thực</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={verify2FACode}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {loading ? "Đang xác thực..." : "Xác thực"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSetupStep('qr')}
                >
                  Quay lại
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}