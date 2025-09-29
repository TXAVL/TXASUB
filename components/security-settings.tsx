'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Key, Smartphone, CheckCircle, AlertTriangle, QrCode } from 'lucide-react'
import { enableTwoFactor, verifyTwoFactor, disableTwoFactor } from '@/lib/auth'

export function SecuritySettings() {
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorSecret, setTwoFactorSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // TODO: Check if user has 2FA enabled
    // setTwoFactorEnabled(user.twoFactorEnabled)
  }, [])

  const handleEnable2FA = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await enableTwoFactor()
      setTwoFactorSecret(result.secret)
      setQrCode(result.qrCode)
    } catch (error) {
      setError('Không thể bật 2FA. Vui lòng thử lại.')
      console.error('Error enabling 2FA:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationToken.trim()) {
      setError('Vui lòng nhập mã xác thực')
      return
    }

    try {
      setLoading(true)
      setError('')
      await verifyTwoFactor(verificationToken, twoFactorSecret)
      setTwoFactorEnabled(true)
      setSuccess('2FA đã được bật thành công!')
      setQrCode('')
      setTwoFactorSecret('')
      setVerificationToken('')
    } catch (error) {
      setError('Mã xác thực không đúng. Vui lòng thử lại.')
      console.error('Error verifying 2FA:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    try {
      setLoading(true)
      setError('')
      await disableTwoFactor()
      setTwoFactorEnabled(false)
      setSuccess('2FA đã được tắt thành công!')
    } catch (error) {
      setError('Không thể tắt 2FA. Vui lòng thử lại.')
      console.error('Error disabling 2FA:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Cài đặt Bảo mật</h2>
      </div>

      {/* 2FA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Xác thực Hai Yếu tố (2FA)
          </CardTitle>
          <CardDescription>
            Thêm lớp bảo mật bổ sung cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Xác thực Hai Yếu tố</p>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled 
                  ? '2FA đã được bật cho tài khoản của bạn'
                  : 'Bảo vệ tài khoản bằng mã từ ứng dụng xác thực'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                {twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
              </Badge>
              {!twoFactorEnabled ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={handleEnable2FA} disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Bật 2FA'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Bật Xác thực Hai Yếu tố</DialogTitle>
                      <DialogDescription>
                        Quét mã QR bằng ứng dụng xác thực của bạn
                      </DialogDescription>
                    </DialogHeader>
                    {qrCode && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Hoặc nhập mã thủ công:</p>
                          <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                            {twoFactorSecret}
                          </div>
                          <p className="text-xs text-gray-500">
                            Tên hiển thị trong ứng dụng xác thực: <strong>TXASUB:(email của bạn)</strong>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Nhập mã xác thực từ ứng dụng:
                          </label>
                          <Input
                            placeholder="000000"
                            value={verificationToken}
                            onChange={(e) => setVerificationToken(e.target.value)}
                            maxLength={6}
                          />
                        </div>
                        <Button onClick={handleVerify2FA} className="w-full" disabled={loading}>
                          {loading ? 'Đang xác thực...' : 'Xác thực và Bật 2FA'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={handleDisable2FA}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Tắt 2FA'}
                </Button>
              )}
            </div>
          </div>

          {twoFactorEnabled && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Tài khoản của bạn đã được bảo vệ bằng xác thực hai yếu tố. 
                Bạn sẽ cần nhập mã từ ứng dụng xác thực khi đăng nhập.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Khuyến nghị Bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Sử dụng mật khẩu mạnh</p>
                <p className="text-sm text-gray-600">
                  Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Bật xác thực hai yếu tố</p>
                <p className="text-sm text-gray-600">
                  Thêm lớp bảo mật bổ sung bằng mã từ ứng dụng xác thực.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Cập nhật thông tin liên hệ</p>
                <p className="text-sm text-gray-600">
                  Đảm bảo email và số điện thoại của bạn được cập nhật để nhận thông báo bảo mật
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Đăng xuất khỏi thiết bị cũ</p>
                <p className="text-sm text-gray-600">
                  Thường xuyên kiểm tra và đăng xuất khỏi các thiết bị không còn sử dụng.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}