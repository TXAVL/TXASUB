'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Calendar, CreditCard } from 'lucide-react'

interface Subscription {
  id: string
  name: string
  price: number
  expiry: string
  category: string
}

interface MonthlyData {
  month: string
  total: number
}

interface ServiceData {
  name: string
  value: number
  color: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [serviceData, setServiceData] = useState<ServiceData[]>([])
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load subscriptions from API
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
        
        // Process data for charts
        processChartData(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (subs: Subscription[]) => {
    // Calculate monthly costs
    const monthlyCosts: { [key: string]: number } = {}
    const serviceCosts: { [key: string]: number } = {}
    
    subs.forEach(sub => {
      const expiryDate = new Date(sub.expiry)
      const monthKey = `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}`
      
      // Monthly data
      monthlyCosts[monthKey] = (monthlyCosts[monthKey] || 0) + sub.price
      
      // Service data
      serviceCosts[sub.category] = (serviceCosts[sub.category] || 0) + sub.price
    })
    
    // Convert to chart data
    const monthlyChartData = Object.entries(monthlyCosts)
      .map(([month, total]) => ({
        month: new Date(month + '-01').toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
        total: Math.round(total)
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
    
    const serviceChartData = Object.entries(serviceCosts)
      .map(([name, value], index) => ({
        name,
        value: Math.round(value),
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
    
    setMonthlyData(monthlyChartData)
    setServiceData(serviceChartData)
    
    // Calculate total monthly cost
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthCost = monthlyCosts[currentMonth] || 0
    setTotalMonthly(Math.round(currentMonthCost))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi phí tháng này</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptions.length} gói đăng ký
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói sắp hết hạn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(sub => {
                const daysLeft = Math.ceil((new Date(sub.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return daysLeft <= 7 && daysLeft > 0
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Trong 7 ngày tới
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng gói đăng ký</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Đang hoạt động
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ phổ biến</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceData.length > 0 ? serviceData[0].name : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Chiếm {serviceData.length > 0 ? Math.round((serviceData[0].value / totalMonthly) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Cost Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Chi phí hàng tháng</CardTitle>
            <CardDescription>
              Biểu đồ cột thể hiện tổng chi phí theo từng tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Chi phí']}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ chi phí theo dịch vụ</CardTitle>
            <CardDescription>
              Biểu đồ tròn thể hiện tỷ lệ chi phí của từng dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Chi phí']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Legend */}
      {serviceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết dịch vụ</CardTitle>
            <CardDescription>
              Danh sách chi phí theo từng dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {serviceData.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(service.value)}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((service.value / totalMonthly) * 100)}% tổng chi phí
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}