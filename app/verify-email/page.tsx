'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Clock, RefreshCw } from 'lucide-react'
import { toast } from '@/lib/toast'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [expiryTime, setExpiryTime] = useState('')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timeParts, setTimeParts] = useState<Array<{ value: string, label: string }>>([])
  const [isChecking, setIsChecking] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(true)

  // Function lấy email từ API user
  const fetchUserEmail = async () => {
    setIsLoadingEmail(true)
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const userData = await response.json()
        if (userData.email) {
          setEmail(userData.email)
          localStorage.setItem('pendingVerificationEmail', userData.email)
          
          // Kiểm tra ngay lập tức xem email đã verified chưa
          if (userData.emailVerified) {
            toast.success('Email đã được xác thực! Đang chuyển hướng...')
            setTimeout(() => {
              window.location.href = '/'
            }, 2000)
            return
          }
        }
      } else if (response.status === 401) {
        // User chưa login, redirect về trang login
        toast.error('Bạn cần đăng nhập trước khi xác thực email')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
        return
      } else {
        console.error('Failed to fetch user data:', response.status)
        // Fallback: thử lấy từ cookie trực tiếp
        const cookies = document.cookie.split(';')
        const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
        if (userCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
            if (userData.email) {
              setEmail(userData.email)
              localStorage.setItem('pendingVerificationEmail', userData.email)
            }
          } catch (parseError) {
            console.error('Error parsing user cookie:', parseError)
            // Nếu không parse được cookie, redirect về login
            toast.error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại')
            setTimeout(() => {
              window.location.href = '/'
            }, 2000)
          }
        } else {
          // Không có cookie, redirect về login
          toast.error('Bạn cần đăng nhập trước khi xác thực email')
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error fetching user email:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại')
    } finally {
      setIsLoadingEmail(false)
    }
  }

  // Function format thời gian chi tiết với 2 digit
  const formatTimeRemaining = (seconds: number): { time: string, parts: Array<{ value: string, label: string }> } => {
    if (seconds <= 0) return { time: 'Đã hết hạn', parts: [] }
    
    const years = Math.floor(seconds / (365 * 24 * 60 * 60))
    const months = Math.floor((seconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60))
    const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const secs = Math.floor(seconds % 60)
    
    const parts: Array<{ value: string, label: string }> = []
    
    if (years > 0) {
      parts.push({ value: years.toString().padStart(2, '0'), label: 'năm' })
      if (months > 0) parts.push({ value: months.toString().padStart(2, '0'), label: 'tháng' })
      if (days > 0) parts.push({ value: days.toString().padStart(2, '0'), label: 'ngày' })
      if (hours > 0) parts.push({ value: hours.toString().padStart(2, '0'), label: 'giờ' })
      if (minutes > 0) parts.push({ value: minutes.toString().padStart(2, '0'), label: 'phút' })
      if (secs > 0) parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    } else if (months > 0) {
      parts.push({ value: months.toString().padStart(2, '0'), label: 'tháng' })
      if (days > 0) parts.push({ value: days.toString().padStart(2, '0'), label: 'ngày' })
      if (hours > 0) parts.push({ value: hours.toString().padStart(2, '0'), label: 'giờ' })
      if (minutes > 0) parts.push({ value: minutes.toString().padStart(2, '0'), label: 'phút' })
      if (secs > 0) parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    } else if (days > 0) {
      parts.push({ value: days.toString().padStart(2, '0'), label: 'ngày' })
      if (hours > 0) parts.push({ value: hours.toString().padStart(2, '0'), label: 'giờ' })
      if (minutes > 0) parts.push({ value: minutes.toString().padStart(2, '0'), label: 'phút' })
      if (secs > 0) parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    } else if (hours > 0) {
      parts.push({ value: hours.toString().padStart(2, '0'), label: 'giờ' })
      if (minutes > 0) parts.push({ value: minutes.toString().padStart(2, '0'), label: 'phút' })
      if (secs > 0) parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    } else if (minutes > 0) {
      parts.push({ value: minutes.toString().padStart(2, '0'), label: 'phút' })
      if (secs > 0) parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    } else {
      parts.push({ value: secs.toString().padStart(2, '0'), label: 'giây' })
    }
    
    const time = parts.map(p => `${p.value} ${p.label}`).join(' ')
    return { time, parts }
  }

  // Auto-check verification status
  const checkVerificationStatus = async () => {
    if (!email || isChecking) return
    
    setIsChecking(true)
    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (data.success && data.verified) {
        toast.success('Email đã được xác thực thành công! Đang chuyển hướng...')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra xác thực:', error)
      toast.error('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử gửi lại email.')
    } finally {
      setIsChecking(false)
    }
  }

  // Real-time countdown
  useEffect(() => {
    const updateCountdown = () => {
      // Dừng đồng hồ nếu đã hết hạn hoặc có lỗi invalid_token
      if (isExpired) {
        return
      }
      
      const tokenExpiry = localStorage.getItem('tokenExpiry')
      if (tokenExpiry) {
        const expiry = new Date(tokenExpiry)
        const now = new Date()
        const diffMs = expiry.getTime() - now.getTime()
        const diffSeconds = Math.max(0, Math.floor(diffMs / 1000))
        
        setTimeLeft(diffSeconds)
        const formatted = formatTimeRemaining(diffSeconds)
        setExpiryTime(formatted.time)
        setTimeParts(formatted.parts)
        
        if (diffSeconds <= 0) {
          setExpiryTime('Đã hết hạn')
          setTimeParts([])
          setIsExpired(true)
        } else {
          setIsExpired(false)
        }
      }
    }

    // Update immediately
    updateCountdown()
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [isExpired])

  // Check if email verification is required
  useEffect(() => {
    const checkEmailVerificationRequired = async () => {
      try {
        const response = await fetch('/api/config')
        const config = await response.json()
        
        // Nếu không cần verify email nữa, auto-verify user và chuyển về home
        if (!config.requireEmailVerify) {
          toast.success('Email verification đã được tắt. Đang chuyển hướng...')
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      } catch (error) {
        console.error('Error checking email verification config:', error)
      }
    }
    
    checkEmailVerificationRequired()
  }, [])

  // Auto-check verification every 5 seconds
  useEffect(() => {
    if (!email) return
    
    const checkInterval = setInterval(checkVerificationStatus, 5000)
    
    return () => clearInterval(checkInterval)
  }, [email])

  useEffect(() => {
    // Lấy email từ URL params, localStorage hoặc API
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    const errorParam = urlParams.get('error')
    
    // Xử lý error từ link verification
    if (errorParam) {
      switch (errorParam) {
        case 'missing_params':
          toast.error('Thiếu thông tin xác thực. Vui lòng thử lại.')
          break
        case 'invalid_token':
          toast.error('Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại email.')
          setIsExpired(true)
          break
        case 'verification_failed':
          toast.error('Xác thực thất bại. Vui lòng thử lại.')
          break
      }
    }
    
    if (emailParam) {
      setEmail(emailParam)
      localStorage.setItem('pendingVerificationEmail', emailParam)
      setIsLoadingEmail(false)
    } else {
      // Thử lấy từ localStorage trước
      const userEmail = localStorage.getItem('pendingVerificationEmail')
      if (userEmail) {
        setEmail(userEmail)
        setIsLoadingEmail(false)
      } else {
        // Nếu không có, lấy từ API user
        fetchUserEmail()
      }
    }

    // Set default expiry time if not set
    const tokenExpiry = localStorage.getItem('tokenExpiry')
    if (!tokenExpiry) {
      const expiryMinutes = parseInt(process.env.NEXT_PUBLIC_VERIFY_TOKEN_EXPIRY || '15')
      const defaultExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000)
      localStorage.setItem('tokenExpiry', defaultExpiry.toISOString())
    } else {
      // Kiểm tra ngay nếu token đã hết hạn
      const expiry = new Date(tokenExpiry)
      const now = new Date()
      if (now > expiry) {
        setIsExpired(true)
        setExpiryTime('Đã hết hạn')
        setTimeParts([])
      }
    }
  }, [])

  // Kiểm tra email sau khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!email) {
        toast.error('Không tìm thấy thông tin email. Vui lòng đăng nhập lại.')
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    }, 3000) // Đợi 3 giây để fetchUserEmail hoàn thành

    return () => clearTimeout(timer)
  }, [email])

  const handleResendVerification = async () => {
    // Đảm bảo có email trước khi gửi
    if (!email) {
      await fetchUserEmail()
      if (!email) {
        toast.error('Không thể lấy thông tin email. Vui lòng thử lại.')
        return
      }
    }

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendSuccess(true)
        setIsExpired(false)
        // Cập nhật thời gian hết hạn mới từ env
        const expiryMinutes = parseInt(process.env.NEXT_PUBLIC_VERIFY_TOKEN_EXPIRY || '15')
        const newExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000)
        localStorage.setItem('tokenExpiry', newExpiry.toISOString())
        
        // Cập nhật ngay lập tức
        const diffSeconds = expiryMinutes * 60
        setTimeLeft(diffSeconds)
        const formatted = formatTimeRemaining(diffSeconds)
        setExpiryTime(formatted.time)
        setTimeParts(formatted.parts)
        
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Có lỗi xảy ra khi gửi lại email')
      }
    } catch (error) {
      console.error('Lỗi khi gửi lại email xác thực:', error)
    } finally {
      setIsResending(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="mt-2">Xác thực email</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi link xác thực đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingEmail ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Đang tải thông tin...</p>
              </div>
            ) : email ? (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Email: <strong>{email}</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  Không tìm thấy thông tin email. Vui lòng đăng nhập lại.
                </AlertDescription>
              </Alert>
            )}

            {!isExpired && expiryTime && (
              <Alert className={timeLeft <= 60 ? "border-red-200 bg-red-50" : timeLeft <= 300 ? "border-yellow-200 bg-yellow-50" : "border-blue-200 bg-blue-50"}>
                <Clock className={`h-4 w-4 ${timeLeft <= 60 ? "text-red-600 animate-pulse" : timeLeft <= 300 ? "text-yellow-600" : "text-blue-600"}`} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="text-sm">Token xác thực sẽ hết hạn sau:</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {timeParts.map((part, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span 
                            className={`font-['Digital-7'] text-2xl font-bold ${timeLeft <= 60 ? "text-red-600" : timeLeft <= 300 ? "text-yellow-600" : "text-blue-600"}`}
                            style={{ fontFamily: 'Digital-7, monospace' }}
                          >
                            {part.value}
                          </span>
                          <span className="text-sm text-gray-600">{part.label}</span>
                        </div>
                      ))}
                      {timeLeft <= 60 && (
                        <span className="text-red-500 text-xs animate-pulse">⚠️</span>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {isExpired && (
              <Alert className="border-red-200 bg-red-50">
                <Clock className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="text-red-600 font-bold text-lg">
                      ⚠️ Token xác thực đã hết hạn!
                    </div>
                    <div className="text-red-600">
                      Link xác thực trong email đã không còn hiệu lực. Vui lòng nhấn nút bên dưới để gửi lại email xác thực mới.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!isExpired && (
              <div className="text-center text-sm text-gray-600">
                <p>Vui lòng kiểm tra hộp thư của bạn và nhấp vào link xác thực.</p>
                <p className="mt-2">Nếu không thấy email, hãy kiểm tra thư mục spam.</p>
                <p className="mt-2 text-blue-600 font-medium">
                  Hệ thống sẽ tự động kiểm tra và chuyển về trang chủ sau khi xác thực thành công.
                </p>
              </div>
            )}

            {isExpired && (
              <div className="text-center text-sm text-gray-600">
                <p className="text-red-600 font-medium">
                  Token xác thực đã hết hạn. Vui lòng gửi lại email xác thực mới.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : (
                  'Gửi lại email xác thực'
                )}
              </Button>

              {isChecking && (
                <div className="text-center text-sm text-blue-600">
                  <RefreshCw className="inline h-4 w-4 animate-spin mr-2" />
                  Đang kiểm tra trạng thái xác thực...
                </div>
              )}
            </div>

            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Email xác thực đã được gửi lại thành công!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}