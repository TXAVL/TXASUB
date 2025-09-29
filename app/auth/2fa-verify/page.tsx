'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TwoFactorVerifyPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Get user email from session or redirect if not authenticated
    const getUserInfo = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const userData = await response.json()
          setUserEmail(userData.email || '')
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Error getting user info:', error)
        router.push('/auth')
      }
    }

    getUserInfo()
  }, [router])

  const handleVerify2FA = async () => {
    if (!token.trim()) {
      setError('Vui lòng nhập mã xác thực')
      return
    }

    if (token.length !== 6) {
      setError('Mã xác thực phải có 6 chữ số')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (response.ok) {
        // 2FA verification successful
        console.log('2FA verification successful')
        
        // Update user session to mark 2FA as completed
        const updateResponse = await fetch('/api/auth/2fa/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (updateResponse.ok) {
          // Redirect to home page
          router.push('/')
        } else {
          setError('Có lỗi xảy ra sau khi xác thực. Vui lòng thử lại.')
        }
      } else {
        setError(data.error || 'Mã xác thực không đúng')
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = () => {
    // TODO: Implement resend code functionality
    console.log('Resend code requested')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Xác thực Hai Yếu tố
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập mã 6 chữ số từ ứng dụng xác thực của bạn
          </p>
          {userEmail && (
            <p className="mt-1 text-sm text-gray-500">
              Cho tài khoản: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nhập mã xác thực</CardTitle>
            <CardDescription>
              Mở ứng dụng xác thực trên điện thoại và nhập mã 6 chữ số
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Mã xác thực
              </label>
              <Input
                id="token"
                type="text"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="mt-1 text-center text-lg tracking-widest"
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleVerify2FA}
                disabled={loading || token.length !== 6}
                className="w-full"
              >
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleResendCode}
                className="w-full"
              >
                Gửi lại mã
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Không có ứng dụng xác thực?{' '}
            <a 
              href="#" 
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={(e) => {
                e.preventDefault()
                alert('Tải Google Authenticator hoặc Authy từ App Store/Google Play')
              }}
            >
              Tải ngay
            </a>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Mẹo sử dụng
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Mở ứng dụng xác thực trên điện thoại</li>
                  <li>Tìm tài khoản "TXASUB:(email của bạn)"</li>
                  <li>Nhập mã 6 chữ số hiển thị</li>
                  <li>Mã sẽ thay đổi mỗi 30 giây</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}