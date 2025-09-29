"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  Activity,
  Target
} from "lucide-react"

interface Subscription {
  id: string
  name: string
  expiry: string
  cost: number
  notes: string
  cycle: "monthly" | "yearly"
  autoRenew: boolean
  finalExpiry?: string
  createdAt: string
  daysLeft?: number
}

interface AnalyticsData {
  totalSubscriptions: number
  totalMonthlyCost: number
  totalYearlyCost: number
  expiringSoon: number
  critical: number
  autoRenewCount: number
  categories: { [key: string]: number }
  monthlyTrend: { month: string; cost: number }[]
  upcomingExpirations: Subscription[]
}

export function AnalyticsDashboard() {
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const getFilteredData = () => {
    if (!analytics) return null
    
    const today = new Date()
    let filteredExpirations = analytics.upcomingExpirations
    
    // Calculate daysLeft for each subscription and filter by time range
    const subscriptionsWithDaysLeft = analytics.upcomingExpirations.map(subscription => {
      const expiryDate = new Date(subscription.expiry)
      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...subscription, daysLeft }
    })
    
    // Filter by time range
    switch (timeRange) {
      case '7d':
        filteredExpirations = subscriptionsWithDaysLeft.filter(item => item.daysLeft <= 7)
        break
      case '30d':
        filteredExpirations = subscriptionsWithDaysLeft.filter(item => item.daysLeft <= 30)
        break
      case '90d':
        filteredExpirations = subscriptionsWithDaysLeft.filter(item => item.daysLeft <= 90)
        break
      case '1y':
        filteredExpirations = subscriptionsWithDaysLeft.filter(item => item.daysLeft <= 365)
        break
    }
    
    return {
      ...analytics,
      upcomingExpirations: filteredExpirations
    }
  }

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 0) return "destructive"
    if (daysLeft <= 1) return "destructive"
    if (daysLeft <= 3) return "secondary"
    return "default"
  }

  const getStatusText = (daysLeft: number) => {
    if (daysLeft <= 0) return "Đã hết hạn"
    if (daysLeft <= 1) return "Hết hạn hôm nay"
    if (daysLeft <= 3) return "Sắp hết hạn"
    return "Còn thời gian"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Không thể tải dữ liệu phân tích</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredData = getFilteredData()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Phân tích chi tiết về gói đăng ký và chi phí
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' && '7 ngày'}
                {range === '30d' && '30 ngày'}
                {range === '90d' && '90 ngày'}
                {range === '1y' && '1 năm'}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Tổng số gói"}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.autoRenewCount} {"Tự động gia hạn"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Chi phí hàng tháng"}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.totalMonthlyCost.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{analytics.totalYearlyCost.toLocaleString()}/năm
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Sắp hết hạn"}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analytics.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.critical} {"Khẩn cấp"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ gia hạn</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((analytics.autoRenewCount / analytics.totalSubscriptions) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Tự động gia hạn
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="expirations">Sắp hết hạn</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
            <TabsTrigger value="trends">Xu hướng</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Phân bổ chi phí
                  </CardTitle>
                  <CardDescription>
                    Chi phí theo chu kỳ thanh toán
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Hàng tháng</span>
                      </div>
                      <span className="font-medium">
                        ${analytics.totalMonthlyCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Hàng năm</span>
                      </div>
                      <span className="font-medium">
                        ${analytics.totalYearlyCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Thống kê nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tổng chi phí/năm</span>
                      <span className="font-medium">
                        ${(analytics.totalMonthlyCost * 12 + analytics.totalYearlyCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chi phí trung bình/gói</span>
                      <span className="font-medium">
                        ${Math.round((analytics.totalMonthlyCost + analytics.totalYearlyCost) / analytics.totalSubscriptions)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gói tự động gia hạn</span>
                      <span className="font-medium">{analytics.autoRenewCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expirations Tab */}
          <TabsContent value="expirations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Gói sắp hết hạn
                </CardTitle>
                <CardDescription>
                  Danh sách các gói đăng ký sắp hết hạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData?.upcomingExpirations.map((subscription) => {
                    const expiryDate = new Date(subscription.expiry)
                    const daysLeft = subscription.daysLeft || 0
                    
                    return (
                      <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{subscription.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Hết hạn: {expiryDate.toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(daysLeft)}>
                            {getStatusText(daysLeft)}
                          </Badge>
                          <span className="text-sm font-medium">
                            ${subscription.cost}/{subscription.cycle === 'monthly' ? 'tháng' : 'năm'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Phân loại gói đăng ký
                </CardTitle>
                <CardDescription>
                  Thống kê theo danh mục
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.categories).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(count / analytics.totalSubscriptions) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Xu hướng chi phí
                </CardTitle>
                <CardDescription>
                  Biểu đồ chi phí theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyTrend.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{trend.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min((trend.cost / Math.max(...analytics.monthlyTrend.map(t => t.cost))) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">${trend.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}