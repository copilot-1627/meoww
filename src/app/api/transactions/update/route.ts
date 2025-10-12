import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ServerTransactionService } from '@/lib/transaction-service.server'
import { Transaction } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status, paymentId } = await request.json()
    
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transaction = await ServerTransactionService.updateTransactionStatus(
      orderId, 
      status as Transaction['status'], 
      paymentId
    )
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ 
      error: 'Failed to update transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}