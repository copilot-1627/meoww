import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'
import { TransactionService } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json()

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      // Update transaction as failed
      TransactionService.updateTransactionStatus(razorpay_order_id, 'failed')
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update transaction as paid and add subdomain slots
    const transaction = TransactionService.updateTransactionStatus(
      razorpay_order_id, 
      'paid', 
      razorpay_payment_id
    )

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Payment successful! ${transaction.subdomainSlots} extra subdomain slot${transaction.subdomainSlots > 1 ? 's' : ''} added to your account.`,
      subdomainSlots: transaction.subdomainSlots
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}