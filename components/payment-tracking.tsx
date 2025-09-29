'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, CreditCard, DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react'
import { getPaymentHistory, addPaymentRecord, PaymentRecord } from '@/lib/auth'

export function PaymentTracking() {
  
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  
  // New payment form
  const [newPayment, setNewPayment] = useState({
    subscriptionId: '',
    amount: '',
    currency: 'USD',
    status: 'completed' as const,
    paymentMethod: '',
    transactionId: '',
    notes: ''
  })

  useEffect(() => {
    loadPayments()
  }, [selectedSubscription, timeRange])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const paymentsData = await getPaymentHistory(selectedSubscription || undefined)
      setPayments(paymentsData)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!newPaymentsubscriptionId || !newPaymentamount) return
    
    try {
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPaymentamount),
        date: new Date().toISOString()
      }
      
      await addPaymentRecord(paymentData)
      setNewPayment({
        subscriptionId: '',
        amount: '',
        currency: 'USD',
        status: 'completed',
        paymentMethod: '',
        transactionId: '',
        notes: ''
      })
      loadPayments()
    } catch (error) {
      console.error('Error adding payment:', error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Đang chờ'
      case 'failed': return 'Thất bại'
      case 'refunded': return 'Hoàn tiền'
      default: return status
    }
  }

  const totalAmount = payments.reduce((sum, payment) => sum + paymentamount, 0)
  const completedPayments = payments.filter(p => p.status === 'completed').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theo dõi Thanh toán</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Giao dịch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm Giao dịch Mới</DialogTitle>
              <DialogDescription>
                Thêm giao dịch thanh toán mới vào lịch sử.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="ID Subscription"
                value={newPaymentsubscriptionId}
                onChange={(e) => setNewPayment({...newPayment, subscriptionId: e.targetvalue})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Số tiền"
                  type="number"
                  value={newPaymentamount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.targetvalue})}
                />
                <Select 
                  value={newPaymentcurrency} 
                  onValueChange={(value) => setNewPayment({...newPayment, currency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select 
                value={newPaymentstatus} 
                onValueChange={(value: any) => setNewPayment({...newPayment, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="refunded">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Phương thức thanh toán"
                value={newPaymentpaymentMethod}
                onChange={(e) => setNewPayment({...newPayment, paymentMethod: e.targetvalue})}
              />
              <Input
                placeholder="ID giao dịch (tùy chọn)"
                value={newPaymenttransactionId}
                onChange={(e) => setNewPayment({...newPayment, transactionId: e.targetvalue})}
              />
              <Input
                placeholder="Ghi chú (tùy chọn)"
                value={newPaymentnotes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.targetvalue})}
              />
              <Button onClick={handleAddPayment} className="w-full">
                Thêm Giao dịch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng chi phí</p>
                <p className="text-2xl font-bold">${totalAmounttoFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Giao dịch</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold">{completedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Lọc theo subscription ID"
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.targetvalue)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử Thanh toán</CardTitle>
          <CardDescription>
            Danh sách tất cả các giao dịch thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscription</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={paymentid}>
                  <TableCell className="font-medium">
                    {paymentsubscriptionId}
                  </TableCell>
                  <TableCell>
                    {paymentcurrency} {paymentamounttoFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(paymentstatus)}>
                      {getStatusText(paymentstatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{paymentpaymentMethod}</TableCell>
                  <TableCell>
                    {new Date(paymentdate).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {paymentnotes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {payments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có giao dịch nào</h3>
            <p className="text-gray-500 text-center mb-4">
              Thêm giao dịch đầu tiên để bắt đầu theo dõi thanh toán.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}