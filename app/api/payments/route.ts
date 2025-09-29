import { NextRequest, NextResponse } from 'next/server'
import { appConfig } from '@/lib/config'

// GET /api/payments - Lấy lịch sử thanh toán
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('subscriptionId')
    
    console.log(`💰 Fetching payment history${subscriptionId ? ` for subscription ${subscriptionId}` : ''}`)
    
    // TODO: Implement database query
    // const payments = await getPaymentHistory(userId, subscriptionId)
    
    // Mock data
    const mockPayments = [
      {
        id: '1',
        subscriptionId: subscriptionId || 'sub1',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        transactionId: 'txn_123456',
        date: '2024-01-15T10:30:00Z',
        notes: 'Monthly subscription payment'
      },
      {
        id: '2',
        subscriptionId: subscriptionId || 'sub1',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        transactionId: 'txn_123457',
        date: '2024-02-15T10:30:00Z',
        notes: 'Monthly subscription payment'
      }
    ]
    
    return NextResponse.json(mockPayments)
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 })
  }
}

// POST /api/payments - Thêm giao dịch thanh toán mới
export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    console.log('💳 Adding new payment record:', paymentData)
    
    // TODO: Implement database insert
    // const payment = await createPaymentRecord(paymentData)
    
    // Mock response
    const newPayment = {
      id: Date.now().toString(),
      ...paymentData,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    console.error('Error adding payment record:', error)
    return NextResponse.json({ error: 'Failed to add payment record' }, { status: 500 })
  }
}