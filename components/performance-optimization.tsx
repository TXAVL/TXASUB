'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap, 
  Database, 
  Smartphone, 
  Wifi, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Download,
  Upload,
  Clock,
  HardDrive
} from 'lucide-react'

interface PerformanceMetrics {
  cacheHitRate: number
  loadTime: number
  bundleSize: number
  memoryUsage: number
  networkRequests: number
  pwaScore: number
}

export function PerformanceOptimization() {
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheHitRate: 85,
    loadTime: 1.2,
    bundleSize: 2.4,
    memoryUsage: 45,
    networkRequests: 12,
    pwaScore: 92
  })
  
  const [optimizations, setOptimizations] = useState({
    caching: true,
    lazyLoading: true,
    compression: true,
    pwa: false,
    cdn: false,
    preloading: false
  })

  const [loading, setLoading] = useState(false)

  const handleOptimizationToggle = (key: string, value: boolean) => {
    setOptimizations(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyOptimizations = async () => {
    setLoading(true)
    try {
      // TODO: Apply optimizations
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading(false)
    } catch (error) {
      console.error('Error applying optimizations:', error)
      setLoading(false)
    }
  }

  const getPerformanceColor = (value: number, type: 'score' | 'time' | 'size' | 'usage') => {
    if (type === 'score') {
      if (value >= 90) return 'text-green-600'
      if (value >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'time') {
      if (value <= 1) return 'text-green-600'
      if (value <= 3) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'size') {
      if (value <= 2) return 'text-green-600'
      if (value <= 5) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'usage') {
      if (value <= 50) return 'text-green-600'
      if (value <= 80) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  const getPerformanceStatus = (value: number, type: 'score' | 'time' | 'size' | 'usage') => {
    if (type === 'score') {
      if (value >= 90) return 'Tuyệt vời'
      if (value >= 70) return 'Tốt'
      return 'Cần cải thiện'
    }
    if (type === 'time') {
      if (value <= 1) return 'Rất nhanh'
      if (value <= 3) return 'Nhanh'
      return 'Chậm'
    }
    if (type === 'size') {
      if (value <= 2) return 'Nhỏ'
      if (value <= 5) return 'Trung bình'
      return 'Lớn'
    }
    if (type === 'usage') {
      if (value <= 50) return 'Thấp'
      if (value <= 80) return 'Trung bình'
      return 'Cao'
    }
    return 'Không xác định'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Tối ưu hóa Hiệu suất</h2>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.cacheHitRate, 'score')}`}>
                  {metrics.cacheHitRate}%
                </p>
                <p className="text-xs text-gray-500">
                  {getPerformanceStatus(metrics.cacheHitRate, 'score')}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={metrics.cacheHitRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Load Time</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.loadTime, 'time')}`}>
                  {metrics.loadTime}s
                </p>
                <p className="text-xs text-gray-500">
                  {getPerformanceStatus(metrics.loadTime, 'time')}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={100 - (metrics.loadTime * 20)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bundle Size</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.bundleSize, 'size')}`}>
                  {metrics.bundleSize}MB
                </p>
                <p className="text-xs text-gray-500">
                  {getPerformanceStatus(metrics.bundleSize, 'size')}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={100 - (metrics.bundleSize * 20)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.memoryUsage, 'usage')}`}>
                  {metrics.memoryUsage}%
                </p>
                <p className="text-xs text-gray-500">
                  {getPerformanceStatus(metrics.memoryUsage, 'usage')}
                </p>
              </div>
              <Database className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.networkRequests}
                </p>
                <p className="text-xs text-gray-500">Requests</p>
              </div>
              <Wifi className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PWA Score</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.pwaScore, 'score')}`}>
                  {metrics.pwaScore}
                </p>
                <p className="text-xs text-gray-500">
                  {getPerformanceStatus(metrics.pwaScore, 'score')}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-indigo-500" />
            </div>
            <Progress value={metrics.pwaScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt Tối ưu hóa
          </CardTitle>
          <CardDescription>
            Bật/tắt các tính năng tối ưu hóa hiệu suất
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Caching</p>
              <p className="text-sm text-gray-600">
                Lưu trữ dữ liệu trong cache để tăng tốc độ tải
              </p>
            </div>
            <Switch
              checked={optimizations.caching}
              onCheckedChange={(checked) => handleOptimizationToggle('caching', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lazy Loading</p>
              <p className="text-sm text-gray-600">
                Tải nội dung khi cần thiết thay vì tải tất cả cùng lúc
              </p>
            </div>
            <Switch
              checked={optimizations.lazyLoading}
              onCheckedChange={(checked) => handleOptimizationToggle('lazyLoading', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compression</p>
              <p className="text-sm text-gray-600">
                Nén dữ liệu để giảm kích thước file
              </p>
            </div>
            <Switch
              checked={optimizations.compression}
              onCheckedChange={(checked) => handleOptimizationToggle('compression', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">PWA (Progressive Web App)</p>
              <p className="text-sm text-gray-600">
                Biến ứng dụng thành PWA để cài đặt trên thiết bị
              </p>
            </div>
            <Switch
              checked={optimizations.pwa}
              onCheckedChange={(checked) => handleOptimizationToggle('pwa', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">CDN</p>
              <p className="text-sm text-gray-600">
                Sử dụng Content Delivery Network để tăng tốc độ
              </p>
            </div>
            <Switch
              checked={optimizations.cdn}
              onCheckedChange={(checked) => handleOptimizationToggle('cdn', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Preloading</p>
              <p className="text-sm text-gray-600">
                Tải trước các tài nguyên quan trọng
              </p>
            </div>
            <Switch
              checked={optimizations.preloading}
              onCheckedChange={(checked) => handleOptimizationToggle('preloading', checked)}
            />
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleApplyOptimizations}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Đang áp dụng...' : 'Áp dụng Tối ưu hóa'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA Installation */}
      {optimizations.pwa && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Progressive Web App
            </CardTitle>
            <CardDescription>
              Cài đặt ứng dụng trên thiết bị của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Ứng dụng đã sẵn sàng để cài đặt như một ứng dụng native!
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Trên Desktop:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click vào icon cài đặt trong thanh địa chỉ</li>
                    <li>• Chọn "Cài đặt Subscription Manager"</li>
                    <li>• Xác nhận cài đặt</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Trên Mobile:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mở menu trình duyệt</li>
                    <li>• Chọn "Thêm vào màn hình chính"</li>
                    <li>• Xác nhận cài đặt</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Cài đặt PWA
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Cập nhật
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Mẹo Tối ưu hóa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Sử dụng CDN</p>
                <p className="text-sm text-gray-600">
                  CDN giúp phân phối nội dung từ server gần nhất, giảm thời gian tải.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Nén hình ảnh</p>
                <p className="text-sm text-gray-600">
                  Sử dụng định dạng WebP và nén hình ảnh để giảm kích thước file.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Lazy Loading</p>
                <p className="text-sm text-gray-600">
                  Tải nội dung khi người dùng cuộn đến, tiết kiệm băng thông.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Giảm số lượng request</p>
                <p className="text-sm text-gray-600">
                  Kết hợp nhiều file CSS/JS thành một file để giảm số lượng request
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}