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

    console.log('Payment verification request:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      user: session.user.email
    })

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Check if Razorpay secret is configured
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET
    if (!razorpaySecret) {
      console.error('RAZORPAY_KEY_SECRET is not configured')
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 })
    }

    // Find the transaction first
    const transaction = await TransactionService.getTransactionByOrderId(razorpay_order_id)
    if (!transaction) {
      console.error('Transaction not found for order ID:', razorpay_order_id)
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(body.toString())
      .digest('hex')

    console.log('Signature verification:', {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    })

    if (expectedSignature !== razorpay_signature) {
      // Update transaction as failed
      await TransactionService.updateTransactionStatus(razorpay_order_id, 'failed')
      console.error('Payment signature verification failed')
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update transaction as paid and add subdomain slots
    const updatedTransaction = await TransactionService.updateTransactionStatus(
      razorpay_order_id, 
      'paid', 
      razorpay_payment_id
    )

    if (!updatedTransaction) {
      console.error('Failed to update transaction status')
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
    }

    console.log('Payment verified successfully:', {
      transaction_id: updatedTransaction.id,
      slots_added: updatedTransaction.subdomainSlots,
      user: updatedTransaction.userEmail
    })

    return NextResponse.json({ 
      success: true, 
      message: `Payment successful! ${updatedTransaction.subdomainSlots} extra subdomain slot${updatedTransaction.subdomainSlots > 1 ? 's' : ''} added to your account.`,
      subdomainSlots: updatedTransaction.subdomainSlots,
      transactionId: updatedTransaction.id
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ 
      error: 'Failed to verify payment', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}