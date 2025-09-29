'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle, Settings } from 'lucide-react'

export default function ConfigTestPage() {
  const [configInfo, setConfigInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test config loading via API
    const testConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        
        if (data.success) {
          setConfigInfo({
            source: data.config.source,
            loaded: data.config.loaded,
            nodeEnv: data.config.variables.NODE_ENV,
            appUrl: data.config.variables.NEXT_PUBLIC_APP_URL,
            googleClientId: data.config.variables.GOOGLE_CLIENT_ID,
            gmailUser: data.config.variables.GMAIL_USER,
            databaseType: 'sqlite', // Default value
            teamMaxMembers: 10, // Default value
            cacheTtl: 3600, // Default value
            encryptionKey: data.config.variables.ENCRYPTION_KEY,
            sessionSecret: data.config.variables.SESSION_SECRET,
            envFiles: data.config.envFiles,
            timestamp: data.config.timestamp
          })
        } else {
          setConfigInfo({
            error: data.error
          })
        }
      } catch (error) {
        console.error('Config test error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setConfigInfo({
          error: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    testConfig()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Settings className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang kiểm tra cấu hình...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Kiểm tra Cấu hình</h1>
        <p className="text-gray-600">
          Trang này kiểm tra hệ thống cấu hình mới và hiển thị thông tin từ .env/.env.local
        </p>
      </div>

      {configInfo?.error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Lỗi khi tải cấu hình: {configInfo.error}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Hệ thống cấu hình đã được tải thành công! Nguồn: {configInfo.source} (Loaded: {configInfo.loaded ? 'Yes' : 'No'})
            </AlertDescription>
          </Alert>

          {/* Environment Files Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái File Environment</CardTitle>
              <CardDescription>
                Kiểm tra các file cấu hình có sẵn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">.env.local</span>
                  <Badge variant={configInfo.envFiles?.hasEnvLocal ? 'default' : 'secondary'}>
                    {configInfo.envFiles?.hasEnvLocal ? 'Có' : 'Không có'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">.env</span>
                  <Badge variant={configInfo.envFiles?.hasEnv ? 'default' : 'secondary'}>
                    {configInfo.envFiles?.hasEnv ? 'Có' : 'Không có'}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Thời gian kiểm tra:</strong> {new Date(configInfo.timestamp).toLocaleString('vi-VN')}</p>
                <p><strong>Nguồn cấu hình:</strong> {configInfo.source}</p>
                <p><strong>Trạng thái load:</strong> {configInfo.loaded ? 'Thành công' : 'Thất bại'}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environment</CardTitle>
                <CardDescription>Thông tin môi trường</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">NODE_ENV:</span>
                    <Badge variant="outline">{configInfo.nodeEnv}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">App URL:</span>
                    <span className="text-sm font-mono">{configInfo.appUrl}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Authentication</CardTitle>
                <CardDescription>Cấu hình xác thực</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Google Client ID:</span>
                    <Badge variant={configInfo.googleClientId === 'Set' ? 'default' : 'secondary'}>
                      {configInfo.googleClientId}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Gmail User:</span>
                    <Badge variant={configInfo.gmailUser === 'Set' ? 'default' : 'secondary'}>
                      {configInfo.gmailUser}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Database</CardTitle>
                <CardDescription>Cấu hình cơ sở dữ liệu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Type:</span>
                    <Badge variant="outline">{configInfo.databaseType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Settings</CardTitle>
                <CardDescription>Cài đặt team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Max Members:</span>
                    <Badge variant="outline">{configInfo.teamMaxMembers}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
                <CardDescription>Cài đặt hiệu suất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cache TTL:</span>
                    <Badge variant="outline">{configInfo.cacheTtl}s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Cài đặt bảo mật</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Encryption Key:</span>
                    <Badge variant={configInfo.encryptionKey === 'Set' ? 'default' : 'secondary'}>
                      {configInfo.encryptionKey}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Session Secret:</span>
                    <Badge variant={configInfo.sessionSecret === 'Set' ? 'default' : 'secondary'}>
                      {configInfo.sessionSecret}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn Sử dụng</CardTitle>
              <CardDescription>
                Cách sử dụng hệ thống cấu hình mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Ưu tiên file cấu hình:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• .env.local (ưu tiên cao nhất)</li>
                    <li>• .env (ưu tiên thứ hai)</li>
                    <li>• Default values (nếu không có file nào)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Console logging:</h4>
                  <p className="text-sm text-gray-600">
                    Hệ thống sẽ in ra console nguồn cấu hình được sử dụng và các thông tin quan trọng.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Các tính năng mới:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Team collaboration và chia sẻ</li>
                    <li>• Theo dõi thanh toán và lịch sử giao dịch</li>
                    <li>• Tích hợp API từ các nhà cung cấp</li>
                    <li>• Bảo mật 2FA và encryption</li>
                    <li>• Tối ưu hóa hiệu suất với caching và PWA</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}