"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { user, refreshAuth } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'delete' | 'password' | '2fa'>('delete')
  const [deleteText, setDeleteText] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [has2FA, setHas2FA] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset form khi mở modal
      setStep('delete')
      setDeleteText('')
      setPassword('')
      setTwoFactorCode('')
      setError('')
      setShowPassword(false)
      
      // Check if user has 2FA enabled
      check2FAStatus()
    }
  }, [isOpen])

  const check2FAStatus = async () => {
    try {
      const response = await fetch('/api/auth/2fa/status')
      if (response.ok) {
        const data = await response.json()
        setHas2FA(data.enabled)
        // If 2FA is enabled, go directly to 2FA step
        if (data.enabled) {
          setStep('2fa')
        }
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error)
    }
  }

  const handleDeleteTextChange = (value: string) => {
    setDeleteText(value)
    if (value === 'DELETE') {
      if (has2FA) {
        setStep('2fa')
      } else {
        setStep('password')
      }
    }
  }


  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          deleteText: deleteText
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Tài khoản đã được xóa thành công')
        await refreshAuth()
        router.push('/')
        onClose()
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa tài khoản')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa tài khoản')
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FASubmit = async () => {
    if (!twoFactorCode.trim()) {
      setError('Vui lòng nhập mã 2FA')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twoFactorCode: twoFactorCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Tài khoản đã được xóa thành công')
        await refreshAuth()
        router.push('/')
        onClose()
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa tài khoản')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa tài khoản')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xóa tài khoản
          </CardTitle>
          <CardDescription>
            Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'delete' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="delete-text">
                  Để xác nhận, vui lòng nhập <strong>DELETE</strong> vào ô bên dưới:
                </Label>
                <Input
                  id="delete-text"
                  value={deleteText}
                  onChange={(e) => handleDeleteTextChange(e.target.value)}
                  placeholder="Nhập DELETE"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Nhập mật khẩu để xác nhận:</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Với tài khoản Google, vui lòng nhập ngày hôm nay (định dạng: dd/mm/yyyy)
                </p>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={`Nhập ngày hôm nay: ${new Date().toLocaleDateString('vi-VN')}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === '2fa' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tài khoản của bạn đã bật xác thực 2 yếu tố. Để xóa tài khoản, vui lòng nhập mã 2FA từ ứng dụng xác thực của bạn.
                </p>
                <Label htmlFor="2fa-code">Nhập mã 2FA để xác nhận:</Label>
                <Input
                  id="2fa-code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Nhập mã 2FA"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            {step === 'password' && (
              <Button 
                variant="destructive" 
                onClick={handlePasswordSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Đang xóa...' : 'Xóa tài khoản'}
              </Button>
            )}
            {step === '2fa' && (
              <Button 
                variant="destructive" 
                onClick={handle2FASubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Đang xóa...' : 'Xóa tài khoản'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}